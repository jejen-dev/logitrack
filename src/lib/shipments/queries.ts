import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth/auth-options";
import { prisma } from "@/lib/prisma";
import type {
    PaymentStatus,
    ShipmentStatus,
} from "@/generated/prisma/enums";

interface GetShipmentsParams {
    search?: string;
    status?: ShipmentStatus;
    paymentStatus?: PaymentStatus;
}

export async function getShipments(
    params: GetShipmentsParams = {},
) {
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
    const { search, status, paymentStatus } = params;

    return prisma.shipment.findMany({
        where: {
            ...(status && {
                status,
            }),

            ...(paymentStatus && {
                paymentStatus,
            }),

            ...(search && {
                OR: [
                    {
                        trackingNumber: {
                            contains: search,
                            mode: "insensitive",
                        },
                    },
                    {
                        customer: {
                            name: {
                                contains: search,
                                mode: "insensitive",
                            },
                        },
                    },
                ],
            }),
        },

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