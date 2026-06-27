<p align="center">
  <img src="https://raw.githubusercontent.com/istofiyusuf/zen-server/main/public/icon-192.svg" alt="Zen Server Logo" width="120" height="120">
</p>

<h1 align="center">Zen Server</h1>

<p align="center">
  <strong>Android Web Server Dashboard untuk Termux</strong>
</p>

<p align="center">
  <a href="https://github.com/istofiyusuf/zen-server/blob/main/LICENSE">
    <img src="https://img.shields.io/badge/License-MIT-blue.svg" alt="License: MIT">
  </a>
  <a href="https://github.com/istofiyusuf/zen-server">
    <img src="https://img.shields.io/badge/Version-1.0.0-black.svg" alt="Version">
  </a>
  <a href="#">
    <img src="https://img.shields.io/badge/Next.js-14.2-black?logo=next.js&logoColor=white" alt="Next.js">
  </a>
  <a href="#">
    <img src="https://img.shields.io/badge/Express-4.21-black?logo=express&logoColor=white" alt="Express">
  </a>
  <a href="#">
    <img src="https://img.shields.io/badge/Prisma-5.22-black?logo=prisma&logoColor=white" alt="Prisma">
  </a>
  <a href="#">
    <img src="https://img.shields.io/badge/Tailwind-3.4-black?logo=tailwindcss&logoColor=white" alt="TailwindCSS">
  </a>
  <a href="#">
    <img src="https://img.shields.io/badge/TypeScript-5.3-black?logo=typescript&logoColor=white" alt="TypeScript">
  </a>
  <a href="#">
    <img src="https://img.shields.io/badge/Platform-Termux-black?logo=android&logoColor=white" alt="Termux">
  </a>
</p>

<p align="center">
  <a href="#tentang">Tentang</a> •
  <a href="#fitur">Fitur</a> •
  <a href="#tampilan">Tampilan</a> •
  <a href="#instalasi">Instalasi</a> •
  <a href="#pengembangan">Pengembangan</a> •
  <a href="#struktur-proyek">Struktur</a> •
  <a href="#teknologi">Teknologi</a> •
  <a href="#lisensi">Lisensi</a>
</p>

---

## Tentang

**Zen Server** adalah dashboard manajemen server web premium yang berjalan di dalam **Termux** pada perangkat **Android**. Aplikasi ini memungkinkan Anda mengelola berbagai layanan server seperti Apache, Nginx, PHP, Node.js, Python, database, dan lainnya melalui browser mobile dengan antarmuka modern dan elegan.

Dirancang dengan filosofi **"Develop on Windows, Deploy on Android"** - tulis kode di PC, clone di Termux, dan langsung berjalan tanpa modifikasi apapun.

---

## Fitur

<table>
  <tr>
    <td width="50%">
      <h3>🔐 Authentication</h3>
      <ul>
        <li>Login & Register dengan JWT</li>
        <li>Password hashing (bcrypt)</li>
        <li>Session management</li>
        <li>Protected routes</li>
      </ul>
    </td>
    <td width="50%">
      <h3>📊 Dashboard Realtime</h3>
      <ul>
        <li>CPU Usage Monitor</li>
        <li>RAM Usage Monitor</li>
        <li>Storage Usage Monitor</li>
        <li>Battery & Temperature</li>
        <li>Network Information</li>
        <li>System Uptime</li>
      </ul>
    </td>
  </tr>
  <tr>
    <td>
      <h3>🌐 Website Manager</h3>
      <ul>
        <li>Create/Delete websites</li>
        <li>Support: Static, PHP, Node.js, Python</li>
        <li>Start/Stop/Restart</li>
        <li>Auto-create default files</li>
        <li>Activity logging</li>
      </ul>
    </td>
    <td>
      <h3>📁 File Manager</h3>
      <ul>
        <li>Browse files & folders</li>
        <li>Preview text files</li>
        <li>Create folders</li>
        <li>Delete files/folders</li>
        <li>Breadcrumb navigation</li>
      </ul>
    </td>
  </tr>
  <tr>
    <td>
      <h3>📦 Package Manager</h3>
      <ul>
        <li>List installed packages</li>
        <li>Search available packages</li>
        <li>Install/Remove packages</li>
        <li>Real pkg/apt integration</li>
      </ul>
    </td>
    <td>
      <h3>🗄️ Database Manager</h3>
      <ul>
        <li>Create/Delete databases</li>
        <li>SQLite, MariaDB, PostgreSQL</li>
        <li>Backup & Restore</li>
      </ul>
    </td>
  </tr>
  <tr>
    <td>
      <h3>💻 Web Terminal</h3>
      <ul>
        <li>Execute system commands</li>
        <li>Real-time output</li>
        <li>Command history</li>
        <li>Built-in: clear, help, cd, pwd</li>
      </ul>
    </td>
    <td>
      <h3>💾 Backup & Restore</h3>
      <ul>
        <li>Full system backup</li>
        <li>Config backup</li>
        <li>Backup history</li>
        <li>One-click restore</li>
      </ul>
    </td>
  </tr>
  <tr>
    <td>
      <h3>⚙️ Settings & Profile</h3>
      <ul>
        <li>Profile management</li>
        <li>Change password</li>
        <li>Dark/Light theme</li>
        <li>System preferences</li>
      </ul>
    </td>
    <td>
      <h3>🎨 Premium UI</h3>
      <ul>
        <li>Glass morphism design</li>
        <li>Smooth animations (Framer Motion)</li>
        <li>Toast notifications</li>
        <li>Mobile responsive</li>
        <li>Touch optimized</li>
      </ul>
    </td>
  </tr>
