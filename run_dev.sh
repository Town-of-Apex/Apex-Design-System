#!/bin/bash

echo ""
echo "Starting Apex Design System in Dev Mode..."
echo ""

# Cleanup function for Ctrl+C
cleanup() {
    echo ""
    echo "Stopping services..."
    kill $BACKEND_PID
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