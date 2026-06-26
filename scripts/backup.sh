#!/data/data/com.termux/files/usr/bin/bash

BACKUP_DIR="./backups"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="zen-server-backup-$TIMESTAMP.tar.gz"

echo "Creating backup: $BACKUP_FILE"

# Create backup directory
mkdir -p $BACKUP_DIR

# Backup
tar -czf "$BACKUP_DIR/$BACKUP_FILE" \
    --exclude="node_modules" \
    --exclude=".next" \
    --exclude="backups" \
    --exclude="logs" \
    .

echo "Backup created: $BACKUP_DIR/$BACKUP_FILE"
echo "Size: $(du -h $BACKUP_DIR/$BACKUP_FILE | cut -f1)"
