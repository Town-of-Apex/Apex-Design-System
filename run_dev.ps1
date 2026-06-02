# Local dev launcher (Mode A): Docker Postgres + host backend + host frontend.
# Run from anywhere: .\run_dev.ps1

$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot

. "$PSScriptRoot\scripts\dev-env.ps1"

ShowApexDevBanner
TestApexDocker
EnsureApexDotEnv
EnsureApexPostgresHostEnv
LaunchApexDevPostgres
EnsureApexVenv
EnsureApexFrontendDeps

$projectRoot = (Get-Location).Path -replace "'", "''"
$backendCommand = @"
Set-Location -LiteralPath '$projectRoot'
& .\.venv\Scripts\Activate.ps1
Write-Host 'Apex backend (uvicorn --reload) -> http://localhost:8080'
uvicorn app.main:app --reload --host 0.0.0.0 --port 8080
"@

Write-Host "Starting backend in a new terminal..."
Start-Process powershell -ArgumentList @('-NoExit', '-Command', $backendCommand)

Write-Host "Starting frontend in this terminal -> http://localhost:5173"
Write-Host "Sign in: admin / admin123 (see .env SEED_DEV_ADMIN_*)"
Write-Host "Press Ctrl+C to stop the frontend (close the backend terminal separately)."
Write-Host ""

Set-Location frontend
npm run dev
