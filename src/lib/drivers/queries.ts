import { prisma } from "@/lib/prisma";

export async function getDrivers() {
    return prisma.driver.findMany({
        orderBy: {
            name: "asc",
        },
        select: {
            id: true,
            name: true,
            phone: true,
            licenseNo: true,
            status: true,
        },
    });
}
