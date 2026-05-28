# Frontend Guide

Welcome to the React + Vite + TypeScript frontend for the Apex application template.

---

## What are all these tools?

| Tool | Role |
|------|------|
| **React** | UI library — build reusable components that update when data changes |
| **Vite** | Dev server and bundler — fast HMR on save |
| **TypeScript** | Typed JavaScript — catches data shape errors at compile time |
| **Tailwind CSS** | Utility-first CSS configured to match Apex design tokens |
| **shadcn/ui** | Accessible UI primitives copied into `src/components/ui/` for full control |

---

## Project structure

```text
frontend/
  src/
    components/
      ui/         # Low-level primitives (Button, Input, Dialog, …)
      layout/     # App shell (Header, Footer, PageContainer)
      shared/     # Cross-page components (PageHeader, StatusBadge)
      auth/       # ProtectedRoute and auth-related UI
    hooks/        # useTheme, useAppMetadata, useAuth
    lib/          # navigation.ts, utilities
    pages/        # Route-level views (Home, Permits, Settings, …)
    services/     # API clients (api.ts, authService.ts, permitService.ts, …)
    styles/       # globals.css — design system variables
    types/        # TypeScript interfaces
    App.tsx       # Route definitions
    main.tsx      # React entry point
```

---

## Running the frontend

### With `run_dev.ps1` (recommended)

The root dev script starts both backend and frontend. Open http://localhost:5173.

### With Docker

```bash
docker compose -f docker-compose.dev.yml up --build
```

Volume mounts in `docker-compose.dev.yml` enable HMR.

### Standalone

```bash
cd frontend
npm install
npm run dev
```

Ensure the backend is running on port 8080. Vite proxies API requests automatically.

---

## Adding a new page

1. Create `src/pages/ReportsPage.tsx`:

```tsx
import { PageContainer } from "@/components/layout/PageContainer"
import { PageHeader } from "@/components/shared/PageHeader"

export function ReportsPage() {
  return (
    <PageContainer>
      <PageHeader title="Reports" subtitle="View system reports." />
    </PageContainer>
  )
}
```

2. Add a route in `src/App.tsx`
3. Add a nav entry in `src/lib/navigation.ts` (set `hidden: true` if accessed from a menu elsewhere)
4. If the page requires a permission, wrap it in `<ProtectedRoute permission={…}>` — see [App User Permissions](./app_user_permissions.md)

---

## API calls

Never call `fetch` directly from page components. Use the shared client:

```typescript
import { get, post } from "@/services/api"

const permits = await get<Permit[]>("/api/permits")
```

When the user is signed in, `api.ts` automatically attaches the JWT `Authorization` header. See [Authentication](./authentication.md).

Create one service file per resource (e.g. `permitService.ts`, `authService.ts`).

---

## Production builds

```bash
cd frontend
npm run build
```

Output goes to `frontend/dist/`. In production, serve static files via Traefik/Nginx or configure the backend to serve the bundle.
