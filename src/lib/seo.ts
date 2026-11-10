import type { Metadata } from "next";
import {
  locales,
  ogLocale,
  privateMode,
  site,
  type Locale,
} from "@/config/site";
import { href } from "@/i18n";

/**
 * Einheitliche Meta-Daten für jede Seite:
 * Titel, Beschreibung, Canonical, hreflang (DE/EN), Open Graph mit Bild.
 * Titel: 50–60 Zeichen inkl. " | Name", Beschreibung: 140–160 Zeichen (Texte in i18n → seo).
 */
export function pageMetadata({
  lang,
  path = "/",
  title,
  description,
  noindex = false,
}: {
  lang: Locale;
  path?: string;
  title?: string;
  description: string;
  noindex?: boolean;
}): Metadata {
  // Vorschaubild für WhatsApp, LinkedIn & Co. – auf JEDER Seite (Unterseiten erben es sonst nicht)
  const image = {
    url: `/${lang}/opengraph-image`,
    width: 1200,
    height: 630,
    alt: site.name,
  };
  const languages = Object.fromEntries(
    locales.map((l) => [ogLocale[l].replace("_", "-"), href(l, path)]),
  );
  return {
    ...(title ? { title } : {}),
    description,
    alternates: {
      canonical: href(lang, path),
      languages: { ...languages, "x-default": href("de", path) },
    },
    openGraph: {
      type: "website",
      siteName: site.name,
      locale: ogLocale[lang],
      url: href(lang, path),
      ...(title ? { title } : {}),
      description,
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      ...(title ? { title } : {}),
      description,
      images: [image],
    },
    robots:
      noindex || privateMode
        ? { index: false, follow: false }
        : { index: true, follow: true },
  };
}
