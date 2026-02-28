# SIP-PEDAS (Sistem Pemantauan Penugasan Perjalanan Dinas)

Aplikasi web untuk monitoring penugasan APIP agar tidak tumpang tindih, memudahkan monitoring real-time pimpinan, dan mendukung tata kelola audit yang aman.

## Fitur Implementasi
- Manajemen penugasan surat tugas (status, periode, tim, upload dokumen PDF).
- Validasi anti tumpang tindih otomatis dengan opsi override Admin.
- Dashboard monitoring (grafik bulanan, distribusi pegawai, penugasan aktif).
- Manajemen pegawai + pencarian cepat + pagination.
- Role & akses (`Admin`, `Pimpinan`, `Auditor`).
- Login JWT + password hashing bcrypt + middleware role-based.
- Export data penugasan ke Excel dan PDF.
- Audit trail aktivitas login/input/edit.
- Validasi backend (Joi), Helmet, rate limit, dan parameterized SQL query.

## Arsitektur Sistem
- Lihat detail: [`docs/architecture.md`](docs/architecture.md)
- ERD: [`docs/erd.md`](docs/erd.md)
- SQL schema: [`backend/sql/schema.sql`](backend/sql/schema.sql)

## Struktur Folder
```bash
APIP/
├── backend/
│   ├── sql/schema.sql
│   └── src/
│       ├── config/
│       ├── controllers/
│       ├── middleware/
│       ├── routes/
│       ├── services/
│       ├── utils/
│       └── server.js
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── context/
│   │   ├── layouts/
│   │   └── pages/
│   └── tailwind.config.js
└── docs/
```

## Instalasi Lokal
### 1) Backend
```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

### 2) Database PostgreSQL
```bash
createdb sip_pedas
psql -d sip_pedas -f backend/sql/schema.sql
```

### 3) Frontend
```bash
cd frontend
npm install
npm run dev
```

## Deployment
### Opsi A - VPS (Direkomendasikan)
1. Gunakan Ubuntu 22.04 LTS.
2. Install Node.js LTS + PostgreSQL 15 + Nginx.
3. Deploy backend pakai PM2 (`pm2 start src/server.js --name sip-pedas-api`).
4. Build frontend (`npm run build`) lalu serve lewat Nginx (static hosting).
5. Reverse proxy Nginx `/api` ke backend port 4000.
6. Aktifkan HTTPS dengan Let's Encrypt (`certbot`).
7. Backup PostgreSQL harian pakai `pg_dump` + cron.

### Opsi B - Shared Hosting
- Jika shared hosting mendukung Node.js app + PostgreSQL, backend dapat dijalankan via Passenger/Node app manager.
- Frontend diupload sebagai static build.
- Keterbatasan umum: tidak fleksibel untuk process manager dan observability, jadi VPS tetap lebih ideal untuk instansi.

## Rekomendasi Server Production
- **CPU**: 4 vCPU
- **RAM**: 8-16 GB
- **Storage**: 120+ GB SSD NVMe
- **OS**: Ubuntu Server LTS
- **DB**: PostgreSQL managed / self-hosted dengan replica (opsional)
- **Observability**: PM2 + Grafana/Loki + centralized log

## Akun Seed
- Username: `admin`
- Password: `Admin@123`

> Segera ganti password default setelah deployment pertama.
