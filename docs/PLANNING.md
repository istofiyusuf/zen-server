# Zen Server - Dokumen Perencanaan

## Visi
Mengubah perangkat Android menjadi server web lengkap yang dapat dikelola melalui browser.

## Misi
Membangun dashboard server web yang berjalan di Termux dengan kontrol penuh terhadap layanan server.

## Tujuan Spesifik
1. Dashboard dapat diakses melalui browser mobile
2. Mendukung Apache/Nginx, PHP, NodeJS, Python
3. Manajemen database (SQLite, MariaDB)
4. Manajemen file lengkap
5. Terminal web realtime
6. Manajemen paket Termux
7. Monitoring sistem realtime
8. Backup dan restore

## Batasan Teknis
1. Hanya berjalan di Android + Termux
2. Tidak memerlukan root
3. Port terbatas (8080 ke atas untuk non-root)
4. Memori terbatas (tergantung perangkat)
5. Penyimpanan terbatas
6. CPU ARM/ARM64
7. Tidak ada systemd, gunakan service Termux

## Teknologi yang Digunakan
### Frontend
- Next.js 16 (App Router)
- TypeScript
- TailwindCSS
- Shadcn UI
- Framer Motion
- React Icons
- Zustand (state management)
- Socket.IO Client

### Backend
- Node.js
- Express.js
- Socket.IO
- Prisma ORM
- SQLite
- JWT Authentication
- bcrypt

### Termux Integration
- child_process untuk eksekusi perintah
- Termux API (opsional)
- Termux Services

## Fitur Prioritas
### Fase 1 (MVP)
- [x] Perencanaan
- [ ] Arsitektur
- [ ] Inisialisasi proyek
- [ ] Theme system
- [ ] Authentication
- [ ] Dashboard dasar
- [ ] API dasar

### Fase 2
- [ ] Website Manager
- [ ] File Manager
- [ ] Database Manager
- [ ] Terminal Web

### Fase 3
- [ ] Package Manager
- [ ] Monitoring Sistem
- [ ] Backup/Restore
- [ ] Settings lengkap

## Metrik Keberhasilan
1. Aplikasi berjalan di Termux tanpa modifikasi
2. Semua fitur berfungsi di browser mobile
3. Waktu load < 3 detik
4. Penggunaan RAM < 200MB
5. Tidak crash saat penggunaan normal
