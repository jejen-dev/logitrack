import * as React from "react";

import { cn } from "@/lib/utils";

type BadgeVariant =
    | "default"
    | "success"
    | "warning"
    | "danger"
    | "info";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
    variant?: BadgeVariant;
}

const variantStyles: Record<BadgeVariant, string> = {
    default: "bg-slate-500/10 text-slate-700 ring-slate-500/20",
    success: "bg-green-500/12 text-green-800 ring-green-600/25",
    warning: "bg-amber-400/15 text-amber-800 ring-amber-500/30",
    danger: "bg-red-500/12 text-red-700 ring-red-600/25",
    info: "bg-sky-500/12 text-sky-800 ring-sky-600/25",
};

export function Badge({
    className,
    variant = "default",
    ...props
}: BadgeProps) {
    return (
        <span
            className={cn(
                "inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset backdrop-blur-sm",
                variantStyles[variant],
                className,
            )}
            {...props}
        />
    );
}