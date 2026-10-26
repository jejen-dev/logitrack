"use client";

import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { useLocale } from "@/components/locale-provider";

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
    const { t } = useLocale();
    return (
        <div className="mb-5 md:mb-6">
            <div className="hidden md:block">
                <Breadcrumbs />
            </div>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between md:mt-3">
                <div>
                    <h1 className="text-xl font-bold tracking-tight text-slate-900 md:text-2xl md:font-semibold">
                        {t(title)}
                    </h1>

                    {description && (
                        <p className="mt-1 max-w-2xl text-sm text-slate-500 md:mt-1.5">
                            {t(description)}
                        </p>
                    )}
                </div>

                {actions && (
                    <div className="flex shrink-0 flex-wrap items-center gap-2 max-sm:[&>*]:flex-1">
                        {actions}
                    </div>
                )}
            </div>
        </div>
    );
}
