"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Archive, Pencil, RotateCcw } from "lucide-react";

import {
    createInventoryItem,
    setInventoryItemActive,
    updateInventoryItem,
} from "@/app/inventory/actions/manage-inventory-item";
import { Card, CardContent } from "@/components/ui";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { InventoryFilters } from "./inventory-filters";
import { LocalizedText , LocalizedInput} from "@/components/locale-provider";

interface InventoryItem {
    id: string;
    sku: string;
    name: string;
    quantity: number;
    reservedQuantity: number;
    reorderPoint: number;
    isActive: boolean;
    warehouse: { id: string; name: string; code: string };
}

interface Warehouse {
    id: string;
    name: string;
    code: string;
    isActive: boolean;
}

interface StateChange {
    item: InventoryItem;
    activate: boolean;
}

export function InventoryManagement({
    items,
    warehouses,
}: {
    items: InventoryItem[];
    warehouses: Warehouse[];
}) {
    const router = useRouter();
    const [editing, setEditing] = useState<InventoryItem | null>(null);
    const [open, setOpen] = useState(false);
    const [stateChange, setStateChange] = useState<StateChange | null>(null);
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState("");

    const activeItems = items.filter((item) => item.isActive);
    const archivedItems = items.filter((item) => !item.isActive);

    async function saveItem(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setBusy(true);
        setError("");
        const form = new FormData(event.currentTarget);
        const input = {
            sku: String(form.get("sku") ?? ""),
            name: String(form.get("name") ?? ""),
            quantity: Number(form.get("quantity")),
            reorderPoint: Number(form.get("reorderPoint")),
            warehouseId: String(form.get("warehouseId") ?? ""),
        };
        try {
            if (editing) await updateInventoryItem(editing.id, input);
            else await createInventoryItem(input);
            setOpen(false);
            router.refresh();
        } catch (caught) {
            setError(caught instanceof Error ? caught.message : "Failed to save inventory item.");
        } finally {
            setBusy(false);
        }
    }

    async function confirmStateChange() {
        if (!stateChange) return;
        setBusy(true);
        setError("");
        try {
            await setInventoryItemActive(stateChange.item.id, stateChange.activate);
            setStateChange(null);
            router.refresh();
        } catch (caught) {
            setError(caught instanceof Error ? caught.message : "Failed to update inventory item status.");
        } finally {
            setBusy(false);
        }
    }

    function startCreate() {
        setEditing(null);
        setError("");
        setOpen(true);
    }

    function startEdit(item: InventoryItem) {
        setEditing(item);
        setError("");
        setOpen(true);
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
                <InventoryFilters warehouses={warehouses} />
                <Button onClick={startCreate} className="shrink-0 md:order-first md:self-end xl:order-none xl:self-auto"><LocalizedText text={"Add inventory item"} /></Button>
            </div>
            {error && !open && !stateChange && <p role="alert" className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700"><LocalizedText text={error} /></p>}

            <InventoryTable items={activeItems} archived={false} onEdit={startEdit} onToggle={(item) => { setError(""); setStateChange({ item, activate: false }); }} />
            {archivedItems.length > 0 && (
                <section className="space-y-4">
                    <h2 className="text-lg font-semibold text-slate-800"><LocalizedText text={"Archived inventory items"} /></h2>
                    <InventoryTable items={archivedItems} archived onEdit={startEdit} onToggle={(item) => { setError(""); setStateChange({ item, activate: true }); }} />
                </section>
            )}

            <Modal
                open={open}
                onOpenChange={(nextOpen) => { if (!nextOpen && !busy) { setOpen(false); setError(""); } }}
                title={editing ? "Edit inventory item" : "Add inventory item"}
                description={editing ? "Update product details and stock levels." : "Add a product to a warehouse and set its current stock level."}
            >
                <form key={editing?.id ?? "new"} onSubmit={saveItem} className="space-y-4">
                    <label className="block text-sm font-medium text-slate-700"><LocalizedText text={"SKU "} /><span className="font-normal text-slate-500"><LocalizedText text={"(optional)"} /></span>
                        <LocalizedInput name="sku" maxLength={80} defaultValue={editing?.sku} placeholder="Auto-generated if left blank" className="mt-1 h-10 w-full rounded-md border border-slate-300 bg-white px-3 font-normal uppercase" />
                        {!editing && <span className="mt-1 block text-xs font-normal text-slate-500"><LocalizedText text={"Leave blank to generate an SKU from the product name."} /></span>}
                    </label>
                    <label className="block text-sm font-medium text-slate-700"><LocalizedText text={"Product name\n                        "} /><LocalizedInput name="name" required maxLength={160} defaultValue={editing?.name} placeholder="Industrial safety gloves" className="mt-1 h-10 w-full rounded-md border border-slate-300 bg-white px-3 font-normal" />
                    </label>
                    <label className="block text-sm font-medium text-slate-700"><LocalizedText text={"Warehouse\n                        "} /><select name="warehouseId" required defaultValue={editing?.warehouse.id ?? ""} className="mt-1 h-10 w-full rounded-md border border-slate-300 bg-white px-3 font-normal">
                            <option value="" disabled><LocalizedText text={"Select a warehouse"} /></option>
                            {warehouses.map((warehouse) => <option key={warehouse.id} value={warehouse.id} disabled={!warehouse.isActive && warehouse.id !== editing?.warehouse.id}>{warehouse.name} <LocalizedText text={" · "} />{warehouse.code}<LocalizedText text={warehouse.isActive ? "" : " (Archived)"} /></option>)}
                        </select>
                    </label>
                    <div className="grid gap-4 md:grid-cols-2">
                        <label className="block text-sm font-medium text-slate-700"><LocalizedText text={"On-hand quantity\n                            "} /><LocalizedInput name="quantity" required type="number" min="0" step="1" defaultValue={editing?.quantity ?? ""} placeholder="0" inputMode="numeric" className="mt-1 h-10 w-full rounded-md border border-slate-300 bg-white px-3 font-normal" />
                        </label>
                        <label className="block text-sm font-medium text-slate-700"><LocalizedText text={"Reorder point\n                            "} /><LocalizedInput name="reorderPoint" required type="number" min="0" step="1" defaultValue={editing?.reorderPoint ?? ""} placeholder="10" inputMode="numeric" className="mt-1 h-10 w-full rounded-md border border-slate-300 bg-white px-3 font-normal" />
                            <span className="mt-1 block text-xs font-normal text-slate-500"><LocalizedText text={"Marks the item as low stock when available stock reaches or drops below this number."} /></span>
                        </label>
                    </div>
                    {error && open && <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700"><LocalizedText text={error} /></p>}
                    <div className="flex justify-end gap-2 pt-2">
                        <Button type="button" variant="outline" disabled={busy} onClick={() => setOpen(false)}><LocalizedText text={"Cancel"} /></Button>
                        <Button type="submit" disabled={busy}><LocalizedText text={busy ? "Saving…" : "Save"} /></Button>
                    </div>
                </form>
            </Modal>

            <Modal
                open={stateChange !== null}
                onOpenChange={(nextOpen) => { if (!nextOpen && !busy) { setStateChange(null); setError(""); } }}
                title={stateChange?.activate ? "Restore inventory item" : "Archive inventory item"}
            >
                {stateChange && (
                    <div className="space-y-5">
                        <p className="text-sm leading-6 text-slate-600">
                            {stateChange.activate
                                ? `Restore ${stateChange.item.name} (${stateChange.item.sku})? It will be available for new shipments again.`
                                : `Archive ${stateChange.item.name} (${stateChange.item.sku})? Its history will be retained, and it will no longer be available for new shipments.`}
                        </p>
                        {error && <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700"><LocalizedText text={error} /></p>}
                        <div className="flex justify-end gap-2">
                            <Button variant="outline" disabled={busy} onClick={() => setStateChange(null)}><LocalizedText text={"Cancel"} /></Button>
                            <Button variant={stateChange.activate ? "primary" : "danger"} disabled={busy} onClick={confirmStateChange}>
                                <LocalizedText text={busy ? "Saving…" : stateChange.activate ? "Restore" : "Archive"} />
                            </Button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
}

function InventoryTable({
    items,
    archived,
    onEdit,
    onToggle,
}: {
    items: InventoryItem[];
    archived: boolean;
    onEdit: (item: InventoryItem) => void;
    onToggle: (item: InventoryItem) => void;
}) {
    return (
        <Card>
            <CardContent className="pt-5">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead><tr className="border-b border-slate-200 text-left">
                            <th className="px-4 py-3 font-medium text-slate-500"><LocalizedText text={"SKU"} /></th>
                            <th className="px-4 py-3 font-medium text-slate-500"><LocalizedText text={"Product"} /></th>
                            <th className="px-4 py-3 font-medium text-slate-500"><LocalizedText text={"Warehouse"} /></th>
                            <th className="px-4 py-3 font-medium text-slate-500"><LocalizedText text={"On hand"} /></th>
                            <th className="px-4 py-3 font-medium text-slate-500"><LocalizedText text={"Reserved"} /></th>
                            <th className="px-4 py-3 font-medium text-slate-500"><LocalizedText text={"Available"} /></th>
                            <th className="px-4 py-3 font-medium text-slate-500"><LocalizedText text={"Reorder point"} /></th>
                            <th className="px-4 py-3 font-medium text-slate-500"><LocalizedText text={"Stock status"} /></th>
                            <th className="px-4 py-3 text-right font-medium text-slate-500"><LocalizedText text={"Actions"} /></th>
                        </tr></thead>
                        <tbody>
                            {items.map((item) => {
                                const availableQuantity = item.quantity - item.reservedQuantity;
                                const isLowStock = availableQuantity <= item.reorderPoint;
                                return (
                                    <tr key={item.id} className="border-b border-slate-100 last:border-0">
                                        <td className="px-4 py-3 font-mono text-xs text-slate-600">{item.sku}</td>
                                        <td className="px-4 py-3 font-medium text-slate-900">{item.name}</td>
                                        <td className="px-4 py-3 text-slate-600"><p>{item.warehouse.name}</p><p className="text-xs text-slate-400">{item.warehouse.code}</p></td>
                                        <td className="px-4 py-3 font-medium text-slate-900">{item.quantity}</td>
                                        <td className="px-4 py-3 text-slate-600">{item.reservedQuantity}</td>
                                        <td className="px-4 py-3 font-medium text-slate-900">{availableQuantity}</td>
                                        <td className="px-4 py-3 text-slate-600">{item.reorderPoint}</td>
                                        <td className="px-4 py-3"><span className={isLowStock ? "inline-flex rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700" : "inline-flex rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700"}><LocalizedText text={isLowStock ? "Low Stock" : "In Stock"} /></span></td>
                                        <td className="px-4 py-3 text-right"><div className="flex justify-end gap-2">
                                            <Button variant="outline" size="sm" onClick={() => onEdit(item)}><Pencil aria-hidden="true" className="h-3.5 w-3.5" /> <LocalizedText text={" Edit"} /></Button>
                                            <Button variant={archived ? "secondary" : "danger"} size="sm" disabled={!archived && item.reservedQuantity > 0} title={!archived && item.reservedQuantity > 0 ? "Release shipment reservations before archiving." : undefined} onClick={() => onToggle(item)}>
                                                {archived ? <RotateCcw aria-hidden="true" className="h-3.5 w-3.5" /> : <Archive aria-hidden="true" className="h-3.5 w-3.5" />}
                                                <LocalizedText text={archived ? "Restore" : "Archive"} />
                                            </Button>
                                        </div></td>
                                    </tr>
                                );
                            })}
                            {items.length === 0 && <tr><td colSpan={9} className="px-4 py-10 text-center text-sm text-slate-500"><LocalizedText text={"No "} /><LocalizedText text={archived ? "archived" : "active"} /> <LocalizedText text={" inventory items found."} /></td></tr>}
                        </tbody>
                    </table>
                </div>
                <div className="mt-4 text-sm text-slate-500"><LocalizedText text={"Showing "} /><span className="font-medium text-slate-700">{items.length}</span> <LocalizedText text={archived ? "archived " : ""} /><LocalizedText text={"inventory item"} /><LocalizedText text={items.length === 1 ? "" : "s"} /></div>
            </CardContent>
        </Card>
    );
}
