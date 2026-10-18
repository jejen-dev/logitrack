"use server";

import {
    markAllNotificationsAsRead,
    markNotificationAsRead,
} from "@/lib/notifications/queries";

export async function markNotificationRead(notificationId: string) {
    await markNotificationAsRead(notificationId);
}

export async function markAllNotificationsRead() {
    await markAllNotificationsAsRead();
}