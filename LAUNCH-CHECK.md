# Launch-Check

Vor jedem Go-live komplett abarbeiten. Ergebnis als Ampel: 🟢 ok · 🟡 nachbessern · 🔴 blockiert Go-live.

## 1. Technik
- [ ] `npm run check` ist grün (Lint, Typen, Build)
- [ ] Vercel-Vorschau getestet: Desktop, Handy, Hell- und Dunkelmodus
- [ ] Keine Fehler in der Browser-Konsole
- [ ] Kein horizontales Scrollen am Handy (390 px)
- [ ] 404-Seite funktioniert
- [ ] Ladezeit: Lighthouse Performance ≥ 90

## 2. Datenschutz & Cookies
- [ ] Netzwerk-Scan: keine Verbindung zu Google Fonts oder anderen externen Diensten ohne Einwilligung
- [ ] Ohne Zustimmung werden keine Cookies gesetzt
- [ ] Mit Tracking: Banner erscheint, beide Knöpfe gleichwertig, Widerruf im Footer möglich
- [ ] Datenschutzerklärung nennt alle Dienste (Vercel, Neon inkl. Login, Resend, ggf. Google)

## 3. Rechtliches
- [ ] Impressum mit echten Angaben
- [ ] Datenschutzerklärung ersetzt (kein Platzhalter mehr)
- [ ] AGB (falls etwas verkauft wird)
- [ ] Footer-Links funktionieren in DE und EN

## 4. SEO
- [ ] Jede Seite: genau eine H1, sinnvolle H2/H3
- [ ] Titel und Beschreibung pro Seite, keine Dopplungen
- [ ] Canonical und hreflang korrekt (`NEXT_PUBLIC_SITE_URL` gesetzt!)
- [ ] `/sitemap.xml` und `/robots.txt` erreichbar
- [ ] Vorschaubild getestet (Link in WhatsApp oder LinkedIn-Post-Inspector)
- [ ] Geschützte Seiten auf `noindex`
- [ ] Search Console: Domain bestätigt, Sitemap eingereicht

## 5. Barrierefreiheit
- [ ] Mit Tastatur komplett bedienbar, Fokus sichtbar
- [ ] Kontraste ausreichend (mind. 4.5:1)
- [ ] Alle Bilder mit Alt-Text, alle Felder mit Label

## 6. Login & Daten
- [ ] Nutzer A sieht keine Daten von Nutzer B (mit zwei Testkonten prüfen)
- [ ] Admin-Rolle funktioniert
- [ ] Neon Auth: Live-Domain unter Auth → Domains freigegeben (sonst "Invalid origin"), eigener E-Mail-Absender, eigene Google-Zugangsdaten
- [ ] Anmeldung per Code und per Google live getestet

## 7. Inhalt & Marke
- [ ] Texte DE und EN geprüft, richtige Schreibweise (ß / ss)
- [ ] Favicon und App-Icon in Markenfarbe
- [ ] Footer: „Made with ♥ by Susan Fleet“ vorhanden
- [ ] Strukturierte Daten (JSON-LD) vorhanden und gültig (Organization/LocalBusiness, FAQ wo passend)
- [ ] Suchbegriff der Seite steht im Title UND in der H1; Leistungsseiten 800+ Wörter

## 8. KI-Look (siehe DESIGN.md → „Typografie ohne KI-Look“)
- [ ] `npm run typocheck` ist grün: `letter-spacing` nur -0.03em / -0.015em / -0.01em / +0.06em (nur mit uppercase) oder 0
- [ ] Keine gesperrten Kleinbuchstaben, keine Buttons in Grossbuchstaben
- [ ] Höchstens 2 kleine Labels pro Seite, keine Eyebrows über Überschriften
- [ ] Keine gleich grossen Icon-Karten als Seitenstruktur, keine Emoji als Icons
- [ ] Bewegung: `prefers-reduced-motion` respektiert (Seite bleibt mit reduzierter Bewegung vollständig nutzbar)
- [ ] Im Launch-Check-Board ist die Gruppe „KI-Look“ grün

## Vor dem Scan
- [ ] `npm run typocheck` und `npm run selfcheck <Adresse>` sind grün
- [ ] Gescannt wird die echte Seite (nicht vercel.com/login einer geschützten Vorschau)
