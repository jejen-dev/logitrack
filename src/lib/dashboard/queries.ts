import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth/auth-options";
import { prisma } from "@/lib/prisma";

export async function getDashboardStats() {
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
    const [
        totalShipments,
        pendingShipments,
        inTransitShipments,
        deliveredShipments,
    ] = await Promise.all([
        prisma.shipment.count(),

        prisma.shipment.count({
            where: {
                status: "PENDING",
            },
        }),

        prisma.shipment.count({
            where: {
                status: "IN_TRANSIT",
            },
        }),

        prisma.shipment.count({
            where: {
                status: "DELIVERED",
            },
        }),
    ]);

    return {
        totalShipments,
        pendingShipments,
        inTransitShipments,
        deliveredShipments,
    };
}

export async function getRecentShipments() {
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

    return prisma.shipment.findMany({
        orderBy: {
            createdAt: "desc",
        },
        take: 5,
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
        },
    });
}

export async function getShipmentStatusOverview() {
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

    const [
        pending,
        pickedUp,
        inTransit,
        outForDelivery,
        delivered,
        cancelled,
    ] = await Promise.all([
        prisma.shipment.count({
            where: { status: "PENDING" },
        }),

        prisma.shipment.count({
            where: { status: "PICKED_UP" },
        }),

        prisma.shipment.count({
            where: { status: "IN_TRANSIT" },
        }),

        prisma.shipment.count({
            where: { status: "OUT_FOR_DELIVERY" },
        }),

        prisma.shipment.count({
            where: { status: "DELIVERED" },
        }),

        prisma.shipment.count({
            where: { status: "CANCELLED" },
        }),
    ]);

    return [
        {
            label: "Pending",
            value: pending,
        },
        {
            label: "Picked Up",
            value: pickedUp,
        },
        {
            label: "In Transit",
            value: inTransit,
        },
        {
            label: "Out for Delivery",
            value: outForDelivery,
        },
        {
            label: "Delivered",
            value: delivered,
        },
        {
            label: "Cancelled",
            value: cancelled,
        },
    ];
}