"use server";

import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";

import { authOptions } from "@/lib/auth/auth-options";
import { prisma } from "@/lib/prisma";

interface InventoryItemInput {
    sku: string;
    name: string;
    quantity: number;
    reorderPoint: number;
    warehouseId: string;
}

async function requireInventoryManager() {
    const session = await getServerSession(authOptions);
    const role = session?.user?.role;
    if (!role) throw new Error("Unauthorized");
    if (!["ADMIN", "MANAGER", "OPERATOR"].includes(role)) throw new Error("Forbidden");
}

function validateInput(input: InventoryItemInput) {
    if (!input || typeof input !== "object" ||
        typeof input.sku !== "string" || typeof input.name !== "string" ||
        typeof input.warehouseId !== "string" ||
        !Number.isInteger(input.quantity) || !Number.isInteger(input.reorderPoint)) {
        throw new Error("Invalid inventory item data.");
    }
    const data = {
        sku: input.sku.trim().toUpperCase(),
        name: input.name.trim(),
        quantity: input.quantity,
        reorderPoint: input.reorderPoint,
        warehouseId: input.warehouseId.trim(),
    };
    if (!data.name || !data.warehouseId) throw new Error("Product name and warehouse are required.");
    if (data.sku.length > 80 || data.name.length > 160) throw new Error("Inventory item information exceeds the allowed length.");
    if (data.quantity < 0 || data.reorderPoint < 0) throw new Error("Quantity and reorder point cannot be negative.");
    return data;
}

function isUniqueConstraintError(error: unknown) {
    return typeof error === "object" && error !== null && "code" in error && error.code === "P2002";
}

async function requireActiveWarehouse(warehouseId: string, allowArchived = false) {
    const warehouse = await prisma.warehouse.findUnique({
        where: { id: warehouseId },
        select: { isActive: true },
    });
    if (!warehouse) throw new Error("Selected warehouse was not found.");
    if (!warehouse.isActive && !allowArchived) throw new Error("Choose an active warehouse for this inventory item.");
}

async function generateSku(name: string) {
    const initials = name
        .normalize("NFKD")
        .replace(/[\u0300-\u036f]/g, "")
        .split(/[^a-zA-Z0-9]+/)
        .filter(Boolean)
        .map((word) => word[0])
        .join("")
        .toUpperCase()
        .slice(0, 6);
    const prefix = `SKU-${initials || "ITEM"}`;
    const existingSkus = await prisma.inventoryItem.findMany({
        where: { sku: { startsWith: `${prefix}-` } },
        select: { sku: true },
    });
    const usedSkus = new Set(existingSkus.map(({ sku }) => sku));

    for (let sequence = 1; sequence <= 999_999; sequence += 1) {
        const sku = `${prefix}-${String(sequence).padStart(3, "0")}`;
        if (!usedSkus.has(sku)) return sku;
    }
    throw new Error("Could not generate an SKU. Enter one manually.");
}

export async function createInventoryItem(input: InventoryItemInput) {
    await requireInventoryManager();
    const data = validateInput(input);
    await requireActiveWarehouse(data.warehouseId);
    if (!data.sku) {
        for (let attempt = 0; attempt < 5; attempt += 1) {
            const sku = await generateSku(data.name);
            try {
                await prisma.inventoryItem.create({ data: { ...data, sku } });
                revalidatePath("/inventory");
                revalidatePath("/dashboard");
                return;
            } catch (error) {
                if (!isUniqueConstraintError(error)) throw error;
            }
        }
        throw new Error("Could not generate a unique SKU. Please try again.");
    }
    try {
        await prisma.inventoryItem.create({ data });
    } catch (error) {
        if (isUniqueConstraintError(error)) throw new Error("This SKU is already in use.");
        throw error;
    }
    revalidatePath("/inventory");
    revalidatePath("/dashboard");
}

export async function updateInventoryItem(id: string, input: InventoryItemInput) {
    await requireInventoryManager();
    if (typeof id !== "string" || !id.trim()) throw new Error("Inventory item ID is required.");
    const data = validateInput(input);
    const existing = await prisma.inventoryItem.findUnique({
        where: { id },
        select: { warehouseId: true, reservedQuantity: true },
    });
    if (!existing) throw new Error("Inventory item was not found.");
    await requireActiveWarehouse(data.warehouseId, data.warehouseId === existing.warehouseId);
    try {
        const updated = await prisma.inventoryItem.updateMany({
            where: { id, reservedQuantity: { lte: data.quantity } },
            data: { ...data, sku: data.sku || undefined },
        });
        if (updated.count !== 1) throw new Error("On-hand quantity cannot be lower than the quantity reserved for shipments.");
    } catch (error) {
        if (isUniqueConstraintError(error)) throw new Error("This SKU is already in use.");
        throw error;
    }
    revalidatePath("/inventory");
    revalidatePath("/dashboard");
}

export async function setInventoryItemActive(id: string, isActive: boolean) {
    await requireInventoryManager();
    if (typeof id !== "string" || !id.trim()) throw new Error("Inventory item ID is required.");
    if (typeof isActive !== "boolean") throw new Error("Invalid inventory item status.");

    const updated = await prisma.inventoryItem.updateMany({
        where: isActive
            ? { id, isActive: false }
            : { id, isActive: true, reservedQuantity: 0 },
        data: { isActive },
    });

    if (updated.count !== 1) {
        const item = await prisma.inventoryItem.findUnique({
            where: { id },
            select: { isActive: true, reservedQuantity: true },
        });
        if (!item) throw new Error("Inventory item was not found.");
        if (item.isActive === isActive) return;
        if (!isActive && item.reservedQuantity > 0) {
            throw new Error("Release this item's shipment reservations before archiving it.");
        }
        throw new Error("Inventory item status changed in another request. Refresh and try again.");
    }

    revalidatePath("/inventory");
    revalidatePath("/shipments/new");
}
