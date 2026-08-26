import { prisma } from "@/lib/prisma";

export async function getShipmentFormData() {
    const [customers, drivers, vehicles] = await Promise.all([
        prisma.customer.findMany({
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
    ]);

    return {
        customers,
        drivers,
        vehicles,
    };
}
