"use server";

import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";

import { authOptions } from "@/lib/auth/auth-options";
import { prisma } from "@/lib/prisma";
import { allowedShipmentTransitions } from "@/lib/shipments/status-transitions";
import type { ShipmentStatus } from "@/generated/prisma/enums";

interface UpdateShipmentStatusInput {
    shipmentId: string;
    status: ShipmentStatus;
    location?: string;
    description?: string;
}

export async function updateShipmentStatus(input: UpdateShipmentStatusInput) {
    const session = await getServerSession(authOptions);
    const role = session?.user?.role;
    if (!role) throw new Error("Unauthorized");
    if (!["ADMIN", "MANAGER", "OPERATOR", "DRIVER"].includes(role)) throw new Error("Forbidden");
    if (!input || typeof input.shipmentId !== "string" || !input.shipmentId.trim()) throw new Error("Shipment ID is required.");
    if (!Object.keys(allowedShipmentTransitions).includes(input.status)) throw new Error("Invalid shipment status.");
    if (role === "DRIVER" && input.status === "CANCELLED") throw new Error("Drivers cannot cancel shipments.");
    if (input.location !== undefined && (typeof input.location !== "string" || input.location.trim().length > 200)) throw new Error("Location must be 200 characters or fewer.");
    if (input.description !== undefined && (typeof input.description !== "string" || input.description.trim().length > 500)) throw new Error("Description must be 500 characters or fewer.");

    const location = input.location?.trim() || null;
    const description = input.description?.trim() || null;

    const updatedShipment = await prisma.$transaction(async (tx) => {
        const shipment = await tx.shipment.findUnique({
            where: { id: input.shipmentId },
            select: {
                id: true,
                trackingNumber: true,
                status: true,
                driverId: true,
                driver: { select: { email: true } },
                vehicleId: true,
                items: { select: { inventoryItemId: true, quantity: true } },
            },
        });
        if (!shipment) throw new Error("Shipment not found.");
        if (role === "DRIVER" && shipment.driver?.email !== session.user.email?.trim().toLowerCase()) {
            throw new Error("You can only update shipments assigned to you.");
        }
        if (!allowedShipmentTransitions[shipment.status].includes(input.status)) {
            throw new Error(`Cannot change shipment from ${shipment.status.replaceAll("_", " ")} to ${input.status.replaceAll("_", " ")}.`);
        }

        const changed = await tx.shipment.updateMany({
            where: { id: shipment.id, status: shipment.status },
            data: {
                status: input.status,
                shippedAt: input.status === "PICKED_UP" ? new Date() : undefined,
                deliveredAt: input.status === "DELIVERED" ? new Date() : undefined,
            },
        });
        if (changed.count !== 1) throw new Error("Shipment status changed in another request. Refresh and try again.");

        if (input.status === "PICKED_UP") {
            if (shipment.driverId) {
                const claimed = await tx.driver.updateMany({
                    where: { id: shipment.driverId, isActive: true, status: "ASSIGNED" },
                    data: { status: "ON_DELIVERY" },
                });
                if (claimed.count !== 1) throw new Error("The assigned driver is no longer available.");
            }
            if (shipment.vehicleId) {
                const claimed = await tx.vehicle.updateMany({
                    where: { id: shipment.vehicleId, isActive: true, status: "RESERVED" },
                    data: { status: "IN_USE" },
                });
                if (claimed.count !== 1) throw new Error("The assigned vehicle is no longer available.");
            }
            for (const item of shipment.items) {
                if (!item.inventoryItemId) continue;
                const consumed = await tx.inventoryItem.updateMany({
                    where: {
                        id: item.inventoryItemId,
                        quantity: { gte: item.quantity },
                        reservedQuantity: { gte: item.quantity },
                    },
                    data: {
                        quantity: { decrement: item.quantity },
                        reservedQuantity: { decrement: item.quantity },
                    },
                });
                if (consumed.count !== 1) throw new Error("Reserved inventory is unavailable. Contact an administrator.");
            }
        }

        if (input.status === "CANCELLED" && shipment.status === "PENDING") {
            if (shipment.driverId) {
                const released = await tx.driver.updateMany({ where: { id: shipment.driverId, status: "ASSIGNED" }, data: { status: "AVAILABLE" } });
                if (released.count !== 1) throw new Error("The assigned driver reservation could not be released.");
            }
            if (shipment.vehicleId) {
                const released = await tx.vehicle.updateMany({ where: { id: shipment.vehicleId, status: "RESERVED" }, data: { status: "AVAILABLE" } });
                if (released.count !== 1) throw new Error("The assigned vehicle reservation could not be released.");
            }
            for (const item of shipment.items) {
                if (!item.inventoryItemId) continue;
                const released = await tx.inventoryItem.updateMany({
                    where: { id: item.inventoryItemId, reservedQuantity: { gte: item.quantity } },
                    data: { reservedQuantity: { decrement: item.quantity } },
                });
                if (released.count !== 1) throw new Error("Shipment reservation could not be released. Contact an administrator.");
            }
        }

        if (input.status === "DELIVERED" || (input.status === "CANCELLED" && shipment.status !== "PENDING")) {
            if (shipment.driverId) {
                await tx.driver.updateMany({ where: { id: shipment.driverId, status: "ON_DELIVERY" }, data: { status: "AVAILABLE" } });
            }
            if (shipment.vehicleId) {
                await tx.vehicle.updateMany({ where: { id: shipment.vehicleId, status: "IN_USE" }, data: { status: "AVAILABLE" } });
            }
        }

        const stockAuditNote = input.status === "PICKED_UP" && shipment.items.some((item) => item.inventoryItemId)
            ? "Reserved inventory was deducted from on-hand stock."
            : input.status === "CANCELLED" && shipment.status === "PENDING" && shipment.items.some((item) => item.inventoryItemId)
                ? "Inventory reservations were released."
                : input.status === "CANCELLED" && shipment.status !== "PENDING" && shipment.items.some((item) => item.inventoryItemId)
                    ? "Shipment was cancelled after pickup; deducted stock was not restored."
                    : null;

        await tx.trackingEvent.create({
            data: {
                shipmentId: shipment.id,
                status: input.status,
                location,
                description: [description, stockAuditNote]
                    .filter(Boolean)
                    .join(" ") || `Shipment status updated to ${input.status.replaceAll("_", " ")}.`,
            },
        });

        const users = await tx.user.findMany({
            where: { role: { in: ["ADMIN", "MANAGER", "OPERATOR"] } },
            select: { id: true },
        });
        if (users.length > 0) {
            await tx.notification.createMany({
                data: users.map((user) => ({
                    userId: user.id,
                    shipmentId: shipment.id,
                    type: "SHIPMENT" as const,
                    title: "Shipment status updated",
                    message: `Shipment ${shipment.trackingNumber} is now ${input.status.replaceAll("_", " ")}.`,
                })),
            });
        }
        return { id: shipment.id, trackingNumber: shipment.trackingNumber };
    });

    revalidatePath("/shipments");
    revalidatePath("/shipments/new");
    revalidatePath(`/shipments/${input.shipmentId}`);
    revalidatePath("/tracking");
    revalidatePath("/inventory");
    revalidatePath("/drivers");
    revalidatePath("/vehicles");
    revalidatePath("/dashboard");
    revalidatePath("/notifications");
    return updatedShipment;
}
