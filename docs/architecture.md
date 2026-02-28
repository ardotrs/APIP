# Arsitektur Sistem SIP-PEDAS

## 1. Gambaran Umum
SIP-PEDAS menggunakan arsitektur 3-layer:
1. **Frontend (React + Tailwind)** untuk antarmuka pengguna responsif.
2. **Backend API (Node.js + Express)** untuk business logic, otorisasi, validasi, dan export data.
3. **Database PostgreSQL** untuk penyimpanan data transaksional, audit trail, dan histori penugasan.

## 2. Komponen Utama
- **Auth Service (JWT + bcrypt)**: login, token issuance, role claims.
- **Assignment Service**: CRUD penugasan, validasi bentrok jadwal otomatis.
- **Employee Service**: CRUD pegawai, status aktif/nonaktif, histori penugasan.
- **Dashboard Service**: agregasi statistik dan grafik monitoring pimpinan.
- **Export Service**: output data penugasan ke Excel/PDF.
- **Audit Service**: pencatatan aktivitas input/edit/login.

## 3. Alur Validasi Anti Tumpang Tindih
1. User mengirim data penugasan (tim + tanggal).
2. Backend mengecek `assignment_team_members` terhadap rentang tanggal yang overlap.
3. Jika ada konflik, API return HTTP 409.
4. Konflik hanya dapat di-override oleh role Admin dengan flag `overrideConflict=true`.

## 4. Keamanan
- Password hash menggunakan bcrypt.
- Token JWT wajib untuk endpoint privat.
- Role-based middleware untuk pembatasan akses endpoint.
- Helmet + rate limiter + validasi schema Joi.
- Query database menggunakan parameterized query (`$1, $2, ...`) untuk mitigasi SQL injection.

## 5. Skalabilitas
- Ready untuk horizontal scale backend via container / PM2 cluster.
- Tambahkan Redis untuk cache dashboard dan session blacklist jika dibutuhkan.
- Tambahkan object storage (S3 compatible) untuk dokumen PDF agar storage terpusat.
