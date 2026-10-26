"use client";

import { useEffect, useId, useRef } from "react";
import { X } from "lucide-react";

import { cn } from "@/lib/utils";
import { useLocale } from "@/components/locale-provider";

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
    const { t } = useLocale();
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
                "glass-surface m-auto w-[calc(100%-2rem)] max-w-lg rounded-2xl border p-0 text-slate-900",
                "max-h-[calc(100dvh-2rem)] overflow-y-auto overscroll-contain",
                // Bottom sheet on phones.
                "max-sm:mb-0 max-sm:w-full max-sm:max-w-none max-sm:rounded-b-none max-sm:border-b-0 max-sm:pb-[env(safe-area-inset-bottom)]",
                "max-sm:max-h-[calc(100dvh-env(safe-area-inset-top)-1rem)]",
                className,
            )}
        >
            <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-slate-900/[0.06] bg-white/70 px-5 py-4 backdrop-blur-xl sm:px-6 sm:py-5">
                <div>
                    <h2 id={titleId} className="text-lg font-semibold">{t(title)}</h2>
                    {description && <p id={descriptionId} className="mt-1 text-sm text-slate-500">{t(description)}</p>}
                </div>
                <button
                    type="button"
                    aria-label={t("Close dialog")}
                    onClick={() => onOpenChange(false)}
                    className="rounded-md p-1.5 text-slate-500 hover:bg-white/70 hover:text-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                >
                    <X aria-hidden="true" className="h-5 w-5" />
                </button>
            </div>
            <div className="p-5 sm:p-6">{children}</div>
        </dialog>
    );
}
