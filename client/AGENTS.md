# Client (`client/`) — agent guide

Vite + React + TanStack Router (file routes) + TanStack Query/Form + Jotai + ky.

## Layout

```
src/
  routes/               # TanStack Router file-based routes (__root.tsx, index.tsx, etc.)
    _auth-layout/       # Sign-in/up — redirects if session already valid
    admin/              # Protected shell (sidebar); session check in route beforeLoad; profile: routes/admin/profile.tsx (UserMenu, not sidebar nav)
  features/profile/     # Account settings UI (AccountProfile + cards); composed by admin/profile route
  features/<feature>/   # Domain UI: components, schemas (e.g. auth/, user/, profile/)
  shared/
    atoms/              # Jotai atoms (e.g. authAtom)
    components/         # UI primitives & composites (buttons, dialogs, tables, …)
    hooks/
    lib/                # api.ts, safeFetch, form helpers, utilities
```

## Imports

- Alias: `#/*` maps to `./src/*` (**package.json** `imports`).
- **`@/*`** also maps to `./src/*` in **tsconfig** — both appear in the codebase; follow the style of the file you are editing.

## API calls

1. Prefer the shared **`ky` instance**: `api` from `@/shared/lib/api` (base URL `/api/` under `import.meta.env.VITE_BACKEND_URL`).
2. Always pass **`credentials: "include"`** for routes that rely on HTTP-only auth cookies (`/me`, logout, mutate user routes, etc.).
3. **`api` hook behavior**: On `UNAUTHORIZED` responses, ky attempts **`POST …/auth/refresh`** once and retries — new cookie-authenticated endpoints should return the same `{ data, error }` shape when using this client.

## Backend response shape

Expect JSON shaped like:

```json
{ "data": ..., "error": { "type": "...", "message": "..." } | null }
```

Use **`safeFetch`** from `@/shared/lib/safeFetch` around `api` chains when handling errors in UI without throwing.

## Routing & auth UX

1. **`/admin`** `beforeLoad`: if `authAtom` empty, call `GET api/me` with credentials; on `UNAUTHORIZED`, `redirect` to `/sign-in` with `search.redirect` preserving return URL.
2. **`/_auth-layout`** `beforeLoad`: opposite — if cookie session exists (`me` succeeds), redirect to `/admin`.
3. After login/register, **`store.set(authAtom, user)`** using the jotai **`store`** from `@/shared/lib/store` so route guards see consistency.
4. **`/admin/profile`**: account profile (name, email, passwords, Google linking) — linked from **`UserMenu`**, not the main sidebar. On that route, **`AppSidebar`** shows only **Back to admin** (`/admin`).

## Forms & validation

- Use **`useAppForm`** from `@/shared/lib/form` with **TanStack Form** validators.
- Mirror server rules with **arktype** schemas colocated near the feature (`features/auth/schemas`, etc.) — keep naming aligned with backend schemas where possible.

## New feature checklist

1. If it needs screens: add route(s) under `src/routes/` using TanStack Router file conventions (`createFileRoute`).
2. UI + logic live under **`src/features/<feature>/`**; reuse **`shared/components`** and **`shared/lib`** before adding primitives.
3. Data fetching: TanStack Query where caching/loading/error states matter; keep **`credentials: "include"`** for cookie-backed APIs.
4. Env: add typed keys to **`vite.config.ts`** **`Env`** arktype schema and consume via **`import.meta.env`**.

## Tooling

- Biome — `bun check` / lint / format (see **`package.json`** scripts).
- Devtools: TanStack Router + Query panels are wired from **`routes/__root.tsx`**.

## Docker (this package)

- **[compose.yml](compose.yml)** is **frontend-only** (`web`): **`docker compose up --build`** works with inline defaults for **`VITE_BACKEND_URL`**. For overrides, copy **[.env.docker.example](.env.docker.example)** to **`.env.docker`** and run **`docker compose --env-file .env.docker up --build`** (host **`WEB_PUBLISH_PORT`** → container **80**).
- **[Dockerfile](Dockerfile)** receives **`VITE_*`** via compose **build args** only (no defaults in the Dockerfile). Caddy serves **`dist/`**. The API runs separately — **`CORS_ORIGIN`** and **`GOOGLE_REDIRECT_URI`** on the server must match this SPA’s public URL. Never put secrets in **`VITE_*`** (they are public in the bundle).
