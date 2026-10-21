import Link from "next/link";

import { Button } from "@/components/ui/button";
import { LocalizedText } from "@/components/locale-provider";

export default function NotFound() {
    return (
        <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
            <div className="w-full max-w-md text-center">
                <p className="text-sm font-semibold text-blue-600">
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