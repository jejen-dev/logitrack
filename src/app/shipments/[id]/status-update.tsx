"use client";

import { useState, useTransition } from "react";

import { updateShipmentStatus } from "@/app/shipments/actions/update-shipment-status";
import { Button } from "@/components/ui/button";

interface StatusUpdateProps {
    shipmentId: string;
    currentStatus:
    | "PENDING"
    | "PICKED_UP"
    | "IN_TRANSIT"
    | "OUT_FOR_DELIVERY"
    | "DELIVERED"
    | "CANCELLED";
    role?: string;
}

const statusOptions = {
    PENDING: [
        {
            value: "PICKED_UP",
            label: "Picked Up",
        },
        {
            value: "CANCELLED",
            label: "Cancelled",
        },
    ],

    PICKED_UP: [
        {
            value: "IN_TRANSIT",
            label: "In Transit",
        },
        {
            value: "CANCELLED",
            label: "Cancelled",
        },
    ],

    IN_TRANSIT: [
        {
            value: "OUT_FOR_DELIVERY",
            label: "Out for Delivery",
        },
        {
            value: "CANCELLED",
            label: "Cancelled",
        },
    ],

    OUT_FOR_DELIVERY: [
        {
            value: "DELIVERED",
            label: "Delivered",
        },
        {
            value: "CANCELLED",
            label: "Cancelled",
        },
    ],

    DELIVERED: [],

    CANCELLED: [],
} as const;

export function StatusUpdate({
    shipmentId,
    currentStatus,
    role,
}: StatusUpdateProps) {
    if (
        role !== "ADMIN" &&
        role !== "MANAGER" &&
        role !== "OPERATOR"
    ) {
        return null;
    }

    const [status, setStatus] = useState(currentStatus);
    const [location, setLocation] = useState("");
    const [description, setDescription] = useState("");
    const [isPending, startTransition] = useTransition();
    const [message, setMessage] = useState("");

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setMessage("");

        startTransition(async () => {
            try {
                await updateShipmentStatus({
                    shipmentId,
                    status,
                    location: location || undefined,
                    description: description || undefined,
                });

                setMessage("Shipment status updated successfully.");
                setLocation("");
                setDescription("");

                window.location.reload();
            } catch {
                setMessage("Failed to update shipment status.");
            }
        });
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label
                    htmlFor="shipment-status"
                    className="text-xs font-medium text-slate-600"
                >
                    Status
                </label>

                <select
                    id="shipment-status"
                    value={status}
                    onChange={(event) =>
                        setStatus(
                            event.target.value as typeof status,
                        )
                    }
                    className="mt-1 h-9 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >
                    {currentStatus === "PENDING" && (
                        <option value="PENDING">Pending</option>
                    )}

                    {statusOptions[currentStatus].map((option) => (
                        <option
                            key={option.value}
                            value={option.value}
                        >
                            {option.label}
                        </option>
                    ))}
                </select>
            </div>

            <div>
                <label
                    htmlFor="shipment-location"
                    className="text-xs font-medium text-slate-600"
                >
                    Location
                </label>

                <input
                    id="shipment-location"
                    value={location}
                    onChange={(event) =>
                        setLocation(event.target.value)
                    }
                    placeholder="e.g. Bekasi Warehouse"
                    className="mt-1 h-9 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
            </div>

            <div>
                <label
                    htmlFor="shipment-description"
                    className="text-xs font-medium text-slate-600"
                >
                    Description
                </label>

                <textarea
                    id="shipment-description"
                    value={description}
                    onChange={(event) =>
                        setDescription(event.target.value)
                    }
                    placeholder="Optional update description"
                    rows={3}
                    className="mt-1 w-full resize-none rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
            </div>

            <Button
                type="submit"
                disabled={isPending || status === currentStatus}
                className="w-full"
            >
                {isPending
                    ? "Updating..."
                    : "Update Status"}
            </Button>

            {message && (
                <p className="text-xs text-slate-500">
                    {message}
                </p>
            )}
        </form>
    );
}
