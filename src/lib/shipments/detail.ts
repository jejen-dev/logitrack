import { prisma } from "@/lib/prisma";

export async function getShipmentById(id: string) {
    return prisma.shipment.findUnique({
        where: {
            id,
        },
        include: {
            customer: true,
            driver: true,
            vehicle: true,
            items: true,
            trackingEvents: {
                orderBy: {
                    occurredAt: "desc",
                },
            },
        },
    });
}