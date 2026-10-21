"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { createShipment } from "@/app/shipments/actions/create-shipment";
import { Button } from "@/components/ui/button";

interface Customer {
    id: string;
    name: string;
}

interface Driver {
    id: string;
    name: string;
}

interface Vehicle {
    id: string;
    plateNumber: string;
    type: string;
}

interface InventoryItem {
    id: string;
    sku: string;
    name: string;
    availableQuantity: number;
    warehouse: { name: string; code: string };
}

interface ShipmentFormProps {
    customers: Customer[];
    drivers: Driver[];
    vehicles: Vehicle[];
    inventoryItems: InventoryItem[];
    onCancel?: () => void;
}

export function ShipmentForm({
    customers,
    drivers,
    vehicles,
    inventoryItems,
    onCancel,
}: ShipmentFormProps) {
    const router = useRouter();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [form, setForm] = useState({
        customerId: "",
        driverId: "",
        vehicleId: "",
        inventoryItemId: "",
        originAddress: "",
        destinationAddress: "",
        paymentStatus: "UNPAID" as
            | "UNPAID"
            | "PAID"
            | "REFUNDED",
        productName: "",
        quantity: "1",
        weight: "",
    });

    const selectedInventoryItem = inventoryItems.find((item) => item.id === form.inventoryItemId);

    function updateField(
        field: keyof typeof form,
        value: string,
    ) {
        setForm((current) => ({
            ...current,
            [field]: value,
        }));
    }

    async function handleSubmit(
        event: React.FormEvent<HTMLFormElement>,
    ) {
        event.preventDefault();

        setError("");
        setLoading(true);

        try {
            const shipment = await createShipment({
                customerId: form.customerId,
                driverId: form.driverId || undefined,
                vehicleId: form.vehicleId || undefined,
                inventoryItemId: form.inventoryItemId || undefined,
                originAddress: form.originAddress,
                destinationAddress: form.destinationAddress,
                paymentStatus: form.paymentStatus,
                productName: form.productName,
                quantity: Number(form.quantity),
                weight: form.weight
                    ? Number(form.weight)
                    : undefined,
            });

            router.push(`/shipments/${shipment.id}`);
            router.refresh();
        } catch (caught) {
            setError(caught instanceof Error ? caught.message : "Failed to create shipment. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="space-y-5"
        >
            {/* Shipment Information */}
            <section className="space-y-4">
                <h3 className="text-sm font-semibold text-slate-800">Shipment Information</h3>
                <div className="grid gap-5 md:grid-cols-2">
                        {/* Customer */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-slate-700">
                                Customer
                            </label>

                            <select
                                required
                                value={form.customerId}
                                onChange={(event) =>
                                    updateField(
                                        "customerId",
                                        event.target.value,
                                    )
                                }
                                className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            >
                                <option value="">
                                    Select customer
                                </option>

                                {customers.map((customer) => (
                                    <option
                                        key={customer.id}
                                        value={customer.id}
                                    >
                                        {customer.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Payment Status */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-slate-700">
                                Payment Status
                            </label>

                            <select
                                value={form.paymentStatus}
                                onChange={(event) =>
                                    updateField(
                                        "paymentStatus",
                                        event.target.value,
                                    )
                                }
                                className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            >
                                <option value="UNPAID">
                                    Unpaid
                                </option>

                                <option value="PAID">
                                    Paid
                                </option>

                                <option value="REFUNDED">
                                    Refunded
                                </option>
                            </select>
                        </div>

                        {/* Origin */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-slate-700">
                                Origin
                            </label>

                            <input
                                required
                                value={form.originAddress}
                                onChange={(event) =>
                                    updateField(
                                        "originAddress",
                                        event.target.value,
                                    )
                                }
                                placeholder="Origin address"
                                className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm outline-none placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            />
                        </div>

                        {/* Destination */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-slate-700">
                                Destination
                            </label>

                            <input
                                required
                                value={
                                    form.destinationAddress
                                }
                                onChange={(event) =>
                                    updateField(
                                        "destinationAddress",
                                        event.target.value,
                                    )
                                }
                                placeholder="Destination address"
                                className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm outline-none placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            />
                        </div>
                </div>
            </section>

            {/* Delivery Assignment */}
            <section className="space-y-4">
                <h3 className="text-sm font-semibold text-slate-800">Delivery Assignment</h3>
                <div className="grid gap-5 md:grid-cols-2">
                        {/* Driver */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-slate-700">
                                Driver
                            </label>

                            <select
                                value={form.driverId}
                                onChange={(event) =>
                                    updateField(
                                        "driverId",
                                        event.target.value,
                                    )
                                }
                                className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            >
                                <option value="">
                                    Unassigned
                                </option>

                                {drivers.map((driver) => (
                                    <option
                                        key={driver.id}
                                        value={driver.id}
                                    >
                                        {driver.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Vehicle */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-slate-700">
                                Vehicle
                            </label>

                            <select
                                value={form.vehicleId}
                                onChange={(event) =>
                                    updateField(
                                        "vehicleId",
                                        event.target.value,
                                    )
                                }
                                className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            >
                                <option value="">
                                    Unassigned
                                </option>

                                {vehicles.map((vehicle) => (
                                    <option
                                        key={vehicle.id}
                                        value={vehicle.id}
                                    >
                                        {vehicle.plateNumber} —{" "}
                                        {vehicle.type}
                                    </option>
                                ))}
                            </select>
                        </div>
                </div>
            </section>

            {/* Shipment Item */}
            <section className="space-y-4">
                <h3 className="text-sm font-semibold text-slate-800">Shipment Item</h3>
                <div className="grid gap-5 md:grid-cols-3">
                        <div className="md:col-span-3">
                            <label className="mb-2 block text-sm font-medium text-slate-700">
                                Inventory stock <span className="font-normal text-slate-500">(optional)</span>
                            </label>
                            <select
                                value={form.inventoryItemId}
                                onChange={(event) => {
                                    const inventoryItemId = event.target.value;
                                    const item = inventoryItems.find((candidate) => candidate.id === inventoryItemId);
                                    setForm((current) => ({
                                        ...current,
                                        inventoryItemId,
                                        productName: item?.name ?? "",
                                    }));
                                }}
                                className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            >
                                <option value="">Manual item (not linked to inventory)</option>
                                {inventoryItems.map((item) => (
                                    <option key={item.id} value={item.id}>
                                        {item.name} · {item.sku} · {item.availableQuantity} available · {item.warehouse.name} ({item.warehouse.code})
                                    </option>
                                ))}
                            </select>
                            {selectedInventoryItem && (
                                <p className="mt-1 text-xs text-slate-500">
                                    This shipment will reserve stock from this warehouse. {selectedInventoryItem.availableQuantity} available now.
                                </p>
                            )}
                        </div>

                        {/* Product */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-slate-700">
                                Product
                            </label>

                            <input
                                required={!selectedInventoryItem}
                                value={form.productName}
                                onChange={(event) =>
                                    updateField(
                                        "productName",
                                        event.target.value,
                                    )
                                }
                                placeholder="Product name"
                                disabled={Boolean(selectedInventoryItem)}
                                className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm outline-none placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            />
                        </div>

                        {/* Quantity */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-slate-700">
                                Quantity
                            </label>

                            <input
                                required
                                min="1"
                                max={selectedInventoryItem?.availableQuantity}
                                step="1"
                                type="number"
                                value={form.quantity}
                                onChange={(event) =>
                                    updateField(
                                        "quantity",
                                        event.target.value,
                                    )
                                }
                                className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            />
                            {selectedInventoryItem && Number(form.quantity) > selectedInventoryItem.availableQuantity && (
                                <p className="mt-1 text-xs text-red-600">Quantity exceeds available stock.</p>
                            )}
                        </div>

                        {/* Weight */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-slate-700">
                                Weight (kg)
                            </label>

                            <input
                                min="0"
                                step="0.01"
                                type="number"
                                value={form.weight}
                                onChange={(event) =>
                                    updateField(
                                        "weight",
                                        event.target.value,
                                    )
                                }
                                placeholder="Optional"
                                className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm outline-none placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            />
                        </div>
                </div>
            </section>

            {/* Error */}
            {error && (
                <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}
                </div>
            )}

            {/* Actions */}
            <div className="flex justify-end gap-3">
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => onCancel ? onCancel() : router.push("/shipments")}
                >
                    Cancel
                </Button>

                <Button
                    type="submit"
                    disabled={loading}
                >
                    {loading
                        ? "Creating..."
                        : "Create Shipment"}
                </Button>
            </div>
        </form>
    );
}
