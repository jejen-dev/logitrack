import { prisma } from "@/lib/prisma";

export async function getShipmentReport() {
    const [
        totalShipments,
        pendingShipments,
        pickedUpShipments,
        inTransitShipments,
        outForDeliveryShipments,
        deliveredShipments,
        cancelledShipments,
    ] = await Promise.all([
        prisma.shipment.count(),

        prisma.shipment.count({
            where: {
                status: "PENDING",
            },
        }),

        prisma.shipment.count({
            where: {
                status: "PICKED_UP",
            },
        }),

        prisma.shipment.count({
            where: {
                status: "IN_TRANSIT",
            },
        }),

        prisma.shipment.count({
            where: {
                status: "OUT_FOR_DELIVERY",
            },
        }),

        prisma.shipment.count({
            where: {
                status: "DELIVERED",
            },
        }),

        prisma.shipment.count({
            where: {
                status: "CANCELLED",
            },
        }),
    ]);

    return {
        totalShipments,
        pendingShipments,
        pickedUpShipments,
        inTransitShipments,
        outForDeliveryShipments,
        deliveredShipments,
        cancelledShipments,
    };
}
