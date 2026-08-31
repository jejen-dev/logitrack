import { prisma } from "@/lib/prisma";

export async function getVehicles() {
    return prisma.vehicle.findMany({
        orderBy: {
            plateNumber: "asc",
        },
        select: {
            id: true,
            plateNumber: true,
            type: true,
            capacity: true,
            status: true,
        },
    });
}
