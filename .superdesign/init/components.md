# Shared UI components

Framework: Next.js 16 App Router, React 19, Tailwind CSS 4, custom components with lucide-react icons.

## `src/components/ui/badge.tsx`

Reusable UI primitive.

```tsx
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
    default: "bg-slate-100 text-slate-700",
    success: "bg-green-50 text-green-700",
    warning: "bg-amber-50 text-amber-700",
    danger: "bg-red-50 text-red-700",
    info: "bg-sky-50 text-sky-700",
};

export function Badge({
    className,
    variant = "default",
    ...props
}: BadgeProps) {
    return (
        <span
            className={cn(
                "inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium",
                variantStyles[variant],
                className,
            )}
            {...props}
        />
    );
}
```

## `src/components/ui/button.tsx`

Reusable UI primitive.

```tsx
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
        "bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-blue-600",
    secondary:
        "bg-slate-100 text-slate-900 hover:bg-slate-200 focus-visible:ring-slate-400",
    outline:
        "border border-slate-200 bg-white text-slate-900 hover:bg-slate-50 focus-visible:ring-blue-600",
    ghost:
        "text-slate-600 hover:bg-slate-100 hover:text-slate-900 focus-visible:ring-slate-400",
    danger:
        "bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-600",
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
                "inline-flex items-center justify-center gap-2 rounded-md font-medium",
                "transition-colors duration-150",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
                "disabled:pointer-events-none disabled:opacity-50",
                variantStyles[variant],
                sizeStyles[size],
                className,
            )}
            {...props}
        />
    );
}
```

## `src/components/ui/card.tsx`

Reusable UI primitive.

```tsx
import * as React from "react";

import { cn } from "@/lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> { }

export function Card({ className, ...props }: CardProps) {
    return (
        <div
            className={cn(
                "rounded-xl border border-slate-200 bg-white shadow-sm",
                className,
            )}
            {...props}
        />
    );
}

export function CardHeader({
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            className={cn("flex flex-col gap-1.5 p-6", className)}
            {...props}
        />
    );
}

export function CardTitle({
    className,
    ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
    return (
        <h3
            className={cn(
                "text-lg font-semibold leading-none tracking-tight text-slate-900",
                className,
            )}
            {...props}
        />
    );
}

export function CardDescription({
    className,
    ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
    return (
        <p
            className={cn("text-sm text-slate-500", className)}
            {...props}
        />
    );
}

export function CardContent({
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div className={cn("p-6 pt-0", className)} {...props} />
    );
}
```

## `src/components/ui/modal.tsx`

Reusable UI primitive.

```tsx
"use client";

import { useEffect, useId, useRef } from "react";
import { X } from "lucide-react";

import { cn } from "@/lib/utils";

interface ModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    description?: string;
    children: React.ReactNode;
    className?: string;
}

export function Modal({
    open,
    onOpenChange,
    title,
    description,
    children,
    className,
}: ModalProps) {
    const dialogRef = useRef<HTMLDialogElement>(null);
    const titleId = useId();
    const descriptionId = useId();

    useEffect(() => {
        const dialog = dialogRef.current;
        if (!dialog) return;

        if (open && !dialog.open) dialog.showModal();
        if (!open && dialog.open) dialog.close();
    }, [open]);

    return (
        <dialog
            ref={dialogRef}
            aria-labelledby={titleId}
            aria-describedby={description ? descriptionId : undefined}
            onClose={() => onOpenChange(false)}
            onClick={(event) => {
                if (event.target === event.currentTarget) onOpenChange(false);
            }}
            className={cn(
                "m-auto w-[calc(100%-2rem)] max-w-lg rounded-2xl border-0 bg-white p-0 text-slate-900 shadow-2xl backdrop:bg-slate-950/50",
                "max-h-[calc(100dvh-2rem)] overflow-y-auto",
                className,
            )}
        >
            <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-6 py-5">
                <div>
                    <h2 id={titleId} className="text-lg font-semibold">{title}</h2>
                    {description && <p id={descriptionId} className="mt-1 text-sm text-slate-500">{description}</p>}
                </div>
                <button
                    type="button"
                    aria-label="Close dialog"
                    onClick={() => onOpenChange(false)}
                    className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                >
                    <X aria-hidden="true" className="h-5 w-5" />
                </button>
            </div>
            <div className="p-6">{children}</div>
        </dialog>
    );
}
```

## `src/components/ui/separator.tsx`

Reusable UI primitive.

```tsx
import * as React from "react";

import { cn } from "@/lib/utils";

interface SeparatorProps
    extends React.HTMLAttributes<HTMLDivElement> {
    orientation?: "horizontal" | "vertical";
}

export function Separator({
    className,
    orientation = "horizontal",
    ...props
}: SeparatorProps) {
    return (
        <div
            role="separator"
            aria-orientation={orientation}
            className={cn(
                "shrink-0 bg-slate-200",
                orientation === "horizontal"
                    ? "h-px w-full"
                    : "h-full w-px",
                className,
            )}
            {...props}
        />
    );
}
```
