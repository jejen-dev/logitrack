"use server";

import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";

import { authOptions } from "@/lib/auth/auth-options";
import { prisma } from "@/lib/prisma";

interface CreateShipmentInput {
    customerId: string;
    driverId?: string;
    vehicleId?: string;
    originAddress: string;
    destinationAddress: string;
    paymentStatus: "UNPAID" | "PAID" | "REFUNDED";
    productName: string;
    quantity: number;
    weight?: number;
}

export async function createShipment(
    input: CreateShipmentInput,
) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.role) {
        throw new Error("Unauthorized");
    }

    const allowedRoles = [
        "ADMIN",
        "MANAGER",
        "OPERATOR",
    ];

    if (!allowedRoles.includes(session.user.role)) {
        throw new Error("Forbidden");
    }

    if (!input.customerId.trim()) {
        throw new Error("Customer is required");
    }

    if (!input.originAddress.trim()) {
        throw new Error("Origin address is required");
    }

    if (!input.destinationAddress.trim()) {
        throw new Error("Destination address is required");
    }

    if (!input.productName.trim()) {
        throw new Error("Product name is required");
    }

    if (
        !Number.isInteger(input.quantity) ||
        input.quantity <= 0
    ) {
        throw new Error("Quantity must be a positive integer");
    }

    if (
        input.weight !== undefined &&
        (!Number.isFinite(input.weight) || input.weight < 0)
    ) {
        throw new Error(
            "Weight must be a valid non-negative number",
        );
    }

    const validPaymentStatuses = [
        "UNPAID",
        "PAID",
        "REFUNDED",
    ] as const;

    if (!validPaymentStatuses.includes(input.paymentStatus)) {
        throw new Error("Invalid payment status");
    }

    const customer = await prisma.customer.findUnique({
        where: {
            id: input.customerId,
        },
        select: {
            id: true,
        },
    });

    if (!customer) {
        throw new Error("Customer not found");
    }

    if (input.driverId) {
        const driver = await prisma.driver.findUnique({
            where: {
                id: input.driverId,
            },
            select: {
                id: true,
                status: true,
            },
        });

        if (!driver) {
            throw new Error("Driver not found");
        }

        if (driver.status !== "AVAILABLE") {
            throw new Error("Driver is not available");
        }
    }

    if (input.vehicleId) {
        const vehicle = await prisma.vehicle.findUnique({
            where: {
                id: input.vehicleId,
            },
            select: {
                id: true,
                status: true,
            },
        });

        if (!vehicle) {
            throw new Error("Vehicle not found");
        }

        if (vehicle.status !== "AVAILABLE") {
            throw new Error("Vehicle is not available");
        }
    }

    const shipment = await prisma.shipment.create({
        data: {
            trackingNumber: `LGT-${Date.now()}`,
            customerId: input.customerId,

            driverId: input.driverId || null,
            vehicleId: input.vehicleId || null,

            originAddress: input.originAddress.trim(),
            destinationAddress:
                input.destinationAddress.trim(),

            paymentStatus: input.paymentStatus,
            status: "PENDING",

            items: {
                create: {
                    productName: input.productName.trim(),
                    quantity: input.quantity,
                    weight:
                        input.weight !== undefined
                            ? input.weight
                            : null,
                },
            },
        },
    });

    revalidatePath("/shipments");
    revalidatePath("/dashboard");

    return shipment;
}