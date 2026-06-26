#!/data/data/com.termux/files/usr/bin/bash

echo "Restarting Zen Server..."
bash scripts/stop.sh
sleep 2
bash scripts/start.sh
