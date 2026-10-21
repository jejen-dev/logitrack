"use client";

import { FormEvent, useEffect, useState } from "react";
import { signOut, useSession } from "next-auth/react";
import {
    Bell,
    ChevronDown,
    Menu,
    Search,
    User,
} from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

interface HeaderProps {
    onMenuClick?: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
    const router = useRouter();
    const { data: session } = useSession();

    const [search, setSearch] = useState("");
    const [accountOpen, setAccountOpen] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        let active = true;

        const fetchUnreadCount = async () => {
            try {
                const response = await fetch(
                    "/api/notifications/unread",
                    {
                        cache: "no-store",
                    },
                );

                if (!response.ok) {
                    return;
                }

                const data: { count?: number } =
                    await response.json();

                if (active) {
                    setUnreadCount(
                        typeof data.count === "number"
                            ? data.count
                            : 0,
                    );
                }
            } catch {
                // Ignore notification polling errors.
            }
        };

        fetchUnreadCount();

        const interval = window.setInterval(
            fetchUnreadCount,
            30_000,
        );

        return () => {
            active = false;
            window.clearInterval(interval);
        };
    }, []);

    const handleLogout = async () => {
        await signOut({
            callbackUrl: "/login",
        });
    };

    const handleSearch = (
        event: FormEvent<HTMLFormElement>,
    ) => {
        event.preventDefault();

        const value = search.trim();

        if (!value) {
            router.push("/shipments");
            return;
        }

        router.push(
            `/shipments?search=${encodeURIComponent(value)}`,
        );
    };

    const userName = session?.user?.name ?? "User";
    const userEmail = session?.user?.email ?? "";
    const userRole = session?.user?.role ?? "USER";

    const initials =
        userName
            .split(" ")
            .filter(Boolean)
            .map((name) => name[0])
            .join("")
            .slice(0, 2)
            .toUpperCase() || "U";

    return (
        <header className="glass-surface sticky top-0 z-30 flex h-16 items-center border-x-0 border-t-0 border-b-white/70 bg-white/65 px-4 backdrop-blur-xl md:px-6">
            {/* Mobile menu */}
            <Button
                variant="ghost"
                size="sm"
                className="mr-2 md:hidden"
                aria-label="Open navigation menu"
                onClick={onMenuClick}
            >
                <Menu className="h-5 w-5" />
            </Button>

            {/* Global Search */}
            <div className="hidden flex-1 md:block">
                <form
                    onSubmit={handleSearch}
                    className="relative max-w-md"
                >
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                    <input
                        type="search"
                        value={search}
                        onChange={(event) =>
                            setSearch(event.target.value)
                        }
                        placeholder="Search shipments, tracking numbers..."
                        aria-label="Search shipments"
                        className="h-10 min-h-10 w-full rounded-lg border border-white/80 bg-white/60 pl-9 pr-3 text-sm text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-blue-500 focus:bg-white/90 focus:ring-2 focus:ring-blue-100"
                    />
                </form>
            </div>

            <div className="ml-auto flex items-center gap-2">
                {/* Notifications */}
                <Button
                    variant="ghost"
                    size="sm"
                    className="relative h-9 w-9 px-0"
                    aria-label={
                        unreadCount > 0
                            ? `${unreadCount} unread notifications`
                            : "Notifications"
                    }
                    onClick={() => {
                        router.push("/notifications");
                    }}
                >
                    <Bell className="h-4 w-4" />

                    {unreadCount > 0 && (
                        <span
                            aria-hidden="true"
                            className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-blue-600"
                        />
                    )}
                </Button>

                {/* Account */}
                <div className="relative">
                    <button
                        type="button"
                        onClick={() =>
                            setAccountOpen((open) => !open)
                        }
                        className="flex items-center gap-2 rounded-lg px-2 py-1.5 outline-none transition-colors hover:bg-slate-50 focus:ring-2 focus:ring-blue-100"
                        aria-expanded={accountOpen}
                        aria-haspopup="menu"
                    >
                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-900 text-xs font-semibold text-white">
                            {initials}
                        </div>

                        <div className="hidden text-left sm:block">
                            <p className="text-xs font-medium text-slate-900">
                                {userName}
                            </p>

                            <p className="text-[11px] text-slate-500">
                                {userRole}
                            </p>
                        </div>

                        <ChevronDown className="hidden h-4 w-4 text-slate-400 sm:block" />
                    </button>

                    {accountOpen && (
                        <div
                            className="glass-surface absolute right-0 top-11 z-50 w-64 rounded-xl border border-white/80 bg-white/85 p-2 shadow-lg"
                            role="menu"
                        >
                            <div className="border-b border-slate-100 px-3 py-3">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-xs font-semibold text-white">
                                        {initials}
                                    </div>

                                    <div className="min-w-0">
                                        <p className="truncate text-sm font-semibold text-slate-900">
                                            {userName}
                                        </p>

                                        <p className="truncate text-xs text-slate-500">
                                            {userEmail}
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-3 rounded-md bg-slate-50 px-3 py-2">
                                    <p className="text-[10px] font-medium uppercase tracking-wide text-slate-400">
                                        Role
                                    </p>

                                    <p className="mt-0.5 text-xs font-semibold text-slate-700">
                                        {userRole}
                                    </p>
                                </div>
                            </div>

                            <button
                                type="button"
                                role="menuitem"
                                onClick={() => {
                                    setAccountOpen(false);
                                    router.push("/settings");
                                }}
                                className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                            >
                                <User className="h-4 w-4" />
                                Account Settings
                            </button>

                            <button
                                type="button"
                                role="menuitem"
                                onClick={handleLogout}
                                className="flex w-full items-center rounded-md px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                            >
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
