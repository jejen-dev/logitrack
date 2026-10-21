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

async function requireCustomerManager(): Promise<string> {
    const session = await getServerSession(authOptions);
    const role = session?.user?.role;

    if (!role || !session?.user?.merchantId) throw new Error("Unauthorized");
    if (!["ADMIN", "MANAGER", "OPERATOR"].includes(role)) {
        throw new Error("Forbidden");
    }
    return session.user.merchantId;
}

function optionalText(value: unknown, label: string, maxLength: number) {
    if (typeof value !== "string") throw new Error(`${label} is invalid.`);
    const normalized = value.trim();
    if (normalized.length > maxLength) throw new Error(`${label} is too long.`);
    return normalized || null;
}

function validateCustomerInput(input: CustomerInput) {
    if (!input || typeof input.name !== "string") {
        throw new Error("Invalid customer data.");
    }

    const name = input.name.trim();
    if (!name) throw new Error("Customer name is required.");
    if (name.length > 120) throw new Error("Customer name is too long.");

    const email = optionalText(input.email, "Email", 254)?.toLowerCase() ?? null;
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        throw new Error("Invalid email format.");
    }

    return {
        name,
        email,
        phone: optionalText(input.phone, "Phone number", 40),
        address: optionalText(input.address, "Address", 300),
        city: optionalText(input.city, "City", 100),
        postalCode: optionalText(input.postalCode, "Postal code", 20),
    };
}

function revalidateCustomerPages() {
    revalidatePath("/customers");
    revalidatePath("/shipments/new");
}

export async function createCustomer(input: CustomerInput) {
    const merchantId = await requireCustomerManager();
    const data = validateCustomerInput(input);
    await prisma.customer.create({ data: { ...data, merchantId } });
    revalidateCustomerPages();
}

export async function updateCustomer(id: string, input: CustomerInput) {
    await requireCustomerManager();
    if (typeof id !== "string" || !id.trim()) throw new Error("Customer ID is required.");

    const data = validateCustomerInput(input);
    await prisma.customer.update({ where: { id }, data });
    revalidateCustomerPages();
}

export async function setCustomerActive(id: string, isActive: boolean) {
    await requireCustomerManager();
    if (typeof id !== "string" || !id.trim()) throw new Error("Customer ID is required.");
    if (typeof isActive !== "boolean") throw new Error("Invalid customer status.");

    await prisma.customer.update({ where: { id }, data: { isActive } });
    revalidateCustomerPages();
}
