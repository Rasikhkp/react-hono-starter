# React + Hono Starter

Full-stack starter with React (Vite) frontend and Hono (Bun) backend.

## Structure

```
client/       React SPA (Vite + TanStack Router + Tailwind CSS v4)
server/       Bun + Hono API (Kysely + MySQL)
```

## Quick start

```bash
# Install dependencies
cd client && bun install
cd server && bun install

# Set up environment
cp client/.env.example client/.env
cp server/.env.example server/.env   # (if exists)

# Start both
cd server && bun run dev     # API at http://localhost:8080
cd client && bun run dev     # SPA at http://localhost:3000
```

## Client

React 19 SPA with TanStack Router, TanStack Query, TanStack Form, Jotai, ky, and Tailwind CSS v4.

See `client/AGENTS.md` for detailed architecture — layout, API calls, auth, forms, data tables (client & server-side), and feature creation checklist.

## Server

Bun + Hono API with Kysely (MySQL), arktype validation, JWT auth, and cookie-based sessions.

See `server/AGENTS.md` for detailed architecture — routing, auth, validation, paginated list endpoints (`buildListQuery`), error handling, and feature creation checklist.

## Key features

- **Authentication:** Google Sign-In, email/password, HTTP-only cookies (access + refresh tokens), role-based permissions
- **Data tables:** Client-side (in-memory) or server-side (URL search params) — both with sorting, filtering, search, pagination, skeleton loading
- **Forms:** TanStack Form with arktype validation and reusable field components (`TextField`, `SelectField`, `PasswordField`, `CheckboxField`, `ImageUploadField`)
- **UI:** Tailwind CSS v4 with @base-ui/react primitives, dark mode, responsive sidebar layout
- **RBAC:** Role-based access control with granular permissions middleware
- **File uploads:** Avatar upload with local storage
