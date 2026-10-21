import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "./globals.css";
import Providers from "@/components/providers";
import { cookies } from "next/headers";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "LogiTrack",
    template: "%s | LogiTrack",
  },
  description:
    "Modern logistics management for smarter operations.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const localeCookie = (await cookies()).get("logitrack_locale")?.value;
  const locale = localeCookie === "en" ? "en" : "id";
  return (
    <html lang={locale}>
      <body className={inter.variable}>
        <Providers initialLocale={locale}>{children}</Providers>
      </body>
    </html>
  );
}
