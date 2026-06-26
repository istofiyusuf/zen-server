# Zen Server - Dokumentasi Arsitektur

## Arsitektur Umum

Browser Mobile (Client)
    |
    | HTTP/HTTPS + WebSocket
    |
Next.js Server (Port 3000)
    |
    | API Calls
    |
Express Backend (Port 3001)
    |
    | System Commands
    |
Termux Environment (Android)

## Komponen Utama

### 1. Frontend Layer (Next.js)
- App Router: Routing dan halaman
- Components: UI components (shadcn/ui)
- Features: Fitur-fitur spesifik
- Hooks: Custom React hooks
- Lib: Utility functions
- Services: API calls, Socket.IO client

### 2. Backend Layer (Express)
- API Routes: REST endpoints
- Socket.IO: Real-time communication
- Middleware: Auth, validation, rate limiting
- Services: Business logic
- TermuxService: Command execution

### 3. Data Layer
- Prisma ORM: Database abstraction
- SQLite: Primary database
- File System: File management

### 4. Termux Layer
- Package Management: pkg/apt interface
- Service Management: Apache, Nginx, etc.
- System Monitoring: CPU, RAM, etc.

## Pola Komunikasi

### REST API
- GET: Mengambil data
- POST: Membuat resource
- PUT: Memperbarui resource
- DELETE: Menghapus resource

### WebSocket (Socket.IO)
- system:stats - CPU, RAM, disk realtime
- terminal:input - Input terminal
- terminal:output - Output terminal
- logs:stream - Log realtime

## Keamanan
- JWT tokens untuk autentikasi
- Helmet untuk HTTP headers
- Rate limiting untuk API
- CORS configuration
- Input sanitization
- XSS protection

## Kompatibilitas Termux
Semua perintah sistem menggunakan path Termux:
- /data/data/com.termux/files/usr/bin/
- /data/data/com.termux/files/usr/etc/
