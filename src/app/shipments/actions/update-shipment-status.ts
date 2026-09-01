"use server";

import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";

import { authOptions } from "@/lib/auth/auth-options";
import { prisma } from "@/lib/prisma";

interface UpdateShipmentStatusInput {
    shipmentId: string;
    status:
    | "PENDING"
    | "PICKED_UP"
    | "IN_TRANSIT"
    | "OUT_FOR_DELIVERY"
    | "DELIVERED"
    | "CANCELLED";
    location?: string;
    description?: string;
}

export async function updateShipmentStatus(
    input: UpdateShipmentStatusInput,
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

    const shipment = await prisma.shipment.update({
        where: {
            id: input.shipmentId,
        },
        data: {
            status: input.status,

            shippedAt:
                input.status === "PICKED_UP"
                    ? new Date()
                    : undefined,

            deliveredAt:
                input.status === "DELIVERED"
                    ? new Date()
                    : undefined,

            trackingEvents: {
                create: {
                    status: input.status,
                    location: input.location || null,
                    description:
                        input.description ||
                        `Shipment status updated to ${input.status}`,
                },
            },
        },
    });

    revalidatePath("/shipments");
    revalidatePath(`/shipments/${input.shipmentId}`);
    revalidatePath("/dashboard");

    return shipment;
}