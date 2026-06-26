# Zen Server - Skema Database (SQLite + Prisma)

## Schema

model User {
  id        String   @id @default(uuid())
  username  String   @unique
  password  String
  email     String   @unique
  role      String   @default("admin")
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  settings  Settings?
}

model Settings {
  id            String   @id @default(uuid())
  userId        String   @unique
  user          User     @relation(fields: [userId], references: [id])
  theme         String   @default("dark")
  language      String   @default("id")
  port          Int      @default(3000)
  autoStart     Boolean  @default(false)
  autoBackup    Boolean  @default(false)
  notifications Boolean  @default(true)
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}

model Website {
  id          String   @id @default(uuid())
  name        String
  domain      String?
  port        Int
  type        String   @default("static")
  phpVersion  String?
  nodeVersion String?
  status      String   @default("stopped")
  path        String
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  logs        Log[]
}

model Database {
  id        String   @id @default(uuid())
  name      String
  type      String
  path      String?
  size      Int?
  status    String   @default("stopped")
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Package {
  id          String   @id @default(uuid())
  name        String   @unique
  version     String?
  status      String   @default("installed")
  installedAt DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model Log {
  id        String   @id @default(uuid())
  type      String
  message   String
  level     String   @default("info")
  source    String?
  websiteId String?
  website   Website? @relation(fields: [websiteId], references: [id])
  createdAt DateTime @default(now())
}

model Backup {
  id        String   @id @default(uuid())
  name      String
  type      String
  path      String
  size      Int?
  status    String   @default("completed")
  createdAt DateTime @default(now())
}

## Indeks yang Direkomendasikan
CREATE INDEX idx_websites_status ON Website(status);
CREATE INDEX idx_logs_created_at ON Log(created_at);
CREATE INDEX idx_logs_type ON Log(type);
CREATE INDEX idx_backups_created_at ON Backup(created_at);

## Relasi
- User 1:1 Settings
- User 1:N Website (opsional, bisa admin saja)
- Website 1:N Log
- Log N:1 Website (optional)

## Catatan
- SQLite tidak mendukung enum, gunakan String
- UUID digunakan sebagai primary key
- Timestamps untuk audit
- Semua relasi optional untuk fleksibilitas
