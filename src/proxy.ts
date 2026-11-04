import { NextResponse, type NextRequest } from "next/server";
import { defaultLocale, locales, privateMode } from "@/config/site";
import { getAuth } from "@/lib/neon-auth";

/**
 * Leitet Adressen ohne Sprache auf /de oder /en um
 * (nach Browsersprache, Standard: Deutsch).
 */
function preferredLocale(request: NextRequest) {
  const header = request.headers.get("accept-language") ?? "";
  const first = header.split(",")[0]?.trim().slice(0, 2).toLowerCase();
  return (locales as readonly string[]).includes(first) ? first : defaultLocale;
}

/** Geschützte Bereiche: /de/app, /en/app und alles darunter. */
const PROTECTED = new RegExp(`^/(${locales.join("|")})/app(/|$)`);

/** Im Privat-Modus ohne Login erreichbar: Anmeldung und Rechtsseiten. */
const PUBLIC_IN_PRIVATE = new RegExp(`^/(${locales.join("|")})/(anmelden|impressum|datenschutz|agb)(/|$)`);
const LOCALE_HOME = new RegExp(`^/(${locales.join("|")})/?$`);

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Dein Lab ist nur deutsch: alte oder geratene /en-Adressen auf Deutsch umleiten
  if (pathname === "/en" || pathname.startsWith("/en/")) {
    const url = request.nextUrl.clone();
    url.pathname = `/de${pathname.slice(3)}`;
    return NextResponse.redirect(url, 308);
  }

  if (privateMode) {
    // Startseite ist im Privat-Modus direkt der App-Bereich
    const home = LOCALE_HOME.exec(pathname);
    if (home) return NextResponse.redirect(new URL(`/${home[1]}/app`, request.url), 307);
    const lang = locales.find((l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`));
    const auth = getAuth();
    if (lang && auth && !PUBLIC_IN_PRIVATE.test(pathname)) {
      return auth.middleware({ loginUrl: `/${lang}/anmelden` })(request);
    }
  }

  // Login prüfen (und nach Google-Login die Sitzung übernehmen)
  const match = PROTECTED.exec(pathname);
  if (match) {
    const auth = getAuth();
    if (!auth) return; // Login nicht eingerichtet: Seite zeigt einen Hinweis
    return auth.middleware({ loginUrl: `/${match[1]}/anmelden` })(request);
  }

  const hasLocale = locales.some((l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`));
  if (hasLocale) return;

  const url = request.nextUrl.clone();
  url.pathname = `/${preferredLocale(request)}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url, 307);
}

export const config = {
  // Nicht für interne Dateien, API, Bilder, Icons, Sitemap, Robots, Manifest
  matcher: [
    "/((?!_next|api|favicon\\.ico|icon|apple-icon|manifest\\.webmanifest|sitemap\\.xml|robots\\.txt|opengraph-image|.*\\.[a-zA-Z0-9]+$).*)",
  ],
};
