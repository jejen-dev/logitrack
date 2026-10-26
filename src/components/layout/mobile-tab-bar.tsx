"use client";

import Link, { useLinkStatus } from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";

import { cn } from "@/lib/utils";
import { useLocale } from "@/components/locale-provider";
import {
    isNavigationItemActive,
    useNavigation,
} from "@/components/layout/sidebar";

const PRIMARY_TAB_COUNT = 4;

const tabClassName =
    "flex min-w-0 flex-1 flex-col items-center justify-center gap-1 rounded-2xl py-1.5 text-[11px] font-medium transition-colors duration-150";

function TabIcon({
    icon: Icon,
    isActive,
}: {
    icon: React.ComponentType<{ className?: string }>;
    isActive: boolean;
}) {
    const { pending } = useLinkStatus();

    return (
        <span
            className={cn(
                "flex h-8 w-12 items-center justify-center rounded-full transition-all duration-200",
                isActive
                    ? "bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-md shadow-blue-600/30"
                    : "text-slate-500",
                pending && "animate-pulse",
            )}
        >
            <Icon className="h-[18px] w-[18px]" />
        </span>
    );
}

interface MobileTabBarProps {
    menuOpen: boolean;
    onMenuClick: () => void;
}

/** App-style bottom navigation on phones and tablets; the remaining routes live in the drawer behind "Menu". */
export function MobileTabBar({ menuOpen, onMenuClick }: MobileTabBarProps) {
    const pathname = usePathname();
    const { t } = useLocale();
    const { visibleSections } = useNavigation();

    const items = visibleSections.flatMap((section) => section.items);
    const tabs = items.slice(0, PRIMARY_TAB_COUNT);
    const menuIsActive =
        menuOpen ||
        !tabs.some((item) => isNavigationItemActive(pathname, item.href));

    return (
        <nav
            aria-label={t("Primary navigation")}
            className="glass-surface fixed inset-x-0 bottom-0 z-30 border-t pb-[env(safe-area-inset-bottom)] lg:hidden"
        >
            <div className="mx-auto flex h-16 max-w-xl items-stretch gap-1 px-2">
                {tabs.map((item) => {
                    const isActive = isNavigationItemActive(pathname, item.href);

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            aria-current={isActive ? "page" : undefined}
                            className={cn(
                                tabClassName,
                                isActive ? "text-blue-800" : "text-slate-500 active:bg-white/60",
                            )}
                        >
                            <TabIcon icon={item.icon} isActive={isActive} />
                            <span className="max-w-full truncate">{t(item.label)}</span>
                        </Link>
                    );
                })}

                <button
                    type="button"
                    onClick={onMenuClick}
                    aria-label={t("Open navigation menu")}
                    aria-expanded={menuOpen}
                    className={cn(
                        tabClassName,
                        menuIsActive ? "text-blue-800" : "text-slate-500 active:bg-white/60",
                    )}
                >
                    <span
                        className={cn(
                            "flex h-8 w-12 items-center justify-center rounded-full transition-all duration-200",
                            menuIsActive && "bg-blue-500/15 ring-1 ring-inset ring-blue-500/20",
                        )}
                    >
                        <Menu className="h-[18px] w-[18px]" />
                    </span>
                    <span>{t("Menu")}</span>
                </button>
            </div>
        </nav>
    );
}
