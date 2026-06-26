#!/data/data/com.termux/files/usr/bin/bash

echo "========================================="
echo "  Zen Server - Installation Script"
echo "========================================="
echo ""

# Update Termux
echo "[1/6] Updating Termux packages..."
pkg update -y && pkg upgrade -y

# Install system dependencies
echo "[2/6] Installing system dependencies..."
pkg install -y nodejs git curl wget openssh python php nginx apache2 mariadb sqlite screen tmux busybox zip unzip tar termux-api termux-services

# Setup Node.js
echo "[3/6] Setting up Node.js..."
npm install -g pm2

# Clone or update repository
echo "[4/6] Setting up Zen Server..."
cd ~
if [ -d "zen-server" ]; then
    echo "Zen Server directory exists, updating..."
    cd zen-server
    git pull
else
    echo "Cloning Zen Server..."
    git clone https://github.com/yourusername/zen-server.git
    cd zen-server
fi

# Install npm dependencies
echo "[5/6] Installing npm dependencies..."
npm install --legacy-peer-deps

# Setup database
echo "[6/6] Setting up database..."
npx prisma generate
npx prisma db push

# Build application
echo "Building application..."
npm run build

echo ""
echo "========================================="
echo "  Installation Complete!"
echo "========================================="
echo ""
echo "Run 'npm start' to start the server"
echo "Access at http://localhost:3000"
echo ""
