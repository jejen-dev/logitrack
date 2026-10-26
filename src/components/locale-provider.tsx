"use client";

import { createContext, useContext, useMemo, useState } from "react";
import type { ComponentProps } from "react";

export type AppLocale = "id" | "en";

const messages: Record<AppLocale, Record<string, string>> = {
    id: {
        Overview: "Ringkasan", Operations: "Operasional", Resources: "Sumber Daya", Analytics: "Analitik", Administration: "Administrasi",
        Dashboard: "Dasbor", Shipments: "Pengiriman", Tracking: "Pelacakan", Inventory: "Inventaris", Warehouses: "Gudang", Drivers: "Pengemudi", Vehicles: "Kendaraan", Customers: "Pelanggan", Reports: "Laporan", Settings: "Pengaturan", "Users & Access": "Pengguna & Akses",
        "Logistics Platform": "Platform Logistik", "Search shipments, tracking numbers...": "Cari pengiriman atau nomor pelacakan...", "Search shipments": "Cari pengiriman", Notifications: "Notifikasi", Role: "Peran", "Account Settings": "Pengaturan Akun", Logout: "Keluar", "Open navigation menu": "Buka menu navigasi", "Close navigation menu": "Tutup menu navigasi", "unread notifications": "notifikasi belum dibaca",
        "Monitor your logistics operations from one place.": "Pantau operasional logistik Anda dari satu tempat.", "Manage and monitor all shipments.": "Kelola dan pantau semua pengiriman.", "Search shipment updates and follow each delivery timeline.": "Cari pembaruan pengiriman dan ikuti linimasa setiap pengantaran.", "Monitor stock levels across your warehouses.": "Pantau tingkat stok di seluruh gudang.", "Manage warehouse locations and inventory capacity.": "Kelola lokasi gudang dan kapasitas inventaris.", "Manage driver records, active status, and availability.": "Kelola data pengemudi, status aktif, dan ketersediaannya.", "Manage fleet vehicles and monitor their status.": "Kelola kendaraan armada dan pantau statusnya.", "Manage customer information and contact details.": "Kelola informasi pelanggan dan detail kontaknya.", "Overview of shipment performance and operational status.": "Ringkasan kinerja pengiriman dan status operasional.", "Create Shipment": "Buat Pengiriman", "Create a new shipment and assign its delivery resources.": "Buat pengiriman baru dan tetapkan sumber daya pengantarannya.", "Shipment details and tracking history.": "Detail pengiriman dan riwayat pelacakan.", "Shipment Not Found": "Pengiriman Tidak Ditemukan", "The requested shipment could not be found.": "Pengiriman yang diminta tidak ditemukan.",
        "Manage application configuration and access settings.": "Atur konfigurasi aplikasi dan pengaturan akses.", "Current application configuration.": "Konfigurasi aplikasi saat ini.", Application: "Aplikasi", Environment: "Lingkungan", Development: "Pengembangan", Version: "Versi", "Access Control": "Kontrol Akses", "Role-based access control is enabled.": "Kontrol akses berbasis peran aktif.", "Full Access": "Akses Penuh", Management: "Manajemen", Delivery: "Pengantaran",
        "Application Language": "Bahasa Aplikasi", "Choose the language used across LogiTrack.": "Pilih bahasa yang digunakan di LogiTrack.", "Bahasa Indonesia": "Bahasa Indonesia", English: "Bahasa Inggris", "Language preference saved on this device.": "Preferensi bahasa tersimpan di perangkat ini.",
        "Search tracking number or customer...": "Cari nomor pelacakan atau pelanggan...", "Tracking number, customer, location...": "Nomor pelacakan, pelanggan, atau lokasi...", "Search SKU or product...": "Cari SKU atau produk...", "Email address": "Alamat email", "Auto-generated if left blank": "Dibuat otomatis jika dikosongkan", "Origin address": "Alamat asal", "Destination address": "Alamat tujuan", "e.g. Bekasi Warehouse": "misalnya Gudang Bekasi", "Optional update description": "Deskripsi pembaruan (opsional)", "Optional": "Opsional",
        Actions: "Tindakan", "Add customer": "Tambah pelanggan", "Add driver": "Tambah pengemudi", "Add inventory item": "Tambah barang inventaris", "Add vehicle": "Tambah kendaraan", "Add warehouse": "Tambah gudang", Address: "Alamat", "All Payments": "Semua Pembayaran", "All Status": "Semua Status", "All Stock": "Semua Stok", "All Warehouses": "Semua Gudang", "All statuses": "Semua status", Assignment: "Penugasan", Available: "Tersedia", "Back to Dashboard": "Kembali ke Dasbor", "Back to Shipments": "Kembali ke Pengiriman", Cancel: "Batal", Cancelled: "Dibatalkan", Capacity: "Kapasitas", "Capacity:": "Kapasitas:", City: "Kota", Clear: "Hapus filter", "Copy link": "Salin tautan", Created: "Dibuat", Customer: "Pelanggan", Delivered: "Terkirim", "Delivery Assignment": "Penugasan Pengantaran", "Delivery Route": "Rute Pengantaran", Description: "Deskripsi", Destination: "Tujuan", "Destination:": "Tujuan:", Driver: "Pengemudi", Edit: "Ubah", Email: "Email", "Email for driver sign-in": "Email untuk login pengemudi", Expires: "Kedaluwarsa", Filter: "Filter", "In Stock": "Stok Tersedia", "In Transit": "Dalam Perjalanan", "In transit": "Dalam perjalanan", "Inventory items": "Barang inventaris", "Inventory stock": "Stok inventaris", "Invite a user": "Undang pengguna", Joined: "Bergabung", "License class": "Golongan SIM", "License number": "Nomor SIM", "License plate": "Nomor polisi", "Loading...": "Memuat...", Location: "Lokasi", "Low Stock": "Stok Menipis", Manager: "Manajer", "Manual item (not linked to inventory)": "Barang manual (tidak terhubung ke inventaris)", "Mark all as read": "Tandai semua sudah dibaca", Members: "Anggota", Name: "Nama", "New accounts are created automatically on first sign-in.": "Akun baru dibuat otomatis saat pertama kali masuk.", "New notifications will appear here.": "Notifikasi baru akan muncul di sini.", No: "Tidak", "No customers found. Add your first customer.": "Pelanggan tidak ditemukan. Tambahkan pelanggan pertama Anda.", "No drivers found. Add your first driver.": "Pengemudi tidak ditemukan. Tambahkan pengemudi pertama Anda.", "No members yet.": "Belum ada anggota.", "No notifications": "Tidak ada notifikasi", "No shipment items.": "Tidak ada barang pengiriman.", "No shipments found.": "Pengiriman tidak ditemukan.", "No tracking events.": "Tidak ada peristiwa pelacakan.", "No tracking updates match your search.": "Tidak ada pembaruan pelacakan yang cocok dengan pencarian.", "No vehicles found. Add your first vehicle.": "Kendaraan tidak ditemukan. Tambahkan kendaraan pertama Anda.", "No warehouses found. Add your first warehouse.": "Gudang tidak ditemukan. Tambahkan gudang pertama Anda.", "On hand": "Stok fisik", "On-hand quantity": "Jumlah stok fisik", "Open the valid invitation link sent to your email. An account that has been invited cannot create a separate merchant.": "Buka tautan undangan yang dikirim ke email Anda. Akun yang telah diundang tidak dapat membuat merchant terpisah.", Operator: "Operator", Origin: "Asal", "Out for Delivery": "Dalam Pengantaran", "Out for delivery": "Dalam pengantaran", "Page not found": "Halaman tidak ditemukan", Paid: "Lunas", Payment: "Pembayaran", "Payment Status": "Status Pembayaran", Pending: "Menunggu", "Pending invitations": "Undangan tertunda", Phone: "Telepon", "Phone number": "Nomor telepon", "Picked Up": "Sudah Dijemput", "Picked up": "Sudah dijemput", "Postal code": "Kode pos", Product: "Produk", "Product name": "Nama produk", Quantity: "Jumlah", "Quantity exceeds available stock.": "Jumlah melebihi stok yang tersedia.", "Recent Shipments": "Pengiriman Terbaru", Refunded: "Dikembalikan", "Reorder point": "Batas pemesanan ulang", Reserved: "Dipesan", Route: "Rute", "Search tracking": "Cari pelacakan", "Select a license class": "Pilih golongan SIM", "Select a vehicle type": "Pilih jenis kendaraan", "Select a warehouse": "Pilih gudang", "Select customer": "Pilih pelanggan", "Shipment Information": "Informasi Pengiriman", "Shipment Item": "Barang Pengiriman", "Shipment Items": "Barang Pengiriman", "Shipment Status": "Status Pengiriman", "Shipment Summary": "Ringkasan Pengiriman", "Showing": "Menampilkan", "Sign in or create your account with Google": "Masuk atau buat akun dengan Google", "Sign in with Google": "Masuk dengan Google", "Signed in as": "Masuk sebagai", "Something went wrong": "Terjadi kesalahan", Status: "Status", "Stock source": "Sumber stok", "Stock status": "Status stok", "Street address": "Alamat jalan", "The page you are looking for does not exist.": "Halaman yang Anda cari tidak ditemukan.", "This shipment will reserve stock from this warehouse.": "Pengiriman ini akan memesan stok dari gudang ini.", "Total Shipments": "Total Pengiriman", "Tracking History": "Riwayat Pelacakan", "Tracking Number": "Nomor Pelacakan", "Try again": "Coba lagi", Unassigned: "Belum Ditugaskan", "Unknown legacy type; select a new type": "Jenis lama tidak dikenal; pilih jenis baru", Unpaid: "Belum Dibayar", "Update Status": "Perbarui Status", User: "Pengguna", Vehicle: "Kendaraan", "Vehicle type": "Jenis kendaraan", Warehouse: "Gudang", "Warehouse code": "Kode gudang", "Warehouse name": "Nama gudang", Weight: "Berat", "Weight (kg)": "Berat (kg)",
        "Archived customers": "Pelanggan Diarsipkan", "Archived drivers": "Pengemudi Diarsipkan", "Archived inventory items": "Barang Inventaris Diarsipkan", "Archived vehicles": "Kendaraan Diarsipkan", "Archived warehouses": "Gudang Diarsipkan", ARCHIVED: "DIARSIPKAN", "Invite teammates with a link, then manage their role here. Users appear in the list after they sign in with the invited Google account.": "Undang anggota melalui tautan, lalu atur perannya di sini. Pengguna akan muncul setelah masuk dengan akun Google yang diundang.", "The invite link expires after 7 days and only works for the invited email.": "Tautan undangan kedaluwarsa dalam 7 hari dan hanya berlaku untuk email yang diundang.", "Send this link to the invited email:": "Kirim tautan ini ke email yang diundang:", "Save role": "Simpan peran", "No users have signed in yet.": "Belum ada pengguna yang masuk.", "We could not load this page. Please try again.": "Halaman ini gagal dimuat. Silakan coba lagi.",
        "(optional)": "(opsional)", ". Accept the invitation to join this merchant. This Google account cannot create a separate merchant.": ". Terima undangan untuk bergabung ke merchant ini. Akun Google ini tidak dapat membuat merchant terpisah.", "available now.": "tersedia saat ini.", "inventory item": "barang inventaris", "inventory items found.": "barang inventaris ditemukan.", "tracking update": "pembaruan pelacakan", "Merchant invitation required": "Undangan Merchant Diperlukan", "Join a merchant team": "Gabung ke Tim Merchant", "Maximum cargo capacity in kilograms (kg).": "Kapasitas muatan maksimum dalam kilogram (kg).", "Marks the item as low stock when available stock reaches or drops below this number.": "Menandai stok menipis saat stok tersedia mencapai atau kurang dari angka ini.", "Leave blank to generate a code from the warehouse name.": "Kosongkan untuk membuat kode otomatis dari nama gudang.", "Leave blank to generate an SKU from the product name.": "Kosongkan untuk membuat SKU otomatis dari nama produk.", "Archived": "Diarsipkan", "active ·": "aktif ·", "archived": "diarsipkan", "available ·": "tersedia ·",
        ADMIN: "ADMIN", MANAGER: "MANAJER", OPERATOR: "OPERATOR", DRIVER: "PENGEMUDI", PENDING: "MENUNGGU", PICKED_UP: "DIJEMPUT", IN_TRANSIT: "DALAM PERJALANAN", OUT_FOR_DELIVERY: "DALAM PENGANTARAN", DELIVERED: "TERKIRIM", CANCELLED: "DIBATALKAN", UNPAID: "BELUM DIBAYAR", PAID: "LUNAS", REFUNDED: "DIKEMBALIKAN", AVAILABLE: "TERSEDIA", ASSIGNED: "DITUGASKAN", ON_DELIVERY: "SEDANG MENGANTAR", OFF_DUTY: "TIDAK BERTUGAS", RESERVED: "DIPESAN", IN_USE: "DIGUNAKAN", MAINTENANCE: "PEMELIHARAAN", LOW_STOCK: "STOK MENIPIS", IN_STOCK: "STOK TERSEDIA",
        "All shipments": "Semua pengiriman", "Waiting to be processed": "Menunggu untuk diproses", "Currently in transit": "Sedang dalam perjalanan", "Successfully delivered": "Berhasil diantarkan", "Create invite link": "Buat tautan undangan", "Creating…": "Membuat…", "Saving…": "Menyimpan…", "Joining…": "Bergabung…", "Accept invitation": "Terima undangan", "No active shipments": "Tidak ada pengiriman aktif", "Active shipments": "Pengiriman aktif", "Edit customer": "Ubah pelanggan", "Edit driver": "Ubah pengemudi", "Edit vehicle": "Ubah kendaraan", "Edit warehouse": "Ubah gudang", "Edit inventory item": "Ubah barang inventaris", "Archive customer": "Arsipkan pelanggan", "Archive driver": "Arsipkan pengemudi", "Archive vehicle": "Arsipkan kendaraan", "Archive warehouse": "Arsipkan gudang", "Archive inventory item": "Arsipkan barang inventaris", "Restore customer": "Pulihkan pelanggan", "Restore driver": "Pulihkan pengemudi", "Restore vehicle": "Pulihkan kendaraan", "Restore warehouse": "Pulihkan gudang", "Restore inventory item": "Pulihkan barang inventaris",
        "Archive": "Arsipkan", "Restore": "Pulihkan", "Delete": "Hapus", "Save": "Simpan", "Create": "Buat", "Update": "Perbarui", "Add": "Tambah", "Search": "Cari", "All": "Semua", "Shipment": "Pengiriman",
    },
    en: {},
};

