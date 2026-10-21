"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Archive, MapPin, Pencil, RotateCcw, Warehouse as WarehouseIcon } from "lucide-react";

import { createWarehouse, setWarehouseActive, updateWarehouse } from "@/app/warehouses/actions/manage-warehouse";
import { Badge, Card, CardContent, CardHeader, CardTitle, Modal } from "@/components/ui";
import { Button } from "@/components/ui/button";
import { LocalizedText , LocalizedInput} from "@/components/locale-provider";

interface Warehouse {
    id: string;
    name: string;
    code: string;
    address: string | null;
    city: string | null;
    postalCode: string | null;
    isActive: boolean;
    _count: { inventoryItems: number };
}

type WarehouseDialog =
    | { type: "create" }
    | { type: "edit"; warehouse: Warehouse }
    | { type: "archive" | "restore"; warehouse: Warehouse }
    | null;

export function WarehouseManagement({ warehouses }: { warehouses: Warehouse[] }) {
    const router = useRouter();
    const [dialog, setDialog] = useState<WarehouseDialog>(null);
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState("");

    async function saveWarehouse(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (dialog?.type !== "create" && dialog?.type !== "edit") return;
        setBusy(true);
        setError("");
        const form = new FormData(event.currentTarget);
        const input = {
            name: String(form.get("name") ?? ""),
            code: String(form.get("code") ?? ""),
            address: String(form.get("address") ?? ""),
            city: String(form.get("city") ?? ""),
            postalCode: String(form.get("postalCode") ?? ""),
        };
        try {
            if (dialog.type === "edit") await updateWarehouse(dialog.warehouse.id, input);
            else await createWarehouse(input);
            setDialog(null);
            router.refresh();
        } catch (caught) {
            setError(caught instanceof Error ? caught.message : "Failed to save warehouse.");
        } finally {
            setBusy(false);
        }
    }

    async function changeWarehouseStatus() {
        if (dialog?.type !== "archive" && dialog?.type !== "restore") return;
        setBusy(true);
        setError("");
        try {
            await setWarehouseActive(dialog.warehouse.id, dialog.type === "restore");
            setDialog(null);
            router.refresh();
        } catch (caught) {
            setError(caught instanceof Error ? caught.message : "Failed to update warehouse status.");
        } finally {
            setBusy(false);
        }
    }

    const active = warehouses.filter((warehouse) => warehouse.isActive);
    const archived = warehouses.filter((warehouse) => !warehouse.isActive);
    const editing = dialog?.type === "edit" ? dialog.warehouse : undefined;
    const changing = dialog?.type === "archive" || dialog?.type === "restore" ? dialog.warehouse : undefined;

    return (
        <div className="space-y-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm text-slate-500">{active.length} <LocalizedText text={" active · "} />{archived.length} <LocalizedText text={" archived"} /></p>
                <Button onClick={() => { setError(""); setDialog({ type: "create" }); }}><LocalizedText text={"Add warehouse"} /></Button>
            </div>
            {error && !dialog && <p role="alert" className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700"><LocalizedText text={error} /></p>}

            <WarehouseGrid warehouses={active} onEdit={(warehouse) => setDialog({ type: "edit", warehouse })} onToggle={(warehouse) => setDialog({ type: "archive", warehouse })} />
            {archived.length > 0 && (
                <section className="space-y-4">
                    <h2 className="text-lg font-semibold text-slate-800"><LocalizedText text={"Archived warehouses"} /></h2>
                    <WarehouseGrid warehouses={archived} onEdit={(warehouse) => setDialog({ type: "edit", warehouse })} onToggle={(warehouse) => setDialog({ type: "restore", warehouse })} />
                </section>
            )}
            {warehouses.length === 0 && (
                <Card><CardContent className="py-12 text-center">
                    <WarehouseIcon className="mx-auto h-8 w-8 text-slate-300" />
                    <p className="mt-3 text-sm text-slate-500"><LocalizedText text={"No warehouses found. Add your first warehouse."} /></p>
                </CardContent></Card>
            )}

            <Modal
                open={dialog !== null}
                onOpenChange={(open) => { if (!open && !busy) { setDialog(null); setError(""); } }}
                title={dialog?.type === "create" ? "Add warehouse" : dialog?.type === "edit" ? "Edit warehouse" : dialog?.type === "archive" ? "Archive warehouse" : "Restore warehouse"}
                description={dialog?.type === "create" ? "Enter the warehouse location details." : dialog?.type === "edit" ? "Update the warehouse location details." : undefined}
            >
                {(dialog?.type === "create" || dialog?.type === "edit") && (
                    <form onSubmit={saveWarehouse} className="space-y-4">
                        <label className="block text-sm font-medium text-slate-700"><LocalizedText text={"Warehouse name\n                            "} /><LocalizedInput name="name" required maxLength={120} defaultValue={editing?.name} placeholder="Jakarta Distribution Center" className="mt-1 h-10 w-full rounded-md border border-slate-300 bg-white px-3 font-normal" />
                        </label>
                        <label className="block text-sm font-medium text-slate-700"><LocalizedText text={"Warehouse code "} /><span className="font-normal text-slate-500"><LocalizedText text={"(optional)"} /></span>
                            <LocalizedInput name="code" maxLength={30} defaultValue={editing?.code} placeholder="Auto-generated if left blank" className="mt-1 h-10 w-full rounded-md border border-slate-300 bg-white px-3 font-normal uppercase" />
                            {!editing && <span className="mt-1 block text-xs font-normal text-slate-500"><LocalizedText text={"Leave blank to generate a code from the warehouse name."} /></span>}
                        </label>
                        <label className="block text-sm font-medium text-slate-700"><LocalizedText text={"Street address\n                            "} /><LocalizedInput name="address" maxLength={240} defaultValue={editing?.address ?? ""} placeholder="Jl. Raya Bekasi No. 18" autoComplete="street-address" className="mt-1 h-10 w-full rounded-md border border-slate-300 bg-white px-3 font-normal" />
                        </label>
                        <div className="grid gap-4 sm:grid-cols-2">
                            <label className="block text-sm font-medium text-slate-700"><LocalizedText text={"City\n                                "} /><LocalizedInput name="city" maxLength={100} defaultValue={editing?.city ?? ""} placeholder="Jakarta Timur" autoComplete="address-level2" className="mt-1 h-10 w-full rounded-md border border-slate-300 bg-white px-3 font-normal" />
                            </label>
                            <label className="block text-sm font-medium text-slate-700"><LocalizedText text={"Postal code\n                                "} /><LocalizedInput name="postalCode" maxLength={20} defaultValue={editing?.postalCode ?? ""} placeholder="13920" autoComplete="postal-code" className="mt-1 h-10 w-full rounded-md border border-slate-300 bg-white px-3 font-normal" />
                            </label>
                        </div>
                        {error && <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700"><LocalizedText text={error} /></p>}
                        <div className="flex justify-end gap-2 pt-2">
                            <Button type="button" variant="outline" disabled={busy} onClick={() => setDialog(null)}><LocalizedText text={"Cancel"} /></Button>
                            <Button type="submit" disabled={busy}><LocalizedText text={busy ? "Saving…" : "Save"} /></Button>
                        </div>
                    </form>
                )}
                {changing && (
                    <div className="space-y-5">
                        <p className="text-sm leading-6 text-slate-600">
                            {dialog?.type === "archive"
                                ? `Archive ${changing.name}? Its inventory records will be kept and remain available in inventory filters.`
                                : `Restore ${changing.name}? It will be available as an active warehouse again.`}
                        </p>
                        {error && <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700"><LocalizedText text={error} /></p>}
                        <div className="flex justify-end gap-2">
                            <Button variant="outline" disabled={busy} onClick={() => setDialog(null)}><LocalizedText text={"Cancel"} /></Button>
                            <Button variant={dialog?.type === "archive" ? "danger" : "primary"} disabled={busy} onClick={changeWarehouseStatus}>
                                <LocalizedText text={busy ? "Saving…" : dialog?.type === "archive" ? "Archive" : "Restore"} />
                            </Button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
}

function WarehouseGrid({ warehouses, onEdit, onToggle }: {
    warehouses: Warehouse[];
    onEdit: (warehouse: Warehouse) => void;
    onToggle: (warehouse: Warehouse) => void;
}) {
    if (warehouses.length === 0) return null;
    return (
        <div className="grid gap-4 md:grid-cols-2">
            {warehouses.map((warehouse) => (
                <Card key={warehouse.id}>
                    <CardHeader>
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600"><WarehouseIcon className="h-5 w-5" /></div>
                                <div><CardTitle className="text-base">{warehouse.name}</CardTitle><p className="mt-1 font-mono text-xs text-slate-500">{warehouse.code}</p></div>
                            </div>
                            {!warehouse.isActive && <Badge variant="default"><LocalizedText text={"ARCHIVED"} /></Badge>}
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-start gap-2 text-sm text-slate-600">
                            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                            <p>{[warehouse.address, [warehouse.city, warehouse.postalCode].filter(Boolean).join(" ")].filter(Boolean).join(", ") || "No address provided"}</p>
                        </div>
                        <div className="mt-4 grid grid-cols-2 gap-3">
                            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3"><p className="text-xs text-slate-500"><LocalizedText text={"Inventory items"} /></p><p className="mt-1 text-xl font-semibold text-slate-900">{warehouse._count.inventoryItems}</p></div>
                            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3"><p className="text-xs text-slate-500"><LocalizedText text={"Warehouse code"} /></p><p className="mt-1 text-sm font-semibold text-slate-900">{warehouse.code}</p></div>
                        </div>
                        <div className="mt-4 flex flex-wrap gap-2">
                            <Button variant="outline" size="sm" onClick={() => onEdit(warehouse)}><Pencil aria-hidden="true" className="h-3.5 w-3.5" /> <LocalizedText text={" Edit"} /></Button>
                            <Button variant={warehouse.isActive ? "danger" : "secondary"} size="sm" onClick={() => onToggle(warehouse)}>
                                {warehouse.isActive ? <Archive aria-hidden="true" className="h-3.5 w-3.5" /> : <RotateCcw aria-hidden="true" className="h-3.5 w-3.5" />}
                                <LocalizedText text={warehouse.isActive ? "Archive" : "Restore"} />
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
