@AGENTS.md

# Projektregeln für Claude – Susan App Starter

Diese Vorlage ist die Basis für alle Web-Apps von Susan Fleet · Digital Business.
Antworten an Susan: Deutsch, Du-Form, Schweizer Schreibweise (ss), klar strukturiert, ein Thema nach dem anderen.

## Stack
GitHub → Next.js 16 (App Router, Cache Components) → Vercel Pro → Neon (Postgres, Drizzle) → Neon Auth (Login, siehe docs/LOGIN.md).
Kein Supabase. Kein Clerk (nur falls ein Projekt es ausdrücklich braucht). Kein Netlify für neue Apps.

## Wofür diese Vorlage gilt
Für **Web-Apps UND Webseiten**. Faustregel:
- **Web-App** (Login, Daten, Tools) → immer diese Vorlage.
- **Webseite mit mehreren Seiten oder Wachstum geplant** (Leistungsseiten, Projekte, Blog, SEO) → immer diese Vorlage. Kein reines HTML ab ca. 3 Seiten: Menü, Footer, SEO und Sitemap müssen an EINER Stelle gepflegt werden.
- **Einzelne Landingpage im System des Kunden** (Brevo, WordPress, Shopify) → dort bauen, aber die festen Regeln unten trotzdem anwenden und vor Übergabe im Launch-Check scannen.

Für Webseiten nicht benötigte Teile (Login, Datenbank, App-Bereich) weglassen bzw. abschalten, nicht löschen-und-vergessen.
Hosting: Vercel (Vorschau pro Änderung → Launch-Check → live). Domain und E-Mail dürfen beim bisherigen Anbieter (z. B. Hostinger) bleiben, nur die DNS-Einträge für die Webseite zeigen auf Vercel.

## SEO-System für Webseiten
- **Eine Seite pro Suchabsicht** (Leistung, Leistung + Ort, Frage wie „Was kostet …“, Projekt/Fallstudie). Keyword-Plan vor dem Bauen festlegen, nicht danach.
- Pro Seite: Suchbegriff im Title und in der H1, 800–1500 Wörter echter Inhalt, Ablauf, Beispiele, FAQ, klare Anfrage-Möglichkeit.
- Alle Leistungsseiten untereinander und von der Startseite verlinkt. Strukturierte Daten (Organization/LocalBusiness, FAQ) wo passend.
- Name/Marke gehört in den Title-Zusatz, nicht allein in die H1.

## Feste Regeln (nicht verhandelbar)
1. **Schriften immer lokal** (`next/font/local`, Dateien in `src/fonts`). Nie `fonts.googleapis.com` oder andere externe Schrift-Server.
2. **Footer-Signatur** „Made with ♥ by Susan Fleet“ mit Link auf https://lappzz.com bleibt in jeder App (`site.credit` in `src/config/site.ts`).
3. **SEO auf jeder Seite:** genau eine H1, logische H2/H3, `pageMetadata()` aus `src/lib/seo.ts` (Titel, Beschreibung, Canonical, hreflang). Neue öffentliche Seite → in `src/app/sitemap.ts` eintragen. Geschützte Seiten → `noindex: true`.
4. **Datentrennung:** Jede Tabelle mit Nutzerdaten hat `user_id`. Datenzugriffe nur über `src/lib/data.ts`. Nutzer sehen nur eigene Daten, Admins alles.
5. **Login nur über `src/lib/auth.ts`** – nie Neon Auth (`@neondatabase/auth`) direkt in Seiten verwenden. Ausnahme: Google-Button nutzt `src/lib/auth-client.ts`.
6. **Tracking nur mit Einwilligung.** Ohne Tracking-ID kein Cookie-Banner. Keine externen Skripte ohne Consent.
7. **Zweisprachig:** Alle Texte in `src/i18n/de.ts` und `en.ts`. Deutsch immer mit ß schreiben, Schweizer Schreibweise wird per `site.spelling` umgewandelt.
8. **Barrierefreiheit:** Kontraste, Fokus sichtbar, Labels an Formularfeldern, Alt-Texte, Tastaturbedienung, `prefers-reduced-motion`.
9. **Keine statischen Seiten:** Bewegung und Tiefe nach den Design-Skills, aber ruhig und hochwertig.
10. **Datenbank nur über Migrationen ändern:** `src/db/schema.ts` anpassen → `npm run db:generate` → Datei in `/drizzle` committen. Nie `db:push` auf Produktion.
11. **Geheimnisse nie in den Code.** Alles über Umgebungsvariablen (`.env.example` aktuell halten).

