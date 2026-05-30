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
- Available field components registered in `@/shared/lib/form`: `TextField`, `PasswordField`, `CheckboxField`, `ImageUploadField`, `SelectField`.
- `SelectField` is a multi-select using `@base-ui/react/select` with `multiple` prop. Usage:
  ```tsx
  <form.AppField name="roleIds">
    {(field) => (
      <field.SelectField
        label="Roles"
        options={roleOptions}          // { label: string; value: string }[]
        placeholder="Select roles..."
      />
    )}
  </form.AppField>
  ```
- To add a new field component: create it in `shared/components/form/` following the `TextField` pattern (uses `useFieldContext`), then register it in `shared/lib/form.ts` under `fieldComponents`.

## Data tables

Two modes available: **client-side** (default) and **server-side** (opt-in via `ServerDataTable`).

### Client-side (`DataTable`)

- Use `DataTable` from `@/shared/components/data-table/DataTable`.
- State (sorting, filtering, pagination, search) is managed locally via `useDataTable` hook.
- All data is fetched upfront as a single array.
- Supports: column-click sorting (asc/desc toggle), sort dropdown presets, filter dialog (select/checkbox/radio), debounced search, bulk delete, export, top & bottom pagination, skeleton loading.

```tsx
import { DataTable } from "@/shared/components/data-table/DataTable";

<DataTable
  data={data}
  columns={columns}
  isLoading={isLoading}
  isError={isError}
  sortableColumns={sortableColumns}   // optional
  filterableColumns={filterableColumns} // optional
  defaultSort={[{ id: "createdAt", desc: true }]}
  onDeleteMany={...}  // optional
/>
```

### Server-side (`ServerDataTable`)

- State lives in **URL search params** (source of truth).
- Use `ServerDataTable` from `@/shared/components/data-table/ServerDataTable`.
- Use `useServerTable` hook (used internally by `ServerDataTable`).
- Requires `manualPagination`, `manualSorting`, `manualFiltering` on the server.
- Route pattern:
  ```tsx
  const Route = createFileRoute("/admin/my-feature")({
    validateSearch: (input): MySearch => ({
      page: Number(input.page) || 1,
      pageSize: Number(input.pageSize) || 10,
      sort: input.sort as string | undefined,
      order: input.order as "asc" | "desc" | undefined,
      search: input.search as string | undefined,
      // feature-specific filter keys...
    }),
    component: RouteComponent,
  });

  function RouteComponent() {
    const search = Route.useSearch();
    const navigate = Route.useNavigate();

    const query = useQuery({
      queryKey: ["my-feature", search],
      queryFn: () => api.get("my-feature", { searchParams: search }).json<PaginatedResponse<MyType>>(),
    });

    const columnFilters: ColumnFiltersState = [];
    // build from search params...

    return (
      <ServerDataTable
        data={result?.data ?? []}
        pageCount={result?.pagination.totalPages ?? 0}
        totalRowCount={result?.pagination.total ?? 0}
        columns={columns}
        isLoading={query.isLoading}
        isError={query.isError}
        state={{
          pagination: { pageIndex: search.page - 1, pageSize: search.pageSize },
          sorting: search.sort ? [{ id: search.sort, desc: search.order === "desc" }] : [],
          globalFilter: search.search ?? "",
          columnFilters,
        }}
        onPaginationChange={(updater) => {
          const next = typeof updater === "function" ? updater(...) : updater;
          navigate({ search: { ...search, page: next.pageIndex + 1, pageSize: next.pageSize } });
        }}
        onSortingChange={(updater) => {
          const next = typeof updater === "function" ? updater(...) : updater;
          navigate({ search: { ...search, sort: next[0]?.id, order: next[0]?.desc ? "desc" : "asc", page: 1 } });
        }}
        onGlobalFilterChange={(updater) => {
          const next = typeof updater === "function" ? updater(search.search ?? "") : updater;
          navigate({ search: { ...search, search: next || undefined, page: 1 } });
        }}
        onColumnFiltersChange={(updater) => { /* convert ColumnFiltersState → URL params */ }}
        sortableColumns={...}
        filterableColumns={...}
      />
    );
  }
  ```
- Server returns `PaginatedResponse<T>`: `{ data: T[], pagination: { page, pageSize, total, totalPages } }`.
- Use `buildListQuery` from `server/src/lib/listQuery.ts` on the server for paginated queries.
- See `routes/admin/demo-server-table.tsx` for a complete working example with mock data.

### Column definitions

- Columns use `ColumnDef<T>` from `@tanstack/react-table`.
- Enable sorting with `enableSorting: true`. Disable with `enableSorting: false`.
- Custom filter functions can be defined via `filterFn` (built-in: `"fuzzy"` for fuzzy text search).
- See `features/user/lib/userColumns.tsx` for an example.

### Filterable & sortable columns

- `sortableColumns: SortableColumn[]` — predefined sort presets shown in a dropdown.
- `filterableColumns: FilterableColumn[]` — column filters shown in the filter dialog. Supports `"select"`, `"checkbox"`, `"radio"` types, with `multiple: true/false`.

## New feature checklist

1. If it needs screens: add route(s) under `src/routes/` using TanStack Router file conventions (`createFileRoute`).
2. UI + logic live under **`src/features/<feature>/`**; reuse **`shared/components`** and **`shared/lib`** before adding primitives.
3. Data fetching: TanStack Query where caching/loading/error states matter; keep **`credentials: "include"`** for cookie-backed APIs.
4. Env: add typed keys to **`vite.config.ts`** **`Env`** arktype schema and consume via **`import.meta.env`**.

## Tooling

- Biome — `bun check` / lint / format (see **`package.json`** scripts).
- Devtools: TanStack Router + Query panels are wired from **`routes/__root.tsx`**.
