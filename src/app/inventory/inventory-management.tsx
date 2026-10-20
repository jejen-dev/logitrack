"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil } from "lucide-react";

import { createInventoryItem, updateInventoryItem } from "@/app/inventory/actions/manage-inventory-item";
import { Card, CardContent } from "@/components/ui";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { InventoryFilters } from "./inventory-filters";

interface InventoryItem {
    id: string;
    sku: string;
    name: string;
    quantity: number;
    reservedQuantity: number;
    reorderPoint: number;
    warehouse: { id: string; name: string; code: string };
}

interface Warehouse {
    id: string;
    name: string;
    code: string;
    isActive: boolean;
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
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState("");

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
        <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <InventoryFilters warehouses={warehouses} />
                <Button onClick={startCreate}>Add inventory item</Button>
            </div>
            <Card>
                <CardContent className="pt-5">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead><tr className="border-b border-slate-200 text-left">
                                <th className="px-4 py-3 font-medium text-slate-500">SKU</th>
                                <th className="px-4 py-3 font-medium text-slate-500">Product</th>
                                <th className="px-4 py-3 font-medium text-slate-500">Warehouse</th>
                                <th className="px-4 py-3 font-medium text-slate-500">On hand</th>
                                <th className="px-4 py-3 font-medium text-slate-500">Reserved</th>
                                <th className="px-4 py-3 font-medium text-slate-500">Available</th>
                                <th className="px-4 py-3 font-medium text-slate-500">Reorder point</th>
                                <th className="px-4 py-3 font-medium text-slate-500">Status</th>
                                <th className="px-4 py-3 text-right font-medium text-slate-500">Actions</th>
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
                                            <td className="px-4 py-3"><span className={isLowStock ? "inline-flex rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700" : "inline-flex rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700"}>{isLowStock ? "Low Stock" : "In Stock"}</span></td>
                                            <td className="px-4 py-3 text-right"><Button variant="outline" size="sm" onClick={() => startEdit(item)}><Pencil aria-hidden="true" className="h-3.5 w-3.5" /> Edit</Button></td>
                                        </tr>
                                    );
                                })}
                                {items.length === 0 && <tr><td colSpan={9} className="px-4 py-10 text-center text-sm text-slate-500">No inventory items found.</td></tr>}
                            </tbody>
                        </table>
                    </div>
                    <div className="mt-4 text-sm text-slate-500">Showing <span className="font-medium text-slate-700">{items.length}</span> inventory item{items.length === 1 ? "" : "s"}</div>
                </CardContent>
            </Card>

            <Modal
                open={open}
                onOpenChange={(nextOpen) => { if (!nextOpen && !busy) { setOpen(false); setError(""); } }}
                title={editing ? "Edit inventory item" : "Add inventory item"}
                description={editing ? "Update product details and stock levels." : "Add a product to a warehouse and set its current stock level."}
            >
                <form key={editing?.id ?? "new"} onSubmit={saveItem} className="space-y-4">
                    <label className="block text-sm font-medium text-slate-700">SKU <span className="font-normal text-slate-500">(optional)</span>
                        <input name="sku" maxLength={80} defaultValue={editing?.sku} placeholder="Auto-generated if left blank" className="mt-1 h-10 w-full rounded-md border border-slate-300 bg-white px-3 font-normal uppercase" />
                        {!editing && <span className="mt-1 block text-xs font-normal text-slate-500">Leave blank to generate an SKU from the product name.</span>}
                    </label>
                    <label className="block text-sm font-medium text-slate-700">Product name
                        <input name="name" required maxLength={160} defaultValue={editing?.name} placeholder="Industrial safety gloves" className="mt-1 h-10 w-full rounded-md border border-slate-300 bg-white px-3 font-normal" />
                    </label>
                    <label className="block text-sm font-medium text-slate-700">Warehouse
                        <select name="warehouseId" required defaultValue={editing?.warehouse.id ?? ""} className="mt-1 h-10 w-full rounded-md border border-slate-300 bg-white px-3 font-normal">
                            <option value="" disabled>Select a warehouse</option>
                            {warehouses.map((warehouse) => <option key={warehouse.id} value={warehouse.id} disabled={!warehouse.isActive && warehouse.id !== editing?.warehouse.id}>{warehouse.name} · {warehouse.code}{warehouse.isActive ? "" : " (Archived)"}</option>)}
                        </select>
                    </label>
                    <div className="grid gap-4 sm:grid-cols-2">
                        <label className="block text-sm font-medium text-slate-700">On-hand quantity
                            <input name="quantity" required type="number" min="0" step="1" defaultValue={editing?.quantity ?? ""} placeholder="0" inputMode="numeric" className="mt-1 h-10 w-full rounded-md border border-slate-300 bg-white px-3 font-normal" />
                        </label>
                        <label className="block text-sm font-medium text-slate-700">Reorder point
                            <input name="reorderPoint" required type="number" min="0" step="1" defaultValue={editing?.reorderPoint ?? ""} placeholder="10" inputMode="numeric" className="mt-1 h-10 w-full rounded-md border border-slate-300 bg-white px-3 font-normal" />
                            <span className="mt-1 block text-xs font-normal text-slate-500">Marks the item as low stock when available stock reaches or drops below this number.</span>
                        </label>
                    </div>
                    {error && <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
                    <div className="flex justify-end gap-2 pt-2">
                        <Button type="button" variant="outline" disabled={busy} onClick={() => setOpen(false)}>Cancel</Button>
                        <Button type="submit" disabled={busy}>{busy ? "Saving…" : "Save"}</Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
