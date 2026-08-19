import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function NotFound() {
    return (
        <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
            <div className="w-full max-w-md text-center">
                <p className="text-sm font-semibold text-blue-600">
                    404
                </p>

                <h1 className="mt-2 text-2xl font-semibold text-slate-900">
                    Page not found
                </h1>

                <p className="mt-2 text-sm text-slate-500">
                    The page you are looking for does not exist.
                </p>

                <Link href="/dashboard" className="inline-flex">
                    <Button className="mt-5">
                        Back to Dashboard
                    </Button>
                </Link>
            </div>
        </main>
    );
}