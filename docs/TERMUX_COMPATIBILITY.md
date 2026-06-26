# Zen Server - Kompatibilitas Termux

## Struktur Direktori Termux

/data/data/com.termux/files/
|-- home/
|   |-- zen-server/          # Aplikasi kita
|-- usr/
|   |-- bin/                 # Executables
|   |-- etc/                 # Konfigurasi
|   |   |-- apache2/
|   |   |-- nginx/
|   |   |-- php/
|   |-- lib/                 # Libraries
|   |-- share/               # Shared data
|-- tmp/                     # Temporary files

## Batasan Termux
1. Tidak ada root access
   - Port 1-1024 tidak tersedia
   - Gunakan port 8080, 8443, dll.

2. Tidak ada systemd
   - Gunakan termux-services atau screen/tmux
   - Atau jalankan sebagai background process

3. Storage terbatas
   - Aplikasi harus efisien
   - Backup ke penyimpanan eksternal

4. CPU ARM
   - Beberapa package mungkin tidak tersedia
   - Gunakan package yang mendukung ARM

5. Path berbeda
   - Tidak ada /usr/bin standar
   - Semua di Termux prefix

## Package yang Didukung
Semua package berikut tersedia di Termux:

pkg install nodejs
pkg install python
pkg install php
pkg install nginx
pkg install apache2
pkg install mariadb
pkg install sqlite
pkg install openssh
pkg install git
pkg install curl
pkg install wget
pkg install cronie
pkg install termux-api
pkg install termux-services
pkg install proot
pkg install proot-distro
pkg install screen
pkg install tmux
pkg install busybox
pkg install zip
pkg install unzip
pkg install tar

## Variabel Lingkungan
PREFIX=/data/data/com.termux/files/usr
HOME=/data/data/com.termux/files/home
TMPDIR=/data/data/com.termux/files/usr/tmp

## Service Management di Termux
Karena tidak ada systemd, kita gunakan:
1. screen atau tmux untuk menjalankan proses background
2. File PID untuk tracking
3. Script start/stop/restart
