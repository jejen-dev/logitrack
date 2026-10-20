"use server";

import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";

import { authOptions } from "@/lib/auth/auth-options";
import { prisma } from "@/lib/prisma";

interface CustomerInput {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    postalCode: string;
}

async function requireCustomerManager() {
    const session = await getServerSession(authOptions);
    const role = session?.user?.role;

    if (!role) throw new Error("Unauthorized");
    if (!["ADMIN", "MANAGER", "OPERATOR"].includes(role)) {
        throw new Error("Forbidden");
    }
}

function optionalText(value: unknown, label: string, maxLength: number) {
    if (typeof value !== "string") throw new Error(`${label} tidak valid.`);
    const normalized = value.trim();
    if (normalized.length > maxLength) throw new Error(`${label} terlalu panjang.`);
    return normalized || null;
}

function validateCustomerInput(input: CustomerInput) {
    if (!input || typeof input.name !== "string") {
        throw new Error("Data pelanggan tidak valid.");
    }

    const name = input.name.trim();
    if (!name) throw new Error("Nama pelanggan wajib diisi.");
    if (name.length > 120) throw new Error("Nama pelanggan terlalu panjang.");

    const email = optionalText(input.email, "Email", 254)?.toLowerCase() ?? null;
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        throw new Error("Format email tidak valid.");
    }

    return {
        name,
        email,
        phone: optionalText(input.phone, "Nomor telepon", 40),
        address: optionalText(input.address, "Alamat", 300),
        city: optionalText(input.city, "Kota", 100),
        postalCode: optionalText(input.postalCode, "Kode pos", 20),
    };
}

function revalidateCustomerPages() {
    revalidatePath("/customers");
    revalidatePath("/shipments/new");
}

export async function createCustomer(input: CustomerInput) {
    await requireCustomerManager();
    const data = validateCustomerInput(input);
    await prisma.customer.create({ data });
    revalidateCustomerPages();
}

export async function updateCustomer(id: string, input: CustomerInput) {
    await requireCustomerManager();
    if (typeof id !== "string" || !id.trim()) throw new Error("ID pelanggan wajib diisi.");

    const data = validateCustomerInput(input);
    await prisma.customer.update({ where: { id }, data });
    revalidateCustomerPages();
}

export async function setCustomerActive(id: string, isActive: boolean) {
    await requireCustomerManager();
    if (typeof id !== "string" || !id.trim()) throw new Error("ID pelanggan wajib diisi.");
    if (typeof isActive !== "boolean") throw new Error("Status pelanggan tidak valid.");

    await prisma.customer.update({ where: { id }, data: { isActive } });
    revalidateCustomerPages();
}
