import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: "LogiTrack",
        short_name: "LogiTrack",
        description:
            "Kelola pengiriman, inventaris, gudang, armada, dan tim operasional dalam satu platform.",
        start_url: "/dashboard",
        display: "standalone",
        background_color: "#eef3fa",
        theme_color: "#eef3fa",
        icons: [
            {
                src: "/icon.svg",
                sizes: "any",
                type: "image/svg+xml",
            },
        ],
    };
}
