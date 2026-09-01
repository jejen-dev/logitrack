import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth/auth-options";
import { prisma } from "@/lib/prisma";

export async function getShipmentFormData() {
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

    const [customers, drivers, vehicles] = await Promise.all([
        prisma.customer.findMany({
            orderBy: {
                name: "asc",
            },
            select: {
                id: true,
                name: true,
            },
        }),

        prisma.driver.findMany({
            where: {
                status: "AVAILABLE",
            },
            orderBy: {
                name: "asc",
            },
            select: {
                id: true,
                name: true,
            },
        }),

        prisma.vehicle.findMany({
            where: {
                status: "AVAILABLE",
            },
            orderBy: {
                plateNumber: "asc",
            },
            select: {
                id: true,
                plateNumber: true,
                type: true,
            },
        }),
    ]);

    return {
        customers,
        drivers,
        vehicles,
    };
}
