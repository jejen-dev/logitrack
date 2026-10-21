# LogiTrack — Panduan Proyek

## Tujuan

LogiTrack adalah aplikasi web internal untuk membantu bisnis distribusi atau logistik kecil mengelola pengiriman. Staf kantor mencatat shipment, menetapkan customer, driver, dan kendaraan, lalu memperbarui status sampai barang diterima. Data operasional dan riwayat status tersimpan di PostgreSQL.

Contoh penggunaan: distributor menerima pesanan toko, operator membuat shipment dari gudang ke alamat toko, staf memperbarui status saat barang dijemput dan dikirim, lalu manager memantau ringkasan pengiriman.

## Alur shipment saat ini

1. Pengguna yang berwenang masuk ke aplikasi.
2. Operator membuka **Shipments → Create Shipment**, mengisi customer, alamat asal dan tujuan, barang, dan bila tersedia memilih driver serta kendaraan berstatus tersedia.
3. Shipment dibuat dengan nomor pelacakan dan status awal `PENDING`.
4. Staf membuka shipment dari daftar untuk melihat detail.
5. Pada bagian **Status Update**, staf memilih status berikutnya. Form juga menerima lokasi dan keterangan untuk event tracking.
6. Riwayat status terlihat pada halaman detail/tracking; dashboard dan Reports merangkum jumlah shipment menurut status.

Urutan status yang diterapkan:

`PENDING → PICKED_UP → IN_TRANSIT → OUT_FOR_DELIVERY → DELIVERED`

Shipment dapat dibatalkan dari status yang belum final. `DELIVERED` dan `CANCELLED` adalah status akhir. Server memvalidasi transisi dan akses role, bukan hanya mengandalkan pilihan yang terlihat di form.

**Status dapat diperbarui oleh staf kantor atau oleh Driver yang ditugaskan ke shipment tersebut.** Driver hanya dapat melihat shipment miliknya dan memajukan status sesuai transisi yang diizinkan; Driver tidak dapat membatalkan shipment. Akun Google harus memiliki role `DRIVER`, dan emailnya harus sama dengan email pada profil Driver. Belum ada fitur pelacakan GPS langsung atau aplikasi khusus driver.

## Role dan akses

- **ADMIN**: akses operasional penuh sesuai halaman yang tersedia.
- **MANAGER**: akses pengelolaan operasional dan Reports.
- **OPERATOR**: akses shipment dan data operasional untuk pekerjaan harian.
- **DRIVER**: akses terbatas ke dashboard, shipment, dan tracking; halaman operasional lain dibatasi.

Akses halaman dan aksi server diperiksa berdasarkan role. Saat pertama kali masuk melalui Google, pengguna baru otomatis memperoleh role `OPERATOR`. Admin dapat mengubah role akun yang sudah pernah masuk melalui menu **Users & Access**; akun belum dapat diundang atau dibuat dari aplikasi, jadi pengguna harus login Google terlebih dahulu. Untuk memberi akses Driver, admin memilih role `DRIVER` di **Users & Access** dan mengisi email Google yang sama pada profil Driver. Bootstrap admin pertama tetap dilakukan melalui database. Untuk deployment internal, batasi Google sign in ke akun organisasi sebelum aplikasi dibuka ke internet, karena pendaftaran saat ini menerima akun Google apa pun.

## Bagian aplikasi

- **Dashboard**: ringkasan jumlah shipment, status, dan pengiriman terbaru.
- **Shipments**: daftar, pencarian, pembuatan, detail, dan perubahan status.
- **Tracking**: riwayat event shipment yang dicatat aplikasi.
- **Customers, Drivers, Vehicles, Warehouses**: tambah, edit, arsipkan, dan pulihkan data lewat modal; arsip tidak menghapus riwayat. **Inventory** mendukung tambah/edit, arsip/pulihkan, pencarian, filter gudang dan stok, generator SKU, serta indikator low stock. Item inventory dengan reservasi shipment tidak dapat diarsipkan.
- **Reports**: jumlah shipment menurut status.
- **Notifications**: daftar notifikasi dan tindakan menandai notifikasi sudah dibaca.
- **Settings**: informasi konfigurasi dan gambaran akses role; saat ini belum menjadi pengaturan aplikasi yang dapat diedit.

