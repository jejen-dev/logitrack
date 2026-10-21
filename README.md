# LogiTrack

LogiTrack adalah aplikasi web untuk mengelola operasional logistik dalam satu ruang kerja. Aplikasi ini mencakup pengiriman, pelacakan status, inventaris, gudang, pengemudi, kendaraan, pelanggan, laporan, dan akses anggota merchant.

Landing page publik tersedia di `/`. Pengunjung dapat memilih Bahasa Indonesia atau English, lalu masuk atau membuat akun melalui Google. Bahasa Indonesia menjadi pilihan awal.

## Fitur

- **Pengiriman:** buat pengiriman, pilih pelanggan dan alamat, tetapkan pengemudi serta kendaraan, catat barang, dan pantau status serta pembayaran.
- **Pelacakan:** lihat rangkaian pembaruan status pengiriman dan riwayatnya. Pelacakan menggunakan status operasional, bukan lokasi GPS langsung.
- **Inventaris:** kelola SKU, jumlah stok fisik, jumlah yang dicadangkan, stok tersedia, dan batas pemesanan ulang. Barang ditandai stok menipis ketika stok tersedia mencapai atau di bawah batas tersebut.
- **Reservasi stok:** pengiriman yang memakai barang inventaris mencadangkan stok saat dibuat. Stok dicatat terpakai ketika pengiriman dijemput; pembatalan sebelum penjemputan melepaskan reservasi.
- **Gudang:** kelola beberapa lokasi, kode gudang, dan barang inventaris di setiap gudang.
- **Sumber daya:** kelola data pelanggan, pengemudi (termasuk golongan SIM), dan kendaraan (termasuk kapasitas dalam kilogram).
- **Arsip:** pelanggan, pengemudi, kendaraan, gudang, dan barang inventaris dapat diarsipkan serta dipulihkan. Data tersebut tidak dihapus permanen melalui menu pengelolaan.
- **Laporan dan notifikasi:** tinjau ringkasan status pengiriman, laporan operasional, serta notifikasi yang dapat ditandai telah dibaca.
- **Tim merchant:** undang anggota lewat tautan yang berlaku selama 7 hari dan atur peran mereka. Data tiap merchant dipisahkan.

## Akun dan peran

Aplikasi menggunakan Google OAuth. Akun baru yang masuk tanpa undangan akan menjadi ADMIN sekaligus pemilik merchant. Akun yang menerima undangan bergabung ke merchant pengundang dan tidak membuat merchant terpisah. Akun driver dihubungkan ke data pengemudi melalui email yang sama.

| Peran | Akses utama |
| --- | --- |
| ADMIN | Semua modul, termasuk pengguna dan akses tim. |
| MANAGER | Dasbor, pengiriman, pelacakan, inventaris, gudang, pelanggan, pengemudi, kendaraan, laporan, dan pengaturan. |
| OPERATOR | Dasbor, pengiriman, pelacakan, inventaris, gudang, pelanggan, pengemudi, dan kendaraan. |
| DRIVER | Dasbor, pelacakan, serta pengiriman yang ditugaskan kepadanya; driver dapat memperbarui status pengiriman tersebut dan tidak dapat membatalkannya. |

## Teknologi

- Next.js 16 App Router, React 19, dan TypeScript
- Tailwind CSS 4
- NextAuth.js 4 dengan Google Provider
- PostgreSQL dan Prisma ORM 7 menggunakan adapter `pg`
- ID model menggunakan CUID

## Menjalankan secara lokal

Persyaratan: Node.js 20.9 atau lebih baru, npm, dan PostgreSQL.

1. Pasang dependensi:

   ```bash
   npm install
   ```

2. Buat file `.env` di root proyek:

   ```dotenv
   DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/logitrack?schema=public"
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="<secret-random>"
   GOOGLE_CLIENT_ID="<google-oauth-client-id>"
   GOOGLE_CLIENT_SECRET="<google-oauth-client-secret>"
   ```

   Buat `NEXTAUTH_SECRET` dengan `openssl rand -base64 32`. Jangan commit file `.env` atau kredensial OAuth.

3. Siapkan Google OAuth Web application. Tambahkan URL callback berikut ke **Authorized redirect URIs**:

   ```text
   http://localhost:3000/api/auth/callback/google
   ```

4. Buat database PostgreSQL bernama `logitrack`, lalu jalankan migrasi dan buat Prisma Client:

   ```bash
   npx prisma migrate dev
   npx prisma generate
   ```

5. Jalankan aplikasi:

   ```bash
   npm run dev
   ```

   Buka [http://localhost:3000](http://localhost:3000).

## Perintah pengembangan

```bash
npm run dev       # server lokal
npm run lint      # ESLint
npx tsc --noEmit  # pemeriksaan TypeScript
npm run build     # build produksi
npm run start     # jalankan build produksi
```

Skema database ada di `prisma/schema.prisma`; migrasi ada di `prisma/migrations/`. `prisma/seed.ts` menghapus data aplikasi yang ada sebelum mengisi data demo, jadi hanya gunakan pada database development yang boleh dikosongkan.
