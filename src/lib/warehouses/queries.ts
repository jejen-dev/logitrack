import { prisma } from "@/lib/prisma";

export async function getWarehouses() {
    return prisma.warehouse.findMany({
        orderBy: {
            name: "asc",
        },
        select: {
            id: true,
            name: true,
            code: true,
            address: true,
            city: true,
            postalCode: true,

            _count: {
                select: {
                    inventoryItems: true,
                },
            },
        },
    });
}