# Reset local dev PostgreSQL and apply migrations + seed data.
# Run from repo root: .\scripts\reset_dev_db.ps1

$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $PSScriptRoot
Set-Location $root

if (-not (Test-Path ".venv\Scripts\python.exe")) {
    Write-Error "Missing .venv. Create it and install requirements.txt first."
}

Write-Host "Stopping dev PostgreSQL and removing data volume..."
docker compose -f docker-compose.dev.yml down -v

Write-Host "Starting fresh dev PostgreSQL..."
docker compose -f docker-compose.dev.yml up apex-dev-db -d --wait
if ($LASTEXITCODE -ne 0) {
    Write-Error "Failed to start dev PostgreSQL. Is Docker running?"
}

$publishedPort = docker port apex-dev-db 5432/tcp 2>$null
if (-not $publishedPort) {
    Write-Host "Recreating container so port 5432 is published to the host..."
    docker compose -f docker-compose.dev.yml up apex-dev-db -d --wait --force-recreate
}

Write-Host "Applying Alembic migrations..."
& .\.venv\Scripts\python.exe -m alembic upgrade head

Write-Host "Seeding roles, permissions, and dev admin user..."
& .\.venv\Scripts\python.exe -c "from app.core.database import init_db; init_db()"

Write-Host ""
Write-Host "Dev database is ready."
Write-Host "  Postgres: 127.0.0.1:5432 (database demo, user demo)"
Write-Host "  Admin login: admin / admin123 (from .env SEED_DEV_ADMIN_*)"
Write-Host ""
