# THIS SCRIPT IS FOR 'DEV MODE' ONLY. DO NOT ATTEMPT TO USE THIS TO DEPLOY A PRODUCTION OR REMOTE-HOSTED APPLICATION


#!/bin/bash
set -e

echo "Starting Apex Design System..."
echo "Base Path: ${BASE_PATH:-'/'}"

# Run the FastAPI server using uvicorn
# We use the app.main:app syntax to point to the FastAPI instance
echo "Launching backend..."
exec uvicorn app.main:app --host 0.0.0.0 --port 8080


# Launch the frontend using Vite dev server
exec cd .\frontend\
exec npm run dev
