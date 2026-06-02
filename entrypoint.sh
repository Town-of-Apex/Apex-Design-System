#!/bin/bash
# Production backend container entrypoint (root Dockerfile).
#
# Local development — do not use this script directly:
#   Windows:  .\run_dev.ps1
#   macOS/Linux: ./run_dev.sh
#   DB only:  docker compose -f docker-compose.dev.yml up apex-dev-db -d --wait
#   Full stack in Docker: docker compose -f docker-compose.dev.yml up --build

set -euo pipefail

echo "Starting Apex backend (production image)..."
echo "BASE_PATH=${BASE_PATH:-/}"
echo "PORT=${PORT:-8080}"

exec uvicorn app.main:app --host 0.0.0.0 --port "${PORT:-8080}"
