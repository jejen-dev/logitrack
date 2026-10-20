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
                    aria-label="Tutup dialog"
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
