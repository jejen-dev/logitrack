"use client";

import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { useLocale } from "@/components/locale-provider";

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
    const { t } = useLocale();

    const segments = pathname.split("/").filter(Boolean);

    if (segments.length === 0) {
        return null;
    }

    return (
        <nav aria-label={t("Breadcrumb")}>
            <ol className="flex items-center gap-1.5 text-sm">
                <li>
                    <Link
                        href="/dashboard"
                        aria-label={t("Dashboard")}
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
                                    {t(formatSegment(segment))}
                                </span>
                            ) : (
                                <Link
                                    href={href}
                                    className="text-slate-400 transition-colors hover:text-slate-700"
                                >
                                    {t(formatSegment(segment))}
                                </Link>
                            )}
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
}
