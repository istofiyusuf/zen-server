#!/data/data/com.termux/files/usr/bin/bash

echo "Starting Zen Server..."
echo ""

# Kill existing processes
pkill -f "node api/server" 2>/dev/null
pkill -f "next start" 2>/dev/null
sleep 1

# Start backend API
echo "[1/2] Starting API server..."
node api/server-termux.js &
API_PID=$!
sleep 2

# Check if API started
if kill -0 $API_PID 2>/dev/null; then
    echo "  API Server: RUNNING (PID: $API_PID)"
else
    echo "  API Server: FAILED TO START"
fi

# Start frontend
echo "[2/2] Starting frontend..."
npx next start &
FRONTEND_PID=$!
sleep 2

if kill -0 $FRONTEND_PID 2>/dev/null; then
    echo "  Frontend: RUNNING (PID: $FRONTEND_PID)"
else
    echo "  Frontend: FAILED TO START"
fi

echo ""
echo "========================================="
echo "  Zen Server is Running!"
echo "  Frontend: http://localhost:3000"
echo "  API:      http://localhost:3001"
echo "========================================="
echo ""
echo "PIDs: API=$API_PID Frontend=$FRONTEND_PID"
echo "Use 'bash scripts/stop.sh' to stop"
