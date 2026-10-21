import type { Metadata } from "next";

import { LandingPage } from "@/components/landing-page";

export const metadata: Metadata = {
    title: "LogiTrack — Platform Operasional Logistik",
    description:
        "Kelola pengiriman, inventaris, gudang, armada, dan tim operasional dalam satu platform.",
};

export default function Home() {
    return <LandingPage />;
}
