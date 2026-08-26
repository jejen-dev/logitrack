import { prisma } from "@/lib/prisma";

export async function getInventoryItems() {
    return prisma.inventoryItem.findMany({
        orderBy: {
            name: "asc",
        },
        select: {
            id: true,
            sku: true,
            name: true,
            quantity: true,
            reorderPoint: true,
            warehouse: {
                select: {
                    name: true,
                    code: true,
                },
            },
        },
    });
}
