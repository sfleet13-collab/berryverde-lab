import type { Metadata, Viewport } from "next";
import { inter, display } from "../fonts";
import { site } from "@/config/site";

/**
 * Eigenes Root-Layout für das Goodie „Öl-Chart“ (Newsletter-Geschenk):
 * ohne Login, ohne Lab-Navigation, ohne Cookie-Banner. Nicht verlinkt, noindex.
 */
export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  applicationName: site.name,
};

export const viewport: Viewport = {
  themeColor: "#f7f1ef",
  width: "device-width",
  initialScale: 1,
  colorScheme: "light",
};

export default function OelChartLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de" className={`${inter.variable} ${display.variable}`}>
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  );
}
