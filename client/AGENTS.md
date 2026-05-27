# Agent Guidelines

## 1. Think Before Coding

**Don't assume. Don't hide confusion. Surface tradeoffs.**

Before implementing:
- State your assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them — don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

## 2. Simplicity First

**Minimum code that solves the problem. Nothing speculative.**

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.

Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

## 3. Surgical Changes

**Touch only what you must. Clean up only your own mess.**

When editing existing code:
- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it — don't delete it.

When your changes create orphans:
- Remove imports/variables/functions that YOUR changes made unused.
- Don't remove pre-existing dead code unless asked.

The test: every changed line should trace directly to the user's request.

## 4. Goal-Driven Execution

**Define success criteria. Loop until verified.**

Transform tasks into verifiable goals:
- "Add validation" → "Write tests for invalid inputs, then make them pass"
- "Fix the bug" → "Write a test that reproduces it, then make it pass"
- "Refactor X" → "Ensure tests pass before and after"

For multi-step tasks, state a brief plan:
```
1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]
```

Strong success criteria let you loop independently. Weak criteria ("make it work") require constant clarification.

---

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
