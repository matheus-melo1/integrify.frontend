# Project Context

## Stack
- **Framework:** React 19 + TypeScript + Vite (`@vitejs/plugin-react`)
- **UI:** Shadcn/ui (Base UI registry — Nova preset) + Tailwind CSS v4
- **Server State:** TanStack React Query
- **Client State:** Zustand
- **Forms:** React Hook Form + Zod
- **Routing:** React Router DOM 7
- **HTTP:** Axios
- **Auth:** JWT (custom backend) — atualmente stub mock
- **Testing:** Vitest + Testing Library (RTL)
- **Utilities:** lodash, date-fns

## Architecture

Package by Feature + Atomic Design Pattern + SOLID (SRP)

### Folder Structure

```
src/
├── app/          # Bootstrap (router, providers, layouts, guards)
├── shared/       # Shared code (components, hooks, lib, types, schemas, styles)
├── features/     # One folder per feature (isolated modules)
├── store/        # Zustand global stores (auth, UI)
└── test/         # Test infra (setup, helpers, fixtures)
```

### Dependency Rules
- feature → shared ✅
- feature → store ✅
- feature → feature ❌ (move to shared if needed)
- shared → feature ❌

### Component Architecture (SRP)
- Components are DUMB — only JSX and props, no logic
- All logic lives in dedicated hooks (useState, useEffect, API calls, handlers)
- Flow: Page → Hook → Service (TanStack Query) → Axios → API

### Atomic Design
- `ui/` — Shadcn components (CLI-managed, never create manually)
- `molecules/` — Compositions of Shadcn atoms (FormField, SearchBar)
- `organisms/` — Complex compositions (DataTable, Sidebar, Header)
- `templates/` — Page layout skeletons (CrudTemplate, DetailTemplate)

### Feature Structure

```
features/{name}/
├── components/    # Atomic Design internal (molecules, organisms)
├── hooks/         # Logic extracted from components
│   └── __tests__/
├── pages/         # Page components (composition)
├── services/      # TanStack Query hooks (API calls)
├── schemas/       # Zod validation schemas
├── types/         # TypeScript interfaces
├── store/         # Zustand store (only if needed)
└── index.ts       # Barrel export (public API)
```

## Code Conventions

### No `else` — early return
```ts
if (condition) return x;
return y;
```

### No `try/catch` — tuple pattern via `to()`
```ts
const [error, data] = await to(promise);
if (error) return handleError(error);
```

### Naming
- Components: `PascalCase` (`UserForm.tsx`)
- Hooks: camelCase + `use` prefix (`useUserForm.ts`)
- Services: camelCase + `.service` (`user.service.ts`)
- Schemas: camelCase + `.schema` (`user.schema.ts`)
- Types: camelCase + `.types` (`user.types.ts`)
- Stores: camelCase + `use` + `Store` (`useAuthStore.ts`)
- Pages: PascalCase + `Page` (`UsersPage.tsx`)

## Testing — TDD

1. **RED** — Write failing tests first.
2. **GREEN** — Minimum code to pass.
3. **REFACTOR** — Clean up.

### What to test
- Hooks: behavior, state, API calls (mock axios)
- Services: query keys, error handling, cache invalidation
- Components: rendering, interactions, conditional display
- Schemas: validation accept/reject

### What NOT to test
- Shadcn components (upstream)
- Pure type definitions
- Static config files
- CSS/Tailwind styles

### Conventions
- Tests in `__tests__/` next to code they test
- Pattern: `*.test.ts` or `*.test.tsx`
- Glob: `src/**/__tests__/**/*.{test,spec}.{ts,tsx}`

## Current Features
- `auth` — UI stub: `LoginPage`, `RegisterPage` (mock `setAuth`, sem API real)
- `dashboard` — placeholder

## Routes
- `/login`, `/register` (AuthLayout)
- `/app/dashboard` (AuthGuard + MainLayout)