## Arbeitsweise (Sicherheitsnetz)
- Änderungen auf einem eigenen Branch, nie direkt auf `main`.
- Vor jedem Commit: `npm run check` (Lint, Typografie, Typen, Build) muss grün sein.
- Vercel-Vorschau prüfen, erst dann in `main` übernehmen.
- Nach dem Bauen immer selbst gegenprüfen und optimieren, dann LAUNCH-CHECK.md abarbeiten.
- **Pflicht vor jeder Übergabe und jedem Go-live:** Seite im Launch-Check-Board scannen (https://launch-check-rho.vercel.app). Nur mit rot-freier Ampel übergeben. Das gilt für ALLE Webseiten – auch Landingpages, die nicht aus dieser Vorlage gebaut sind (statisches HTML, Brevo, WordPress).

## Prüfschleife (Pflicht, bevor Susan ein Ergebnis sieht)
Susans Regeln sind keine Bitte, sondern Pflicht. Damit sie eingehalten werden, wird jedes Bau-Ergebnis geprüft, **bevor** es gezeigt wird – nicht danach.

1. **Bauen** nach CLAUDE.md, DESIGN.md, LEARNINGS.md und den Design-Skills.
2. **Maschinell prüfen:** `npm run check` (enthält `typocheck`) und `npm run selfcheck <Vorschau-Adresse>`.
3. **Unabhängig prüfen:** Ein zweiter Agent, der den Bau nicht kennt, prüft die Vorschau gegen LAUNCH-CHECK.md (alle Blöcke, besonders 8 „KI-Look“) und gegen die Anforderungen des Auftrags. Er bekommt nur die Adresse und die Checklisten, nicht den Code-Verlauf. Für Webseiten zusätzlich Scan im Launch-Check-Board.
4. **Rot → zurück zu 1.** Korrigieren, erneut prüfen. Maximal drei Runden; danach den Rest offen an Susan melden statt still weiterzuprobieren.
5. **Erst grün → Susan sieht es.** Bericht in drei Zeilen: was gebaut, was die Prüfung korrigiert hat, was offen ist.

Was die Prüfschleife nicht ersetzt: Susans Go vor dem Bauen (Verständnis, max. 3–5 Rückfragen) und ihr OK vor `main` und Go-live.

## Lernschleife (bei JEDER App)
Jede Verbesserung, die beim Bauen einer App entsteht, fließt zurück in diese Vorlage – damit die nächste App sie schon hat.
1. **Vor dem Start** `LEARNINGS.md` lesen und alles Gelernte anwenden.
2. **Während der Arbeit** jede Verbesserung festhalten, die nicht nur für diese eine App gilt: behobene Fehler, bessere Lösungen, Stolperfallen, neue Prüfpunkte.
3. **Am Ende** in `LEARNINGS.md` eintragen (Datum, App, was, warum) und – wenn es Code oder Regeln betrifft – direkt in die Vorlage übernehmen (eigener Branch).
4. Susan in einem Satz sagen, was neu gelernt und übernommen wurde.
Nicht eintragen: Kunden-Inhalte, Zugangsdaten, Dinge, die nur für eine App gelten.

## Design
Vor UI-Arbeit `DESIGN.md` lesen und die Skills nutzen:
- `.claude/skills/impeccable` – Gestaltung, Audit, Feinschliff
- `.claude/skills/emil-design-eng` – Animation und Details nach Emil Kowalski
