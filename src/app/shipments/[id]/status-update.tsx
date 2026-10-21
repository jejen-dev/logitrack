"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { updateShipmentStatus } from "@/app/shipments/actions/update-shipment-status";
import { Button } from "@/components/ui/button";
import { allowedShipmentTransitions, shipmentStatuses } from "@/lib/shipments/status-transitions";
import type { ShipmentStatus } from "@/generated/prisma/enums";
import { LocalizedText , LocalizedInput, LocalizedTextarea} from "@/components/locale-provider";

interface StatusUpdateProps {
    shipmentId: string;
    currentStatus: ShipmentStatus;
    role?: string;
}

export function StatusUpdate({
    shipmentId,
    currentStatus,
    role,
}: StatusUpdateProps) {
    const router = useRouter();
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
                router.refresh();
            } catch (caught) {
                setMessage(caught instanceof Error ? caught.message : "Failed to update shipment status.");
            }
        });
    }

    if (role !== "ADMIN" && role !== "MANAGER" && role !== "OPERATOR" && role !== "DRIVER") return null;

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label
                    htmlFor="shipment-status"
                    className="text-xs font-medium text-slate-600"
                >
                    <LocalizedText text={"\n                    Status\n                "} /></label>

                <select
                    id="shipment-status"
                    value={status}
                    onChange={(event) =>
                        setStatus(
                            event.target.value as typeof status,
                        )
                    }
                    className="mt-1 h-10 min-h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >
                    <option value={currentStatus}><LocalizedText text={currentStatus.replaceAll("_", " ")} /></option>

                    {shipmentStatuses
                        .filter((option) => option !== currentStatus)
                        .map((option) => (
                        <option
                            key={option}
                            value={option}
                            disabled={
                                !allowedShipmentTransitions[currentStatus].includes(option) ||
                                (role === "DRIVER" && option === "CANCELLED")
                            }
                        >
                            <LocalizedText text={option.replaceAll("_", " ")} />
                        </option>
                    ))}
                </select>
            </div>

            <div>
                <label
                    htmlFor="shipment-location"
                    className="text-xs font-medium text-slate-600"
                >
                    <LocalizedText text={"\n                    Location\n                "} /></label>

                <LocalizedInput
                    id="shipment-location"
                    value={location}
                    onChange={(event) =>
                        setLocation(event.target.value)
                    }
                    placeholder="e.g. Bekasi Warehouse"
                    className="mt-1 h-10 min-h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
            </div>

            <div>
                <label
                    htmlFor="shipment-description"
                    className="text-xs font-medium text-slate-600"
                >
                    <LocalizedText text={"\n                    Description\n                "} /></label>

                <LocalizedTextarea
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
                <LocalizedText text={isPending
                    ? "Updating..."
                    : "Update Status"} />
            </Button>

            {message && (
                <p role="status" className="text-xs text-slate-500">
                    {message}
                </p>
            )}
        </form>
    );
}
