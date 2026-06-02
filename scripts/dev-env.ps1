# Shared helpers for local dev launchers (run_dev.ps1, reset_dev_db.ps1).
# Dot-source from repo root: . .\scripts\dev-env.ps1
#
# Function names must not use reserved prefixes (Start-*, Ensure-Postgres*) or bare --flags (quote them).

$ErrorActionPreference = "Stop"

$script:DevComposeFile = "docker-compose.dev.yml"
$script:DevDbService = "apex-dev-db"
$script:DevDbContainer = "apex-dev-db"

function ShowApexDevBanner {
    Write-Host ""
    Write-Host "=== Apex local dev (Mode A) ===" -ForegroundColor Cyan
    Write-Host "  1. Docker: PostgreSQL only (container: $script:DevDbContainer)"
    Write-Host "  2. Host:    FastAPI backend  -> http://localhost:8080"
    Write-Host "  3. Host:    Vite frontend    -> http://localhost:5173"
    Write-Host ""
    Write-Host "Full stack in Docker (Mode B):"
    Write-Host "  docker compose -f $script:DevComposeFile up --build"
    Write-Host ""
}

function TestApexDocker {
    docker info *> $null
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Docker is not running or not installed. Start Docker Desktop and retry."
        exit 1
    }
}

function EnsureApexDotEnv {
    if (-not (Test-Path ".env")) {
        Copy-Item ".env.example" ".env"
        Write-Host "Created .env from .env.example."
        Write-Host ""
    }
}

function EnsureApexPostgresHostEnv {
    # Use $postgresHostLine; $hostLine is parsed as $Host.Line (automatic variable).
    $postgresHostLine = Get-Content ".env" -ErrorAction SilentlyContinue |
        Where-Object { $_ -match '^\s*POSTGRES_HOST\s*=' } |
        Select-Object -First 1

    if (-not $postgresHostLine) {
        Write-Host "POSTGRES_HOST is not set in .env. Use POSTGRES_HOST=127.0.0.1 for host-run backend."
        exit 1
    }

    $value = ($postgresHostLine -split '=', 2)[1].Trim().Trim('"').Trim("'")
    if ($value -notin @("127.0.0.1", "localhost")) {
        Write-Host "POSTGRES_HOST=$value is for in-container backends."
        Write-Host "run_dev.ps1 runs uvicorn on the host - set POSTGRES_HOST=127.0.0.1 in .env"
        Write-Host "(Use docker compose -f $script:DevComposeFile up for full Docker dev.)"
        exit 1
    }
}

function LaunchApexDevPostgres {
    Write-Host "Starting dev PostgreSQL ($script:DevDbContainer)..."
    docker compose -f $script:DevComposeFile up $script:DevDbService -d "--wait"
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Failed to start dev PostgreSQL."
        exit 1
    }

    $publishedPort = docker port $script:DevDbContainer "5432/tcp" 2>$null
    if (-not $publishedPort) {
        Write-Host "Port 5432 not published - recreating container..."
        docker compose -f $script:DevComposeFile up $script:DevDbService -d "--wait" "--force-recreate"
        if ($LASTEXITCODE -ne 0) {
            Write-Host "Failed to recreate dev PostgreSQL."
            exit 1
        }
        $publishedPort = docker port $script:DevDbContainer "5432/tcp" 2>$null
        if (-not $publishedPort) {
            Write-Host "PostgreSQL still has no host port. Check Docker and POSTGRES_PORT in .env."
            exit 1
        }
    }

    Write-Host "PostgreSQL ready at 127.0.0.1:5432 (or POSTGRES_PORT from .env)."
    Write-Host ""
}

function EnsureApexVenv {
    if (-not (Test-Path ".venv\Scripts\python.exe")) {
        Write-Host "Creating Python virtual environment (.venv)..."
        python -m venv .venv
        if ($LASTEXITCODE -ne 0) {
            Write-Host "Failed to create .venv. Install Python 3.13+ and retry."
            exit 1
        }
        Write-Host "Installing Python dependencies..."
        & .\.venv\Scripts\pip.exe install -r requirements.txt
        if ($LASTEXITCODE -ne 0) {
            Write-Host "pip install failed."
            exit 1
        }
    }
}

function EnsureApexFrontendDeps {
    if (-not (Test-Path "frontend\node_modules")) {
        Write-Host "Installing frontend dependencies (npm install)..."
        Push-Location frontend
        try {
            npm install
            if ($LASTEXITCODE -ne 0) { exit 1 }
        } finally {
            Pop-Location
        }
        Write-Host ""
    }
}
