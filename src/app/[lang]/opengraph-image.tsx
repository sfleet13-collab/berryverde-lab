import { ImageResponse } from "next/og";
import { isLocale, locales, site } from "@/config/site";
import { getDictionary } from "@/i18n";

/** Vorschaubild für WhatsApp, LinkedIn, Instagram & Co. – wird automatisch erzeugt. */
export const alt = site.name;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export default async function OgImage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const t = getDictionary(isLocale(lang) ? lang : "de");
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "linear-gradient(150deg, #0e5a61 0%, #083a3f 55%, #ff6b4a 150%)",
          color: "#fff",
        }}
      >
        <div style={{ fontSize: 30, opacity: 0.85, letterSpacing: 4, textTransform: "uppercase" }}>{site.name}</div>
        <div style={{ fontSize: 76, fontWeight: 700, lineHeight: 1.05, maxWidth: 950 }}>{t.home.title}</div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 26, opacity: 0.85 }}>
          Made with
          {/* Herz als Grafik, damit beim Erzeugen keine Emoji-Schrift nachgeladen werden muss */}
          <svg width="26" height="24" viewBox="0 0 24 22" fill="#fff">
            <path d="M12 21.6 10.3 20C4.2 14.5 0 10.7 0 6.1 0 2.7 2.7 0 6.1 0c1.9 0 3.8.9 5 2.3C13.1.9 15 0 16.9 0 20.3 0 23 2.7 23 6.1c0 4.6-4.2 8.4-10.3 13.9z" />
          </svg>
          by Susan Fleet
        </div>
      </div>
    ),
    size,
  );
}
