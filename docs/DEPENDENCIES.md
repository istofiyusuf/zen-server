# Zen Server - Daftar Dependensi

## Dependensi Utama (Node.js)

### Frontend
{
  "next": "16.0.0",
  "react": "19.0.0",
  "react-dom": "19.0.0",
  "typescript": "5.5.0",
  "tailwindcss": "4.0.0",
  "framer-motion": "11.0.0",
  "react-icons": "5.0.0",
  "zustand": "5.0.0",
  "socket.io-client": "4.8.0",
  "next-themes": "0.4.0",
  "lucide-react": "0.400.0"
}

### Backend
{
  "express": "5.0.0",
  "socket.io": "4.8.0",
  "prisma": "6.0.0",
  "@prisma/client": "6.0.0",
  "jsonwebtoken": "9.0.0",
  "bcrypt": "5.1.0",
  "helmet": "8.0.0",
  "cors": "2.8.0",
  "express-rate-limit": "7.0.0",
  "zod": "3.23.0",
  "ws": "8.18.0"
}

### Dev Dependencies
{
  "@types/node": "22.0.0",
  "@types/express": "5.0.0",
  "nodemon": "3.1.0",
  "ts-node": "10.9.0",
  "eslint": "9.0.0",
  "prettier": "3.3.0"
}

## Dependensi Sistem Termux
Semua harus diinstall melalui pkg:
- nodejs (untuk runtime)
- python (untuk script tambahan)
- php (untuk website hosting)
- nginx atau apache2 (web server)
- mariadb atau sqlite (database)
- git (version control)
- curl, wget (download)
- zip, unzip, tar (kompresi)
- openssh (SSH server)
- screen atau tmux (background process)
- termux-api (fitur Android)

## Catatan Kompatibilitas
- systeminformation mungkin terbatas di Termux
- Gunakan fallback ke pembacaan /proc
- Socket.IO harus menggunakan polling transport jika WebSocket gagal
