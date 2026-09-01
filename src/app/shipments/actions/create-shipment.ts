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

    const shipment = await prisma.shipment.create({
        data: {
            trackingNumber: `LGT-${Date.now()}`,
            customerId: input.customerId,

            driverId: input.driverId || null,
            vehicleId: input.vehicleId || null,

            originAddress: input.originAddress,
            destinationAddress: input.destinationAddress,

            paymentStatus: input.paymentStatus,
            status: "PENDING",

            items: {
                create: {
                    productName: input.productName,
                    quantity: input.quantity,
                    weight: input.weight || null,
                },
            },
        },
    });

    revalidatePath("/shipments");
    revalidatePath("/dashboard");

    return shipment;
}