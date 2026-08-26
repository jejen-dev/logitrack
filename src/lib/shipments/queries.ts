import { prisma } from "@/lib/prisma";

export async function getShipments() {
    return prisma.shipment.findMany({
        orderBy: {
            createdAt: "desc",
        },
        select: {
            id: true,
            trackingNumber: true,
            status: true,
            paymentStatus: true,
            originAddress: true,
            destinationAddress: true,
            createdAt: true,
            customer: {
                select: {
                    name: true,
                },
            },
            driver: {
                select: {
                    name: true,
                },
            },
        },
    });
}