"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { ShipmentForm } from "./new/shipment-form";
import { LocalizedText } from "@/components/locale-provider";

interface ShipmentCreateDialogProps {
    customers: { id: string; name: string }[];
    drivers: { id: string; name: string }[];
    vehicles: { id: string; plateNumber: string; type: string }[];
    inventoryItems: {
        id: string;
        sku: string;
        name: string;
        availableQuantity: number;
        warehouse: { name: string; code: string };
    }[];
}

export function ShipmentCreateDialog(props: ShipmentCreateDialogProps) {
    const [open, setOpen] = useState(false);

    return (
        <>
            <Button onClick={() => setOpen(true)}><LocalizedText text={"Create Shipment"} /></Button>
            <Modal
                open={open}
                onOpenChange={setOpen}
                title="Create Shipment"
                description="Enter shipment, delivery, and item details."
                className="max-w-5xl"
            >
                {open && <ShipmentForm {...props} onCancel={() => setOpen(false)} />}
            </Modal>
        </>
    );
}
