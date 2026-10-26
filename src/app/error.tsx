"use client";

import { AlertTriangle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { LocalizedText } from "@/components/locale-provider";

export default function Error({
    reset,
}: {
    reset: () => void;
}) {
    return (
        <main className="flex min-h-screen items-center justify-center px-4">
            <div
                className="glass-surface w-full max-w-md rounded-2xl border p-8 text-center"
                role="alert"
            >
                <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-red-500/10 ring-1 ring-inset ring-red-600/20">
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                </div>

                <h1 className="mt-4 text-lg font-semibold text-slate-900">
                    <LocalizedText text={"\n                    Something went wrong\n                "} /></h1>

                <p className="mt-2 text-sm text-slate-500">
                    <LocalizedText text={"\n                    We could not load this page. Please try again.\n                "} /></p>

                <Button
                    className="mt-5"
                    onClick={reset}
                >
                    <LocalizedText text={"\n                    Try again\n                "} /></Button>
            </div>
        </main>
    );
}
