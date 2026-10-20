"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Archive, Pencil, Phone, RotateCcw, UserRound } from "lucide-react";

import {
    createDriver,
    setDriverActive,
    updateDriver,
} from "@/app/drivers/actions/manage-driver";
import { Badge, Card, CardContent, CardHeader, CardTitle, Modal } from "@/components/ui";
import { Button } from "@/components/ui/button";

interface Driver {
    id: string;
    name: string;
    phone: string;
    licenseNo: string;
    status: "AVAILABLE" | "ON_DELIVERY" | "OFF_DUTY";
    isActive: boolean;
}

type DriverDialog =
    | { type: "create" }
    | { type: "edit"; driver: Driver }
    | { type: "archive" | "restore"; driver: Driver }
    | null;

export function DriverManagement({ drivers }: { drivers: Driver[] }) {
    const router = useRouter();
    const [dialog, setDialog] = useState<DriverDialog>(null);
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState("");

    async function saveDriver(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (dialog?.type !== "create" && dialog?.type !== "edit") return;

        setError("");
        setBusy(true);
        const formData = new FormData(event.currentTarget);
        const input = {
            name: String(formData.get("name") ?? ""),
            phone: String(formData.get("phone") ?? ""),
            licenseNo: String(formData.get("licenseNo") ?? ""),
        };

        try {
            if (dialog.type === "edit") await updateDriver(dialog.driver.id, input);
            else await createDriver(input);
            setDialog(null);
            router.refresh();
        } catch (caught) {
            setError(caught instanceof Error ? caught.message : "Gagal menyimpan driver.");
        } finally {
            setBusy(false);
        }
    }

    async function confirmDriverStateChange() {
        if (dialog?.type !== "archive" && dialog?.type !== "restore") return;

        setError("");
        setBusy(true);
        try {
            await setDriverActive(dialog.driver.id, dialog.type === "restore");
            setDialog(null);
            router.refresh();
        } catch (caught) {
            setError(caught instanceof Error ? caught.message : "Gagal mengubah status driver.");
        } finally {
            setBusy(false);
        }
    }

    const activeDrivers = drivers.filter((driver) => driver.isActive);
    const inactiveDrivers = drivers.filter((driver) => !driver.isActive);
    const editingDriver = dialog?.type === "edit" ? dialog.driver : undefined;
    const stateChangeDriver = dialog?.type === "archive" || dialog?.type === "restore" ? dialog.driver : undefined;

    return (
        <div className="space-y-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm text-slate-500">
                    {activeDrivers.length} driver aktif · {inactiveDrivers.length} diarsipkan
                </p>
                <Button onClick={() => { setError(""); setDialog({ type: "create" }); }}>
                    Tambah driver
                </Button>
            </div>

            {error && !dialog && <p role="alert" className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

            <DriverGrid
                drivers={activeDrivers}
                onEdit={(driver) => { setError(""); setDialog({ type: "edit", driver }); }}
                onToggle={(driver) => { setError(""); setDialog({ type: "archive", driver }); }}
            />

            {inactiveDrivers.length > 0 && (
                <section className="space-y-4">
                    <h2 className="text-lg font-semibold text-slate-800">Driver diarsipkan</h2>
                    <DriverGrid
                        drivers={inactiveDrivers}
                        onEdit={(driver) => { setError(""); setDialog({ type: "edit", driver }); }}
                        onToggle={(driver) => { setError(""); setDialog({ type: "restore", driver }); }}
                    />
                </section>
            )}

            {drivers.length === 0 && (
                <Card>
                    <CardContent className="py-12 text-center">
                        <UserRound className="mx-auto h-8 w-8 text-slate-300" />
                        <p className="mt-3 text-sm text-slate-500">Belum ada driver. Tambahkan driver pertama.</p>
                    </CardContent>
                </Card>
            )}

            <Modal
                open={dialog !== null}
                onOpenChange={(open) => { if (!open && !busy) { setDialog(null); setError(""); } }}
                title={dialog?.type === "create" ? "Tambah driver" : dialog?.type === "edit" ? "Edit driver" : dialog?.type === "archive" ? "Arsipkan driver" : "Aktifkan driver"}
                description={dialog?.type === "create" ? "Isi data driver baru." : dialog?.type === "edit" ? "Perbarui informasi driver." : undefined}
            >
                {(dialog?.type === "create" || dialog?.type === "edit") && (
                    <DriverForm driver={editingDriver} busy={busy} error={error} onCancel={() => setDialog(null)} onSubmit={saveDriver} />
                )}

                {stateChangeDriver && (
                    <div className="space-y-5">
                        <p className="text-sm leading-6 text-slate-600">
                            {dialog?.type === "archive"
                                ? `Arsipkan ${stateChangeDriver.name}? Data dan riwayat shipment tetap disimpan, tetapi driver tidak tersedia untuk shipment baru.`
                                : `Aktifkan kembali ${stateChangeDriver.name}? Driver dapat dipilih lagi untuk shipment baru jika statusnya tersedia.`}
                        </p>
                        {error && <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
                        <div className="flex justify-end gap-2">
                            <Button variant="outline" disabled={busy} onClick={() => setDialog(null)}>Batal</Button>
                            <Button variant={dialog?.type === "archive" ? "danger" : "primary"} disabled={busy} onClick={confirmDriverStateChange}>
                                {busy ? "Menyimpan…" : dialog?.type === "archive" ? "Arsipkan" : "Aktifkan"}
                            </Button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
}

function DriverGrid({
    drivers,
    onEdit,
    onToggle,
}: {
    drivers: Driver[];
    onEdit: (driver: Driver) => void;
    onToggle: (driver: Driver) => void;
}) {
    if (drivers.length === 0) return null;

    return (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {drivers.map((driver) => (
                <Card key={driver.id}>
                    <CardHeader>
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100">
                                    <UserRound className="h-5 w-5 text-slate-600" />
                                </div>
                                <div>
                                    <CardTitle className="text-base">{driver.name}</CardTitle>
                                    <p className="mt-1 text-xs text-slate-500">SIM {driver.licenseNo}</p>
                                </div>
                            </div>
                            <Badge variant={driver.isActive ? (driver.status === "AVAILABLE" ? "success" : "info") : "default"}>
                                {driver.isActive ? driver.status.replaceAll("_", " ") : "DIARSIPKAN"}
                            </Badge>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                            <Phone className="h-4 w-4 text-slate-400" />
                            <span>{driver.phone}</span>
                        </div>
                        <div className="mt-4 flex flex-wrap gap-2">
                            <Button variant="outline" size="sm" onClick={() => onEdit(driver)}>
                                <Pencil aria-hidden="true" className="h-3.5 w-3.5" /> Edit
                            </Button>
                            <Button variant={driver.isActive ? "danger" : "secondary"} size="sm" onClick={() => onToggle(driver)}>
                                {driver.isActive ? <Archive aria-hidden="true" className="h-3.5 w-3.5" /> : <RotateCcw aria-hidden="true" className="h-3.5 w-3.5" />}
                                {driver.isActive ? "Nonaktifkan" : "Aktifkan"}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}

function DriverForm({
    driver,
    busy,
    error,
    onCancel,
    onSubmit,
}: {
    driver?: Driver;
    busy: boolean;
    error: string;
    onCancel: () => void;
    onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}) {
    return (
        <form onSubmit={onSubmit} className="space-y-4">
            <label className="block text-sm font-medium text-slate-700">
                Nama
                <input name="name" required maxLength={120} defaultValue={driver?.name} autoComplete="name" className="mt-1 h-10 w-full rounded-md border border-slate-300 bg-white px-3 font-normal" />
            </label>
            <label className="block text-sm font-medium text-slate-700">
                Nomor telepon
                <input name="phone" required maxLength={40} defaultValue={driver?.phone} type="tel" autoComplete="tel" className="mt-1 h-10 w-full rounded-md border border-slate-300 bg-white px-3 font-normal" />
            </label>
            <label className="block text-sm font-medium text-slate-700">
                Nomor SIM
                <input name="licenseNo" required maxLength={60} defaultValue={driver?.licenseNo} className="mt-1 h-10 w-full rounded-md border border-slate-300 bg-white px-3 font-normal" />
            </label>
            {error && <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
            <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" disabled={busy} onClick={onCancel}>Batal</Button>
                <Button type="submit" disabled={busy}>{busy ? "Menyimpan…" : "Simpan"}</Button>
            </div>
        </form>
    );
}
