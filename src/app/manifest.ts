import type { MetadataRoute } from "next";
import { site } from "@/config/site";

/** Macht die App am Handy installierbar ("Zum Startbildschirm hinzufügen"). */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: site.name,
    short_name: site.shortName,
    id: "/",
    // Vom Home-Bildschirm direkt in den App-Bereich (ohne Login → Anmeldeseite)
    start_url: "/de/app",
    scope: "/",
    display: "standalone",
    background_color: "#fcf5f2",
    theme_color: site.themeColor,
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
