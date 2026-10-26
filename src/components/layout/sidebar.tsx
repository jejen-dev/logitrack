"use client";

import Link, { useLinkStatus } from "next/link";
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
    UserCog,
    Warehouse,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { useLocale , LocalizedText} from "@/components/locale-provider";
import { canAccessRoute } from "@/lib/auth/permissions";
import type { UserRole } from "@/generated/prisma/enums";

export type NavigationItem = {
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
    {
        label: "Administration",
        items: [
            {
                label: "Users & Access",
                href: "/users",
                icon: UserCog,
            },
        ],
    },
];

// Navigation has no route-level loading screen, so show which link is pending instead.
function NavPendingIndicator() {
    const { pending } = useLinkStatus();

    return (
        <span
            aria-hidden="true"
            className={cn(
                "ml-auto h-3.5 w-3.5 shrink-0 rounded-full border-2 border-blue-500/25 border-t-blue-600",
                pending ? "animate-spin opacity-100" : "opacity-0",
            )}
        />
    );
}

export function isNavigationItemActive(pathname: string, href: string) {
    return pathname === href || pathname.startsWith(`${href}/`);
}

/** Navigation sections the current user may open, shared by the sidebar and the mobile tab bar. */
export function useNavigation() {
    const { data: session } = useSession();

    const role = session?.user?.role as UserRole | undefined;

    const visibleSections = navigation
        .map((section) => ({
            ...section,
            items: section.items.filter(
                (item) =>
                    role && (canAccessRoute(item.href, role) || (item.href === "/users" && session?.user?.isMerchantOwner === true)),
            ),
        }))
        .filter((section) => section.items.length > 0);

    const canAccessSettings =
        !!role && canAccessRoute("/settings", role);

    return { visibleSections, canAccessSettings };
}

export function Sidebar() {
    const pathname = usePathname();
    const { t } = useLocale();
    const { visibleSections, canAccessSettings } = useNavigation();

    return (
        <aside className="glass-surface flex h-dvh w-64 shrink-0 flex-col border-r pb-[env(safe-area-inset-bottom)] pt-[env(safe-area-inset-top)]">
            {/* Brand */}
            <div className="flex h-16 items-center border-b border-white/60 px-5">
                <Link
                    href="/dashboard"
                    className="flex items-center gap-3"
                >
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 shadow-lg shadow-blue-600/30 ring-1 ring-inset ring-white/30">
                        <Truck className="h-4 w-4 text-white" />
                    </div>

                    <div>
                        <p className="text-sm font-semibold tracking-tight text-slate-900">
                            <LocalizedText text={"\n                            LogiTrack\n                        "} /></p>

                        <p className="text-[11px] text-slate-500">
                            {t("Logistics Platform")}
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
                                    {t(section.label)}
                                </p>
                            </div>

                            <div className="space-y-1">
                                {section.items.map((item) => {
                                    const Icon = item.icon;

                                    const isActive = isNavigationItemActive(
                                        pathname,
                                        item.href,
                                    );

                                    return (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            className={cn(
                                                "flex h-9 items-center gap-3 rounded-xl px-3 text-sm font-medium",
                                                "transition-all duration-150",
                                                isActive
                                                    ? "bg-blue-600/10 text-blue-800 shadow-sm shadow-blue-600/10 ring-1 ring-inset ring-blue-500/20"
                                                    : "text-slate-600 hover:bg-white/65 hover:text-slate-900",
                                            )}
                                        >
                                            <Icon className="h-4 w-4 shrink-0" />

                                            <span>{t(item.label)}</span>

                                            <NavPendingIndicator />
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
                <div className="border-t border-white/60 p-3">
                    <Link
                        href="/settings"
                        className={cn(
                            "flex h-9 items-center gap-3 rounded-xl px-3 text-sm font-medium",
                            "transition-all duration-150",
                            pathname === "/settings"
                                ? "bg-blue-600/10 text-blue-800 shadow-sm shadow-blue-600/10 ring-1 ring-inset ring-blue-500/20"
                                : "text-slate-600 hover:bg-white/65 hover:text-slate-900",
                        )}
                    >
                        <Settings className="h-4 w-4" />

                        <span><LocalizedText text={"Settings"} /></span>

                        <NavPendingIndicator />
                    </Link>
                </div>
            )}
        </aside>
    );
}
