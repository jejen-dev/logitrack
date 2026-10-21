import type { ShipmentStatus } from "@/generated/prisma/enums";

export const shipmentStatuses: ShipmentStatus[] = [
    "PENDING",
    "PICKED_UP",
    "IN_TRANSIT",
    "OUT_FOR_DELIVERY",
    "DELIVERED",
    "CANCELLED",
];

export const allowedShipmentTransitions: Record<ShipmentStatus, ShipmentStatus[]> = {
    PENDING: ["PICKED_UP", "CANCELLED"],
    PICKED_UP: ["IN_TRANSIT", "CANCELLED"],
    IN_TRANSIT: ["OUT_FOR_DELIVERY", "CANCELLED"],
    OUT_FOR_DELIVERY: ["DELIVERED", "CANCELLED"],
    DELIVERED: [],
    CANCELLED: [],
};