</table>

---

## Tampilan

<div align="center">
  <p><em>Splash Screen • Login • Dashboard • File Manager • Terminal • Settings</em></p>
</div>

| Splash | Login | Dashboard |
|--------|-------|-----------|
| Zen logo dengan progress bar | Form login premium dengan toast | CPU, RAM, Storage realtime |

| File Manager | Web Terminal | Settings |
|-------------|--------------|----------|
| Browse, preview, delete files | Execute commands via browser | Profile, theme, password |

| Website Manager | Package Manager | Backup |
|----------------|-----------------|--------|
| Create PHP/Node.js sites | Install/remove packages | Full system backup |

---

## Instalasi

### Persyaratan

- **Android 7.0+**
- **[Termux](https://f-droid.org/packages/com.termux/)** (dari F-Droid, bukan Play Store)
- **Koneksi internet** untuk instalasi awal

### Quick Start di Termux

```bash
# Update Termux
pkg update && pkg upgrade -y
```

# Install dependencies
```bash
pkg install nodejs git curl wget -y
```

# Clone repository
```bash
cd ~
git clone https://github.com/istofiyusuf/zen-server.git
cd zen-server
```

# Jalankan script instalasi
```bash
bash scripts/install.sh
```

# Start server
```bash
bash scripts/start.sh
```

Buka browser Android dan akses: http://localhost:3000

---

## Command Lainnya

```bash
bash scripts/stop.sh      # Stop server
bash scripts/restart.sh    # Restart server
bash scripts/check.sh      # Cek status sistem
bash scripts/backup.sh     # Backup data
bash scripts/restore.sh    # Restore dari backup
```

---

## Pengembangan
### Development di Windows

# Clone repository
```bash
git clone https://github.com/istofiyusuf/zen-server.git
cd zen-server
```

# Install dependencies
```bash
npm install --legacy-peer-deps
```

# Setup database
```bash
npx prisma generate
npx prisma db push
```

# Terminal 1 - Backend
```bash
node api/server.js
```

# Terminal 2 - Frontend
```bash
npm run dev
```

Buka http://localhost:3000 untuk frontend dan http://localhost:3001/api/health untuk API.

---

## Scripts Development

```bash
npm run dev           # Next.js development server
npm run build         # Production build
npm start             # Production start
npm run server        # API server only
npm run db:studio     # Prisma Studio (http://localhost:5555)
npm run db:push       # Push schema ke database
npm run lint          # ESLint
npm run format        # Prettier
```

---

## Struktur Project

```bash
zen-server/
├── app/                          # Next.js App Router
│   ├── backup/page.tsx           # Backup & Restore page
│   ├── dashboard/                # Dashboard (protected)
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── databases/page.tsx        # Database Manager
│   ├── docs/page.tsx             # Documentation
│   ├── files/page.tsx            # File Manager
│   ├── github/page.tsx           # GitHub Info
│   ├── login/page.tsx            # Login
│   ├── packages/page.tsx         # Package Manager
│   ├── profile/page.tsx          # User Profile
│   ├── register/page.tsx         # Register
│   ├── restart/page.tsx          # Restart Server
│   ├── restore/page.tsx          # Restore Data
│   ├── settings/page.tsx         # Settings
│   ├── storage/page.tsx          # Storage Info
│   ├── system/page.tsx           # System Info
│   ├── terminal/page.tsx         # Web Terminal
│   ├── websites/                 # Website Manager
│   │   ├── create/page.tsx
│   │   └── page.tsx
│   ├── layout.tsx                # Root Layout
│   └── page.tsx                  # Splash Screen
├── api/                          # Backend API
│   ├── server.js                 # Express server (all routes)
│   ├── routes/                   # Route modules
│   ├── middleware/               # Auth middleware
│   ├── services/                 # System monitor
│   ├── socket/                   # Socket.IO setup
│   └── utils/                    # JWT utilities
├── components/                   # React Components
│   ├── dashboard/                # Dashboard widgets
│   │   ├── cpu-monitor.tsx
│   │   ├── ram-monitor.tsx
│   │   ├── storage-monitor.tsx
│   │   └── system-stats.tsx
│   ├── layout/                   # Layout components
│   │   └── page-layout.tsx
│   ├── navigation/               # Navigation
│   │   ├── bottom-nav.tsx
│   │   └── drawer-menu.tsx
│   └── ui/                       # UI components
│       ├── toast-container.tsx
│       └── toast.tsx
├── hooks/                        # Custom Hooks
│   ├── use-socket.ts
│   └── use-system-stats.ts
├── lib/                          # Libraries
│   ├── auth-store.ts             # Zustand auth store
│   ├── theme-provider.tsx        # Theme context
│   └── toast-store.ts            # Toast store
├── services/                     # API Services
│   ├── api.ts                    # Auth API
│   ├── file-api.ts               # File API
│   ├── package-api.ts            # Package API
│   ├── settings-api.ts           # Settings API
│   ├── terminal-api.ts           # Terminal API
│   └── website-api.ts            # Website API
├── scripts/                      # Shell Scripts
│   ├── install.sh
│   ├── start.sh
│   ├── stop.sh
│   ├── restart.sh
│   ├── backup.sh
│   ├── restore.sh
│   └── check.sh
├── prisma/                       # Database
│   └── schema.prisma
├── public/                       # Static Files
│   ├── favicon.svg
│   ├── icon-192.svg
│   └── manifest.json
├── styles/
│   └── globals.css               # Global styles + theme
├── .env.example                  # Environment template
├── .eslintrc.json                # ESLint config
├── .gitignore                    # Git ignore
├── .prettierrc                   # Prettier config
├── ecosystem.config.js           # PM2 config
├── LICENSE                       # MIT License
├── next.config.mjs               # Next.js config
├── package.json                  # Dependencies
├── postcss.config.js             # PostCSS config
├── README.md                     # You are here
├── tailwind.config.js            # TailwindCSS config
└── tsconfig.json                 # TypeScript config
```

---

## Teknologi

<div align="center">
Category	Technology	Version
Framework	Next.js	14.2
Language	TypeScript	5.3
Backend	Express.js	4.21
Database	Prisma + SQLite	5.22
Styling	TailwindCSS	3.4
Animation	Framer Motion	10.18
Icons	React Icons	5.0
State	Zustand	4.5
Auth	JWT + bcrypt	-
Security	Helmet + CORS + Rate Limit	-
</div>

---

## API Endpoints
```bash
Method	Endpoint	Description
GET	/api/health	Health check
POST	/api/v1/auth/register	Register user
POST	/api/v1/auth/login	Login user
GET	/api/v1/auth/me	Get current user
POST	/api/v1/auth/logout	Logout user
PUT	/api/v1/auth/password	Change password
GET	/api/v1/system/stats	System statistics
GET	/api/v1/websites	List websites
POST	/api/v1/websites	Create website
PUT	/api/v1/websites/:id	Update website
DELETE	/api/v1/websites/:id	Delete website
POST	/api/v1/websites/:id/start	Start website
POST	/api/v1/websites/:id/stop	Stop website
GET	/api/v1/files/list	List files
POST	/api/v1/files/mkdir	Create folder
GET	/api/v1/files/read	Read file
DELETE	/api/v1/files/delete	Delete file
GET	/api/v1/packages/installed	List packages
GET	/api/v1/packages/search	Search packages
POST	/api/v1/packages/install	Install package
POST	/api/v1/packages/remove	Remove package
POST	/api/v1/terminal/exec	Execute command
POST	/api/v1/terminal/cd	Change directory
GET	/api/v1/terminal/pwd	Current directory
GET	/api/v1/settings	Get settings
PUT	/api/v1/settings	Update settings
GET	/api/v1/databases	List databases
POST	/api/v1/databases	Create database
POST	/api/v1/backup	Create backup
GET	/api/v1/backups	List backups
POST	/api/v1/restore	Restore backup
```

---

## Keamanan
- JWT Authentication - Token-based auth dengan expiry 7 hari
- bcrypt - Password hashing dengan salt rounds 12
- Helmet - HTTP security headers
- CORS - Cross-Origin Resource Sharing config
- Rate Limiting - Maksimal 100 request per 15 menit
- Input Validation - Validasi semua input user
- Directory Traversal Protection - Cegah akses di luar direktori
- Command Injection Protection - Block perintah berbahaya di terminal

---

## Support

<div align="center">
Termux	Android	Browser
Termux (F-Droid)	Android 7.0+	Chrome Android
Termux:API	RAM 2GB+	Kiwi Browser
Termux:Services	Storage 500MB+	Firefox Android
</div>

---

## Lisensi
MIT License - Lihat LICENSE untuk detail.

---

## Credits
Dibangun dengan sepenuh hati oleh [IstofiYusuf](https://github.com/istofiyusuf/)

---

<p align="center"> <strong>Zen Server</strong> - Transform your Android into a powerful web server. </p><p align="center"> <sub>Made with ❤️ for the Termux community</sub> </p>
