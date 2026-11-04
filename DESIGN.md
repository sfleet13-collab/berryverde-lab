# Design-Regeln – Susan Fleet

Mein Geschmack, schriftlich festgehalten. Gilt für jede App aus dieser Vorlage.

## Haltung
- **Klar vor schön, schön vor laut.** Jede Seite hat ein Ziel und einen Hauptknopf.
- **Keine statischen Seiten.** Sanfte Bewegung, Tiefe, Details, die man spürt, nicht sieht.
- **Mobile first.** Erst fürs Handy gestalten, dann für den Desktop erweitern.
- **Conversion denken:** Was soll die Person als Nächstes tun? Das muss sofort sichtbar sein.

## Marke anpassen (5 Minuten)
Alles in `src/app/globals.css` unter `:root`:
1. `--brand`, `--brand-strong`, `--brand-soft`, `--accent` – Markenfarben
2. Dunkle Variante im Block `[data-theme="dark"]` angleichen
3. Schriften: `.woff2` in `src/fonts` legen, in `src/app/fonts.ts` eintragen
4. `themeColor` in `src/config/site.ts` = `--brand`
5. Icon: `public/icon.svg` ersetzen, PNGs neu erzeugen

## Farbwelt "Hell & frisch" (Standard)
- Hintergrund Off-White `#FBFAF7`, Text `#10201F`
- Marke: kräftiges Petrol `#0E5A61` (Überschrift Hero, Bühnen, Abschluss)
- Akzent: Koralle `#FF6B4A` (Hauptknopf, Zahlen, Admin-Badge) – sparsam
- Petrol-Flächen bleiben in Hell und Dunkel gleich

## Gestaltungsregeln (Impeccable)
- Keine Mini-Überschriften (Eyebrows) über Überschriften
- Keine gleich grossen Icon-Karten als Seitenstruktur: Kacheln zeigen echte Mini-Ansichten
- Keine Emoji oder Sonderzeichen als Icons: nur `src/components/Icon.tsx`
- Ein inszenierter Moment pro Seite (Startseite: Login-Bühne), der Rest ruhig

## Typografie
- Überschriften: Bricolage Grotesque (serifenlos, markant), fett, `text-wrap: balance`
- Fliesstext: Inter, Zeilenhöhe 1.6, max. ca. 65 Zeichen pro Zeile
- Grössen nur über `--step-…` Variablen (fliessend zwischen Handy und Desktop)

## Typografie ohne KI-Look (Pflicht, wird maschinell geprüft)
Man darf einer Seite nicht ansehen, dass KI mitgebaut hat. Die Design-Skills (Impeccable, Emil) prüfen den Buchstabenabstand nicht von selbst, darum gilt immer:

**`letter-spacing` nur in vier Stufen** – jeder andere Wert ist ein Fehler:

| Stufe | Wert | Wofür |
|---|---|---|
| Riesen-Überschrift | `-0.03em` | fette Schrift ab `--step-4` (Hero-H1, grosse Zahlen) |
| Normale Überschrift | `-0.015em` | H2, H3, Karten-Titel, fette Schrift unter `--step-4` |
| Dünne grosse Schrift | `-0.01em` | Schriftstärke ≤ 400 ab ca. 2rem |
| Kleines Label | `+0.06em` | nur zusammen mit `text-transform: uppercase`, Schriftgrösse unter 0.85rem |

Alles andere: **0** (kein `letter-spacing`): Fliesstext, Claims, Buttons, Links, Navigation, Badges, kleine Schrift.

**Verbote**
- Kleinbuchstaben nie sperren (positiver Wert nur mit `uppercase`).
- Buttons in normaler Schreibweise. Kein `text-transform: uppercase` auf `button`, `.btn`, `a[role=button]`.
- Höchstens **2 kleine Labels** (uppercase + gesperrt) pro Seite, nie direkt über oder neben einer Überschrift, die dasselbe sagt (keine Eyebrows).
- Je dünner die Schrift, desto mehr Luft: dünn nie enger als `-0.01em`.

**Einzige Ausnahme:** Eingabefelder für Codes/Ziffern (`inputmode="numeric"`, `tabular-nums`) dürfen gesperrt sein, damit die Ziffern lesbar bleiben.

**Prüfung:** `npm run typocheck` (statisch, alle CSS-Dateien) läuft in `npm run check`; der Launch-Check prüft dasselbe live auf der Seite. Nach jedem Bau beide grün, bevor Susan das Ergebnis sieht.

## Farbe & Kontrast
- Text auf Hintergrund mindestens 4.5:1 (WCAG AA)
- Akzentfarbe sparsam: Eyebrows, Zahlen, Hover
- Hell- und Dunkelmodus immer beide prüfen

## Bewegung (nach Emil Kowalski)
- Kurz: 160–240 ms für Interaktionen, max. 600 ms für Einblendungen
- Weich: `--ease-out` für fast alles, nie `linear` für UI
- Knöpfe geben nach (`scale(0.97)` beim Drücken)
- Hover-Effekte nur bei echter Maus (`@media (hover: hover)`)
- `prefers-reduced-motion` wird immer respektiert

## Abstände & Formen
- Abstände nur aus der Skala (`--space-…`)
- Radien: klein 8, mittel 14, gross 24
- Schatten zurückhaltend (`--shadow-1`, `--shadow-2`)

## Formulare
- Label immer sichtbar über dem Feld
- Fehler direkt am Feld, in Klartext, Eingaben bleiben erhalten
- Spam-Schutz ohne Captcha (verstecktes Feld + Zeitprüfung)

## Werkzeug-Apps (nur Susans eigene: HQ, Launch-Check, Brand-Board …)
- `src/components/ToolSwitch.tsx` im Kopf einbauen (`<ToolSwitch current="…" />`): ein Umschalter, der in jeder Werkzeug-App gleich aussieht und die aktuelle App markiert – so wirken alle wie eine Anwendung mit Reitern.
- Für Kunden-Apps weglassen.

## Footer
„Made with ♥ by Susan Fleet“ → https://lappzz.com – in jeder App.
