# Apex Design System (Template App)

Standardized starting point for Town of Apex web applications — **React + Vite + TypeScript** frontend, **FastAPI + PostgreSQL** backend.

## Quick start

```powershell
# Copy environment config
copy .env.example .env

# Start dev Postgres, backend, and frontend
.\run_dev.ps1
```

Open http://localhost:5173 — sign in with **admin** / **admin123** to access admin features.

To wipe and recreate the local dev database (migrations + seed data):

```powershell
.\scripts\reset_dev_db.ps1
```

## Documentation

All project documentation lives in **[docs/](./docs/README.md)**:

| Topic | Link |
|-------|------|
| Architecture & adding features | [docs/template-guide.md](./docs/template-guide.md) |
| Frontend structure | [docs/frontend-guide.md](./docs/frontend-guide.md) |
| Database connection (dev & production) | [docs/database-configuration.md](./docs/database-configuration.md) |
| Alembic migrations | [docs/database-migrations.md](./docs/database-migrations.md) |
| Authentication (dev + Entra roadmap) | [docs/authentication.md](./docs/authentication.md) |
| Roles & permissions | [docs/app_user_permissions.md](./docs/app_user_permissions.md) |
| UI design system | [docs/ui-design-summary.md](./docs/ui-design-summary.md) |

## Project structure

```text
.
├── app/                  # FastAPI backend
├── frontend/             # React frontend
├── docs/                 # Documentation
├── migrations/           # Alembic database migrations
├── docker-compose.yml      # Production (backend + frontend)
├── docker-compose.dev.yml  # Local dev (Postgres + optional full stack)
├── run_dev.ps1           # Windows dev launcher
└── .env.example          # Environment variable reference
```

## Tech stack

React 19 · TypeScript · Vite · Tailwind CSS · FastAPI · SQLAlchemy · PostgreSQL · Alembic · Docker
