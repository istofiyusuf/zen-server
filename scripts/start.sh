#!/data/data/com.termux/files/usr/bin/bash

echo "Starting Zen Server..."
echo ""

# Check if already running
if [ -f "zen-server.pid" ]; then
    PID=$(cat zen-server.pid)
    if kill -0 $PID 2>/dev/null; then
        echo "Zen Server is already running (PID: $PID)"
        echo "Use 'bash scripts/stop.sh' to stop first"
        exit 1
    fi
fi

# Start backend API
echo "Starting API server on port 3001..."
node api/server.js &
API_PID=$!
echo $API_PID > api.pid

# Start Next.js frontend
echo "Starting frontend on port 3000..."
npx next start &
FRONTEND_PID=$!
echo $FRONTEND_PID > zen-server.pid

echo ""
echo "========================================="
echo "  Zen Server is Running!"
echo "  Frontend: http://localhost:3000"
echo "  API:      http://localhost:3001"
echo "========================================="
echo ""
echo "PID: $FRONTEND_PID"
echo "Use 'bash scripts/stop.sh' to stop"
