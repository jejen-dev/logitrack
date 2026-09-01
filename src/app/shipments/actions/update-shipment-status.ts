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

    if (!input.shipmentId.trim()) {
        throw new Error("Shipment ID is required");
    }

    const validStatuses = [
        "PENDING",
        "PICKED_UP",
        "IN_TRANSIT",
        "OUT_FOR_DELIVERY",
        "DELIVERED",
        "CANCELLED",
    ] as const;

    if (!validStatuses.includes(input.status)) {
        throw new Error("Invalid shipment status");
    }

    if (
        input.location !== undefined &&
        input.location.length > 200
    ) {
        throw new Error("Location is too long");
    }

    if (
        input.description !== undefined &&
        input.description.length > 500
    ) {
        throw new Error("Description is too long");
    }

    const currentShipment = await prisma.shipment.findUnique({
        where: {
            id: input.shipmentId,
        },
        select: {
            status: true,
        },
    });

    if (!currentShipment) {
        throw new Error("Shipment not found");
    }

    if (input.status === currentShipment.status) {
        throw new Error("Shipment is already in this status");
    }

    const allowedTransitions: Record<
        typeof currentShipment.status,
        string[]
    > = {
        PENDING: [
            "PICKED_UP",
            "CANCELLED",
        ],
        PICKED_UP: [
            "IN_TRANSIT",
            "CANCELLED",
        ],
        IN_TRANSIT: [
            "OUT_FOR_DELIVERY",
            "CANCELLED",
        ],
        OUT_FOR_DELIVERY: [
            "DELIVERED",
            "CANCELLED",
        ],
        DELIVERED: [],
        CANCELLED: [],
    };

    if (
        !allowedTransitions[currentShipment.status].includes(
            input.status,
        )
    ) {
        throw new Error(
            `Cannot change shipment status from ${currentShipment.status} to ${input.status}`,
        );
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