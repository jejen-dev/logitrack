import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth/auth-options";
import { prisma } from "@/lib/prisma";

export async function getShipmentReport() {
    const session = await getServerSession(authOptions);

    if (!session?.user?.role) {
        throw new Error("Unauthorized");
    }

    const allowedRoles = [
        "ADMIN",
        "MANAGER",
    ];

    if (!allowedRoles.includes(session.user.role)) {
        throw new Error("Forbidden");
    }

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
