"use client";

import { SessionProvider } from "next-auth/react";
import { LocaleProvider, type AppLocale } from "@/components/locale-provider";

export default function Providers({
  children,
  initialLocale,
}: {
  children: React.ReactNode;
  initialLocale: AppLocale;
}) {
  return <LocaleProvider initialLocale={initialLocale}><SessionProvider>{children}</SessionProvider></LocaleProvider>;
}
