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