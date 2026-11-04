import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { Analytics } from "@vercel/analytics/next";
import "../globals.css";
import { inter, display } from "../fonts";
import { htmlLang, isLocale, locales, privateMode, site, trackingEnabled } from "@/config/site";
import { getDictionary } from "@/i18n";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ConsentBanner from "@/components/ConsentBanner";
import JsonLd from "@/components/JsonLd";

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  const t = getDictionary(lang);
  return {
    metadataBase: new URL(site.url),
    title: { default: t.meta.title, template: `%s | ${site.name}` },
    description: t.meta.description,
    applicationName: site.name,
    ...(privateMode ? { robots: { index: false, follow: false } } : {}),
    // iPhone/iPad: als App vom Home-Bildschirm starten (ohne Browserleiste)
    appleWebApp: { capable: true, title: site.shortName, statusBarStyle: "default" },
    formatDetection: { telephone: false },
    verification: process.env.NEXT_PUBLIC_GSC_VERIFICATION
      ? { google: process.env.NEXT_PUBLIC_GSC_VERIFICATION }
      : undefined,
    twitter: { card: "summary_large_image" },
  };
}

export const viewport: Viewport = {
  themeColor: site.themeColor,
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

/** Setzt Hell/Dunkel vor dem ersten Zeichnen, damit nichts aufblitzt. */
const themeScript = `(function(){try{var t=localStorage.getItem('theme');if(t==='light'||t==='dark')document.documentElement.dataset.theme=t;}catch(e){}document.documentElement.classList.add('js');})();`;

export default async function RootLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = getDictionary(lang);

  return (
    <html lang={htmlLang[lang]} className={`${inter.variable} ${display.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <a className="skip-link" href="#inhalt">
          {t.nav.skip}
        </a>
        <JsonLd lang={lang} />
        <Header lang={lang} t={t} />
        <main id="inhalt" tabIndex={-1}>{children}</main>
        <Footer lang={lang} t={t} />
        {trackingEnabled && <ConsentBanner t={t.consent} />}
        {process.env.VERCEL && <Analytics />}
      </body>
    </html>
  );
}
