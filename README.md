# Dein Lab (berryverde)

Rezeptur-Rechner für selbst gerührte Naturkosmetik. Gebaut aus der Vorlage `susan-app-starter`.
Regeln für die Arbeit an diesem Projekt: `CLAUDE.md`, `DESIGN.md`, `LEARNINGS.md`, `LAUNCH-CHECK.md`.

## Aufbau

| Wo | Was |
|---|---|
| `src/lib/lab/rechner.ts` | Rechnen: ad 100, Gramm, Tropfen/ml, Fettphase, Emulgatoranteil, INCI |
| `src/lib/lab/regeln.ts` | Prüfregeln nach Regelwerk, mit Korrekturvorschlag |
| `src/lib/lab/lab.test.ts` | Tests für Rechner und Regeln (`npm run test`) |
| `src/db/schema.ts` | Tabellen: Rohstoffe, Dosierungen, Rezepturen, Positionen, Geräte, Zugänge |
| `src/db/seed-data.ts` | Startbestand (Rohstoffe, Geräte, R-001). Wird beim Deployment eingespielt, überschreibt nie |
| `src/lib/data.ts` | Alle Datenzugriffe und Rechte (Mitglied / Admin) |
| `src/components/lab/` | Formel-Tabelle, Rechner, Editor, Rohstoff-Liste, Verwaltung |
| `src/i18n/de.ts`, `src/i18n/lab.ts` | Alle Texte (deutsch mit ß) |

## Zugang
- Admin: Adressen in `ADMIN_EMAILS` (Vercel) bekommen beim Anmelden die Rolle Admin.
- Mitglieder: Admin trägt die E-Mail unter „Verwaltung“ ein. Anmeldung per Code, ohne Passwort.

## Wo ändere ich was?
- Werte eines Rohstoffs, Steckbrief, Tropfenfaktor, Nachbestell-Link: in der App unter Rohstoffe → Bearbeiten.
- Geräte-Links: in der App unter Verwaltung.
- Eine Prüfregel selbst: `src/lib/lab/regeln.ts` (und einen Test in `lab.test.ts` ergänzen).
- Platzhalter Tropfenfaktor (0,045 g) und Grenze 20 Tropfen: `src/lib/lab/types.ts` → `LAB`.

## Befehle
```
npm run dev      # lokal starten
npm run test     # Rechner und Regeln testen
npm run check    # Lint, Typografie, Tests, Typen, Build
```
