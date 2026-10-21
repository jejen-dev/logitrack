"use server";

import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";

import { authOptions } from "@/lib/auth/auth-options";
import { prisma } from "@/lib/prisma";
import { vehicleTypes } from "@/lib/vehicles/vehicle-types";

interface VehicleInput {
    plateNumber: string;
    type: string;
    capacity: number;
}

async function requireVehicleManager(): Promise<string> {
    const session = await getServerSession(authOptions);
    const role = session?.user?.role;

    if (!role || !session?.user?.merchantId) throw new Error("Unauthorized");
    if (!["ADMIN", "MANAGER", "OPERATOR"].includes(role)) {
        throw new Error("Forbidden");
    }
    return session.user.merchantId;
}

function validateVehicleInput(input: VehicleInput) {
    if (
        !input ||
        typeof input.plateNumber !== "string" ||
        typeof input.type !== "string" ||
        (typeof input.capacity !== "number" && typeof input.capacity !== "string")
    ) {
        throw new Error("Invalid vehicle data.");
    }

    const plateNumber = input.plateNumber.trim().toUpperCase();
    const type = input.type.trim();
    const capacity = Number(input.capacity);

    if (!plateNumber || !vehicleTypes.includes(type as (typeof vehicleTypes)[number])) {
        throw new Error("Select a supported vehicle type.");
    }
    if (plateNumber.length > 20) {
        throw new Error("Vehicle information exceeds the allowed length.");
    }
    if (!Number.isFinite(capacity) || capacity <= 0) {
        throw new Error("Capacity must be a number greater than zero.");
    }

    return { plateNumber, type, capacity };
}

function revalidateVehiclePages() {
    revalidatePath("/vehicles");
    revalidatePath("/shipments/new");
}

export async function createVehicle(input: VehicleInput) {
    const merchantId = await requireVehicleManager();
    const data = validateVehicleInput(input);

    try {
        const vehicle = await prisma.vehicle.create({ data: { ...data, merchantId } });
        revalidateVehiclePages();
        return vehicle;
    } catch (error) {
        if (isUniqueConstraintError(error)) {
            throw new Error("This license plate is already registered.");
        }
        throw error;
    }
}

export async function updateVehicle(id: string, input: VehicleInput) {
    await requireVehicleManager();
    if (typeof id !== "string" || !id.trim()) throw new Error("Vehicle ID is required.");
    const data = validateVehicleInput(input);

    try {
        const vehicle = await prisma.vehicle.update({ where: { id }, data });
        revalidateVehiclePages();
        return vehicle;
    } catch (error) {
        if (isUniqueConstraintError(error)) {
            throw new Error("This license plate is already registered.");
        }
        throw error;
    }
}

export async function setVehicleActive(id: string, isActive: boolean) {
    await requireVehicleManager();
    if (typeof id !== "string" || !id.trim()) throw new Error("Vehicle ID is required.");
    if (typeof isActive !== "boolean") throw new Error("Invalid vehicle status.");

    if (!isActive) {
        const [vehicle, activeShipments] = await Promise.all([
            prisma.vehicle.findUnique({
                where: { id },
                select: { status: true },
            }),
            prisma.shipment.count({
                where: {
                    vehicleId: id,
                    status: {
                        in: ["PENDING", "PICKED_UP", "IN_TRANSIT", "OUT_FOR_DELIVERY"],
                    },
                },
            }),
        ]);

        if (!vehicle) throw new Error("Vehicle not found.");
        if (vehicle.status === "IN_USE" || activeShipments > 0) {
            throw new Error("The vehicle is assigned to an active shipment.");
        }
    }

    await prisma.vehicle.update({ where: { id }, data: { isActive } });
    revalidateVehiclePages();
}

function isUniqueConstraintError(error: unknown): boolean {
    return (
        typeof error === "object" &&
        error !== null &&
        "code" in error &&
        error.code === "P2002"
    );
}
