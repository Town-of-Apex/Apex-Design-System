# Apex Design System (Template App)

Standardized starting point for Town of Apex web applications — **React + Vite + TypeScript** frontend, **FastAPI + PostgreSQL** backend.

## Quick start (local dev)

**One command** starts PostgreSQL in Docker, then the backend and frontend on your machine:

```powershell
# Windows
.\run_dev.ps1
```

```bash
# macOS / Linux (chmod +x run_dev.sh once if needed)
./run_dev.sh
```

Open http://localhost:5173 — sign in with **admin** / **admin123**.

The scripts create `.env` and `.venv` / `node_modules` on first run when missing. Your `.env` must use **`POSTGRES_HOST=127.0.0.1`** for this mode (the default in `.env.example`).

To wipe and recreate the local dev database (migrations + seed data):

```powershell
.\scripts\reset_dev_db.ps1
```

## Local development modes

| Mode | Command | What runs |
|------|---------|-----------|
| **A — Recommended** | `run_dev.ps1` / `run_dev.sh` | Docker: `apex-dev-db` only · Host: uvicorn + Vite |
| **B — Full Docker** | `docker compose -f docker-compose.dev.yml up --build` | `apex-dev-db`, `apex-dev-backend`, `apex-dev-frontend` |
| **DB only** | `docker compose -f docker-compose.dev.yml up apex-dev-db -d --wait` | Postgres on `127.0.0.1:5432` |

Compose project name **`apex-dev`** keeps container names separate from production (`apex-prod-*`).

## Production compose (WIP)

Org deployment uses `docker-compose.yml` (project **`apex-prod`**, Traefik, external `apex-internal` network). Not required for everyday local work — see comments in that file and [docs/database-configuration.md](./docs/database-configuration.md).

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
├── app/                    # FastAPI backend
├── frontend/               # React frontend
├── docs/                   # Documentation
├── migrations/             # Alembic database migrations
├── scripts/
│   ├── dev-env.ps1         # Shared dev bootstrap (PowerShell)
│   ├── dev-env.sh          # Shared dev bootstrap (bash)
│   └── reset_dev_db.ps1    # Wipe dev DB + migrate + seed
├── docker-compose.yml      # Production (apex-prod project)
├── docker-compose.dev.yml  # Local dev (apex-dev project)
├── entrypoint.sh           # Production backend container only
├── run_dev.ps1             # Windows dev launcher (Mode A)
├── run_dev.sh              # macOS/Linux dev launcher (Mode A)
└── .env.example            # Environment variable reference
```

## Tech stack

React 19 · TypeScript · Vite · Tailwind CSS · FastAPI · SQLAlchemy · PostgreSQL · Alembic · Docker
