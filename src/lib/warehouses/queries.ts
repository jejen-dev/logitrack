import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth/auth-options";
import { prisma } from "@/lib/prisma";

export async function getWarehouses() {
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

    return prisma.warehouse.findMany({
        orderBy: {
            name: "asc",
        },
        select: {
            id: true,
            name: true,
            code: true,
            address: true,
            city: true,
            postalCode: true,

            _count: {
                select: {
                    inventoryItems: true,
                },
            },
        },
    });
}