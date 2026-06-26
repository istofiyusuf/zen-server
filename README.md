# Zen Server

Android Web Server Dashboard untuk Termux.

## Deskripsi

Zen Server adalah dashboard manajemen server web yang berjalan di dalam Termux pada perangkat Android. Aplikasi ini memungkinkan Anda mengelola berbagai layanan server seperti Apache, Nginx, PHP, Node.js, Python, database, dan lainnya melalui browser mobile.

## Fitur Utama

- Manajemen Website (Apache/Nginx + PHP/Node.js/Python)
- File Manager
- Database Manager (SQLite/MariaDB)
- Web Terminal (Socket.IO)
- Package Manager (pkg/apt)
- System Monitoring (CPU/RAM/Disk/Battery)
- Backup & Restore
- SSL Management
- FTP & SSH Management
- Log Viewer

## Teknologi

- **Frontend:** Next.js 16, TypeScript, TailwindCSS, Shadcn UI
- **Backend:** Express.js, Socket.IO
- **Database:** SQLite + Prisma ORM
- **Auth:** JWT + bcrypt

## Persyaratan

- Android 7.0+
- Termux (dari F-Droid)
- Node.js 20+
- npm/pnpm

## Instalasi di Termux

```bash
# Update Termux
pkg update && pkg upgrade

# Install dependensi sistem
pkg install nodejs git curl wget

# Clone repository
cd ~
git clone https://github.com/yourusername/zen-server.git
cd zen-server

# Zen Server

Android Web Server Dashboard untuk Termux.

## Fitur

- Dashboard Realtime (CPU, RAM, Storage, Battery, Network)
- Website Manager (Static, PHP, Node.js, Python)
- File Manager (Browse, Upload, Delete, Preview)
- Package Manager (Install, Remove, Search)
- Database Manager (SQLite, MariaDB, PostgreSQL)
- Web Terminal (Execute commands via browser)
- Backup & Restore
- Dark/Light Theme
- JWT Authentication

## Screenshot


## Instalasi di Termux

```bash
# Update Termux
pkg update && pkg upgrade

# Install dependencies
pkg install nodejs git

# Clone repository
cd ~
git clone https://github.com/istofiyusuf/zen-server.git
cd zen-server

# Run install script
bash scripts/install.sh

# Start server
bash scripts/start.
```
Buka browser: [http://localhost:](http://localhost:3000)

# Install
npm install

# Setup database
npx prisma generate
npx prisma db push

# Build aplikasi
npm run build

# Jalankan server
npm start


Pengembangan di Windows
bash
# Clone repository
git clone https://github.com/yourusername/zen-server.git
cd zen-server

# Install dependensi
npm install

# Setup database
npx prisma generate
npx prisma db push

# Jalankan development server
npm run

## Struktur Proyek
text
zen-server/
├── app/                    # Next.js App Router
├── components/             # UI Components
├── features/               # Feature modules
├── hooks/                  # Custom hooks
├── lib/                    # Utilities
├── services/               # API services
├── api/                    # Backend API
├── database/               # Database
├── scripts/                # Scripts
├── termux/                 # Termux spesifik
├── config/                 # Konfigurasi
├── public/                 # Static files
└── docs/                   # Dokumentasi

## Lisensi
MIT License


## Kontribusi
Pull request selalu diterima. Untuk perubahan besar, buka issue terlebih dahulu.

text

### LANGKAH 12: Buat file konfigurasi ESLint

**File: D:\CODINGGG\zen-server\.eslintrc.json**

```json
{
  "extends": [
    "next/core-web-vitals",
    "next/typescript"
  ],
  "rules": {
    "@typescript-eslint/no-unused-vars": ["warn", { "argsIgnorePattern": "^_" }],
    "@typescript-eslint/no-explicit-any": "warn",
    "react-hooks/exhaustive-deps": "warn",
    "no-console": ["warn", { "allow": ["warn", "error"] }]
  }
}
