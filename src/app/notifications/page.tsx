import { Bell, CheckCheck, Package, Settings } from "lucide-react";
import Link from "next/link";

import { getNotifications } from "@/lib/notifications/queries";
import {
    markAllNotificationsRead,
    markNotificationRead,
} from "./actions";

function formatDate(date: Date) {
    return new Intl.DateTimeFormat("id-ID", {
        dateStyle: "medium",
        timeStyle: "short",
    }).format(date);
}

export default async function NotificationsPage() {
    const notifications = await getNotifications();
    const unreadCount = notifications.filter(
        (notification) => !notification.isRead,
    ).length;

    return (
        <div className="space-y-6">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2">
                        <Bell className="h-5 w-5" />
                        <h1 className="text-2xl font-semibold tracking-tight">
                            Notifications
                        </h1>
                    </div>

                    <p className="mt-1 text-sm text-muted-foreground">
                        {unreadCount > 0
                            ? `${unreadCount} unread notification${unreadCount > 1 ? "s" : ""
                            }`
                            : "You're all caught up."}
                    </p>
                </div>

                {unreadCount > 0 && (
                    <form action={markAllNotificationsRead}>
                        <button
                            type="submit"
                            className="inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm font-medium transition-colors hover:bg-muted"
                        >
                            <CheckCheck className="h-4 w-4" />
                            Mark all as read
                        </button>
                    </form>
                )}
            </div>

            {notifications.length === 0 ? (
                <div className="flex min-h-[300px] flex-col items-center justify-center rounded-xl border border-dashed">
                    <Bell className="mb-3 h-8 w-8 text-muted-foreground" />

                    <h2 className="font-medium">No notifications</h2>

                    <p className="mt-1 text-sm text-muted-foreground">
                        New notifications will appear here.
                    </p>
                </div>
            ) : (
                <div className="space-y-3">
                    {notifications.map((notification) => {
                        const content = (
                            <div
                                className={`flex gap-4 rounded-xl border p-4 transition-colors ${notification.isRead
                                        ? "bg-background"
                                        : "border-primary/20 bg-primary/5"
                                    }`}
                            >
                                <div
                                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${notification.type === "SHIPMENT"
                                            ? "bg-blue-100 text-blue-600"
                                            : "bg-muted text-muted-foreground"
                                        }`}
                                >
                                    {notification.type === "SHIPMENT" ? (
                                        <Package className="h-5 w-5" />
                                    ) : (
                                        <Settings className="h-5 w-5" />
                                    )}
                                </div>

                                <div className="min-w-0 flex-1">
                                    <div className="flex items-start justify-between gap-4">
                                        <div>
                                            <h2 className="font-medium">{notification.title}</h2>

                                            <p className="mt-1 text-sm text-muted-foreground">
                                                {notification.message}
                                            </p>
                                        </div>

                                        {!notification.isRead && (
                                            <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-primary" />
                                        )}
                                    </div>

                                    <p className="mt-3 text-xs text-muted-foreground">
                                        {formatDate(notification.createdAt)}
                                    </p>
                                </div>
                            </div>
                        );

                        if (
                            notification.shipmentId &&
                            notification.shipment?.trackingNumber
                        ) {
                            return (
                                <div key={notification.id}>
                                    {notification.isRead ? (
                                        <Link
                                            href={`/shipments/${notification.shipmentId}`}
                                            className="block"
                                        >
                                            {content}
                                        </Link>
                                    ) : (
                                        <form
                                            action={async () => {
                                                "use server";
                                                await markNotificationRead(notification.id);
                                            }}
                                        >
                                            <button type="submit" className="block w-full text-left">
                                                {content}
                                            </button>
                                        </form>
                                    )}
                                </div>
                            );
                        }

                        return (
                            <div key={notification.id}>
                                {notification.isRead ? (
                                    content
                                ) : (
                                    <form
                                        action={async () => {
                                            "use server";
                                            await markNotificationRead(notification.id);
                                        }}
                                    >
                                        <button type="submit" className="block w-full text-left">
                                            {content}
                                        </button>
                                    </form>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}