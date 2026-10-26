import Link from "next/link";

import { Button } from "@/components/ui/button";
import { LocalizedText } from "@/components/locale-provider";

export default function NotFound() {
    return (
        <main className="flex min-h-screen items-center justify-center px-4">
            <div className="glass-surface w-full max-w-md rounded-2xl border p-8 text-center">
                <p className="bg-gradient-to-br from-blue-500 to-indigo-600 bg-clip-text text-5xl font-bold tracking-tight text-transparent">
                    <LocalizedText text={"\n                    404\n                "} /></p>

                <h1 className="mt-2 text-2xl font-semibold text-slate-900">
                    <LocalizedText text={"\n                    Page not found\n                "} /></h1>

                <p className="mt-2 text-sm text-slate-500">
                    <LocalizedText text={"\n                    The page you are looking for does not exist.\n                "} /></p>

                <Link href="/dashboard" className="inline-flex">
                    <Button className="mt-5">
                        <LocalizedText text={"\n                        Back to Dashboard\n                    "} /></Button>
                </Link>
            </div>
        </main>
    );
}