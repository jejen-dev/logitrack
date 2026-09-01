import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth/auth-options";
import { prisma } from "@/lib/prisma";

export async function getShipmentById(id: string) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.role) {
        throw new Error("Unauthorized");
    }

    const allowedRoles = [
        "ADMIN",
        "MANAGER",
        "OPERATOR",
        "DRIVER",
    ];

    if (!allowedRoles.includes(session.user.role)) {
        throw new Error("Forbidden");
    }

    if (!id.trim()) {
        throw new Error("Shipment ID is required");
    }

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