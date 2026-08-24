"use client";

import { signOut, useSession } from "next-auth/react";
import {
    Bell,
    ChevronDown,
    Menu,
    Search,
} from "lucide-react";

import { Button } from "@/components/ui/button";

interface HeaderProps {
    onMenuClick?: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
    const { data: session } = useSession();
    const handleLogout = () => {
        signOut({
            callbackUrl: "/login",
        });
    };

    const userName = session?.user?.name ?? "User";
    const userRole = session?.user?.role ?? "USER";

    const initials = userName
        .split(" ")
        .map((name) => name[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();

    return (
        <header className="flex h-16 items-center border-b border-slate-200 bg-white px-4 md:px-6">
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

            {/* Search */}
            <div className="hidden flex-1 md:block">
                <div className="relative max-w-md">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                    <input
                        type="search"
                        placeholder="Search shipments, tracking numbers..."
                        className="h-9 w-full rounded-md border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                    />
                </div>
            </div>

            <div className="ml-auto flex items-center gap-2">
                {/* Notifications */}
                <Button
                    variant="ghost"
                    size="sm"
                    className="relative h-9 w-9 px-0"
                    aria-label="Notifications"
                >
                    <Bell className="h-4 w-4" />

                    <span
                        aria-label="2 unread notifications"
                        className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-blue-600"
                    />
                </Button>

                {/* User */}
                <div className="flex items-center gap-2">
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

                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleLogout}
                        className="text-xs text-slate-600 hover:text-slate-900"
                    >
                        Logout
                    </Button>
                </div>
            </div>
        </header>
    );
}