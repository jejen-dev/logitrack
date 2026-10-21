
import { LocalizedText } from "@/components/locale-provider";

export default function Loading() {
    return (
        <div
            className="flex min-h-[calc(100vh-4rem)] items-center justify-center"
            role="status"
            aria-live="polite"
            aria-label="Memuat"
        >
            <div className="flex items-center gap-3">
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-200 border-t-blue-600" />

                <span className="text-sm text-slate-500">
                    <LocalizedText text={"\n                    Loading...\n                "} /></span>
            </div>
        </div>
    );
}
