"use server";

import { revalidatePath } from "next/cache";

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
