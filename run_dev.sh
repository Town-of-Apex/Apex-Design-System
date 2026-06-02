#!/bin/bash
# Local dev launcher (Mode A): Docker Postgres + host backend + host frontend.
# Run from anywhere: ./run_dev.sh

set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT"

# shellcheck source=scripts/dev-env.sh
source "./scripts/dev-env.sh"

write_dev_mode_banner
test_docker_available
ensure_dotenv
ensure_host_postgres_env
start_dev_postgres_container
ensure_python_venv
ensure_frontend_deps

cleanup() {
    echo ""
    echo "Stopping backend..."
    kill "$BACKEND_PID" 2>/dev/null || true
    wait "$BACKEND_PID" 2>/dev/null || true
    exit 0
}

trap cleanup SIGINT SIGTERM

echo "Starting backend -> http://localhost:8080"
.venv/bin/python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8080 &
BACKEND_PID=$!

echo "Starting frontend -> http://localhost:5173"
echo "Sign in: admin / admin123 (see .env SEED_DEV_ADMIN_*)"
echo "Press Ctrl+C to stop both services."
echo ""

cd frontend
npm run dev
