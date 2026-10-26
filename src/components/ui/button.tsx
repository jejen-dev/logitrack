import * as React from "react";

import { cn } from "@/lib/utils";

type ButtonVariant =
    | "primary"
    | "secondary"
    | "outline"
    | "ghost"
    | "danger";

type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    size?: ButtonSize;
}

const variantStyles: Record<ButtonVariant, string> = {
    primary:
        "bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-600/25 ring-1 ring-inset ring-white/20 hover:from-blue-700 hover:to-blue-800 hover:shadow-blue-600/35 focus-visible:ring-blue-600",
    secondary:
        "border border-white/70 bg-white/55 text-slate-900 shadow-sm shadow-slate-900/5 backdrop-blur-md hover:bg-white/80 focus-visible:ring-slate-400",
    outline:
        "border border-blue-500/25 bg-white/45 text-blue-700 shadow-sm shadow-slate-900/5 backdrop-blur-md hover:bg-white/80 focus-visible:ring-blue-600",
    ghost:
        "text-slate-600 hover:bg-white/60 hover:text-slate-900 focus-visible:ring-slate-400",
    danger:
        "bg-gradient-to-br from-red-500 to-rose-600 text-white shadow-lg shadow-red-600/25 ring-1 ring-inset ring-white/20 hover:from-red-600 hover:to-rose-700 focus-visible:ring-red-600",
};

const sizeStyles: Record<ButtonSize, string> = {
    sm: "h-8 px-3 text-xs",
    md: "h-9 px-4 text-sm",
    lg: "h-10 px-5 text-sm",
};

export function Button({
    className,
    variant = "primary",
    size = "md",
    type = "button",
    ...props
}: ButtonProps) {
    return (
        <button
            type={type}
            className={cn(
                "inline-flex items-center justify-center gap-2 rounded-lg font-medium",
                "transition-all duration-150",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent",
                "disabled:pointer-events-none disabled:opacity-50",
                variantStyles[variant],
                sizeStyles[size],
                className,
            )}
            {...props}
        />
    );
}
