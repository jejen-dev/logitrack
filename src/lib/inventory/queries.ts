import { prisma } from "@/lib/prisma";

interface GetInventoryItemsParams {
    search?: string;
    warehouseId?: string;
    stockStatus?: "ALL" | "IN_STOCK" | "LOW_STOCK";
}

export async function getInventoryItems(
    params: GetInventoryItemsParams = {},
) {
    const { search, warehouseId, stockStatus = "ALL" } = params;

    const inventoryItems = await prisma.inventoryItem.findMany({
        where: {
            ...(search
                ? {
                    OR: [
                        {
                            sku: {
                                contains: search,
                                mode: "insensitive",
                            },
                        },
                        {
                            name: {
                                contains: search,
                                mode: "insensitive",
                            },
                        },
                    ],
                }
                : {}),

            ...(warehouseId
                ? {
                    warehouseId,
                }
                : {}),
        },

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
                    id: true,
                    name: true,
                    code: true,
                },
            },
        },
    });

    if (stockStatus === "ALL") {
        return inventoryItems;
    }

    return inventoryItems.filter((item) => {
        const isLowStock =
            item.quantity <= item.reorderPoint;

        return stockStatus === "LOW_STOCK"
            ? isLowStock
            : !isLowStock;
    });
}

export async function getInventoryWarehouses() {
    return prisma.warehouse.findMany({
        orderBy: {
            name: "asc",
        },
        select: {
            id: true,
            name: true,
            code: true,
        },
    });
}