import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth/auth-options";
import { prisma } from "@/lib/prisma";

export async function getUsers() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || session.user.role !== "ADMIN") {
        throw new Error("Forbidden");
    }

    const users = await prisma.user.findMany({
        orderBy: [{ role: "asc" }, { email: "asc" }],
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            createdAt: true,
        },
    });
    return { currentUserId: session.user.id, users };
}
