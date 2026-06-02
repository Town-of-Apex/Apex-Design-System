# Database Configuration

The template uses **PostgreSQL** as its primary database. All connection settings live in **`.env`** (copy from `.env.example`) and are read only in `app/core/config.py`.

---

## Environment variables

| Variable | Purpose |
|----------|---------|
| `POSTGRES_HOST` | Database hostname — see table below |
| `POSTGRES_PORT` | Port (default `5432`) |
| `POSTGRES_DB` | App-specific database name |
| `POSTGRES_USER` | App-specific database user |
| `POSTGRES_PASSWORD` | Password for the database user |
| `DATABASE_URL` | Optional full override (e.g. SQLite) — otherwise built from `POSTGRES_*` |
| `DEV_MODE` | Enables dev defaults |
| `ALLOW_SQLITE_FALLBACK` | Fall back to SQLite if PostgreSQL is unreachable |
| `RUN_MIGRATIONS` | Run Alembic on startup (default `true`) |
| `AUTO_MIGRATE_DEV` | Autogenerate migrations on schema drift in dev |

---

## Which `POSTGRES_HOST` to use

| Mode | How you run the app | `POSTGRES_HOST` |
|------|---------------------|-----------------|
| Host dev | `run_dev.ps1` / `run_dev.sh` | `127.0.0.1` (preferred on Windows) |
| Docker dev | `docker compose -f docker-compose.dev.yml up` | `apex-dev-db` (set in compose file) |
| Production | `docker compose up` | `postgres_db` (centralized container) |

---

## Dev PostgreSQL container

Each app gets its own isolated dev database container — separate from the shared production Postgres.

Compose project **`apex-dev`** (`docker-compose.dev.yml`):

| Container | Service | When |
|-----------|---------|------|
| `apex-dev-db` | `apex-dev-db` | Mode A (`run_dev.*`) and Mode B |
| `apex-dev-backend` | `apex-backend` | Mode B only (full Docker stack) |
| `apex-dev-frontend` | `apex-frontend` | Mode B only |

- **`run_dev.ps1` / `run_dev.sh`** (Mode A) — starts only `apex-dev-db`; backend and Vite run on the host
- **`docker compose -f docker-compose.dev.yml up --build`** (Mode B) — all three containers

Production compose project **`apex-prod`** uses containers `apex-prod-backend` and `apex-prod-frontend` so names do not clash with dev on the same machine.

Configure credentials in `.env`:

```env
POSTGRES_HOST=127.0.0.1
POSTGRES_DB=demo
POSTGRES_USER=demo
POSTGRES_PASSWORD=password
```

---

## Production — centralized PostgreSQL

All production apps share one PostgreSQL container (`postgres_db`) on the `apex-internal` Docker network. **Each app gets its own database and user** — not its own Postgres server.

### 1. Create database and user (via pgAdmin or psql)

```sql
CREATE DATABASE my_app_db;
CREATE ROLE my_app_user WITH LOGIN PASSWORD 'strong-password';
GRANT ALL PRIVILEGES ON DATABASE my_app_db TO my_app_user;
```

pgAdmin is available at `host:5050` on the infrastructure host.

### 2. Configure `.env`

```env
POSTGRES_HOST=postgres_db
POSTGRES_DB=my_app_db
POSTGRES_USER=my_app_user
POSTGRES_PASSWORD=strong-password
DEV_MODE=false
ALLOW_SQLITE_FALLBACK=false
RUN_MIGRATIONS=true
AUTO_MIGRATE_DEV=false
```

### 3. Deploy

```bash
docker compose up -d --build
```

Uses `docker-compose.yml` only — no dev Postgres container is started.

Migrations run on startup when `RUN_MIGRATIONS=true`. See [Database Migrations](./database-migrations.md).

---

## Troubleshooting host dev (`run_dev.*`)

If the backend reports **connection refused** on port 5432 but `apex-dev-db` is running:

1. Check that the port is published to the host (you should see `127.0.0.1:5432->5432/tcp`):

   ```bash
   docker port apex-dev-db 5432/tcp
   ```

2. If that command prints nothing, recreate the dev DB container:

   ```bash
   docker compose -f docker-compose.dev.yml up apex-dev-db -d --wait --force-recreate
   ```

3. Ensure `.env` uses `POSTGRES_HOST=127.0.0.1` (not a Docker-only hostname like `apex-dev-db`) when uvicorn runs on the host.

`run_dev.ps1` / `run_dev.sh` recreate the container automatically when the host port is missing.

---

## SQLite fallback (local prototyping only)

If PostgreSQL is unreachable and `ALLOW_SQLITE_FALLBACK=true`, the app stores data in `./data/app.db`. The Settings page shows a warning when fallback is active.

**Disable in production.** SQLite is for zero-config local prototyping only.

---

## Cloning this template for a new app

1. Copy `.env.example` → `.env`
2. Change `POSTGRES_DB`, `POSTGRES_USER`, `POSTGRES_PASSWORD` to app-specific values
3. For production, create the matching database/user in the centralized Postgres container
4. Set `BASE_PATH=/your-app-slug` for Traefik routing

Shared identity data (staff profiles from Entra) will live in a **separate central database** managed outside this app. This app's database holds app-specific tables and authorization only.
