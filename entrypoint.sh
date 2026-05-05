#!/bin/bash
set -e

echo "Starting Apex Design System..."
echo "Base Path: ${BASE_PATH:-'/'}"

# Run the FastAPI server using uvicorn
# We use the app.main:app syntax to point to the FastAPI instance
exec uvicorn app.main:app --host 0.0.0.0 --port 8080