const idExtraMessages: Record<string, string> = {
    'Close dialog': 'Tutup dialog',
    'Breadcrumb': 'Navigasi',
    'Primary navigation': 'Navigasi utama',
    'Menu': 'Menu',
    'Loading': 'Memuat',
    "You're all caught up.": 'Semua notifikasi sudah dibaca.',
    'No address provided': 'Alamat belum diisi',
    'Release shipment reservations before archiving.': 'Lepaskan reservasi pengiriman sebelum mengarsipkan.',
    'Expires ': 'Kedaluwarsa ',
    'Continue with Google': 'Lanjutkan dengan Google',
    'Connecting to Google…': 'Menghubungkan ke Google…',
    'Failed to create shipment. Please try again.': 'Gagal membuat pengiriman. Silakan coba lagi.',
    'Select a customer': 'Pilih pelanggan',
    'Select a driver': 'Pilih pengemudi',
    'Select a vehicle': 'Pilih kendaraan',
    'Select payment status': 'Pilih status pembayaran',
    'Payment status': 'Status pembayaran',
    'Capacity: ': 'Kapasitas: ',
    ' kg': ' kg',
    'Shipment updated to ': 'Status pengiriman diperbarui menjadi ',
    'Active': 'Aktif',
    'active · ': 'aktif · ',
    ' archived': ' diarsipkan',
    ' (Archived)': ' (Diarsipkan)',
    'Stock Status': 'Status Stok',
    'Showing ': 'Menampilkan ',
    'active ': 'aktif ',
    'archived ': 'diarsipkan ',
    's': 's',
    'Notifications': 'Notifikasi',
    'Mark all as read': 'Tandai semua sudah dibaca',
    'New notifications will appear here.': 'Notifikasi baru akan muncul di sini.',
    'No notifications': 'Tidak ada notifikasi',
    'Shipment status updated': 'Status pengiriman diperbarui',
    'Role': 'Peran',
    'Users & Access': 'Pengguna & Akses',
    'Name': 'Nama',
    'Email address': 'Alamat email',
    'Archive': 'Arsipkan',
    'Restore': 'Pulihkan',
    'Edit': 'Ubah',
    'Cancel': 'Batal',
    'Save': 'Simpan',
    'Create': 'Buat',
    'Add': 'Tambah',
    'Vehicles': 'Kendaraan',
    'Reports': 'Laporan',
    'Search SKU or product...': 'Cari SKU atau produk...',
    'Search tracking number or customer...': 'Cari nomor pelacakan atau pelanggan...',
    'Origin address': 'Alamat asal',
    'Destination address': 'Alamat tujuan',
    'Product name': 'Nama produk',
    'Optional': 'Opsional',
    'Optional update description': 'Deskripsi pembaruan (opsional)',
    'e.g. Bekasi Warehouse': 'misalnya Gudang Bekasi',
    'Close navigation menu': 'Tutup menu navigasi',
    'New shipment created': 'Pengiriman baru dibuat',
};

