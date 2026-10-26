"use client";

import { useEffect, useState } from "react";

import { Header } from "@/components/layout/header";
import { MobileTabBar } from "@/components/layout/mobile-tab-bar";
import { Sidebar } from "@/components/layout/sidebar";
import { cn } from "@/lib/utils";
import { useLocale } from "@/components/locale-provider";

interface AppShellProps {
    children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { t } = useLocale();

    useEffect(() => {
        if (!sidebarOpen) return;

        const closeOnEscape = (event: KeyboardEvent) => {
            if (event.key === "Escape") setSidebarOpen(false);
        };

        window.addEventListener("keydown", closeOnEscape);
        return () => window.removeEventListener("keydown", closeOnEscape);
    }, [sidebarOpen]);

    return (
        <div className="min-h-screen bg-transparent">
            {/* Desktop sidebar */}
            <div className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-40 lg:flex">
                <Sidebar />
            </div>

            {/* Mobile sidebar overlay */}
            {sidebarOpen && (
                <button
                    type="button"
                    aria-label={t("Close navigation menu")}
                    className="fixed inset-0 z-40 bg-slate-900/30 backdrop-blur-[2px] lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Mobile sidebar */}
            <div
                inert={!sidebarOpen}
                className={cn(
                    "fixed inset-y-0 left-0 z-50 transition-transform duration-300 ease-out lg:hidden",
                    sidebarOpen ? "translate-x-0 shadow-2xl shadow-slate-900/20" : "-translate-x-full",
                )}
            >
                <Sidebar />
            </div>

            {/* Main area */}
            <div className="lg:pl-64">
                <Header />

                {/* Bottom padding keeps content clear of the mobile/tablet tab bar. */}
                <main className="min-h-[calc(100dvh-4rem)] pb-[calc(5rem+env(safe-area-inset-bottom))] lg:pb-0">
                    {children}
                </main>
            </div>

            <MobileTabBar
                menuOpen={sidebarOpen}
                onMenuClick={() => setSidebarOpen(true)}
            />
        </div>
    );
}
