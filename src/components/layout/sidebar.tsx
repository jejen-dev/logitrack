"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import {
    BarChart3,
    Boxes,
    Car,
    LayoutDashboard,
    MapPin,
    Package,
    Settings,
    Truck,
    Users,
    Warehouse,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { canAccessRoute } from "@/lib/auth/permissions";
import type { UserRole } from "@/generated/prisma/enums";

type NavigationItem = {
    label: string;
    href: string;
    icon: React.ComponentType<{ className?: string }>;
};

type NavigationSection = {
    label: string;
    items: NavigationItem[];
};

const navigation: NavigationSection[] = [
    {
        label: "Overview",
        items: [
            {
                label: "Dashboard",
                href: "/dashboard",
                icon: LayoutDashboard,
            },
        ],
    },
    {
        label: "Operations",
        items: [
            {
                label: "Shipments",
                href: "/shipments",
                icon: Package,
            },
            {
                label: "Tracking",
                href: "/tracking",
                icon: MapPin,
            },
            {
                label: "Inventory",
                href: "/inventory",
                icon: Boxes,
            },
            {
                label: "Warehouses",
                href: "/warehouses",
                icon: Warehouse,
            },
        ],
    },
    {
        label: "Resources",
        items: [
            {
                label: "Drivers",
                href: "/drivers",
                icon: Truck,
            },
            {
                label: "Vehicles",
                href: "/vehicles",
                icon: Car,
            },
            {
                label: "Customers",
                href: "/customers",
                icon: Users,
            },
        ],
    },
    {
        label: "Analytics",
        items: [
            {
                label: "Reports",
                href: "/reports",
                icon: BarChart3,
            },
        ],
    },
];

export function Sidebar() {
    const pathname = usePathname();
    const { data: session } = useSession();

    const role = session?.user?.role as UserRole | undefined;

    const visibleSections = navigation
        .map((section) => ({
            ...section,
            items: section.items.filter(
                (item) =>
                    role && canAccessRoute(item.href, role),
            ),
        }))
        .filter((section) => section.items.length > 0);

    const canAccessSettings =
        role && canAccessRoute("/settings", role);

    return (
        <aside className="flex h-screen w-64 shrink-0 flex-col border-r border-slate-200 bg-white">
            {/* Brand */}
            <div className="flex h-16 items-center border-b border-slate-200 px-5">
                <Link
                    href="/dashboard"
                    className="flex items-center gap-3"
                >
                    <div className="flex h-8 w-8 items-center justify-center rounded-md bg-blue-600">
                        <Truck className="h-4 w-4 text-white" />
                    </div>

                    <div>
                        <p className="text-sm font-semibold tracking-tight text-slate-900">
                            LogiTrack
                        </p>

                        <p className="text-[11px] text-slate-500">
                            Logistics Platform
                        </p>
                    </div>
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto px-3 py-5">
                <div className="space-y-6">
                    {visibleSections.map((section) => (
                        <div key={section.label}>
                            <div className="mb-2 px-2">
                                <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                                    {section.label}
                                </p>
                            </div>

                            <div className="space-y-1">
                                {section.items.map((item) => {
                                    const Icon = item.icon;

                                    const isActive =
                                        pathname === item.href ||
                                        pathname.startsWith(
                                            `${item.href}/`,
                                        );

                                    return (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            className={cn(
                                                "flex h-9 items-center gap-3 rounded-md px-3 text-sm font-medium",
                                                "transition-colors duration-150",
                                                isActive
                                                    ? "bg-blue-50 text-blue-700"
                                                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900",
                                            )}
                                        >
                                            <Icon className="h-4 w-4 shrink-0" />

                                            <span>{item.label}</span>
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            </nav>

            {/* Settings */}
            {canAccessSettings && (
                <div className="border-t border-slate-200 p-3">
                    <Link
                        href="/settings"
                        className={cn(
                            "flex h-9 items-center gap-3 rounded-md px-3 text-sm font-medium",
                            "text-slate-600 transition-colors duration-150",
                            "hover:bg-slate-50 hover:text-slate-900",
                        )}
                    >
                        <Settings className="h-4 w-4" />

                        <span>Settings</span>
                    </Link>
                </div>
            )}
        </aside>
    );
}