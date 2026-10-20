import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth/auth-options";
import { prisma } from "@/lib/prisma";
import type { ShipmentStatus } from "@/generated/prisma/enums";

interface GetTrackingEventsParams {
    search?: string;
    status?: ShipmentStatus;
}

export async function getTrackingEvents({ search, status }: GetTrackingEventsParams = {}) {
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
        where: {
            ...(status ? { status } : {}),
            ...(search ? {
                OR: [
                    { shipment: { trackingNumber: { contains: search, mode: "insensitive" } } },
                    { shipment: { customer: { name: { contains: search, mode: "insensitive" } } } },
                    { location: { contains: search, mode: "insensitive" } },
                    { description: { contains: search, mode: "insensitive" } },
                ],
            } : {}),
        },
        orderBy: { occurredAt: "desc" },
        select: {
            id: true,
            status: true,
            description: true,
            location: true,
            occurredAt: true,
            shipment: {
                select: {
                    id: true,
                    trackingNumber: true,
                    customer: { select: { name: true } },
                    destinationAddress: true,
                },
            },
        },
    });
}
