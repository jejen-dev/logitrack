"use server";

import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";

import { authOptions } from "@/lib/auth/auth-options";
import { prisma } from "@/lib/prisma";

interface WarehouseInput {
    name: string;
    code: string;
    address: string;
    city: string;
    postalCode: string;
}

async function requireWarehouseManager(): Promise<string> {
    const session = await getServerSession(authOptions);
    const role = session?.user?.role;
    if (!role || !session?.user?.merchantId) throw new Error("Unauthorized");
    if (!["ADMIN", "MANAGER", "OPERATOR"].includes(role)) throw new Error("Forbidden");
    return session.user.merchantId;
}

function validateWarehouseInput(input: WarehouseInput) {
    if (!input || typeof input !== "object") throw new Error("Invalid warehouse data.");
    for (const key of ["name", "code", "address", "city", "postalCode"] as const) {
        if (typeof input[key] !== "string") throw new Error("Invalid warehouse data.");
    }
    const data = {
        name: input.name.trim(),
        code: input.code.trim().toUpperCase(),
        address: input.address.trim(),
        city: input.city.trim(),
        postalCode: input.postalCode.trim(),
    };
    if (!data.name) throw new Error("Warehouse name is required.");
    if (data.name.length > 120 || data.code.length > 30 || data.address.length > 240 || data.city.length > 100 || data.postalCode.length > 20) {
        throw new Error("Warehouse information exceeds the allowed length.");
    }
    return {
        ...data,
        address: data.address || null,
        city: data.city || null,
        postalCode: data.postalCode || null,
    };
}

async function generateWarehouseCode(name: string) {
    const initials = name
        .normalize("NFKD")
        .replace(/[\u0300-\u036f]/g, "")
        .split(/[^a-zA-Z0-9]+/)
        .filter(Boolean)
        .map((word) => word[0])
        .join("")
        .toUpperCase()
        .slice(0, 6);
    const prefix = initials || "WH";
    const existingCodes = await prisma.warehouse.findMany({
        where: { code: { startsWith: `${prefix}-` } },
        select: { code: true },
    });
    const usedCodes = new Set(existingCodes.map(({ code }) => code));

    for (let sequence = 1; sequence <= 999_999; sequence += 1) {
        const code = `${prefix}-${String(sequence).padStart(3, "0")}`;
        if (!usedCodes.has(code)) return code;
    }

    throw new Error("Could not generate a warehouse code. Enter one manually.");
}

function isUniqueConstraintError(error: unknown): boolean {
    return typeof error === "object" && error !== null && "code" in error && error.code === "P2002";
}

async function saveWarehouse(operation: () => Promise<unknown>) {
    try {
        await operation();
    } catch (error) {
        if (isUniqueConstraintError(error)) throw new Error("This warehouse code is already in use.");
        throw error;
    }
    revalidatePath("/warehouses");
    revalidatePath("/inventory");
}

export async function createWarehouse(input: WarehouseInput) {
    const merchantId = await requireWarehouseManager();
    const data = validateWarehouseInput(input);
    if (data.code) {
        await saveWarehouse(() => prisma.warehouse.create({ data: { ...data, merchantId } }));
        return;
    }

    // Retry if another request claims the same generated code concurrently.
    for (let attempt = 0; attempt < 5; attempt += 1) {
        const code = await generateWarehouseCode(data.name);
        try {
            await prisma.warehouse.create({ data: { ...data, code, merchantId } });
            revalidatePath("/warehouses");
            revalidatePath("/inventory");
            return;
        } catch (error) {
            if (!isUniqueConstraintError(error)) throw error;
        }
    }
    throw new Error("Could not generate a unique warehouse code. Please try again.");
}

export async function updateWarehouse(id: string, input: WarehouseInput) {
    await requireWarehouseManager();
    if (typeof id !== "string" || !id.trim()) throw new Error("Warehouse ID is required.");
    const data = validateWarehouseInput(input);
    await saveWarehouse(() => prisma.warehouse.update({
        where: { id },
        data: { ...data, code: data.code || undefined },
    }));
}

export async function setWarehouseActive(id: string, isActive: boolean) {
    await requireWarehouseManager();
    if (typeof id !== "string" || !id.trim()) throw new Error("Warehouse ID is required.");
    if (typeof isActive !== "boolean") throw new Error("Invalid warehouse status.");
    await prisma.warehouse.update({ where: { id }, data: { isActive } });
    revalidatePath("/warehouses");
    revalidatePath("/inventory");
}
