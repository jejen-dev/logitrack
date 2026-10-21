"use server";

import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";

import { authOptions } from "@/lib/auth/auth-options";
import { prisma } from "@/lib/prisma";
import { driverLicenseTypes } from "@/lib/drivers/license-types";

interface DriverInput {
    name: string;
    email: string;
    phone: string;
    licenseNo: string;
    licenseType: string;
}

async function requireDriverManager() {
    const session = await getServerSession(authOptions);
    const role = session?.user?.role;

    if (!role) {
        throw new Error("Unauthorized");
    }

    if (!["ADMIN", "MANAGER", "OPERATOR"].includes(role)) {
        throw new Error("Forbidden");
    }
}

function validateDriverInput(input: DriverInput) {
    if (
        !input ||
        typeof input.name !== "string" ||
        typeof input.email !== "string" ||
        typeof input.phone !== "string" ||
        typeof input.licenseNo !== "string" ||
        typeof input.licenseType !== "string"
    ) {
        throw new Error("Invalid driver data.");
    }

    const name = input.name.trim();
    const email = input.email.trim().toLowerCase();
    const phone = input.phone.trim();
    const licenseNo = input.licenseNo.trim();
    const licenseType = driverLicenseTypes.find((type) => type.value === input.licenseType)?.value;

    if (!name || !email || !phone || !licenseNo || !licenseType) {
        throw new Error("Name, email, phone number, license number, and license class are required.");
    }

    if (name.length > 120 || email.length > 254 || !/^\S+@\S+\.\S+$/.test(email) || phone.length > 40 || licenseNo.length > 60) {
        throw new Error("Enter a valid email and keep driver information within the allowed length.");
    }

    return { name, email, phone, licenseNo, licenseType };
}

function revalidateDriverPages() {
    revalidatePath("/drivers");
    revalidatePath("/shipments/new");
}

export async function createDriver(input: DriverInput) {
    await requireDriverManager();
    const data = validateDriverInput(input);

    try {
        const driver = await prisma.driver.create({ data });
        revalidateDriverPages();
        return driver;
    } catch (error) {
        if (isUniqueConstraintError(error)) {
            throw new Error("A driver with this email or license number already exists.");
        }
        throw error;
    }
}

export async function updateDriver(id: string, input: DriverInput) {
    await requireDriverManager();
    if (typeof id !== "string" || !id.trim()) throw new Error("Driver ID is required.");
    const data = validateDriverInput(input);

    try {
        const driver = await prisma.driver.update({
            where: { id },
            data,
        });
        revalidateDriverPages();
        return driver;
    } catch (error) {
        if (isUniqueConstraintError(error)) {
            throw new Error("A driver with this email or license number already exists.");
        }
        throw error;
    }
}

export async function setDriverActive(id: string, isActive: boolean) {
    await requireDriverManager();
    if (typeof id !== "string" || !id.trim()) throw new Error("Driver ID is required.");
    if (typeof isActive !== "boolean") throw new Error("Invalid driver status.");

    if (!isActive) {
        const [driver, activeShipments] = await Promise.all([
            prisma.driver.findUnique({
                where: { id },
                select: { status: true },
            }),
            prisma.shipment.count({
                where: {
                    driverId: id,
                    status: {
                        in: ["PENDING", "PICKED_UP", "IN_TRANSIT", "OUT_FOR_DELIVERY"],
                    },
                },
            }),
        ]);

        if (!driver) throw new Error("Driver not found.");
        if (driver.status === "ON_DELIVERY" || activeShipments > 0) {
            throw new Error("The driver is assigned to an active shipment.");
        }
    }

    await prisma.driver.update({
        where: { id },
        data: { isActive },
    });
    revalidateDriverPages();
}

function isUniqueConstraintError(error: unknown): boolean {
    return (
        typeof error === "object" &&
        error !== null &&
        "code" in error &&
        error.code === "P2002"
    );
}
