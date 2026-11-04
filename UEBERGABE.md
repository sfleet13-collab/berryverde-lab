# Übergabe an Kunden

Zwei Wege. Pro Kunde entscheiden.

## Weg A: App bleibt bei Susan (Empfehlung für kleine Kunden)
Kunde zahlt Hosting + Betreuung monatlich. Alles bleibt in Susans Konten.
- [ ] Vercel-Projekt im Susan-Team, Domain des Kunden verbunden
- [ ] Neon (inkl. Login), Resend laufen über Susans Konten
- [ ] Betreuungsvertrag: Leistungen, Preis, Kündigung, Datenübergabe bei Ende
- [ ] Auftragsverarbeitungsvertrag (AVV) mit dem Kunden

## Weg B: Komplette Übergabe ("Setup as a Service")
Kunde besitzt am Ende alles selbst.

### Voraussetzungen beim Kunden
- [ ] GitHub-Konto (gratis)
- [ ] Vercel-Konto **Pro** (kommerzielle Nutzung, ca. 20 $/Monat)
- [ ] Neon-Konto (über Vercel Marketplace) – oder Datenbank wird mit übertragen
- [ ] Resend-Konto (falls E-Mails verschickt werden)

### Schritte
1. [ ] Finalen Stand in `main`, `npm run check` grün, LAUNCH-CHECK erledigt
2. [ ] GitHub: Settings → Danger Zone → **Transfer ownership** an den Kunden
3. [ ] Vercel: Project Settings → **Transfer Project** in das Team des Kunden
4. [ ] Neon: Datenbank mit übertragen oder beim Kunden neu anlegen und Daten exportieren/importieren
5. [ ] Neon Auth: Domain, E-Mail-Absender und Google-Zugangsdaten auf den Kunden umstellen, neuen `NEON_AUTH_COOKIE_SECRET` setzen
6. [ ] Alle Umgebungsvariablen beim Kunden prüfen (`.env.example` als Liste)
7. [ ] Domain: DNS beim Kunden auf das neue Vercel-Projekt zeigen lassen
8. [ ] Zugänge von Susan entfernen (oder als Betreuerin behalten, schriftlich vereinbaren)
9. [ ] Übergabe-Protokoll mit allen Zugängen und Kosten an den Kunden

### Wichtig
- Keine Passwörter per E-Mail – Zugänge legt der Kunde selbst an und lädt Susan ein.
- Footer „Made with ♥ by Susan Fleet“ bleibt (im Angebot festhalten).
