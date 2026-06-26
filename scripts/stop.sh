#!/data/data/com.termux/files/usr/bin/bash

echo "Stopping Zen Server..."

# Stop frontend
if [ -f "zen-server.pid" ]; then
    PID=$(cat zen-server.pid)
    if kill -0 $PID 2>/dev/null; then
        kill $PID
        echo "Frontend stopped (PID: $PID)"
    fi
    rm -f zen-server.pid
fi

# Stop API
if [ -f "api.pid" ]; then
    PID=$(cat api.pid)
    if kill -0 $PID 2>/dev/null; then
        kill $PID
        echo "API stopped (PID: $PID)"
    fi
    rm -f api.pid
fi

# Kill any remaining node processes
pkill -f "node api/server.js" 2>/dev/null
pkill -f "next start" 2>/dev/null

echo "Zen Server stopped."
