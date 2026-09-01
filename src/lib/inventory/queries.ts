import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth/auth-options";
import { prisma } from "@/lib/prisma";

interface GetInventoryItemsParams {
    search?: string;
    warehouseId?: string;
    stockStatus?: "ALL" | "IN_STOCK" | "LOW_STOCK";
}

export async function getInventoryItems(
    params: GetInventoryItemsParams = {},
) {
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