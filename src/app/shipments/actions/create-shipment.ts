"use server";

import { randomBytes } from "node:crypto";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";

import { authOptions } from "@/lib/auth/auth-options";
import { prisma } from "@/lib/prisma";

interface CreateShipmentInput {
    customerId: string;
    driverId?: string;
    vehicleId?: string;
    inventoryItemId?: string;
    originAddress: string;
    destinationAddress: string;
    paymentStatus: "UNPAID" | "PAID" | "REFUNDED";
    productName: string;
    quantity: number;
    weight?: number;
}

export async function createShipment(input: CreateShipmentInput) {
    const session = await getServerSession(authOptions);
    const role = session?.user?.role;
    if (!role) throw new Error("Unauthorized");
    if (!["ADMIN", "MANAGER", "OPERATOR"].includes(role)) throw new Error("Forbidden");

    if (!input || typeof input !== "object" ||
        typeof input.customerId !== "string" || typeof input.originAddress !== "string" ||
        typeof input.destinationAddress !== "string" || typeof input.productName !== "string" ||
        (input.driverId !== undefined && typeof input.driverId !== "string") ||
        (input.vehicleId !== undefined && typeof input.vehicleId !== "string") ||
        (input.inventoryItemId !== undefined && typeof input.inventoryItemId !== "string")) {
        throw new Error("Invalid shipment data.");
    }

    const customerId = input.customerId.trim();
    const originAddress = input.originAddress.trim();
    const destinationAddress = input.destinationAddress.trim();
    const productName = input.productName.trim();
    const driverId = input.driverId?.trim() || undefined;
    const vehicleId = input.vehicleId?.trim() || undefined;
    const inventoryItemId = input.inventoryItemId?.trim() || undefined;

    if (!customerId || !originAddress || !destinationAddress) throw new Error("Customer, origin, and destination are required.");
    if (!inventoryItemId && !productName) throw new Error("Product name is required for manual shipment items.");
    if (!Number.isInteger(input.quantity) || input.quantity <= 0) throw new Error("Quantity must be a positive integer.");
    if (input.weight !== undefined && (!Number.isFinite(input.weight) || input.weight < 0)) throw new Error("Weight must be a valid non-negative number.");
    if (!["UNPAID", "PAID", "REFUNDED"].includes(input.paymentStatus)) throw new Error("Invalid payment status.");
    if (originAddress.length > 300 || destinationAddress.length > 300 || productName.length > 160) throw new Error("Shipment information exceeds the allowed length.");

    const trackingNumber = `LGT-${Date.now()}-${randomBytes(4).toString("hex").toUpperCase()}`;

    const shipment = await prisma.$transaction(async (tx) => {
        const customer = await tx.customer.findUnique({
            where: { id: customerId },
            select: { isActive: true },
        });
        if (!customer) throw new Error("Customer not found.");
        if (!customer.isActive) throw new Error("Customer is inactive.");

        if (driverId) {
            const assigned = await tx.driver.updateMany({
                where: { id: driverId, isActive: true, status: "AVAILABLE" },
                data: { status: "ASSIGNED" },
            });
            if (assigned.count !== 1) throw new Error("Driver is no longer available.");
        }

        if (vehicleId) {
            const vehicle = await tx.vehicle.findUnique({
                where: { id: vehicleId },
                select: { capacity: true, isActive: true, status: true },
            });
            if (!vehicle || !vehicle.isActive || vehicle.status !== "AVAILABLE") throw new Error("Vehicle is no longer available.");
            if (input.weight !== undefined && input.weight > vehicle.capacity) {
                throw new Error(`Shipment weight exceeds the vehicle capacity of ${vehicle.capacity} kg.`);
            }
            const reserved = await tx.vehicle.updateMany({
                where: { id: vehicleId, isActive: true, status: "AVAILABLE" },
                data: { status: "RESERVED" },
            });
            if (reserved.count !== 1) throw new Error("Vehicle is no longer available.");
        }

        let itemName = productName;
        if (inventoryItemId) {
            const inventoryItem = await tx.inventoryItem.findUnique({
                where: { id: inventoryItemId },
                select: { name: true, warehouse: { select: { isActive: true } } },
            });
            if (!inventoryItem) throw new Error("Inventory item not found.");
            if (!inventoryItem.warehouse.isActive) throw new Error("The item's warehouse is inactive.");

            const reserved = await tx.$executeRaw`
                UPDATE "InventoryItem"
                SET "reservedQuantity" = "reservedQuantity" + ${input.quantity}, "updatedAt" = CURRENT_TIMESTAMP
                WHERE "id" = ${inventoryItemId}
                    AND "quantity" - "reservedQuantity" >= ${input.quantity}
                    AND EXISTS (
                        SELECT 1 FROM "Warehouse"
                        WHERE "Warehouse"."id" = "InventoryItem"."warehouseId"
                            AND "Warehouse"."isActive" = true
                    )
            `;
            if (reserved !== 1) throw new Error("There is not enough available stock for this shipment.");
            itemName = inventoryItem.name;
        }

        const createdShipment = await tx.shipment.create({
            data: {
                trackingNumber,
                customerId,
                driverId: driverId ?? null,
                vehicleId: vehicleId ?? null,
                originAddress,
                destinationAddress,
                paymentStatus: input.paymentStatus,
                status: "PENDING",
                items: {
                    create: {
                        productName: itemName,
                        quantity: input.quantity,
                        weight: input.weight ?? null,
                        inventoryItemId: inventoryItemId ?? null,
                    },
                },
                trackingEvents: {
                    create: {
                        status: "PENDING",
                        location: originAddress,
                        description: inventoryItemId
                            ? "Shipment created. Inventory stock reserved."
                            : "Shipment created and ready for processing.",
                    },
                },
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
                    shipmentId: createdShipment.id,
                    type: "SHIPMENT" as const,
                    title: "New shipment created",
                    message: `Shipment ${createdShipment.trackingNumber} has been created and is pending.`,
                })),
            });
        }
        return createdShipment;
    });

    revalidatePath("/shipments");
    revalidatePath("/shipments/new");
    revalidatePath("/tracking");
    revalidatePath("/inventory");
    revalidatePath("/drivers");
    revalidatePath("/vehicles");
    revalidatePath("/dashboard");
    revalidatePath("/notifications");
    return shipment;
}
