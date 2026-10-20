"use server";

import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";

import { authOptions } from "@/lib/auth/auth-options";
import { prisma } from "@/lib/prisma";
import { driverLicenseTypes } from "@/lib/drivers/license-types";

interface DriverInput {
    name: string;
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
        typeof input.phone !== "string" ||
        typeof input.licenseNo !== "string" ||
        typeof input.licenseType !== "string"
    ) {
        throw new Error("Data driver tidak valid.");
    }

    const name = input.name.trim();
    const phone = input.phone.trim();
    const licenseNo = input.licenseNo.trim();
    const licenseType = driverLicenseTypes.find((type) => type.value === input.licenseType)?.value;

    if (!name || !phone || !licenseNo || !licenseType) {
        throw new Error("Nama, nomor telepon, nomor SIM, dan tipe SIM wajib diisi.");
    }

    if (name.length > 120 || phone.length > 40 || licenseNo.length > 60) {
        throw new Error("Panjang data driver melebihi batas.");
    }

    return { name, phone, licenseNo, licenseType };
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
            throw new Error("Nomor SIM sudah digunakan driver lain.");
        }
        throw error;
    }
}

export async function updateDriver(id: string, input: DriverInput) {
    await requireDriverManager();
    if (typeof id !== "string" || !id.trim()) throw new Error("ID driver wajib diisi.");
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
            throw new Error("Nomor SIM sudah digunakan driver lain.");
        }
        throw error;
    }
}

export async function setDriverActive(id: string, isActive: boolean) {
    await requireDriverManager();
    if (typeof id !== "string" || !id.trim()) throw new Error("ID driver wajib diisi.");
    if (typeof isActive !== "boolean") throw new Error("Status driver tidak valid.");

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

        if (!driver) throw new Error("Driver tidak ditemukan.");
        if (driver.status === "ON_DELIVERY" || activeShipments > 0) {
            throw new Error("Driver masih menangani shipment aktif.");
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
