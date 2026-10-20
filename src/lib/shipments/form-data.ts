import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth/auth-options";
import { prisma } from "@/lib/prisma";

export async function getShipmentFormData() {
    const session = await getServerSession(authOptions);

    if (!session?.user?.role) {
        throw new Error("Unauthorized");
    }

    const allowedRoles = [
        "ADMIN",
        "MANAGER",
        "OPERATOR",
    ];

    if (!allowedRoles.includes(session.user.role)) {
        throw new Error("Forbidden");
    }

    const [customers, drivers, vehicles, inventoryItems] = await Promise.all([
        prisma.customer.findMany({
            where: {
                isActive: true,
            },
            orderBy: {
                name: "asc",
            },
            select: {
                id: true,
                name: true,
            },
        }),

        prisma.driver.findMany({
            where: {
                isActive: true,
                status: "AVAILABLE",
            },
            orderBy: {
                name: "asc",
            },
            select: {
                id: true,
                name: true,
            },
        }),

        prisma.vehicle.findMany({
            where: {
                isActive: true,
                status: "AVAILABLE",
            },
            orderBy: {
                plateNumber: "asc",
            },
            select: {
                id: true,
                plateNumber: true,
                type: true,
            },
        }),

        prisma.inventoryItem.findMany({
            where: { warehouse: { isActive: true } },
            orderBy: { name: "asc" },
            select: {
                id: true,
                sku: true,
                name: true,
                quantity: true,
                reservedQuantity: true,
                warehouse: { select: { name: true, code: true } },
            },
        }),
    ]);

    return {
        customers,
        drivers,
        vehicles,
        inventoryItems: inventoryItems
            .filter((item) => item.quantity > item.reservedQuantity)
            .map((item) => ({ ...item, availableQuantity: item.quantity - item.reservedQuantity })),
    };
}
