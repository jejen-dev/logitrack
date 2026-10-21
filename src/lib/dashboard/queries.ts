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
    const driverScope = session.user.role === "DRIVER"
        ? { driver: { email: session.user.email?.trim().toLowerCase() ?? "" } }
        : {};
    const [
        totalShipments,
        pendingShipments,
        inTransitShipments,
        deliveredShipments,
    ] = await Promise.all([
        prisma.shipment.count({ where: driverScope }),

        prisma.shipment.count({
            where: {
                ...driverScope,
                status: "PENDING",
            },
        }),

        prisma.shipment.count({
            where: {
                ...driverScope,
                status: "IN_TRANSIT",
            },
        }),

        prisma.shipment.count({
            where: {
                ...driverScope,
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

    const driverScope = session.user.role === "DRIVER"
        ? { driver: { email: session.user.email?.trim().toLowerCase() ?? "" } }
        : {};

    return prisma.shipment.findMany({
        where: driverScope,
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

    const driverScope = session.user.role === "DRIVER"
        ? { driver: { email: session.user.email?.trim().toLowerCase() ?? "" } }
        : {};
    const [
        pending,
        pickedUp,
        inTransit,
        outForDelivery,
        delivered,
        cancelled,
    ] = await Promise.all([
        prisma.shipment.count({
            where: { ...driverScope, status: "PENDING" },
        }),

        prisma.shipment.count({
            where: { ...driverScope, status: "PICKED_UP" },
        }),

        prisma.shipment.count({
            where: { ...driverScope, status: "IN_TRANSIT" },
        }),

        prisma.shipment.count({
            where: { ...driverScope, status: "OUT_FOR_DELIVERY" },
        }),

        prisma.shipment.count({
            where: { ...driverScope, status: "DELIVERED" },
        }),

        prisma.shipment.count({
            where: { ...driverScope, status: "CANCELLED" },
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