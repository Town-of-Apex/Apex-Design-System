Write-Host ""
Write-Host "Starting Apex Design System in Dev Mode..."
Write-Host ""

# Start backend in separate window
Write-Host ""
Write-Host "Starting Apex Design System Backend..."
Write-Host ""
Start-Process powershell -ArgumentList `
    "-NoExit", `
    "-Command", `
    "& { .\.venv\Scripts\Activate.ps1; uvicorn app.main:app --reload --host 0.0.0.0 --port 8080 }"

# Start frontend in current window
Write-Host ""
Write-Host "Starting Apex Design System Frontend..."
Write-Host ""
Set-Location frontend
npm run dev