const idActionMessages: Record<string, string> = {
    "Google sign-in failed. Please try again.": "Login Google gagal. Silakan coba lagi.",
    "Failed to save inventory item.": "Gagal menyimpan barang inventaris.", "Failed to update inventory item status.": "Gagal memperbarui status barang inventaris.", "Failed to save vehicle.": "Gagal menyimpan kendaraan.", "Failed to update vehicle status.": "Gagal memperbarui status kendaraan.", "Failed to save driver.": "Gagal menyimpan pengemudi.", "Failed to update driver status.": "Gagal memperbarui status pengemudi.", "Failed to save warehouse.": "Gagal menyimpan gudang.", "Failed to update warehouse status.": "Gagal memperbarui status gudang.", "Failed to save customer.": "Gagal menyimpan pelanggan.", "Failed to update customer status.": "Gagal memperbarui status pelanggan.",
    "Unauthorized": "Tidak memiliki akses.", "Forbidden": "Akses ditolak.", "Merchant membership required.": "Keanggotaan merchant diperlukan.", "Invalid email format.": "Format email tidak valid.", "Description must be 500 characters or fewer.": "Deskripsi maksimal 500 karakter.", "Location must be 200 characters or fewer.": "Lokasi maksimal 200 karakter.", "Selected warehouse was not found.": "Gudang yang dipilih tidak ditemukan.", "Vehicle information exceeds the allowed length.": "Informasi kendaraan melebihi batas karakter.", "Warehouse information exceeds the allowed length.": "Informasi gudang melebihi batas karakter.", "Invalid customer data.": "Data pelanggan tidak valid.", "Invalid customer status.": "Status pelanggan tidak valid.", "Customer ID is required.": "ID pelanggan wajib diisi.", "Customer name is required.": "Nama pelanggan wajib diisi.", "Customer name is too long.": "Nama pelanggan terlalu panjang.", "Customer not found.": "Pelanggan tidak ditemukan.", "Customer is inactive.": "Pelanggan tidak aktif.",
    "Invalid driver data.": "Data pengemudi tidak valid.", "Invalid driver status.": "Status pengemudi tidak valid.", "Driver ID is required.": "ID pengemudi wajib diisi.", "Driver not found.": "Pengemudi tidak ditemukan.", "Name, email, phone number, license number, and license class are required.": "Nama, email, nomor telepon, nomor SIM, dan golongan SIM wajib diisi.", "Enter a valid email and keep driver information within the allowed length.": "Masukkan email yang valid dan pastikan data pengemudi tidak melebihi batas karakter.", "A driver with this email or license number already exists.": "Pengemudi dengan email atau nomor SIM ini sudah terdaftar.", "The driver is assigned to an active shipment.": "Pengemudi masih ditugaskan pada pengiriman aktif.",
    "Invalid vehicle data.": "Data kendaraan tidak valid.", "Invalid vehicle status.": "Status kendaraan tidak valid.", "Vehicle ID is required.": "ID kendaraan wajib diisi.", "Vehicle not found.": "Kendaraan tidak ditemukan.", "Capacity must be a number greater than zero.": "Kapasitas harus berupa angka lebih dari nol.", "Select a supported vehicle type.": "Pilih jenis kendaraan yang tersedia.", "This license plate is already registered.": "Nomor polisi ini sudah terdaftar.", "The vehicle is assigned to an active shipment.": "Kendaraan masih ditugaskan pada pengiriman aktif.",
    "Invalid warehouse data.": "Data gudang tidak valid.", "Invalid warehouse status.": "Status gudang tidak valid.", "Warehouse ID is required.": "ID gudang wajib diisi.", "Warehouse name is required.": "Nama gudang wajib diisi.", "This warehouse code is already in use.": "Kode gudang ini sudah digunakan.", "Could not generate a warehouse code. Enter one manually.": "Kode gudang gagal dibuat. Silakan isi secara manual.", "Could not generate a unique warehouse code. Please try again.": "Kode gudang unik gagal dibuat. Silakan coba lagi.",
    "Invalid inventory item data.": "Data barang inventaris tidak valid.", "Invalid inventory item status.": "Status barang inventaris tidak valid.", "Inventory item ID is required.": "ID barang inventaris wajib diisi.", "Product name and warehouse are required.": "Nama produk dan gudang wajib diisi.", "Inventory item not found.": "Barang inventaris tidak ditemukan.", "Inventory item was not found.": "Barang inventaris tidak ditemukan.", "Inventory item information exceeds the allowed length.": "Informasi barang inventaris melebihi batas karakter.", "This SKU is already in use.": "SKU ini sudah digunakan.", "Could not generate an SKU. Enter one manually.": "SKU gagal dibuat. Silakan isi secara manual.", "Could not generate a unique SKU. Please try again.": "SKU unik gagal dibuat. Silakan coba lagi.", "Choose an active warehouse for this inventory item.": "Pilih gudang yang aktif untuk barang inventaris ini.", "Quantity and reorder point cannot be negative.": "Jumlah dan batas pemesanan ulang tidak boleh negatif.", "On-hand quantity cannot be lower than the quantity reserved for shipments.": "Stok fisik tidak boleh kurang dari jumlah yang dipesan untuk pengiriman.", "Release this item's shipment reservations before archiving it.": "Lepaskan reservasi pengiriman barang ini sebelum mengarsipkannya.",
    "Invalid shipment data.": "Data pengiriman tidak valid.", "Invalid shipment status.": "Status pengiriman tidak valid.", "Shipment ID is required.": "ID pengiriman wajib diisi.", "Shipment not found.": "Pengiriman tidak ditemukan.", "Customer, origin, and destination are required.": "Pelanggan, alamat asal, dan tujuan wajib diisi.", "Product name is required for manual shipment items.": "Nama produk wajib diisi untuk barang pengiriman manual.", "Quantity must be a positive integer.": "Jumlah harus berupa bilangan bulat positif.", "Weight must be a valid non-negative number.": "Berat harus berupa angka nol atau lebih.", "Invalid payment status.": "Status pembayaran tidak valid.", "Shipment information exceeds the allowed length.": "Informasi pengiriman melebihi batas karakter.", "Driver is no longer available.": "Pengemudi tidak lagi tersedia.", "Vehicle is no longer available.": "Kendaraan tidak lagi tersedia.", "The inventory item is archived.": "Barang inventaris telah diarsipkan.", "The item's warehouse is inactive.": "Gudang barang ini tidak aktif.", "There is not enough available stock for this shipment.": "Stok yang tersedia tidak cukup untuk pengiriman ini.", "Shipment reservation could not be released. Contact an administrator.": "Reservasi pengiriman gagal dilepas. Hubungi administrator.", "Drivers cannot cancel shipments.": "Pengemudi tidak dapat membatalkan pengiriman.", "You can only update shipments assigned to you.": "Anda hanya dapat memperbarui pengiriman yang ditugaskan kepada Anda.",
    "Enter a valid email address.": "Masukkan alamat email yang valid.", "Invalid invitation link.": "Tautan undangan tidak valid.", "Invitation is invalid, expired, or addressed to another email.": "Undangan tidak valid, sudah kedaluwarsa, atau ditujukan ke email lain.", "This invitation has already been used.": "Undangan ini sudah digunakan.", "This account is already a member of a merchant.": "Akun ini sudah menjadi anggota merchant.", "This email already belongs to a merchant.": "Email ini sudah terdaftar di merchant.", "This email already has an active invitation to another merchant.": "Email ini sudah memiliki undangan aktif ke merchant lain.", "Only the merchant owner or an administrator can invite team members.": "Hanya pemilik merchant atau administrator yang dapat mengundang anggota tim.", "Sign in with the invited Google account first.": "Masuk terlebih dahulu dengan akun Google yang diundang.", "Invalid team role.": "Peran tim tidak valid.", "Invalid user or role.": "Pengguna atau peran tidak valid.", "User not found in this merchant.": "Pengguna tidak ditemukan di merchant ini.", "The merchant owner must keep the ADMIN role.": "Pemilik merchant harus tetap memiliki peran ADMIN.", "You cannot change your own role.": "Anda tidak dapat mengubah peran sendiri.", "The last administrator cannot be demoted.": "Administrator terakhir tidak dapat diturunkan perannya.", "This user's role changed in another request. Refresh and try again.": "Peran pengguna ini berubah pada permintaan lain. Muat ulang lalu coba lagi.",
    "The assigned driver is no longer available.": "Pengemudi yang ditugaskan tidak lagi tersedia.", "The assigned vehicle is no longer available.": "Kendaraan yang ditugaskan tidak lagi tersedia.", "The assigned driver reservation could not be released.": "Reservasi pengemudi yang ditugaskan gagal dilepas.", "The assigned vehicle reservation could not be released.": "Reservasi kendaraan yang ditugaskan gagal dilepas.", "Reserved inventory is unavailable. Contact an administrator.": "Stok yang dipesan tidak tersedia. Hubungi administrator.", "Inventory item status changed in another request. Refresh and try again.": "Status barang inventaris berubah pada permintaan lain. Muat ulang lalu coba lagi.", "Shipment status changed in another request. Refresh and try again.": "Status pengiriman berubah pada permintaan lain. Muat ulang lalu coba lagi.",
};

