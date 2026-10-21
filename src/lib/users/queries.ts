import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth/auth-options";
import { authPrisma } from "@/lib/prisma";

export async function getUsers() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || !session.user.merchantId || (session.user.role !== "ADMIN" && !session.user.isMerchantOwner)) {
        throw new Error("Forbidden");
    }

    const merchant = await authPrisma.merchant.findUnique({
        where: { id: session.user.merchantId },
        select: {
            id: true,
            name: true,
            ownerId: true,
            members: {
                orderBy: [{ role: "asc" }, { email: "asc" }],
                select: { id: true, name: true, email: true, role: true, createdAt: true },
            },
            invitations: {
                where: { acceptedAt: null, expiresAt: { gt: new Date() } },
                orderBy: { createdAt: "desc" },
                select: { email: true, role: true, expiresAt: true },
            },
        },
    });
    if (!merchant || (merchant.ownerId !== session.user.id && session.user.role !== "ADMIN")) {
        throw new Error("Forbidden");
    }
    return {
        currentUserId: session.user.id,
        ownerId: merchant.ownerId,
        merchantName: merchant.name,
        users: merchant.members,
        invitations: merchant.invitations,
    };
}
