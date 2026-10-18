import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";
import { prisma } from "@/lib/prisma";

export async function getNotifications() {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        return [];
    }

    return prisma.notification.findMany({
        where: {
            userId: session.user.id,
        },
        include: {
            shipment: {
                select: {
                    id: true,
                    trackingNumber: true,
                    status: true,
                },
            },
        },
        orderBy: {
            createdAt: "desc",
        },
        take: 50,
    });
}

export async function getUnreadNotificationCount() {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        return 0;
    }

    return prisma.notification.count({
        where: {
            userId: session.user.id,
            isRead: false,
        },
    });
}

export async function markNotificationAsRead(notificationId: string) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        throw new Error("Unauthorized");
    }

    if (!notificationId || typeof notificationId !== "string") {
        throw new Error("Invalid notification ID");
    }

    const notification = await prisma.notification.findFirst({
        where: {
            id: notificationId,
            userId: session.user.id,
        },
        select: {
            id: true,
        },
    });

    if (!notification) {
        throw new Error("Notification not found");
    }

    return prisma.notification.update({
        where: {
            id: notification.id,
        },
        data: {
            isRead: true,
        },
    });
}

export async function markAllNotificationsAsRead() {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        throw new Error("Unauthorized");
    }

    return prisma.notification.updateMany({
        where: {
            userId: session.user.id,
            isRead: false,
        },
        data: {
            isRead: true,
        },
    });
}