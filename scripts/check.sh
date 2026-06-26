#!/data/data/com.termux/files/usr/bin/bash

echo "========================================="
echo "  Zen Server - System Check"
echo "========================================="
echo ""

# Check Node.js
if command -v node &>/dev/null; then
    echo "Node.js:   $(node --version) [OK]"
else
    echo "Node.js:   NOT INSTALLED [FAIL]"
fi

# Check npm
if command -v npm &>/dev/null; then
    echo "npm:       $(npm --version) [OK]"
else
    echo "npm:       NOT INSTALLED [FAIL]"
fi

# Check Git
if command -v git &>/dev/null; then
    echo "Git:       $(git --version) [OK]"
else
    echo "Git:       NOT INSTALLED [FAIL]"
fi

# Check PHP
if command -v php &>/dev/null; then
    echo "PHP:       $(php --version | head -1) [OK]"
else
    echo "PHP:       NOT INSTALLED [FAIL]"
fi

# Check Python
if command -v python &>/dev/null; then
    echo "Python:    $(python --version) [OK]"
else
    echo "Python:    NOT INSTALLED [FAIL]"
fi

# Check Nginx
if command -v nginx &>/dev/null; then
    echo "Nginx:     $(nginx -v 2>&1) [OK]"
else
    echo "Nginx:     NOT INSTALLED [FAIL]"
fi

# Check MariaDB
if command -v mysql &>/dev/null; then
    echo "MariaDB:   Installed [OK]"
else
    echo "MariaDB:   NOT INSTALLED [FAIL]"
fi

# Check if running
if [ -f "zen-server.pid" ]; then
    PID=$(cat zen-server.pid)
    if kill -0 $PID 2>/dev/null; then
        echo ""
        echo "Zen Server: RUNNING (PID: $PID)"
    else
        echo ""
        echo "Zen Server: STOPPED"
    fi
else
    echo ""
    echo "Zen Server: STOPPED"
fi

echo ""
echo "========================================="
