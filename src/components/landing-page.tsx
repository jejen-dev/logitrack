"use client";

import Link from "next/link";
import {
    Archive,
    ArrowRight,
    Bell,
    Boxes,
    ChevronDown,
    CircleCheck,
    Languages,
    LayoutDashboard,
    MapPin,
    PackageCheck,
    Route,
    ShieldCheck,
    Smartphone,
    Sparkles,
    Truck,
    TriangleAlert,
    UserCog,
    UsersRound,
    Warehouse,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { useLocale } from "@/components/locale-provider";

type Feature = {
    title: string;
    description: string;
    icon: LucideIcon;
};

function GoogleMark({ className }: { className: string }) {
    return (
        <svg aria-hidden="true" viewBox="0 0 48 48" className={className}>
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5Z" />
            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.25 5.48-4.73 7.18l7.65 5.93c4.46-4.12 7.12-10.18 7.12-17.58Z" />
            <path fill="#FBBC05" d="M10.53 28.59a14.4 14.4 0 0 1 0-9.18l-7.98-6.19a23.9 23.9 0 0 0 0 21.56l7.98-6.19Z" />
            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.9-5.87l-7.65-5.93c-2.13 1.43-4.86 2.28-8.25 2.28-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48Z" />
        </svg>
    );
}

function SignInLink({
    children,
    className,
}: {
    children: React.ReactNode;
    className: string;
}) {
    return (
        <Link href="/login" className={className}>
            {children}
        </Link>
    );
}

const primaryCta =
    "inline-flex h-12 items-center justify-center gap-3 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 px-6 text-sm font-semibold text-white shadow-lg shadow-blue-600/30 ring-1 ring-inset ring-white/20 transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-blue-600/35 motion-reduce:hover:translate-y-0";

export function LandingPage() {
    const { locale, setLocale } = useLocale();
    const id = locale === "id";

    const copy = id
        ? {
              tagline: "Platform Logistik",
              features: "Fitur",
              workflow: "Alur Kerja",
              roles: "Peran",
              faq: "FAQ",
              signIn: "Masuk",
              eyebrow: "Satu ruang kerja untuk tim logistik",
              heroLead: "Kirim lebih rapi,",
              heroEmphasis: "pantau tanpa ribet.",
              heroDescription:
                  "LogiTrack menyatukan pengiriman, pelacakan, inventaris, gudang, dan armada dalam satu dasbor. Tim gudang, admin, dan pengemudi bekerja dari data yang sama.",
              startWithGoogle: "Mulai dengan Google",
              seeHow: "Lihat cara kerjanya",
              signInNote: "Akun dibuat otomatis saat pertama kali masuk dengan Google.",
              trust: ["Login Google tanpa kata sandi", "Akses berbasis peran", "Bisa dipasang di HP"],
              preview: "Contoh tampilan",
              illustrative: "Data ilustrasi",
              totalShipments: "Total pengiriman",
              inTransit: "Dalam perjalanan",
              delivered: "Terkirim",
              waiting: "Menunggu",
              shipmentStatus: "Status pengiriman",
              liveCard: "Dalam pengantaran",
              liveCardRoute: "Gudang Bekasi → Jakarta Selatan",
              lowStock: "Stok menipis",
              lowStockItem: "Sarung tangan safety · sisa 8",
              highlights: [
                  { value: "6", label: "Modul operasional dalam satu dasbor" },
                  { value: "4", label: "Peran akses: admin hingga pengemudi" },
                  { value: "2", label: "Bahasa: Indonesia & English" },
                  { value: "1", label: "Klik masuk dengan akun Google" },
              ],
              problemEyebrow: "Masalah yang kami selesaikan",
              problemHeading: "Berhenti mengejar status lewat chat dan spreadsheet",
              problems: [
                  "Status pengiriman tersebar di grup chat",
                  "Stok gudang baru ketahuan habis saat dibutuhkan",
                  "Penugasan pengemudi dan kendaraan dicatat manual",
              ],
              solutions: [
                  "Riwayat status setiap pengiriman tercatat rapi",
                  "Peringatan stok menipis berdasarkan batas pemesanan ulang",
                  "Pengemudi dan kendaraan tersedia dipilih langsung saat membuat pengiriman",
              ],
              before: "Sebelum",
              after: "Dengan LogiTrack",
              featureEyebrow: "Fitur lengkap",
              featureHeading: "Semua yang dibutuhkan operasional harian",
              featureIntro:
                  "Dari data pelanggan sampai laporan kinerja, setiap modul saling terhubung sehingga tidak ada input ganda.",
              shipmentTitle: "Pengiriman & penugasan",
              shipmentDescription:
                  "Buat pengiriman dalam satu form: pelanggan, alamat, barang dari inventaris, pengemudi, dan kendaraan. Stok otomatis dipesan.",
              trackingTitle: "Pelacakan status",
              trackingDescription:
                  "Ikuti perjalanan dari menunggu, dijemput, dalam perjalanan, hingga terkirim lengkap dengan lokasi dan catatan.",
              inventoryTitle: "Inventaris & stok",
              inventoryDescription:
                  "Pantau stok fisik, stok dipesan, dan stok tersedia. Barang yang menipis langsung ditandai.",
              warehouseTitle: "Multi gudang",
              warehouseDescription:
                  "Kelola banyak lokasi gudang beserta kapasitas dan inventaris di masing-masing lokasi.",
              fleetTitle: "Pengemudi & kendaraan",
              fleetDescription:
                  "Simpan data SIM, kapasitas muatan, dan status ketersediaan armada.",
              teamTitle: "Pelanggan & tim",
              teamDescription:
                  "Simpan kontak pelanggan dan undang anggota tim lewat tautan undangan yang aman.",
              rolesEyebrow: "Akses sesuai peran",
              rolesHeading: "Setiap orang melihat yang mereka butuhkan",
              rolesIntro:
                  "Menu dan halaman menyesuaikan peran, jadi tim tetap fokus dan data sensitif tetap terjaga.",
              roleCards: [
                  { role: "Admin", description: "Akses penuh, termasuk mengundang pengguna dan mengatur peran." },
                  { role: "Manajer", description: "Kelola operasional, lihat laporan kinerja, dan atur pengaturan." },
                  { role: "Operator", description: "Kelola pengiriman, inventaris, gudang, armada, dan pelanggan." },
                  { role: "Pengemudi", description: "Lihat tugas pengiriman dan perbarui status langsung dari HP." },
              ],
              workflowEyebrow: "Cara kerja",
              workflowHeading: "Mulai dalam tiga langkah",
              steps: [
                  { title: "Masuk & undang tim", description: "Masuk dengan Google, lalu undang anggota tim sesuai perannya." },
                  { title: "Siapkan data", description: "Tambahkan pelanggan, gudang, inventaris, pengemudi, dan kendaraan." },
                  { title: "Kirim & pantau", description: "Buat pengiriman, tugaskan armada, dan ikuti statusnya sampai terkirim." },
              ],
              faqEyebrow: "Pertanyaan umum",
              faqHeading: "Masih ada pertanyaan?",
              faqs: [
                  { q: "Bagaimana cara masuk?", a: "Cukup gunakan akun Google. Akun LogiTrack dibuat otomatis saat pertama kali masuk, tanpa perlu membuat kata sandi baru." },
                  { q: "Bagaimana mengajak anggota tim?", a: "Admin membuat tautan undangan untuk email tertentu. Tautan berlaku 7 hari dan hanya bisa dipakai oleh email yang diundang." },
                  { q: "Apakah pengemudi bisa memakai dari HP?", a: "Bisa. Tampilan LogiTrack dirancang untuk HP dan tablet, dan dapat dipasang ke layar utama seperti aplikasi." },
                  { q: "Bagaimana jika data sudah tidak dipakai?", a: "Pelanggan, gudang, inventaris, pengemudi, dan kendaraan dapat diarsipkan lalu dipulihkan kapan saja tanpa kehilangan riwayat." },
              ],
              finalHeading: "Siap membuat operasional lebih tertata?",
              finalDescription:
                  "Masuk dengan Google dan mulai kelola pengiriman pertama Anda hari ini.",
              footerNote: "Operasional logistik dalam satu ruang kerja.",
              copyright: "Semua hak dilindungi.",
          }
        : {
              tagline: "Logistics Platform",
              features: "Features",
              workflow: "How it works",
              roles: "Roles",
              faq: "FAQ",
              signIn: "Sign in",
              eyebrow: "One workspace for logistics teams",
              heroLead: "Ship organized,",
              heroEmphasis: "track without the chaos.",
              heroDescription:
                  "LogiTrack brings shipments, tracking, inventory, warehouses, and your fleet into one dashboard. Warehouse staff, admins, and drivers work from the same data.",
              startWithGoogle: "Get started with Google",
              seeHow: "See how it works",
              signInNote: "Your account is created automatically on first Google sign-in.",
              trust: ["Google sign-in, no passwords", "Role-based access", "Installable on phones"],
              preview: "Sample view",
              illustrative: "Illustrative data",
              totalShipments: "Total shipments",
              inTransit: "In transit",
              delivered: "Delivered",
              waiting: "Pending",
              shipmentStatus: "Shipment status",
              liveCard: "Out for delivery",
              liveCardRoute: "Bekasi Warehouse → South Jakarta",
              lowStock: "Low stock",
              lowStockItem: "Safety gloves · 8 left",
              highlights: [
                  { value: "6", label: "Operational modules in one dashboard" },
                  { value: "4", label: "Access roles, from admin to driver" },
                  { value: "2", label: "Languages: Indonesian & English" },
                  { value: "1", label: "Click to sign in with Google" },
              ],
              problemEyebrow: "The problem we solve",
              problemHeading: "Stop chasing status updates across chats and spreadsheets",
              problems: [
                  "Shipment updates scattered across group chats",
                  "Stockouts discovered only when items are needed",
                  "Driver and vehicle assignments tracked by hand",
              ],
              solutions: [
                  "A clean status history for every shipment",
                  "Low-stock warnings based on each item's reorder point",
                  "Pick available drivers and vehicles while creating the shipment",
              ],
              before: "Before",
              after: "With LogiTrack",
              featureEyebrow: "Everything included",
              featureHeading: "Everything your daily operations need",
              featureIntro:
                  "From customer records to performance reports, every module is connected so nothing gets entered twice.",
              shipmentTitle: "Shipments & assignments",
              shipmentDescription:
                  "Create a shipment in one form: customer, addresses, inventory items, driver, and vehicle. Stock is reserved automatically.",
              trackingTitle: "Status tracking",
              trackingDescription:
                  "Follow every step from pending and picked up to in transit and delivered, with locations and notes.",
              inventoryTitle: "Inventory & stock",
              inventoryDescription:
                  "See on-hand, reserved, and available stock. Items running low are flagged right away.",
              warehouseTitle: "Multiple warehouses",
              warehouseDescription:
                  "Manage many warehouse locations with their capacity and inventory.",
              fleetTitle: "Drivers & vehicles",
              fleetDescription:
                  "Keep license details, cargo capacity, and fleet availability in one place.",
              teamTitle: "Customers & team",
              teamDescription:
                  "Store customer contacts and invite teammates with secure invitation links.",
              rolesEyebrow: "Role-based access",
              rolesHeading: "Everyone sees exactly what they need",
              rolesIntro:
                  "Menus and pages adapt to each role, keeping teams focused and sensitive data protected.",
              roleCards: [
                  { role: "Admin", description: "Full access, including inviting users and managing roles." },
                  { role: "Manager", description: "Run operations, review performance reports, and manage settings." },
                  { role: "Operator", description: "Manage shipments, inventory, warehouses, fleet, and customers." },
                  { role: "Driver", description: "See delivery assignments and update status right from a phone." },
              ],
              workflowEyebrow: "How it works",
              workflowHeading: "Get started in three steps",
              steps: [
                  { title: "Sign in & invite your team", description: "Sign in with Google, then invite teammates with the right role." },
                  { title: "Set up your records", description: "Add customers, warehouses, inventory, drivers, and vehicles." },
                  { title: "Ship & track", description: "Create shipments, assign your fleet, and follow them until delivered." },
              ],
              faqEyebrow: "FAQ",
              faqHeading: "Still have questions?",
              faqs: [
                  { q: "How do I sign in?", a: "Just use your Google account. Your LogiTrack account is created automatically on first sign-in, with no new password to remember." },
                  { q: "How do I invite my team?", a: "Admins create an invitation link for a specific email. Links last 7 days and only work for the invited email." },
                  { q: "Can drivers use it on their phones?", a: "Yes. LogiTrack is designed for phones and tablets and can be installed to the home screen like an app." },
                  { q: "What about records we no longer use?", a: "Customers, warehouses, inventory, drivers, and vehicles can be archived and restored at any time without losing history." },
              ],
              finalHeading: "Ready to bring order to your operations?",
              finalDescription:
                  "Sign in with Google and manage your first shipment today.",
              footerNote: "Logistics operations in one workspace.",
              copyright: "All rights reserved.",
          };

    const features: Feature[] = [
        { title: copy.shipmentTitle, description: copy.shipmentDescription, icon: PackageCheck },
        { title: copy.trackingTitle, description: copy.trackingDescription, icon: MapPin },
        { title: copy.inventoryTitle, description: copy.inventoryDescription, icon: Boxes },
        { title: copy.warehouseTitle, description: copy.warehouseDescription, icon: Warehouse },
        { title: copy.fleetTitle, description: copy.fleetDescription, icon: Truck },
        { title: copy.teamTitle, description: copy.teamDescription, icon: UsersRound },
    ];

    const roleIcons: LucideIcon[] = [UserCog, LayoutDashboard, Route, Smartphone];
    const trustIcons: LucideIcon[] = [ShieldCheck, UserCog, Smartphone];

    const statusBars = [
        { label: copy.waiting, width: "w-[28%]", color: "bg-amber-400" },
        { label: copy.inTransit, width: "w-[46%]", color: "bg-blue-500" },
        { label: copy.delivered, width: "w-[72%]", color: "bg-emerald-500" },
    ];

    const navLinks = [
        { href: "#features", label: copy.features },
        { href: "#roles", label: copy.roles },
        { href: "#workflow", label: copy.workflow },
        { href: "#faq", label: copy.faq },
    ];

    return (
        <main id="top" className="min-h-screen overflow-hidden">
            <nav className="glass-surface sticky top-0 z-30 border-b">
                <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-5 sm:px-8">
                    <a href="#top" className="flex items-center gap-3" aria-label="LogiTrack">
                        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-md shadow-blue-600/30 ring-1 ring-inset ring-white/20">
                            <Truck aria-hidden="true" className="h-5 w-5" />
                        </span>
                        <span>
                            <span className="block text-sm font-bold tracking-tight text-slate-900">LogiTrack</span>
                            <span className="block text-[11px] text-slate-500">{copy.tagline}</span>
                        </span>
                    </a>

                    <div className="hidden items-center gap-7 lg:flex">
                        {navLinks.map((link) => (
                            <a key={link.href} href={link.href} className="text-sm font-medium text-slate-600 transition hover:text-blue-700">
                                {link.label}
                            </a>
                        ))}
                    </div>

                    <div className="flex items-center gap-2 sm:gap-3">
                        <div role="group" aria-label={id ? "Pilih bahasa" : "Select language"} className="flex items-center rounded-xl border border-slate-200/80 bg-white/60 p-1">
                            <button
                                type="button"
                                aria-label="Bahasa Indonesia"
                                aria-pressed={id}
                                title="Bahasa Indonesia"
                                onClick={() => setLocale("id")}
                                className={`h-8 rounded-lg px-2 text-xs font-semibold transition sm:px-2.5 ${id ? "bg-blue-600 text-white shadow-sm" : "text-slate-600 hover:bg-white"}`}
                            >
                                ID
                            </button>
                            <button
                                type="button"
                                aria-label="English"
                                aria-pressed={!id}
                                title="English"
                                onClick={() => setLocale("en")}
                                className={`h-8 rounded-lg px-2 text-xs font-semibold transition sm:px-2.5 ${!id ? "bg-blue-600 text-white shadow-sm" : "text-slate-600 hover:bg-white"}`}
                            >
                                EN
                            </button>
                        </div>
                        <SignInLink className="inline-flex h-10 items-center rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 px-4 text-sm font-semibold text-white shadow-md shadow-blue-600/25 transition hover:shadow-lg hover:shadow-blue-600/30">
                            {copy.signIn}
                        </SignInLink>
                    </div>
                </div>
            </nav>

            {/* Hero */}
            <section className="relative">
                <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[38rem] bg-[radial-gradient(60rem_28rem_at_50%_-10%,rgba(59,116,222,0.22),transparent_70%)]" />
                <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(to_right,rgba(35,77,176,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(35,77,176,0.06)_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_at_top,black_30%,transparent_70%)]" />

                <div className="mx-auto grid max-w-7xl items-center gap-14 px-5 pb-16 pt-14 sm:px-8 sm:pt-20 lg:grid-cols-[1fr_1.05fr] lg:gap-12 lg:pb-24 lg:pt-24">
                    <div className="mx-auto min-w-0 max-w-2xl text-center lg:mx-0 lg:text-left">
                        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-200/70 bg-white/70 px-3.5 py-1.5 text-xs font-semibold text-blue-800 shadow-sm backdrop-blur">
                            <Sparkles aria-hidden="true" className="h-3.5 w-3.5 text-blue-600" />
                            {copy.eyebrow}
                        </div>
                        <h1 className="text-balance text-4xl font-extrabold leading-[1.08] tracking-tight text-slate-950 sm:text-6xl sm:leading-[1.05] lg:text-[4.1rem]">
                            {copy.heroLead}{" "}
                            {/* Text decoration (not an absolutely positioned SVG) so the emphasis can wrap on narrow phones. */}
                            <span className="text-blue-600 underline decoration-blue-300/80 decoration-[0.09em] underline-offset-[0.14em]">
                                {copy.heroEmphasis}
                            </span>
                        </h1>
                        <p className="mx-auto mt-6 max-w-xl text-base leading-7 text-slate-600 sm:text-lg sm:leading-8 lg:mx-0">
                            {copy.heroDescription}
                        </p>
                        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row lg:justify-start">
                            <SignInLink className={primaryCta}>
                                <GoogleMark className="h-5 w-5 rounded-full bg-white p-0.5" />
                                {copy.startWithGoogle}
                                <ArrowRight aria-hidden="true" className="h-4 w-4" />
                            </SignInLink>
                            <a href="#workflow" className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-white/80 bg-white/60 px-5 text-sm font-semibold text-slate-700 shadow-sm backdrop-blur transition hover:bg-white/90 hover:text-slate-900">
                                {copy.seeHow}
                            </a>
                        </div>
                        <p className="mt-4 text-xs text-slate-500">{copy.signInNote}</p>
                        <ul className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-3 lg:justify-start">
                            {copy.trust.map((item, index) => {
                                const Icon = trustIcons[index];
                                return (
                                    <li key={item} className="flex items-center gap-2 text-sm font-medium text-slate-600">
                                        <Icon aria-hidden="true" className="h-4 w-4 text-blue-600" />
                                        {item}
                                    </li>
                                );
                            })}
                        </ul>
                    </div>

                    {/* Product preview (illustrative) */}
                    <div className="relative mx-auto w-full min-w-0 max-w-2xl">
                        <div aria-hidden="true" className="absolute -inset-6 -z-10 rounded-[2.5rem] bg-gradient-to-tr from-blue-500/15 via-blue-300/10 to-transparent blur-2xl" />
                        <figure className="glass-surface rounded-[1.75rem] border p-2 shadow-[0_40px_100px_rgba(35,77,176,0.22)] sm:p-3" aria-label={copy.preview}>
                            <div className="overflow-hidden rounded-[1.25rem] border border-slate-200/70 bg-[#f7faff]">
                                <div className="flex h-11 items-center justify-between border-b border-slate-200/70 bg-white/90 px-4">
                                    <div className="flex shrink-0 items-center gap-1.5">
                                        <span className="h-2.5 w-2.5 rounded-full bg-red-300" />
                                        <span className="h-2.5 w-2.5 rounded-full bg-amber-300" />
                                        <span className="h-2.5 w-2.5 rounded-full bg-emerald-300" />
                                    </div>
                                    <span className="mx-2 min-w-0 truncate rounded-full bg-slate-100 px-3 py-0.5 text-[10px] font-medium text-slate-500">logitrack.app/dashboard</span>
                                    <span className="shrink-0 rounded-full border border-blue-100 bg-blue-50 px-2 py-0.5 text-[10px] font-medium text-blue-700">{copy.illustrative}</span>
                                </div>
                                <div className="flex">
                                    <div aria-hidden="true" className="hidden w-14 shrink-0 flex-col items-center gap-3 border-r border-slate-200/70 bg-white/60 py-4 sm:flex">
                                        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white"><LayoutDashboard className="h-4 w-4" /></span>
                                        {[PackageCheck, MapPin, Boxes, Warehouse].map((Icon, index) => (
                                            <span key={index} className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400"><Icon className="h-4 w-4" /></span>
                                        ))}
                                    </div>
                                    <div className="min-w-0 flex-1 space-y-3 p-4 sm:space-y-4 sm:p-5">
                                        <div className="grid grid-cols-3 gap-2 sm:gap-3">
                                            {[
                                                { label: copy.totalShipments, value: "1.248", tone: "text-slate-900" },
                                                { label: copy.inTransit, value: "86", tone: "text-blue-700" },
                                                { label: copy.delivered, value: "1.117", tone: "text-emerald-700" },
                                            ].map((stat) => (
                                                <div key={stat.label} className="min-w-0 rounded-xl border border-white bg-white/80 p-3 shadow-sm">
                                                    <p className="truncate text-[10px] text-slate-500 sm:text-xs">{stat.label}</p>
                                                    <p className={`mt-1 text-lg font-bold tracking-tight sm:text-2xl ${stat.tone}`}>{stat.value}</p>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="rounded-xl border border-white bg-white/80 p-4 shadow-sm">
                                            <p className="mb-3 text-xs font-semibold text-slate-900">{copy.shipmentStatus}</p>
                                            <div className="space-y-2.5">
                                                {statusBars.map((bar) => (
                                                    <div key={bar.label} className="flex items-center gap-3">
                                                        <span className="w-24 shrink-0 truncate text-[11px] text-slate-500">{bar.label}</span>
                                                        <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
                                                            <div className={`h-full rounded-full ${bar.width} ${bar.color}`} />
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="rounded-xl border border-white bg-white/80 p-3 shadow-sm">
                                            {["LT-2410-0182", "LT-2410-0179"].map((tracking, index) => (
                                                <div key={tracking} className="flex items-center justify-between gap-3 border-b border-slate-100 py-2 text-[11px] last:border-0 sm:text-xs">
                                                    <span className="font-mono font-medium text-slate-700">{tracking}</span>
                                                    <span className={`rounded-md px-2 py-0.5 font-medium ${index === 0 ? "bg-blue-500/10 text-blue-700" : "bg-emerald-500/10 text-emerald-700"}`}>
                                                        {index === 0 ? copy.inTransit : copy.delivered}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </figure>

                        {/* Floating cards */}
                        <div aria-hidden="true" className="glass-surface absolute -bottom-8 -left-4 hidden w-60 rounded-2xl border p-3.5 shadow-xl motion-safe:animate-[float_6s_ease-in-out_infinite] sm:block lg:-left-10">
                            <div className="flex items-center gap-3">
                                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white"><Truck className="h-4 w-4" /></span>
                                <div className="min-w-0">
                                    <p className="text-xs font-semibold text-slate-900">{copy.liveCard}</p>
                                    <p className="truncate text-[11px] text-slate-500">{copy.liveCardRoute}</p>
                                </div>
                            </div>
                        </div>
                        <div aria-hidden="true" className="glass-surface absolute -right-3 top-[42%] hidden w-56 rounded-2xl border p-3.5 shadow-xl motion-safe:animate-[float_7s_ease-in-out_1s_infinite] sm:block lg:-right-8">
                            <div className="flex items-center gap-3">
                                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-400/20 text-amber-700"><TriangleAlert className="h-4 w-4" /></span>
                                <div className="min-w-0">
                                    <p className="text-xs font-semibold text-slate-900">{copy.lowStock}</p>
                                    <p className="truncate text-[11px] text-slate-500">{copy.lowStockItem}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Highlights */}
                <div className="mx-auto max-w-7xl px-5 pb-20 sm:px-8">
                    <dl className="glass-surface grid grid-cols-2 divide-slate-900/[0.06] rounded-2xl border lg:grid-cols-4 lg:divide-x">
                        {copy.highlights.map((item) => (
                            <div key={item.label} className="flex flex-col-reverse gap-1 p-5 text-center sm:p-6">
                                <dt className="text-xs leading-5 text-slate-500 sm:text-sm">{item.label}</dt>
                                <dd className="text-3xl font-extrabold tracking-tight text-blue-700 sm:text-4xl">{item.value}</dd>
                            </div>
                        ))}
                    </dl>
                </div>
            </section>

            {/* Problem → solution */}
            <section className="px-5 py-20 sm:px-8 sm:py-24">
                <div className="mx-auto max-w-7xl">
                    <div className="mx-auto mb-12 max-w-2xl text-center">
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-700">{copy.problemEyebrow}</p>
                        <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">{copy.problemHeading}</h2>
                    </div>
                    <div className="grid gap-5 md:grid-cols-2">
                        <div className="rounded-3xl border border-slate-200/80 bg-white/40 p-6 sm:p-8">
                            <p className="text-sm font-semibold uppercase tracking-wide text-slate-400">{copy.before}</p>
                            <ul className="mt-5 space-y-4">
                                {copy.problems.map((item) => (
                                    <li key={item} className="flex items-start gap-3 text-slate-600">
                                        <span aria-hidden="true" className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-200 text-xs font-bold text-slate-500">×</span>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="glass-surface relative overflow-hidden rounded-3xl border p-6 ring-1 ring-blue-500/15 sm:p-8">
                            <div aria-hidden="true" className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-blue-500/10 blur-3xl" />
                            <p className="relative text-sm font-semibold uppercase tracking-wide text-blue-700">{copy.after}</p>
                            <ul className="relative mt-5 space-y-4">
                                {copy.solutions.map((item) => (
                                    <li key={item} className="flex items-start gap-3 font-medium text-slate-800">
                                        <CircleCheck aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features */}
            <section id="features" className="scroll-mt-24 px-5 py-20 sm:px-8 sm:py-24">
                <div className="mx-auto max-w-7xl">
                    <div className="mx-auto mb-12 max-w-2xl text-center sm:mb-16">
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-700">{copy.featureEyebrow}</p>
                        <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">{copy.featureHeading}</h2>
                        <p className="mt-4 leading-7 text-slate-600">{copy.featureIntro}</p>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
                        {features.map(({ title, description, icon: Icon }, index) => (
                            <article
                                key={title}
                                className={`glass-surface group rounded-2xl border p-6 transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_50px_rgba(35,77,176,0.16)] motion-reduce:hover:translate-y-0 sm:p-7 ${index === 0 ? "lg:col-span-2" : ""}`}
                            >
                                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-600/25 transition group-hover:scale-105 motion-reduce:group-hover:scale-100">
                                    <Icon aria-hidden="true" className="h-5 w-5" />
                                </span>
                                <h3 className="mt-5 text-lg font-semibold text-slate-900">{title}</h3>
                                <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
                            </article>
                        ))}
                        <article className="glass-surface flex flex-col justify-between rounded-2xl border p-6 sm:col-span-2 lg:col-span-2 sm:p-7">
                            <div className="flex flex-wrap gap-2">
                                {[
                                    { icon: Bell, label: id ? "Notifikasi" : "Notifications" },
                                    { icon: Languages, label: "ID / EN" },
                                    { icon: Archive, label: id ? "Arsip & pulihkan" : "Archive & restore" },
                                    { icon: Smartphone, label: id ? "Siap mobile" : "Mobile ready" },
                                ].map(({ icon: Icon, label }) => (
                                    <span key={label} className="inline-flex items-center gap-1.5 rounded-full border border-blue-500/15 bg-blue-500/[0.06] px-3 py-1.5 text-xs font-medium text-blue-800">
                                        <Icon aria-hidden="true" className="h-3.5 w-3.5" />
                                        {label}
                                    </span>
                                ))}
                            </div>
                            <p className="mt-6 text-sm leading-6 text-slate-600">
                                {id ? "Ditambah fitur pendukung yang membuat tim nyaman bekerja setiap hari." : "Plus the everyday details that make your team comfortable at work."}
                            </p>
                        </article>
                    </div>
                </div>
            </section>

            {/* Roles */}
            <section id="roles" className="scroll-mt-24 px-5 py-20 sm:px-8 sm:py-24">
                <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-700">{copy.rolesEyebrow}</p>
                        <h2 className="mt-3 max-w-lg text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">{copy.rolesHeading}</h2>
                        <p className="mt-4 max-w-lg leading-7 text-slate-600">{copy.rolesIntro}</p>
                        <SignInLink className={`${primaryCta} mt-8`}>
                            {copy.startWithGoogle}
                            <ArrowRight aria-hidden="true" className="h-4 w-4" />
                        </SignInLink>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                        {copy.roleCards.map((card, index) => {
                            const Icon = roleIcons[index];
                            return (
                                <div key={card.role} className="glass-surface rounded-2xl border p-6">
                                    <div className="flex items-center gap-3">
                                        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600/10 text-blue-700 ring-1 ring-inset ring-blue-600/15">
                                            <Icon aria-hidden="true" className="h-5 w-5" />
                                        </span>
                                        <h3 className="text-base font-semibold text-slate-900">{card.role}</h3>
                                    </div>
                                    <p className="mt-3 text-sm leading-6 text-slate-600">{card.description}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Workflow */}
            <section id="workflow" className="scroll-mt-24 px-5 py-20 sm:px-8 sm:py-24">
                <div className="mx-auto max-w-7xl">
                    <div className="mx-auto mb-12 max-w-2xl text-center sm:mb-16">
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-700">{copy.workflowEyebrow}</p>
                        <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">{copy.workflowHeading}</h2>
                    </div>
                    <ol className="relative grid gap-5 md:grid-cols-3">
                        <div aria-hidden="true" className="absolute left-[16.6%] right-[16.6%] top-7 hidden h-px bg-gradient-to-r from-blue-300 via-blue-500 to-blue-300 md:block" />
                        {copy.steps.map((step, index) => (
                            <li key={step.title} className="relative text-center">
                                <span className="relative mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 text-lg font-bold text-white shadow-lg shadow-blue-600/30 ring-4 ring-[var(--background)]">
                                    {index + 1}
                                </span>
                                <div className="glass-surface mt-5 rounded-2xl border p-6">
                                    <h3 className="text-base font-semibold text-slate-900">{step.title}</h3>
                                    <p className="mt-2 text-sm leading-6 text-slate-600">{step.description}</p>
                                </div>
                            </li>
                        ))}
                    </ol>
                </div>
            </section>

            {/* FAQ */}
            <section id="faq" className="scroll-mt-24 px-5 py-20 sm:px-8 sm:py-24">
                <div className="mx-auto max-w-3xl">
                    <div className="mb-10 text-center">
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-700">{copy.faqEyebrow}</p>
                        <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">{copy.faqHeading}</h2>
                    </div>
                    <div className="space-y-3">
                        {copy.faqs.map((item) => (
                            <details key={item.q} className="glass-surface group rounded-2xl border px-6 py-1 [&_summary::-webkit-details-marker]:hidden">
                                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 text-left font-semibold text-slate-900">
                                    {item.q}
                                    <ChevronDown aria-hidden="true" className="h-5 w-5 shrink-0 text-blue-600 transition group-open:rotate-180" />
                                </summary>
                                <p className="pb-5 text-sm leading-6 text-slate-600">{item.a}</p>
                            </details>
                        ))}
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="px-5 pb-20 pt-4 sm:px-8 sm:pb-24">
                <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-gradient-to-br from-blue-700 via-blue-800 to-blue-950 px-6 py-16 text-center shadow-[0_40px_100px_rgba(21,35,70,0.35)] sm:px-12 sm:py-20">
                    <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_75%)]" />
                    <div aria-hidden="true" className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-blue-400/30 blur-3xl" />
                    <div aria-hidden="true" className="absolute -bottom-32 -left-16 h-72 w-72 rounded-full bg-blue-300/20 blur-3xl" />
                    <div className="relative mx-auto max-w-2xl">
                        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 text-white ring-1 ring-inset ring-white/25 backdrop-blur">
                            <Truck aria-hidden="true" className="h-7 w-7" />
                        </span>
                        <h2 className="mt-6 text-3xl font-bold tracking-tight text-white sm:text-5xl">{copy.finalHeading}</h2>
                        <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-blue-100 sm:text-lg">{copy.finalDescription}</p>
                        <SignInLink className="mt-8 inline-flex h-12 items-center justify-center gap-3 rounded-xl bg-white px-6 text-sm font-semibold text-blue-800 shadow-xl shadow-blue-950/30 transition hover:-translate-y-0.5 hover:bg-blue-50 motion-reduce:hover:translate-y-0">
                            <GoogleMark className="h-5 w-5" />
                            {copy.startWithGoogle}
                            <ArrowRight aria-hidden="true" className="h-4 w-4" />
                        </SignInLink>
                        <p className="mt-4 text-xs text-blue-200">{copy.signInNote}</p>
                    </div>
                </div>
            </section>

            <footer className="border-t border-white/70 px-5 py-8 sm:px-8">
                <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
                    <a href="#top" className="flex items-center gap-2.5">
                        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 text-white"><Truck aria-hidden="true" className="h-4 w-4" /></span>
                        <span className="text-sm font-bold tracking-tight text-slate-800">LogiTrack</span>
                    </a>
                    <p className="text-xs text-slate-500">{copy.footerNote}</p>
                    <p className="text-xs text-slate-400">© 2026 LogiTrack. {copy.copyright}</p>
                </div>
            </footer>
        </main>
    );
}
