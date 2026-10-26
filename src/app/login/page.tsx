"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { Truck } from "lucide-react";

import { LocalizedText } from "@/components/locale-provider";

export default function LoginPage() {
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleGoogleSignIn() {
        setError("");
        setLoading(true);

        try {
            await signIn("google", {
                callbackUrl: new URLSearchParams(window.location.search).get("callbackUrl") ?? "/dashboard",
            });
        } catch {
            setError("Google sign-in failed. Please try again.");
            setLoading(false);
        }
    }

    return (
        <main className="flex min-h-screen items-center justify-center px-4">
            <div className="glass-surface w-full max-w-md rounded-3xl border p-8 sm:p-10">
                <div className="mb-8 text-center">
                    <span className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-600/30 ring-1 ring-inset ring-white/30">
                        <Truck aria-hidden="true" className="h-6 w-6" />
                    </span>
                    <h1 className="text-3xl font-bold text-slate-900">
                        <LocalizedText text={"\n                        LogiTrack\n                    "} /></h1>
                    <p className="mt-2 text-sm text-slate-500">
                        <LocalizedText text={"\n                        Sign in or create your account with Google\n                    "} /></p>
                </div>

                <button
                    type="button"
                    onClick={handleGoogleSignIn}
                    disabled={loading}
                    className="flex w-full items-center justify-center gap-3 rounded-xl border border-white/80 bg-white/70 px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm shadow-slate-900/5 backdrop-blur-md transition hover:-translate-y-0.5 hover:bg-white/90 hover:shadow-md disabled:cursor-wait disabled:opacity-60"
                >
                    <svg aria-hidden="true" viewBox="0 0 48 48" className="h-5 w-5">
                        <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5Z" />
                        <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.25 5.48-4.73 7.18l7.65 5.93c4.46-4.12 7.12-10.18 7.12-17.58Z" />
                        <path fill="#FBBC05" d="M10.53 28.59a14.4 14.4 0 0 1 0-9.18l-7.98-6.19a23.9 23.9 0 0 0 0 21.56l7.98-6.19Z" />
                        <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.9-5.87l-7.65-5.93c-2.13 1.43-4.86 2.28-8.25 2.28-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48Z" />
                    </svg>
                    <LocalizedText text={loading ? "Connecting to Google…" : "Continue with Google"} />
                </button>

                {error && (
                    <p role="alert" className="mt-4 rounded-xl bg-red-500/10 px-4 py-3 text-sm text-red-700 ring-1 ring-inset ring-red-600/20">
                        <LocalizedText text={error} />
                    </p>
                )}

                <p className="mt-6 text-center text-xs text-slate-500">
                    <LocalizedText text={"\n                    New accounts are created automatically on first sign-in.\n                "} /></p>
            </div>
        </main>
    );
}
