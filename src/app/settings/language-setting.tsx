"use client";

import { Languages } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import { useLocale , LocalizedText} from "@/components/locale-provider";

export function LanguageSetting() {
    const { locale, setLocale, t } = useLocale();
    return (
        <Card>
            <CardHeader>
                <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100">
                        <Languages className="h-4 w-4 text-slate-600" />
                    </div>
                    <div>
                        <CardTitle className="text-base">{t("Application Language")}</CardTitle>
                        <p className="mt-1 text-xs text-slate-500">{t("Choose the language used across LogiTrack.")}</p>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-2">
                <label htmlFor="app-language" className="text-sm font-medium text-slate-700">{t("Application Language")}</label>
                <select
                    id="app-language"
                    value={locale}
                    onChange={(event) => setLocale(event.target.value === "en" ? "en" : "id")}
                    className="h-11 w-full rounded-xl border border-slate-200 bg-white/70 px-3 text-sm"
                >
                    <option value="id"><LocalizedText text={"Bahasa Indonesia"} /></option>
                    <option value="en"><LocalizedText text={"English"} /></option>
                </select>
                <p className="text-xs text-slate-500">{t("Language preference saved on this device.")}</p>
            </CardContent>
        </Card>
    );
}