interface LocaleContextValue {
    locale: AppLocale;
    setLocale: (locale: AppLocale) => void;
    t: (text: string) => string;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({ children, initialLocale }: { children: React.ReactNode; initialLocale: AppLocale }) {
    const [locale, setLocaleState] = useState<AppLocale>(initialLocale);
    const value = useMemo<LocaleContextValue>(() => ({
        locale,
        setLocale(nextLocale) {
            setLocaleState(nextLocale);
            document.cookie = `logitrack_locale=${nextLocale}; Path=/; Max-Age=31536000; SameSite=Lax`;
            document.documentElement.lang = nextLocale;
        },
        t(text) {
            if (locale !== "id") return text;
            const leading = text.match(/^\s*/)?.[0] ?? "";
            const trailing = text.match(/\s*$/)?.[0] ?? "";
            const content = text.trim();
            let translated: string;
            if (content.startsWith("Signed in as ")) {
                translated = content.replace("Signed in as ", "Masuk sebagai ");
            } else if (content === "Sign in using the Google account invited by your merchant owner.") {
                translated = "Masuk menggunakan akun Google yang diundang oleh pemilik merchant Anda.";
            } else if (content.startsWith("Manage members and access for ")) {
                translated = `Kelola anggota dan akses untuk ${content.slice("Manage members and access for ".length).replace(/\.$/, "")}.`;
            } else if (content.startsWith("Cannot change shipment from ")) {
                const match = content.match(/^Cannot change shipment from (.+) to (.+)\.$/);
                translated = match
                    ? `Status pengiriman tidak dapat diubah dari ${messages.id[match[1].toUpperCase().replaceAll(" ", "_")] ?? match[1]} menjadi ${messages.id[match[2].toUpperCase().replaceAll(" ", "_")] ?? match[2]}.`
                    : content;
            } else if (content.startsWith("Shipment weight exceeds the vehicle capacity of ")) {
                translated = content.replace("Shipment weight exceeds the vehicle capacity of ", "Berat pengiriman melebihi kapasitas kendaraan sebesar ");
            } else if (content.endsWith(" is invalid.")) {
                const label = content.slice(0, -" is invalid.".length);
                translated = `${messages.id[label] ?? label} tidak valid.`;
            } else if (content.endsWith(" is too long.")) {
                const label = content.slice(0, -" is too long.".length);
                translated = `${messages.id[label] ?? label} terlalu panjang.`;
            } else if (/^\d+ unread notifications?$/.test(content)) {
                const count = content.match(/^\d+/)?.[0] ?? "";
                translated = `${count} notifikasi belum dibaca`;
            } else if (content.startsWith("Shipment updated to ") && content.endsWith(".")) {
                const status = content.slice("Shipment updated to ".length, -1);
                translated = `Status pengiriman diperbarui menjadi ${messages.id[status.toUpperCase().replaceAll(" ", "_")] ?? status}.`;
            } else if (content.startsWith("Shipment ") && content.includes(" is now ")) {
                const match = content.match(/^Shipment (.+) is now (.+)\.$/);
                translated = match
                    ? `Pengiriman ${match[1]} sekarang berstatus ${messages.id[match[2].toUpperCase().replaceAll(" ", "_")] ?? match[2]}.`
                    : content;
            } else if (content.startsWith("Shipment ") && content.endsWith(" has been created and is pending.")) {
                translated = content.replace(/^Shipment (.+) has been created and is pending\.$/, "Pengiriman $1 telah dibuat dan menunggu diproses.");
            } else if (content.startsWith("Cannot change shipment from ")) {
                const match = content.match(/^Cannot change shipment from (.+) to (.+)\.$/);
                translated = match
                    ? `Status pengiriman tidak dapat diubah dari ${messages.id[match[1].toUpperCase().replaceAll(" ", "_")] ?? match[1]} menjadi ${messages.id[match[2].toUpperCase().replaceAll(" ", "_")] ?? match[2]}.`
                    : content;
            } else if (content === "You're all caught up.") {
                translated = "Semua notifikasi sudah dibaca.";
            } else {
                translated = messages.id[content] ?? idExtraMessages[content] ?? idActionMessages[content] ?? messages.id[content.toUpperCase().replaceAll(" ", "_")] ?? content;
            }
            return `${leading}${translated}${trailing}`;
        },
    }), [locale]);
    return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
    const value = useContext(LocaleContext);
    if (!value) throw new Error("useLocale must be used within LocaleProvider");
    return value;
}

export function LocalizedText({ text }: { text: string }) {
    const { t } = useLocale();
    return <>{t(text)}</>;
}

export function LocalizedInput(props: ComponentProps<"input">) {
    const { t } = useLocale();
    return <input {...props} placeholder={props.placeholder ? t(props.placeholder) : undefined} />;
}

export function LocalizedTextarea(props: ComponentProps<"textarea">) {
    const { t } = useLocale();
    return <textarea {...props} placeholder={props.placeholder ? t(props.placeholder) : undefined} />;
}
