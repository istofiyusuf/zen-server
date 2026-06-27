#!/data/data/com.termux/files/usr/bin/bash

echo "========================================="
echo "  Zen Server - Starting..."
echo "========================================="
echo ""

# Kill existing processes
echo "Cleaning up old processes..."
pkill -f "node api/server" 2>/dev/null
pkill -f "next start" 2>/dev/null
sleep 1

# Detect environment
if [ -f "/data/data/com.termux/files/usr/bin/pkg" ]; then
    echo "Termux detected - Using Termux backend"
    SERVER_FILE="api/server-termux.js"
else
    echo "Standard environment - Using standard backend"
    SERVER_FILE="api/server.js"
fi

# Start backend API
echo ""
echo "[1/2] Starting API server..."
node $SERVER_FILE &
API_PID=$!
sleep 3

# Check if API started
if kill -0 $API_PID 2>/dev/null; then
    echo "  ✓ API Server: RUNNING (PID: $API_PID)"
    echo "  URL: http://localhost:3001"
else
    echo "  ✗ API Server: FAILED"
    cat nohup.out 2>/dev/null
fi

# Start frontend
echo ""
echo "[2/2] Starting frontend..."
npx next start -p 3000 &
FRONTEND_PID=$!
sleep 3

if kill -0 $FRONTEND_PID 2>/dev/null; then
    echo "  ✓ Frontend: RUNNING (PID: $FRONTEND_PID)"
    echo "  URL: http://localhost:3000"
else
    echo "  ✗ Frontend: FAILED"
fi

# Save PIDs
echo $API_PID > api.pid
echo $FRONTEND_PID > zen-server.pid

echo ""
echo "========================================="
echo "  Zen Server is Running!"
echo ""
echo "  Dashboard: http://localhost:3000"
echo "  API:       http://localhost:3001/api/health"
echo "========================================="
echo ""
echo "PIDs: API=$API_PID | Frontend=$FRONTEND_PID"
echo ""
echo "Stop server: bash scripts/stop.sh"
echo "Check status: bash scripts/check.sh"
