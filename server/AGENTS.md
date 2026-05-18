# Server (`server/`) — agent guide

Bun + Hono API. Prefer matching existing feature layout and patterns below when adding endpoints or business logic.

## Layout

```
src/
  index.ts              # App mount: CORS, public/protected routers, `/api` prefix
  config/env.ts         # arkenv — all required env vars (add new vars here first)
  db/
    database.ts         # Kysely instance
    schema.ts           # codegen output — do not hand-edit for new columns; migrate + codegen
    migrations/
  lib/                  # shared helpers (jwt, cookie, validateData, errors, hashing, etc.)
  middlewares/
    authMiddleware.ts   # Validates `access_token` cookie, attaches `User` subset to context
  features/<feature>/
    routes.ts           # Hono router: binds paths → controllers only
    controllers/        # HTTP: parse body/params → validate → call service → JSON response + cookies when needed
    services/           # DB + domain logic — no `Context`; throw `AppError` for expected failures
    schemas/            # arktype schemas for inbound payloads
```

## Mounting routes

- **Public**: add to `publicApi` in `src/index.ts` (e.g. `publicApi.route("/auth", authRoutes)`).
- **Protected** (logged-in cookie session): attach routes to `protectedApi` **after** `protectedApi.use("*", authMiddleware)`.
- Preserve response shape:

```json
{ "data": <payload | null>, "error": { "type": "...", "message": "..." } | null }
```

Success uses `data`; errors use `error` plus appropriate HTTP status. `AppError` is converted in the global `onError` handler in `index.ts`.

## Authentication

- **Google Sign-In**: `GOOGLE_REDIRECT_URI` in `server/.env` must be the SPA origin string that matches GIS popup behavior and **Authorized redirect URIs** in Google Cloud Console (`localhost` vs `127.0.0.1` must stay consistent). Restart the dev server after changing `server/.env`.
- **Self-service profile**: `PATCH /api/me` updates **`name`** and **`email`** for the authenticated user only; **`oldPassword`** + **`newPassword`** together rotate the password (first password still uses `POST /api/auth/set-password`). Changing **`email`** sets **`isEmailVerified`** to **`0`** until email verification exists; duplicate emails return **`409`**.
- **Cookies**: login/register issue `access_token` (JWT, short-lived) and `refresh_token` (opaque, hashed in DB) via `setCookie` + `cookieOptions` from `@/lib/cookie`.
- **Protected handlers**: rely on `c.get("user")` after middleware — do not duplicate JWT parsing in controllers unless there is a special case.
- **Logout / refresh**: follow existing `@/features/auth/controllers` patterns (cookie names: `access_token`, `refresh_token`).

## Validation

1. Define an arktype schema in `features/<feature>/schemas/` (see `features/auth/schemas` or `features/user/schemas`).
2. In controllers: `validateData(await c.req.json(), mySchema)` (or equivalent for params).
3. `validateData` throws `AppError` with `ERROR_TYPES.VALIDATION_ERROR` — do not duplicate that branching.

## Data access

- Use **Kysely** (`db` from `@/db/database`) in **services**, not controllers.
- Types come from `@/db/schema` (`DB`, table row types).
- Prefer **camelCase** in application code — DB column naming follows migrations/schema as generated.

## Errors

- Use `AppError` + `ERROR_TYPES` from `@/lib/error` for predictable failures (401, 404, 409, etc.).
- Do not leak raw DB/driver errors to clients unless intentionally wrapped.

## New feature checklist

1. `features/<name>/schemas/` — request DTO arktype types.
2. `features/<name>/services/` — core logic + DB queries.
3. `features/<name>/controllers/` — thin HTTP layer.
4. `features/<name>/routes.ts` — wire methods and paths.
5. Mount router in `src/index.ts` (public vs protected).
6. If persistence changes: migration under `src/db/migrations`, then regenerate types (`pnpm` / README scripts for codegen).
7. Update `openapi.json` if API docs must stay accurate (Scalar serves it at `/doc`).

## Imports

- Alias: `@/` → `./src/` (see `tsconfig.json`).

## Scripts (reference)

- `bun run dev` — hot reload
- `migrate:*`, `db:typegen`, `db:seed` — see `package.json`
