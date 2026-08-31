import { prisma } from "@/lib/prisma";

export async function getCustomers() {
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
