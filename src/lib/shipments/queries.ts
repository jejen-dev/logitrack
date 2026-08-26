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