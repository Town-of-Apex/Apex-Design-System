# Reset local dev PostgreSQL and apply migrations + seed data.
# Run from repo root: .\scripts\reset_dev_db.ps1

$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $PSScriptRoot
Set-Location $root

. "$root\scripts\dev-env.ps1"

EnsureApexDotEnv
EnsureApexPostgresHostEnv
EnsureApexVenv

Write-Host "Stopping dev PostgreSQL and removing data volume..."
docker compose -f $script:DevComposeFile down -v

LaunchApexDevPostgres

Write-Host "Applying Alembic migrations..."
& .\.venv\Scripts\python.exe -m alembic upgrade head

Write-Host "Seeding roles, permissions, and dev admin user..."
& .\.venv\Scripts\python.exe -c "from app.core.database import init_db; init_db()"

Write-Host ""
Write-Host "Dev database is ready."
Write-Host "  Postgres: 127.0.0.1:5432 (see POSTGRES_* in .env)"
Write-Host "  Admin login: admin / admin123 (from .env SEED_DEV_ADMIN_*)"
Write-Host "  Start app: .\run_dev.ps1"
Write-Host ""
