#!/bin/bash
set -euo pipefail

echo ""
echo "Starting Apex Design System in Dev Mode..."
echo ""

# Ensure .env exists so POSTGRES_* and DEV_MODE are configured
if [ ! -f .env ]; then
    cp .env.example .env
    echo "Created .env from .env.example — review POSTGRES_* settings before continuing."
    echo ""
fi

# Start local dev PostgreSQL (maps POSTGRES_PORT to 127.0.0.1 on the host)
echo "Starting dev PostgreSQL container..."
docker compose -f docker-compose.dev.yml up apex-dev-db -d --wait

if ! docker port apex-dev-db 5432/tcp >/dev/null 2>&1; then
    echo "PostgreSQL is running but port 5432 is not published to the host. Recreating container..."
    docker compose -f docker-compose.dev.yml up apex-dev-db -d --wait --force-recreate
    if ! docker port apex-dev-db 5432/tcp >/dev/null 2>&1; then
        echo "PostgreSQL still has no host port mapping. Check Docker and POSTGRES_PORT in .env."
        exit 1
    fi
fi

echo "Dev PostgreSQL is ready at 127.0.0.1:5432 (POSTGRES_HOST=127.0.0.1 in .env for host-run backend)."
echo ""

# Cleanup function for Ctrl+C
cleanup() {
    echo ""
    echo "Stopping services..."
    kill "$BACKEND_PID" 2>/dev/null || true
    exit 0
}

trap cleanup SIGINT

# Start backend in background
echo ""
echo "Starting Apex Design System Backend..."
echo ""
uvicorn app.main:app --reload --host 0.0.0.0 --port 8080 &
BACKEND_PID=$!

# Start frontend
echo ""
echo "Starting Apex Design System Frontend..."
echo ""
cd frontend || exit
npm run dev
