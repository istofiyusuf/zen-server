#!/data/data/com.termux/files/usr/bin/bash

if [ -z "$1" ]; then
    echo "Usage: bash scripts/restore.sh <backup-file>"
    echo "Available backups:"
    ls -1 backups/*.tar.gz 2>/dev/null || echo "  No backups found"
    exit 1
fi

BACKUP_FILE="$1"

if [ ! -f "$BACKUP_FILE" ]; then
    echo "Error: Backup file not found: $BACKUP_FILE"
    exit 1
fi

echo "Restoring from: $BACKUP_FILE"

# Stop server
bash scripts/stop.sh 2>/dev/null

# Restore
tar -xzf "$BACKUP_FILE"

# Reinstall dependencies
npm install --legacy-peer-deps
npx prisma generate
npx prisma db push

echo "Restore complete!"
echo "Run 'bash scripts/start.sh' to start the server"
