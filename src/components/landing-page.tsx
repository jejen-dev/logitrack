"use client";

import Link from "next/link";
import {
    ArrowDown,
    ArrowRight,
    Boxes,
    ChartNoAxesCombined,
    Check,
    CircleHelp,
    MapPin,
    PackageCheck,
    Truck,
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

export function LandingPage() {
    const { locale, setLocale } = useLocale();
    const id = locale === "id";

    const copy = id
        ? {
              tagline: "Platform Logistik",
              features: "Fitur",
              workflow: "Alur Kerja",
              signIn: "Masuk",
              eyebrow: "Operasional Terpadu",
              heroLead: "Kelola operasional logistik dengan",
              heroEmphasis: "lebih terarah",
              heroEnd: ".",
              heroDescription:
                  "Satukan pengiriman, inventaris, dan pengelolaan armada dalam satu platform untuk membantu tim bekerja lebih terkoordinasi.",
              startWithGoogle: "Mulai dengan Google",
              exploreFeatures: "Jelajahi fitur",
              preview: "Pratinjau fitur",
              totalShipments: "Total pengiriman",
              waiting: "Menunggu",
              delivered: "Terkirim",
              featureEyebrow: "Satu ruang kerja untuk operasional",
              featureHeading: "Informasi dan alur kerja lebih tertata",
              featureIntro:
                  "Kelola kebutuhan operasional harian dari data awal hingga status pengiriman dan laporan.",
              shipmentTitle: "Pengiriman & penugasan",
              shipmentDescription:
                  "Buat pengiriman, pilih pelanggan, lalu tetapkan pengemudi dan kendaraan yang tersedia.",
              trackingTitle: "Pelacakan status",
              trackingDescription:
                  "Ikuti pembaruan status dan riwayat pengiriman dari menunggu hingga diterima pelanggan.",
              inventoryTitle: "Inventaris & stok",
              inventoryDescription:
                  "Pantau stok tersedia, jumlah yang dipesan, dan barang yang mencapai batas pemesanan ulang.",
              warehouseTitle: "Pengelolaan gudang",
              warehouseDescription:
                  "Kelola beberapa lokasi gudang dan lihat barang inventaris yang terhubung ke setiap lokasi.",
              fleetTitle: "Pengemudi & kendaraan",
              fleetDescription:
                  "Kelola data pengemudi, SIM, kapasitas kendaraan, dan ketersediaan armada.",
              teamTitle: "Pelanggan & akses tim",
              teamDescription:
                  "Simpan informasi pelanggan, undang anggota merchant, dan atur akses berdasarkan peran.",
              workflowEyebrow: "Alur yang saling terhubung",
              workflowHeading: "Dari data operasional hingga laporan",
              workflowIntro:
                  "Catat pelanggan dan inventaris, tugaskan sumber daya, lalu pantau pembaruan status pengiriman.",
              stepOne: "Siapkan data",
              stepOneDescription:
                  "Kelola pelanggan, gudang, barang inventaris, pengemudi, dan kendaraan.",
              stepTwo: "Buat dan tugaskan pengiriman",
              stepTwoDescription:
                  "Pilih alamat, pengemudi, kendaraan, dan barang yang akan dikirim.",
              stepThree: "Perbarui status dan tinjau laporan",
              stepThreeDescription:
                  "Ikuti riwayat status dan ringkasan kinerja pengiriman.",
              reportPreview: "Ringkasan operasional",
              reportNote:
                  "Laporan merangkum jumlah dan status pengiriman untuk membantu pemantauan operasional.",
              archiveNote:
                  "Data sumber daya yang tidak aktif dapat diarsipkan dan dipulihkan kembali.",
              finalHeading: "Siap menata operasional pengiriman?",
              finalDescription:
                  "Masuk untuk mulai mengelola data operasional bisnis Anda di LogiTrack.",
              footerNote: "Operasional logistik dalam satu ruang kerja.",
              copyright: "Semua hak dilindungi.",
          }
        : {
              tagline: "Logistics Platform",
              features: "Features",
              workflow: "Workflow",
              signIn: "Sign in",
              eyebrow: "Connected Operations",
              heroLead: "Bring your logistics operations",
              heroEmphasis: "into focus",
              heroEnd: ".",
              heroDescription:
                  "Bring shipments, inventory, and fleet management together in one workspace so your team can coordinate its work.",
              startWithGoogle: "Get started with Google",
              exploreFeatures: "Explore features",
              preview: "Feature preview",
              totalShipments: "Total shipments",
              waiting: "Pending",
              delivered: "Delivered",
              featureEyebrow: "One workspace for operations",
              featureHeading: "A clearer way to manage daily work",
              featureIntro:
                  "Manage daily operations from the initial records through shipment updates and reporting.",
              shipmentTitle: "Shipments & assignments",
              shipmentDescription:
                  "Create shipments, choose customers, then assign available drivers and vehicles.",
              trackingTitle: "Status tracking",
              trackingDescription:
                  "Follow shipment status updates and history from pending through customer delivery.",
              inventoryTitle: "Inventory & stock",
              inventoryDescription:
                  "Monitor available stock, reserved quantities, and items at their reorder point.",
              warehouseTitle: "Warehouse management",
              warehouseDescription:
                  "Manage multiple warehouse locations and see the inventory linked to each one.",
              fleetTitle: "Drivers & vehicles",
              fleetDescription:
                  "Manage driver details, licenses, vehicle capacity, and fleet availability.",
              teamTitle: "Customers & team access",
              teamDescription:
                  "Keep customer records, invite merchant members, and manage access by role.",
              workflowEyebrow: "A connected workflow",
              workflowHeading: "From operational records to reporting",
              workflowIntro:
                  "Record customers and inventory, assign resources, and follow shipment status updates.",
              stepOne: "Prepare your records",
              stepOneDescription:
                  "Manage customers, warehouses, inventory items, drivers, and vehicles.",
              stepTwo: "Create and assign shipments",
              stepTwoDescription:
                  "Choose addresses, a driver, a vehicle, and the items to ship.",
              stepThree: "Update status and review reports",
              stepThreeDescription:
                  "Follow shipment history and review operational summaries.",
              reportPreview: "Operations summary",
              reportNote:
                  "Reports summarize shipment counts and statuses to support operational reviews.",
              archiveNote:
                  "Inactive resource records can be archived and restored later.",
              finalHeading: "Ready to organize your shipment operations?",
              finalDescription:
                  "Sign in to start managing your business operations in LogiTrack.",
              footerNote: "Logistics operations in one workspace.",
              copyright: "All rights reserved.",
          };

    const features: Feature[] = [
        {
            title: copy.shipmentTitle,
            description: copy.shipmentDescription,
            icon: PackageCheck,
        },
        {
            title: copy.trackingTitle,
            description: copy.trackingDescription,
            icon: MapPin,
        },
        {
            title: copy.inventoryTitle,
            description: copy.inventoryDescription,
            icon: Boxes,
        },
        {
            title: copy.warehouseTitle,
            description: copy.warehouseDescription,
            icon: Warehouse,
        },
        {
            title: copy.fleetTitle,
            description: copy.fleetDescription,
            icon: Truck,
        },
        {
            title: copy.teamTitle,
            description: copy.teamDescription,
            icon: UsersRound,
        },
    ];

    const steps = [
        { title: copy.stepOne, description: copy.stepOneDescription },
        { title: copy.stepTwo, description: copy.stepTwoDescription },
        { title: copy.stepThree, description: copy.stepThreeDescription },
    ];

    return (
        <main id="top" className="min-h-screen overflow-hidden">
            <nav className="glass-surface sticky top-0 z-30 border-x-0 border-t-0">
                <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
                    <a href="#top" className="flex items-center gap-3" aria-label="LogiTrack">
                        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md shadow-blue-600/20">
                            <Truck aria-hidden="true" className="h-5 w-5" />
                        </span>
                        <span>
                            <span className="block text-sm font-bold tracking-tight text-slate-900">LogiTrack</span>
                            <span className="block text-[11px] text-slate-500">{copy.tagline}</span>
                        </span>
                    </a>

                    <div className="flex items-center gap-3 sm:gap-8">
                        <a href="#features" className="hidden text-sm font-medium text-slate-600 transition hover:text-blue-700 sm:inline">{copy.features}</a>
                        <a href="#workflow" className="hidden text-sm font-medium text-slate-600 transition hover:text-blue-700 sm:inline">{copy.workflow}</a>
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
                        <SignInLink className="inline-flex h-10 items-center rounded-xl border border-blue-600/20 bg-white/70 px-4 text-sm font-semibold text-blue-700 transition hover:bg-blue-50">{copy.signIn}</SignInLink>
                    </div>
                </div>
            </nav>

            <section className="mx-auto grid max-w-7xl items-center gap-12 px-5 pb-20 pt-16 sm:px-8 sm:pt-20 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16 lg:pb-28 lg:pt-24">
                <div className="relative z-10 mx-auto max-w-2xl text-center lg:mx-0 lg:text-left">
                    <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50/80 px-3.5 py-1.5 text-xs font-semibold tracking-wide text-blue-800">
                        <span className="h-2 w-2 rounded-full bg-blue-600" />
                        {copy.eyebrow}
                    </div>
                    <h1 className="text-4xl font-bold leading-[1.08] tracking-tight text-slate-950 sm:text-5xl lg:text-[3.65rem]">
                        {copy.heroLead}{" "}
                        <span className="text-blue-600">{copy.heroEmphasis}</span>{copy.heroEnd}
                    </h1>
                    <p className="mx-auto mt-6 max-w-xl text-base leading-7 text-slate-600 sm:text-lg lg:mx-0">
                        {copy.heroDescription}
                    </p>
                    <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row lg:justify-start">
                        <SignInLink className="inline-flex h-12 items-center justify-center gap-3 rounded-xl bg-slate-900 px-6 text-sm font-semibold text-white shadow-lg shadow-slate-900/10 transition hover:-translate-y-0.5 hover:bg-slate-800">
                            <GoogleMark className="h-5 w-5" />
                            {copy.startWithGoogle}
                        </SignInLink>
                        <a href="#features" className="inline-flex h-12 items-center justify-center gap-2 rounded-xl px-5 text-sm font-semibold text-slate-600 transition hover:bg-white/70 hover:text-slate-900">
                            {copy.exploreFeatures}
                            <ArrowDown aria-hidden="true" className="h-4 w-4" />
                        </a>
                    </div>
                    <p className="mt-4 text-xs text-slate-500">
                        {id
                            ? "Akun baru dibuat otomatis saat pertama kali masuk dengan Google."
                            : "New accounts are created automatically on first Google sign-in."}
                    </p>
                </div>

                <div className="relative mx-auto w-full max-w-2xl">
                    <div aria-hidden="true" className="absolute -left-8 top-12 h-40 w-40 rounded-full bg-blue-300/25 blur-3xl" />
                    <div aria-hidden="true" className="absolute -bottom-8 right-0 h-48 w-48 rounded-full bg-sky-300/25 blur-3xl" />
                    <div className="glass-surface relative rotate-0 rounded-[1.6rem] p-2 shadow-[0_28px_80px_rgba(30,64,110,0.16)] transition-transform duration-500 sm:rotate-1 sm:p-3 sm:hover:rotate-0">
                        <div className="overflow-hidden rounded-[1.15rem] border border-slate-200/70 bg-[#f7faff]">
                            <div className="flex h-12 items-center justify-between border-b border-slate-200/70 bg-white/90 px-4 sm:px-5">
                                <div className="flex items-center gap-2">
                                    <span className="h-2.5 w-2.5 rounded-full bg-slate-200" />
                                    <span className="h-2.5 w-2.5 rounded-full bg-slate-200" />
                                    <span className="h-2.5 w-2.5 rounded-full bg-slate-200" />
                                </div>
                                <span className="rounded-full border border-blue-100 bg-blue-50 px-2.5 py-1 text-[10px] font-medium text-blue-700">{copy.preview}</span>
                            </div>
                            <div className="space-y-4 p-4 sm:space-y-5 sm:p-6">
                                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                                    <div className="glass-surface rounded-xl p-4">
                                        <p className="text-xs text-slate-500">{copy.totalShipments}</p>
                                        <p className="mt-2 text-2xl font-bold tracking-tight text-slate-900">—</p>
                                    </div>
                                    <div className="glass-surface rounded-xl p-4">
                                        <p className="text-xs text-slate-500">{copy.delivered}</p>
                                        <p className="mt-2 text-2xl font-bold tracking-tight text-slate-900">—</p>
                                    </div>
                                </div>
                                <div className="glass-surface rounded-xl p-4 sm:p-5">
                                    <div className="mb-5 flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-semibold text-slate-900">{copy.reportPreview}</p>
                                            <p className="mt-1 text-xs text-slate-500">{id ? "Status pengiriman" : "Shipment status"}</p>
                                        </div>
                                        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                                            <ChartNoAxesCombined aria-hidden="true" className="h-4 w-4" />
                                        </span>
                                    </div>
                                    <div className="space-y-4">
                                        <div>
                                            <div className="mb-2 flex items-center justify-between text-xs">
                                                <span className="font-medium text-slate-600">{copy.waiting}</span>
                                                <span className="text-slate-400">—</span>
                                            </div>
                                            <div className="h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full w-[42%] rounded-full bg-blue-500/70" /></div>
                                        </div>
                                        <div>
                                            <div className="mb-2 flex items-center justify-between text-xs">
                                                <span className="font-medium text-slate-600">{copy.delivered}</span>
                                                <span className="text-slate-400">—</span>
                                            </div>
                                            <div className="h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full w-[68%] rounded-full bg-emerald-500/70" /></div>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3 rounded-xl border border-white/80 bg-white/55 p-3 text-xs leading-5 text-slate-500">
                                    <CircleHelp aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />
                                    {id ? "Tampilan ilustrasi, bukan data operasional." : "Illustrative preview, not operational data."}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section id="features" className="scroll-mt-24 px-5 py-20 sm:px-8 sm:py-24">
                <div className="mx-auto max-w-7xl">
                    <div className="mx-auto mb-12 max-w-2xl text-center sm:mb-16">
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-700">{copy.featureEyebrow}</p>
                        <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">{copy.featureHeading}</h2>
                        <p className="mt-4 leading-7 text-slate-600">{copy.featureIntro}</p>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
                        {features.map(({ title, description, icon: Icon }) => (
                            <article key={title} className="glass-surface rounded-2xl p-6 transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_42px_rgba(30,64,110,0.13)] sm:p-7">
                                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600/10 text-blue-700">
                                    <Icon aria-hidden="true" className="h-5 w-5" />
                                </span>
                                <h3 className="mt-5 text-base font-semibold text-slate-900">{title}</h3>
                                <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            <section id="workflow" className="scroll-mt-24 border-y border-white/60 bg-slate-900/[0.025] px-5 py-20 sm:px-8 sm:py-24">
                <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-700">{copy.workflowEyebrow}</p>
                        <h2 className="mt-3 max-w-xl text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">{copy.workflowHeading}</h2>
                        <p className="mt-4 max-w-xl leading-7 text-slate-600">{copy.workflowIntro}</p>
                        <div className="mt-8 space-y-3">
                            {steps.map((step, index) => (
                                <div key={step.title} className="glass-surface flex gap-4 rounded-xl p-4 sm:p-5">
                                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white">{index + 1}</span>
                                    <div>
                                        <h3 className="text-sm font-semibold text-slate-900">{step.title}</h3>
                                        <p className="mt-1 text-sm leading-6 text-slate-600">{step.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <aside className="glass-surface rounded-3xl p-6 shadow-[0_24px_64px_rgba(30,64,110,0.12)] sm:p-8">
                        <div className="flex items-center gap-3 border-b border-slate-200/70 pb-5">
                            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-700"><ChartNoAxesCombined aria-hidden="true" className="h-5 w-5" /></span>
                            <div>
                                <h3 className="text-sm font-semibold text-slate-900">{copy.reportPreview}</h3>
                                <p className="mt-1 text-xs text-slate-500">{copy.totalShipments} · {copy.waiting} · {copy.delivered}</p>
                            </div>
                        </div>
                        <p className="mt-5 text-sm leading-6 text-slate-600">{copy.reportNote}</p>
                        <div className="mt-5 flex items-start gap-3 rounded-xl border border-blue-100/80 bg-blue-50/55 p-4 text-sm leading-6 text-slate-600">
                            <Check aria-hidden="true" className="mt-1 h-4 w-4 shrink-0 text-blue-700" />
                            <span>{copy.archiveNote}</span>
                        </div>
                        <div className="mt-6 flex items-center justify-between border-t border-slate-200/70 pt-5 text-xs text-slate-500">
                            <span>{id ? "Pelacakan status" : "Status tracking"}</span>
                            <span className="inline-flex items-center gap-1 font-medium text-blue-700">{id ? "Lihat fitur" : "Explore features"}<ArrowRight aria-hidden="true" className="h-3.5 w-3.5" /></span>
                        </div>
                    </aside>
                </div>
            </section>

            <section className="px-5 py-20 sm:px-8 sm:py-24">
                <div className="glass-surface relative mx-auto max-w-7xl overflow-hidden rounded-[1.75rem] px-6 py-14 text-center sm:px-12 sm:py-16">
                    <div aria-hidden="true" className="absolute -right-20 -top-28 h-64 w-64 rounded-full bg-blue-400/10 blur-3xl" />
                    <div aria-hidden="true" className="absolute -bottom-36 -left-12 h-64 w-64 rounded-full bg-sky-400/10 blur-3xl" />
                    <div className="relative mx-auto max-w-2xl">
                        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/20"><Truck aria-hidden="true" className="h-6 w-6" /></span>
                        <h2 className="mt-5 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">{copy.finalHeading}</h2>
                        <p className="mx-auto mt-4 max-w-xl leading-7 text-slate-600">{copy.finalDescription}</p>
                        <SignInLink className="mt-7 inline-flex h-12 items-center justify-center gap-3 rounded-xl bg-blue-600 px-6 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:-translate-y-0.5 hover:bg-blue-700">
                            <GoogleMark className="h-5 w-5 rounded-full bg-white p-0.5" />
                            {copy.startWithGoogle}
                        </SignInLink>
                    </div>
                </div>
            </section>

            <footer className="border-t border-white/70 px-5 py-7 sm:px-8">
                <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
                    <a href="#top" className="flex items-center gap-2.5">
                        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-900 text-white"><Truck aria-hidden="true" className="h-4 w-4" /></span>
                        <span className="text-sm font-bold tracking-tight text-slate-800">LogiTrack</span>
                    </a>
                    <p className="text-xs text-slate-500">{copy.footerNote}</p>
                    <p className="text-xs text-slate-400">© 2026 LogiTrack. {copy.copyright}</p>
                </div>
            </footer>
        </main>
    );
}
