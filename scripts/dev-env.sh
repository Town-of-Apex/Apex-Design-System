#!/bin/bash
# Shared helpers for local dev launchers (run_dev.sh).
# Source from repo root: source "./scripts/dev-env.sh"

set -euo pipefail

DEV_COMPOSE_FILE="docker-compose.dev.yml"
DEV_DB_SERVICE="apex-dev-db"
DEV_DB_CONTAINER="apex-dev-db"

write_dev_mode_banner() {
    echo ""
    echo "=== Apex local dev (Mode A) ==="
    echo "  1. Docker: PostgreSQL only (container: ${DEV_DB_CONTAINER})"
    echo "  2. Host:    FastAPI backend  -> http://localhost:8080"
    echo "  3. Host:    Vite frontend    -> http://localhost:5173"
    echo ""
    echo "Full stack in Docker (Mode B):"
    echo "  docker compose -f ${DEV_COMPOSE_FILE} up --build"
    echo ""
}

test_docker_available() {
    if ! docker info >/dev/null 2>&1; then
        echo "Docker is not running or not installed. Start Docker and retry."
        exit 1
    fi
}

ensure_dotenv() {
    if [ ! -f .env ]; then
        cp .env.example .env
        echo "Created .env from .env.example."
        echo ""
    fi
}

ensure_host_postgres_env() {
    local host_line value
    host_line=$(grep -E '^[[:space:]]*POSTGRES_HOST[[:space:]]*=' .env 2>/dev/null | head -n 1 || true)
    if [ -z "$host_line" ]; then
        echo "POSTGRES_HOST is not set in .env. Use POSTGRES_HOST=127.0.0.1 for host-run backend."
        exit 1
    fi
    value=$(echo "$host_line" | cut -d= -f2- | xargs)
    case "$value" in
        127.0.0.1|localhost) ;;
        *)
            echo "POSTGRES_HOST=${value} is for in-container backends."
            echo "run_dev.sh runs uvicorn on the host — set POSTGRES_HOST=127.0.0.1 in .env"
            echo "(Use: docker compose -f ${DEV_COMPOSE_FILE} up --build for full Docker dev.)"
            exit 1
            ;;
    esac
}

start_dev_postgres_container() {
    echo "Starting dev PostgreSQL (${DEV_DB_CONTAINER})..."
    docker compose -f "${DEV_COMPOSE_FILE}" up "${DEV_DB_SERVICE}" -d --wait

    if ! docker port "${DEV_DB_CONTAINER}" 5432/tcp >/dev/null 2>&1; then
        echo "Port 5432 not published — recreating container..."
        docker compose -f "${DEV_COMPOSE_FILE}" up "${DEV_DB_SERVICE}" -d --wait --force-recreate
        if ! docker port "${DEV_DB_CONTAINER}" 5432/tcp >/dev/null 2>&1; then
            echo "PostgreSQL still has no host port. Check Docker and POSTGRES_PORT in .env."
            exit 1
        fi
    fi

    echo "PostgreSQL ready at 127.0.0.1:5432 (see POSTGRES_PORT in .env if customized)."
    echo ""
}

ensure_python_venv() {
    if [ ! -x .venv/bin/python ]; then
        echo "Creating Python virtual environment (.venv)..."
        python3 -m venv .venv
        echo "Installing Python dependencies..."
        .venv/bin/pip install -r requirements.txt
    fi
}

ensure_frontend_deps() {
    if [ ! -d frontend/node_modules ]; then
        echo "Installing frontend dependencies (npm install)..."
        (cd frontend && npm install)
        echo ""
    fi
}
