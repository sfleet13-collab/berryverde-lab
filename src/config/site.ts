/**
 * ZENTRALE EINSTELLUNGEN – pro App hier anpassen.
 * Alles, was sich von App zu App unterscheidet, steht in dieser Datei
 * oder in den Umgebungsvariablen (.env.local / Vercel).
 */

/** Dein Lab ist in Version 1 nur deutsch. Weitere Sprache: hier ergänzen und src/i18n/<sprache>.ts anlegen. */
export const locales = ["de"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "de";

export const site = {
  /** Name der App (Titel, Manifest, Vorschaubild) */
  name: "Dein Lab",
  /** Kurzname für den Homescreen (max. ca. 12 Zeichen) */
  shortName: "Dein Lab",
  /** Öffentliche Adresse ohne Schrägstrich am Ende. Auf Vercel per NEXT_PUBLIC_SITE_URL setzen. */
  url: (
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : "http://localhost:3000")
  ).replace(/\/$/, ""),

  /**
   * Schreibweise für Deutsch:
   * "de-CH" = Schweizer Schreibweise (ss statt ß), "de-DE" = deutsche Schreibweise (ß).
   * Texte werden immer mit ß geschrieben, bei "de-CH" wird automatisch umgewandelt.
   */
  spelling: "de-DE" as "de-DE" | "de-CH",

  /** Markenfarbe für Browser-Leiste und Homescreen-Icon (gleiche Farbe wie --brand in globals.css) */
  themeColor: "#9e254d",

  /** Betreiber (Impressum, strukturierte Daten). Bei Kunden-Apps die Daten des Kunden eintragen. */
  owner: {
    name: "berryverde · Susan Fleet",
    url: "https://berryverde.com",
    email: "susan@berryverde.com",
  },

  /** Footer-Signatur – bleibt in jeder App */
  credit: {
    label: "Made with ♥ by Susan Fleet",
    url: "https://lappzz.com",
  },

  social: [] as { label: string; url: string }[],
} as const;

/**
 * PRIVAT-MODUS (für eigene Werkzeug-Apps): PRIVATE_MODE=1
 * → jede Seite nur mit Login, nicht bei Google. Rechtsseiten und Anmeldung bleiben erreichbar.
 * ALLOWED_EMAILS = kommagetrennte Liste: nur diese Adressen bekommen einen Code / Zugang.
 */
export const privateMode = process.env.PRIVATE_MODE === "1";
export const allowedEmails = (process.env.ALLOWED_EMAILS ?? "")
  .split(",")
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);
export function emailAllowed(email?: string | null) {
  return allowedEmails.length === 0 || (!!email && allowedEmails.includes(email.toLowerCase()));
}

/** Tracking ist nur aktiv, wenn eine ID gesetzt ist. Ohne ID: kein Cookie-Banner. */
export const tracking = {
  googleAnalyticsId: process.env.NEXT_PUBLIC_GA_ID ?? "",
  googleAdsId: process.env.NEXT_PUBLIC_GOOGLE_ADS_ID ?? "",
};
export const trackingEnabled = Boolean(tracking.googleAnalyticsId || tracking.googleAdsId);

export const htmlLang: Record<Locale, string> = {
  de: site.spelling === "de-CH" ? "de-CH" : "de-DE",
};

export const ogLocale: Record<Locale, string> = {
  de: site.spelling === "de-CH" ? "de_CH" : "de_DE",
};

/** Dein Lab: Verkaufsseite der Mitgliedschaft und Admin-Adressen (bekommen automatisch die Rolle Admin). */
export const lab = {
  mitgliedschaftUrl: process.env.NEXT_PUBLIC_MITGLIEDSCHAFT_URL ?? "https://berryverde.com/",
  blogUrl: "https://berryverde.com",
};
export const adminEmails = (process.env.ADMIN_EMAILS ?? "")
  .split(",")
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}
