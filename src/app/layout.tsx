import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";

import "./globals.css";
import Providers from "@/components/providers";
import { cookies } from "next/headers";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "LogiTrack — Platform Operasional Logistik",
    template: "%s | LogiTrack",
  },
  description:
    "Kelola pengiriman, inventaris, gudang, armada, dan tim operasional dalam satu platform.",
  appleWebApp: {
    capable: true,
    title: "LogiTrack",
    statusBarStyle: "default",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#e9f0fb",
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
      <body className={plusJakartaSans.variable}>
        <Providers initialLocale={locale}>{children}</Providers>
      </body>
    </html>
  );
}
