import { prisma } from "@/lib/prisma";

export async function getTrackingEvents() {
    return prisma.trackingEvent.findMany({
        orderBy: {
            createdAt: "desc",
        },
        select: {
            id: true,
            status: true,
            description: true,
            location: true,
            createdAt: true,
            shipment: {
                select: {
                    trackingNumber: true,
                },
            },
        },
    });
}
