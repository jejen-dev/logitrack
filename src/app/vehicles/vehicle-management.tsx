"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Archive, Car, Gauge, Pencil, RotateCcw } from "lucide-react";

import {
    createVehicle,
    setVehicleActive,
    updateVehicle,
} from "@/app/vehicles/actions/manage-vehicle";
import { Badge, Card, CardContent, CardHeader, CardTitle, Modal } from "@/components/ui";
import { Button } from "@/components/ui/button";
import { getVehicleTypeLabel, normalizeVehicleType, vehicleTypes } from "@/lib/vehicles/vehicle-types";

interface Vehicle {
    id: string;
    plateNumber: string;
    type: string;
    capacity: number;
    status: "AVAILABLE" | "IN_USE" | "MAINTENANCE";
    isActive: boolean;
}

type VehicleDialog =
    | { type: "create" }
    | { type: "edit"; vehicle: Vehicle }
    | { type: "archive" | "restore"; vehicle: Vehicle }
    | null;

export function VehicleManagement({ vehicles }: { vehicles: Vehicle[] }) {
    const router = useRouter();
    const [dialog, setDialog] = useState<VehicleDialog>(null);
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState("");

    async function saveVehicle(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (dialog?.type !== "create" && dialog?.type !== "edit") return;

        setError("");
        setBusy(true);
        const formData = new FormData(event.currentTarget);
        const input = {
            plateNumber: String(formData.get("plateNumber") ?? ""),
            type: String(formData.get("type") ?? ""),
            capacity: Number(formData.get("capacity")),
        };

        try {
            if (dialog.type === "edit") await updateVehicle(dialog.vehicle.id, input);
            else await createVehicle(input);
            setDialog(null);
            router.refresh();
        } catch (caught) {
            setError(caught instanceof Error ? caught.message : "Gagal menyimpan vehicle.");
        } finally {
            setBusy(false);
        }
    }

    async function confirmVehicleStateChange() {
        if (dialog?.type !== "archive" && dialog?.type !== "restore") return;

        setError("");
        setBusy(true);
        try {
            await setVehicleActive(dialog.vehicle.id, dialog.type === "restore");
            setDialog(null);
            router.refresh();
        } catch (caught) {
            setError(caught instanceof Error ? caught.message : "Gagal mengubah status vehicle.");
        } finally {
            setBusy(false);
        }
    }

    const activeVehicles = vehicles.filter((vehicle) => vehicle.isActive);
    const inactiveVehicles = vehicles.filter((vehicle) => !vehicle.isActive);
    const editingVehicle = dialog?.type === "edit" ? dialog.vehicle : undefined;
    const stateChangeVehicle = dialog?.type === "archive" || dialog?.type === "restore" ? dialog.vehicle : undefined;

    return (
        <div className="space-y-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm text-slate-500">
                    {activeVehicles.length} vehicle aktif · {inactiveVehicles.length} diarsipkan
                </p>
                <Button onClick={() => { setError(""); setDialog({ type: "create" }); }}>
                    Tambah vehicle
                </Button>
            </div>

            {error && !dialog && <p role="alert" className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

            <VehicleGrid
                vehicles={activeVehicles}
                onEdit={(vehicle) => { setError(""); setDialog({ type: "edit", vehicle }); }}
                onToggle={(vehicle) => { setError(""); setDialog({ type: "archive", vehicle }); }}
            />

            {inactiveVehicles.length > 0 && (
                <section className="space-y-4">
                    <h2 className="text-lg font-semibold text-slate-800">Vehicle diarsipkan</h2>
                    <VehicleGrid
                        vehicles={inactiveVehicles}
                        onEdit={(vehicle) => { setError(""); setDialog({ type: "edit", vehicle }); }}
                        onToggle={(vehicle) => { setError(""); setDialog({ type: "restore", vehicle }); }}
                    />
                </section>
            )}

            {vehicles.length === 0 && (
                <Card>
                    <CardContent className="py-12 text-center">
                        <Car className="mx-auto h-8 w-8 text-slate-300" />
                        <p className="mt-3 text-sm text-slate-500">Belum ada vehicle. Tambahkan kendaraan pertama.</p>
                    </CardContent>
                </Card>
            )}

            <Modal
                open={dialog !== null}
                onOpenChange={(open) => { if (!open && !busy) { setDialog(null); setError(""); } }}
                title={dialog?.type === "create" ? "Tambah vehicle" : dialog?.type === "edit" ? "Edit vehicle" : dialog?.type === "archive" ? "Arsipkan vehicle" : "Aktifkan vehicle"}
                description={dialog?.type === "create" ? "Isi data kendaraan baru." : dialog?.type === "edit" ? "Perbarui informasi kendaraan." : undefined}
            >
                {(dialog?.type === "create" || dialog?.type === "edit") && (
                    <VehicleForm vehicle={editingVehicle} busy={busy} error={error} onCancel={() => setDialog(null)} onSubmit={saveVehicle} />
                )}

                {stateChangeVehicle && (
                    <div className="space-y-5">
                        <p className="text-sm leading-6 text-slate-600">
                            {dialog?.type === "archive"
                                ? `Arsipkan ${stateChangeVehicle.plateNumber}? Data dan riwayat shipment tetap disimpan, tetapi kendaraan tidak tersedia untuk shipment baru.`
                                : `Aktifkan kembali ${stateChangeVehicle.plateNumber}? Kendaraan dapat dipilih lagi untuk shipment baru jika statusnya tersedia.`}
                        </p>
                        {error && <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
                        <div className="flex justify-end gap-2">
                            <Button variant="outline" disabled={busy} onClick={() => setDialog(null)}>Batal</Button>
                            <Button variant={dialog?.type === "archive" ? "danger" : "primary"} disabled={busy} onClick={confirmVehicleStateChange}>
                                {busy ? "Menyimpan…" : dialog?.type === "archive" ? "Arsipkan" : "Aktifkan"}
                            </Button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
}

function VehicleGrid({
    vehicles,
    onEdit,
    onToggle,
}: {
    vehicles: Vehicle[];
    onEdit: (vehicle: Vehicle) => void;
    onToggle: (vehicle: Vehicle) => void;
}) {
    if (vehicles.length === 0) return null;

    return (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {vehicles.map((vehicle) => (
                <Card key={vehicle.id}>
                    <CardHeader>
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100">
                                    <Car className="h-5 w-5 text-slate-600" />
                                </div>
                                <div>
                                    <CardTitle className="text-base">{vehicle.plateNumber}</CardTitle>
                                    <p className="mt-1 text-xs text-slate-500">{getVehicleTypeLabel(vehicle.type)}</p>
                                </div>
                            </div>
                            <Badge variant={vehicle.isActive ? (vehicle.status === "AVAILABLE" ? "success" : "info") : "default"}>
                                {vehicle.isActive ? vehicle.status.replaceAll("_", " ") : "DIARSIPKAN"}
                            </Badge>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                            <Gauge className="h-4 w-4 text-slate-400" />
                            <span>Kapasitas: {vehicle.capacity}</span>
                        </div>
                        <div className="mt-4 flex flex-wrap gap-2">
                            <Button variant="outline" size="sm" onClick={() => onEdit(vehicle)}>
                                <Pencil aria-hidden="true" className="h-3.5 w-3.5" /> Edit
                            </Button>
                            <Button variant={vehicle.isActive ? "danger" : "secondary"} size="sm" onClick={() => onToggle(vehicle)}>
                                {vehicle.isActive ? <Archive aria-hidden="true" className="h-3.5 w-3.5" /> : <RotateCcw aria-hidden="true" className="h-3.5 w-3.5" />}
                                {vehicle.isActive ? "Nonaktifkan" : "Aktifkan"}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}

function VehicleForm({
    vehicle,
    busy,
    error,
    onCancel,
    onSubmit,
}: {
    vehicle?: Vehicle;
    busy: boolean;
    error: string;
    onCancel: () => void;
    onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}) {
    return (
        <form onSubmit={onSubmit} className="space-y-4">
            <label className="block text-sm font-medium text-slate-700">
                Nomor polisi
                <input name="plateNumber" required maxLength={20} defaultValue={vehicle?.plateNumber} placeholder="B 1234 ABC" autoComplete="off" className="mt-1 h-10 w-full rounded-md border border-slate-300 bg-white px-3 font-normal" />
            </label>
            <label className="block text-sm font-medium text-slate-700">
                Tipe kendaraan
                <select name="type" required defaultValue={vehicle ? normalizeVehicleType(vehicle.type) : ""} className="mt-1 h-10 w-full rounded-md border border-slate-300 bg-white px-3 font-normal">
                    <option value="" disabled>Pilih tipe kendaraan</option>
                    {vehicle && !normalizeVehicleType(vehicle.type) && <option value="" disabled>Tipe lama tidak dikenal, pilih tipe baru</option>}
                    {vehicleTypes.map((type) => <option key={type} value={type}>{type}</option>)}
                </select>
            </label>
            <label className="block text-sm font-medium text-slate-700">
                Kapasitas
                <input name="capacity" required type="number" min="0.01" step="any" defaultValue={vehicle?.capacity} placeholder="1200" aria-describedby="vehicle-capacity-note" className="mt-1 h-10 w-full rounded-md border border-slate-300 bg-white px-3 font-normal" />
                <span id="vehicle-capacity-note" className="mt-1 block text-xs font-normal text-slate-500">
                    Kapasitas muatan maksimal dalam kilogram (kg).
                </span>
            </label>
            {error && <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
            <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" disabled={busy} onClick={onCancel}>Batal</Button>
                <Button type="submit" disabled={busy}>{busy ? "Menyimpan…" : "Simpan"}</Button>
            </div>
        </form>
    );
}

