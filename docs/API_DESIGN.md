# Zen Server - Desain API

## Base URL
http://localhost:3001/api/v1

## Autentikasi
Semua endpoint (kecuali login/register) memerlukan header:
Authorization: Bearer <jwt_token>

## Endpoints

### Authentication
POST   /api/v1/auth/register     # Register user
POST   /api/v1/auth/login        # Login user
POST   /api/v1/auth/logout       # Logout user
GET    /api/v1/auth/me           # Get current user
PUT    /api/v1/auth/password     # Change password

### System Monitoring
GET    /api/v1/system/info       # System information
GET    /api/v1/system/cpu        # CPU usage
GET    /api/v1/system/ram        # RAM usage
GET    /api/v1/system/disk       # Disk usage
GET    /api/v1/system/battery    # Battery status
GET    /api/v1/system/network    # Network info

### Services
GET    /api/v1/services          # List services
POST   /api/v1/services/start    # Start service
POST   /api/v1/services/stop     # Stop service
POST   /api/v1/services/restart  # Restart service
GET    /api/v1/services/:name    # Service status

### Websites
GET    /api/v1/websites          # List websites
POST   /api/v1/websites          # Create website
PUT    /api/v1/websites/:id      # Update website
DELETE /api/v1/websites/:id      # Delete website
POST   /api/v1/websites/:id/start
POST   /api/v1/websites/:id/stop

### File Manager
GET    /api/v1/files/list        # List files
POST   /api/v1/files/upload      # Upload file
GET    /api/v1/files/download    # Download file
DELETE /api/v1/files/delete      # Delete file
POST   /api/v1/files/move        # Move file
POST   /api/v1/files/copy        # Copy file
POST   /api/v1/files/compress    # Compress
POST   /api/v1/files/extract     # Extract

### Database
GET    /api/v1/database/list     # List databases
POST   /api/v1/database/create   # Create database
DELETE /api/v1/database/:name    # Delete database
POST   /api/v1/database/backup   # Backup database
POST   /api/v1/database/restore  # Restore database

### Terminal
WebSocket: ws://localhost:3001/terminal
Events: terminal:input, terminal:output

### Package Manager
GET    /api/v1/packages/list     # List packages
GET    /api/v1/packages/search   # Search packages
POST   /api/v1/packages/install  # Install package
POST   /api/v1/packages/remove   # Remove package
GET    /api/v1/packages/installed # Installed packages

### Settings
GET    /api/v1/settings          # Get settings
PUT    /api/v1/settings          # Update settings

## Response Format
{
  "success": true,
  "data": {},
  "message": "Success",
  "error": null
}

## Error Response
{
  "success": false,
  "data": null,
  "message": "Error message",
  "error": {
    "code": "ERROR_CODE",
    "details": {}
  }
}

## Socket.IO Events
// Client to Server
socket.emit('terminal:input', { command: 'ls' });
socket.on('system:stats', (data) => {});

// Server to Client
socket.emit('terminal:output', (data) => {});
socket.on('logs:stream', (data) => {});
