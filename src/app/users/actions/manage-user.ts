"use server";

import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";

import { authOptions } from "@/lib/auth/auth-options";
import { prisma } from "@/lib/prisma";
import type { UserRole } from "@/generated/prisma/enums";

const userRoles: UserRole[] = ["ADMIN", "MANAGER", "OPERATOR", "DRIVER"];

export async function updateUserRole(id: string, role: UserRole) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || session.user.role !== "ADMIN") {
        throw new Error("Forbidden");
    }
    if (typeof id !== "string" || !id.trim() || !userRoles.includes(role)) {
        throw new Error("Invalid user or role.");
    }

    await prisma.$transaction(async (tx) => {
        const user = await tx.user.findUnique({
            where: { id },
            select: { id: true, role: true },
        });
        if (!user) throw new Error("User not found.");
        if (user.role === role) return;
        if (user.id === session.user.id) {
            throw new Error("You cannot change your own role.");
        }
        if (user.role === "ADMIN" && role !== "ADMIN") {
            const adminCount = await tx.user.count({ where: { role: "ADMIN" } });
            if (adminCount <= 1) throw new Error("The last administrator cannot be demoted.");
        }

        const updated = await tx.user.updateMany({
            where: { id, role: user.role },
            data: { role },
        });
        if (updated.count !== 1) {
            throw new Error("This user's role changed in another request. Refresh and try again.");
        }
    }, { isolationLevel: "Serializable" });

    revalidatePath("/users");
}
