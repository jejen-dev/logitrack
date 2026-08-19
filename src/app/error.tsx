"use client";

import { AlertTriangle } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function Error({
    reset,
}: {
    reset: () => void;
}) {
    return (
        <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
            <div
                className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 text-center shadow-sm"
                role="alert"
            >
                <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-red-50">
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                </div>

                <h1 className="mt-4 text-lg font-semibold text-slate-900">
                    Something went wrong
                </h1>

                <p className="mt-2 text-sm text-slate-500">
                    We could not load this page. Please try again.
                </p>

                <Button
                    className="mt-5"
                    onClick={reset}
                >
                    Try again
                </Button>
            </div>
        </main>
    );
}