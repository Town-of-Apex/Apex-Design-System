Write-Host ""
Write-Host "Starting Apex Design System in Dev Mode..."
Write-Host ""

# Ensure .env exists so POSTGRES_* and DEV_MODE are configured
if (-not (Test-Path ".env")) {
    Copy-Item ".env.example" ".env"
    Write-Host "Created .env from .env.example - review POSTGRES_* settings before continuing."
    Write-Host ""
}

# Start local dev PostgreSQL (maps POSTGRES_PORT to 127.0.0.1 on the host)
Write-Host "Starting dev PostgreSQL container..."
docker compose -f docker-compose.dev.yml up apex-dev-db -d --wait
if ($LASTEXITCODE -ne 0) {
    Write-Host "Failed to start dev PostgreSQL. Is Docker running?"
    exit 1
}

# Older containers may run without a published host port; recreate if 5432 is not reachable.
$publishedPort = docker port apex-dev-db 5432/tcp 2>$null
if (-not $publishedPort) {
    Write-Host "PostgreSQL is running but port 5432 is not published to the host. Recreating container..."
    docker compose -f docker-compose.dev.yml up apex-dev-db -d --wait --force-recreate
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Failed to recreate dev PostgreSQL."
        exit 1
    }
    $publishedPort = docker port apex-dev-db 5432/tcp 2>$null
    if (-not $publishedPort) {
        Write-Host "PostgreSQL still has no host port mapping. Check Docker Desktop and POSTGRES_PORT in .env."
        exit 1
    }
}

Write-Host "Dev PostgreSQL is ready at 127.0.0.1:5432 (set POSTGRES_HOST=127.0.0.1 in .env for host-run backend)."
Write-Host ""

# Start backend in separate window
Write-Host "Starting Apex Design System Backend..."
Write-Host ""
$projectRoot = (Get-Location).Path -replace "'", "''"
$backendCommand = "Set-Location -LiteralPath '$projectRoot'; & .\.venv\Scripts\Activate.ps1; uvicorn app.main:app --reload --host 0.0.0.0 --port 8080"
Start-Process powershell -ArgumentList @('-NoExit', '-Command', $backendCommand)

# Start frontend in current window
Write-Host ""
Write-Host "Starting Apex Design System Frontend..."
Write-Host ""
Set-Location frontend
npm run dev