## Batas fitur yang perlu diketahui

- Tidak ada form email/password atau reset password. Pengguna baru didaftarkan otomatis saat Google sign in pertama kali.
- Pengelolaan inventory belum menyediakan penyesuaian stok masuk/keluar sebagai ledger atau audit transaksi tersendiri; jumlah on-hand masih dapat diubah lewat edit item.
- Belum ada integrasi GPS, peta, atau bukti serah terima.
- Tracking menggambarkan event yang dicatat staf, bukan posisi kendaraan real-time.
- Reports berisi hitungan status dasar, belum analitik bisnis yang lebih luas.
- README proyek masih berupa template Next.js, sehingga panduan ini menjadi ringkasan penggunaan dan konteks produk.

Karena itu, aplikasi paling tepat dipakai sebagai MVP/demo sistem operasional internal. Sebelum digunakan untuk operasi produksi, bisnis perlu melengkapi administrasi data dan akun serta memastikan alur kerja sesuai kebutuhan mereka.

## Teknologi

- Next.js 16 dengan React 19 dan TypeScript.
- NextAuth dengan Google OAuth; sesi menggunakan JWT.
- Prisma ORM 7 dengan PostgreSQL.
- Tailwind CSS untuk antarmuka.

Model utama database meliputi `User`, `Customer`, `Warehouse`, `Driver`, `Vehicle`, `Shipment`, `ShipmentItem`, `InventoryItem`, `TrackingEvent`, dan `Notification`.

## Menjalankan lokal

Pastikan Node.js/npm dan PostgreSQL tersedia, lalu:

1. Pasang dependensi:

   ```bash
   npm install
   ```

2. Atur `.env` dengan `DATABASE_URL`, `NEXTAUTH_URL`, `NEXTAUTH_SECRET`, `GOOGLE_CLIENT_ID`, dan `GOOGLE_CLIENT_SECRET`. Daftarkan redirect URI Google OAuth sebagai `http://localhost:3000/api/auth/callback/google` untuk lokal, dan URL produksi yang sesuai saat deploy. Contoh repository memakai database lokal bernama `logitrack`; sesuaikan dengan mesin sendiri.

3. Terapkan migrasi:

   ```bash
   npx prisma migrate deploy
   ```

4. Jalankan server pengembangan:

   ```bash
   npm run dev
   ```

5. Buka `http://localhost:3000`; halaman login tersedia di `/login`.

Perintah Prisma bergantung pada konfigurasi proyek di `prisma.config.ts`. Jika client Prisma belum tersedia setelah checkout atau perubahan skema, jalankan `npx prisma generate`.

## Akun demo dan seed

Seed membuat akun demo dengan password yang sama:

| Role | Email |
|---|---|
| Admin | `admin@logitrack.dev` |
| Manager | `manager@logitrack.dev` |
| Operator | `operator@logitrack.dev` |
| Driver | `driver@logitrack.dev` |

Seed membuat akun contoh dengan email demo dan hash password lama, tetapi hash tersebut tidak dipakai untuk login. Akun Google yang emailnya cocok dengan user di database akan memakai role user yang sudah tersimpan; Google user baru otomatis mendapat role `OPERATOR`. Admin dapat mengubah role lewat **Users & Access** setelah akun tersebut pernah masuk. Bootstrap role `ADMIN` pertama tetap perlu dilakukan melalui database. Pendaftaran menerima semua Google account, sehingga untuk pemakaian internal batasi ke akun organisasi sebelum aplikasi dibuka ke internet.

File seed tersedia di `prisma/seed.ts`, tetapi perintah seed belum dikonfigurasi di `prisma.config.ts` maupun `package.json`; jadi `npx prisma db seed` belum siap dipakai pada checkout ini. Setelah mengonfigurasi runner seed, seed akan menghapus data aplikasi yang ada sebelum mengisi ulang data contoh. Jangan jalankan pada database berisi data yang perlu dipertahankan. Kredensial demo tidak aman untuk lingkungan produksi.

## Catatan pengembangan

- Periksa `git status` sebelum commit dan sertakan migrasi database bersama perubahan skema.
- Migrasi database harus ikut ditinjau dan disertakan bersama perubahan skema yang memerlukannya.
- Belum ada hasil build atau test yang dicatat dalam panduan ini.
