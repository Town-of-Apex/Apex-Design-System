# Database Migrations (Alembic)

Schema changes (new tables, new columns, type changes) are managed with **Alembic**, a migration tool for SQLAlchemy. Migrations are version-controlled Python files that describe how to upgrade (and downgrade) your database schema.

If you've never used migrations before: think of them as **Git commits for your database structure**. The application code (models) describes what the schema *should* look like; migration files describe how to get there from what you *had* before.

---

## How it works in this template

```text
app/models/*.py          ← you edit SQLAlchemy models here
        ↓
Alembic detects changes  ← compares models to live database
        ↓
migrations/versions/     ← generates a revision file
        ↓
alembic upgrade head     ← applies pending changes to the database
```

### Automatic behavior in dev

When you start the app via `run_dev.ps1` (or uvicorn directly), `init_db()` runs:

1. Connects to the database
2. If `RUN_MIGRATIONS=true`:
   - Runs `alembic upgrade head` (applies pending revision files first)
   - If `AUTO_MIGRATE_DEV=true` and models still differ from the DB:
     - **No revisions exist?** → autogenerates `initial_schema`, then upgrades
     - **Otherwise** → autogenerates `auto_dev_sync`, then upgrades
3. Seeds roles, permissions, and the dev admin user

You edit a model, restart the backend, and the database updates automatically in dev.

### Production behavior

```env
RUN_MIGRATIONS=true
AUTO_MIGRATE_DEV=false
```

On deploy, the app runs `alembic upgrade head` only — it does **not** autogenerate new revisions. You create and commit migration files before deploying.

---

## Environment variables

| Variable | Dev | Production |
|----------|-----|------------|
| `RUN_MIGRATIONS` | `true` | `true` |
| `AUTO_MIGRATE_DEV` | `true` | `false` |
| `AUTO_CREATE_TABLES` | `false` | `false` |

`AUTO_CREATE_TABLES` (SQLAlchemy `create_all`) is deprecated in favor of migrations.

---

## File layout

```text
alembic.ini                 # Alembic config (script location, logging)
migrations/
  env.py                    # Connects to DATABASE_URL, loads all models
  script.py.mako            # Template for new revision files
  versions/
    44ceeb970712_initial_schema.py   # baseline migration (example)
    xxxx_auto_dev_sync.py            # auto-generated in dev (may appear after model edits)
app/core/migrations.py      # Programmatic runner called from init_db()
app/models/                 # SQLAlchemy models — auto-discovered
```

Models in `app/models/` are automatically imported so Alembic sees them. **Adding a new model file requires no Alembic config changes** — just create the file and restart in dev.

---

## Common workflows

### I added a new model or column (dev)

1. Edit or create a file in `app/models/`
2. Restart the backend (`run_dev.ps1` or uvicorn)
3. Check `migrations/versions/` for a new `auto_dev_sync` file
4. Commit the migration file to git

That's it in dev. The restart handles everything.

### I want to create a migration manually

Activate the venv, ensure `.env` points at your database, then:

```bash
# Generate a migration from model changes
alembic revision --autogenerate -m "add vehicle_logs table"

# Review the generated file in migrations/versions/ — always read it before applying

# Apply it
alembic upgrade head
```

### I want to see current migration status

```bash
alembic current     # which revision the DB is at
alembic history     # list all revisions
alembic heads       # latest revision(s)
```

### I need to roll back one step

```bash
alembic downgrade -1
```

Use with caution — downgrades can lose data if the migration dropped columns.

---

## What autogenerate catches (and what it misses)

### Usually works

- New tables
- New columns
- Removed columns (generates `drop_column` — review carefully)
- New indexes and foreign keys

### Often needs manual editing

- **Renaming** a column (Alembic sees drop + add → data loss)
- Changing column types with data conversion
- Renaming tables
- Complex constraint changes

Always **read the generated migration file** before applying, especially in production.

---

## Production deployment checklist

1. Develop and test model changes locally (dev auto-migrate creates the revision)
2. Review the generated file in `migrations/versions/`
3. Commit the migration to git
4. Deploy — `RUN_MIGRATIONS=true` applies `upgrade head` on startup
5. Verify with `alembic current` inside the container if needed

For the first deploy of a new app against an empty database, the baseline `initial_schema` migration creates all tables.

---

## Cloning this template for a new app

Each cloned app carries its own `migrations/versions/` history. Options:

**Option A — Keep the baseline, continue from there (recommended)**

The included `initial_schema` migration creates all template tables. New model changes append new revision files.

**Option B — Fresh baseline for a renamed app**

Delete `migrations/versions/*.py`, start the app in dev, and let it autogenerate a new `initial_schema`.

---

## Troubleshooting

### "Target database is not up to date"

Run `alembic upgrade head` manually, or restart the backend with `RUN_MIGRATIONS=true`.

### Startup hangs after `Will assume transactional DDL`

Usually the dev DB is empty but `AUTO_MIGRATE_DEV` tried to autogenerate before applying revisions. Reset and re-apply:

```powershell
.\scripts\reset_dev_db.ps1
```

Then restart uvicorn.

### Autogenerate doesn't detect my change

- Ensure the model file is in `app/models/` and inherits from `Base`
- Restart the backend (import happens at startup)
- Some changes (renames) aren't detected — write the migration manually

### Too many `auto_dev_sync` files piling up

In active dev this is normal. Before merging to main, consider squashing into one descriptive migration:

```bash
# After dev is stable, optionally create one clean migration and delete the auto ones
alembic revision --autogenerate -m "add permits and rbac"
# Remove older auto_dev_sync files if the new one covers everything
```

### SQLite vs PostgreSQL

Dev may fall back to SQLite if Postgres is unreachable. Migrations work on both, but test against PostgreSQL before production deploy — some types differ (e.g. `JSONB` is Postgres-only).

---

## Key files reference

| File | Purpose |
|------|---------|
| `app/core/migrations.py` | `run_migrations()` — upgrade head + dev autogenerate |
| `app/core/database.py` | `init_db()` calls migrations, then seeds RBAC |
| `migrations/env.py` | Alembic environment; reads `settings.DATABASE_URL` |
| `app/core/config.py` | `RUN_MIGRATIONS`, `AUTO_MIGRATE_DEV` settings |
