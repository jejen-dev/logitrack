# Shared application layout

## `src/app/layout.tsx`

Shared layout or page wrapper.

```tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "./globals.css";
import Providers from "@/components/providers";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "LogiTrack",
    template: "%s | LogiTrack",
  },
  description:
    "Modern logistics management for smarter operations.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.variable}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
```

## `src/components/layout/app-shell.tsx`

Shared layout or page wrapper.

```tsx
"use client";

import { useState } from "react";

import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import { cn } from "@/lib/utils";

interface AppShellProps {
    children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Desktop sidebar */}
            <div className="hidden md:fixed md:inset-y-0 md:left-0 md:z-40 md:flex">
                <Sidebar />
            </div>

            {/* Mobile sidebar overlay */}
            {sidebarOpen && (
                <button
                    type="button"
                    aria-label="Close navigation menu"
                    className="fixed inset-0 z-40 bg-slate-900/20 md:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Mobile sidebar */}
            <div
                className={cn(
                    "fixed inset-y-0 left-0 z-50 transition-transform duration-200 md:hidden",
                    sidebarOpen ? "translate-x-0" : "-translate-x-full",
                )}
            >
                <Sidebar />
            </div>

            {/* Main area */}
            <div className="md:pl-64">
                <Header onMenuClick={() => setSidebarOpen(true)} />

                <main className="min-h-[calc(100vh-4rem)]">
                    {children}
                </main>
            </div>
        </div>
    );
}
```

## `src/components/layout/sidebar.tsx`

Shared layout or page wrapper.

```tsx
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
    UserCog,
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
```

## `src/components/layout/header.tsx`

Shared layout or page wrapper.

```tsx
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
                        className="h-9 w-full rounded-md border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
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
                            className="absolute right-0 top-11 z-50 w-64 rounded-xl border border-slate-200 bg-white p-2 shadow-lg"
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
```

## `src/components/layout/breadcrumbs.tsx`

Shared layout or page wrapper.

```tsx
"use client";

import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

const routeLabels: Record<string, string> = {
    dashboard: "Dashboard",
    shipments: "Shipments",
    tracking: "Tracking",
    inventory: "Inventory",
    warehouses: "Warehouses",
    drivers: "Drivers",
    vehicles: "Vehicles",
    customers: "Customers",
    reports: "Reports",
    settings: "Settings",
};

function formatSegment(segment: string) {
    return (
        routeLabels[segment] ??
        segment
            .replace(/-/g, " ")
            .replace(/\b\w/g, (character) => character.toUpperCase())
    );
}

export function Breadcrumbs() {
    const pathname = usePathname();

    const segments = pathname.split("/").filter(Boolean);

    if (segments.length === 0) {
        return null;
    }

    return (
        <nav aria-label="Breadcrumb">
            <ol className="flex items-center gap-1.5 text-sm">
                <li>
                    <Link
                        href="/dashboard"
                        aria-label="Dashboard"
                        className="flex items-center text-slate-400 transition-colors hover:text-slate-700"
                    >
                        <Home className="h-3.5 w-3.5" />
                    </Link>
                </li>

                {segments.map((segment, index) => {
                    const href = `/${segments.slice(0, index + 1).join("/")}`;
                    const isLast = index === segments.length - 1;

                    return (
                        <li
                            key={href}
                            className="flex items-center gap-1.5"
                        >
                            <ChevronRight
                                aria-hidden="true"
                                className="h-3.5 w-3.5 text-slate-300"
                            />

                            {isLast ? (
                                <span
                                    aria-current="page"
                                    className={cn(
                                        "font-medium text-slate-700",
                                    )}
                                >
                                    {formatSegment(segment)}
                                </span>
                            ) : (
                                <Link
                                    href={href}
                                    className="text-slate-400 transition-colors hover:text-slate-700"
                                >
                                    {formatSegment(segment)}
                                </Link>
                            )}
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
}
```

## `src/components/shared/page-container.tsx`

Shared layout or page wrapper.

```tsx
import { cn } from "@/lib/utils";

interface PageContainerProps {
    children: React.ReactNode;
    className?: string;
}

export function PageContainer({
    children,
    className,
}: PageContainerProps) {
    return (
        <div
            className={cn(
                "mx-auto w-full max-w-7xl px-4 py-6 md:px-6 md:py-8",
                className,
            )}
        >
            {children}
        </div>
    );
}
```

## `src/components/shared/page-header.tsx`

Shared layout or page wrapper.

```tsx
import { Breadcrumbs } from "@/components/layout/breadcrumbs";

interface PageHeaderProps {
    title: string;
    description?: string;
    actions?: React.ReactNode;
}

export function PageHeader({
    title,
    description,
    actions,
}: PageHeaderProps) {
    return (
        <div className="mb-6">
            <Breadcrumbs />

            <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
                        {title}
                    </h1>

                    {description && (
                        <p className="mt-1.5 max-w-2xl text-sm text-slate-500">
                            {description}
                        </p>
                    )}
                </div>

                {actions && (
                    <div className="flex shrink-0 items-center gap-2">
                        {actions}
                    </div>
                )}
            </div>
        </div>
    );
}
```
