import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth/auth-options";
import { prisma } from "@/lib/prisma";

const allowedRoles = [
    "ADMIN",
    "MANAGER",
    "OPERATOR",
] as const;

export async function getCustomers() {
    const session = await getServerSession(authOptions);

    if (!session?.user?.role) {
        throw new Error("Unauthorized");
    }

    if (!allowedRoles.includes(session.user.role as typeof allowedRoles[number])) {
        throw new Error("Forbidden");
    }

    return prisma.customer.findMany({
        orderBy: {
            name: "asc",
        },
        select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            address: true,
            city: true,
            postalCode: true,
        },
    });
}