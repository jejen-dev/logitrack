import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth/auth-options";
import { prisma } from "@/lib/prisma";

export async function getTrackingEvents() {
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
