# Susan App Starter

Die Basis für jede neue Web-App von **Susan Fleet · Digital Business**.
Login, Datenbank, Rollen, SEO, Datenschutz, DE/EN und Design-System sind schon drin.

**Stack:** GitHub → Next.js 16 → Vercel → Neon (Datenbank) → Neon Auth (Login)

---

## Neue App starten (Checkliste)

1. Auf GitHub in diesem Repository **„Use this template“ → „Create a new repository“** (privat)
2. In Vercel: **Add New → Project**, das neue Repository auswählen → Deploy
3. In Vercel unter **Storage**: Neon-Datenbank verbinden, Name `<app>-db`, Region Frankfurt (setzt `DATABASE_URL` automatisch)
4. In Vercel unter **Settings → Environment Variables**: `NEXT_PUBLIC_SITE_URL` setzen
5. `src/config/site.ts` anpassen: Name, Kurzname, Schreibweise (`de-DE` / `de-CH`), Betreiber
6. Marke anpassen nach `DESIGN.md` (Farben, Schriften, Icon)
7. Texte in `src/i18n/de.ts` und `src/i18n/en.ts` anpassen
8. Datenbank-Tabellen: werden beim Deployment automatisch angelegt (Migrationen in `/drizzle`)
9. Login einrichten: `docs/LOGIN.md`
10. Rechtstexte einsetzen (Impressum, Datenschutz, AGB)
11. Vor dem Go-live: `LAUNCH-CHECK.md` komplett abarbeiten

---

## Was drin ist

| Bereich | Wo |
|---|---|
| Zentrale Einstellungen | `src/config/site.ts` |
| Design-Variablen (Farben, Abstände, Bewegung) | `src/app/globals.css` |
| Schriften (lokal, DSGVO-sicher) | `src/fonts`, `src/app/fonts.ts` |
| Texte DE / EN | `src/i18n/` |
| Meta-Daten, Canonical, hreflang | `src/lib/seo.ts` |
| Sitemap, robots.txt, Manifest (PWA) | `src/app/sitemap.ts`, `robots.ts`, `manifest.ts` |
| Vorschaubild für Social Media | `src/app/[lang]/opengraph-image.tsx` |
| Datenbank-Tabellen | `src/db/schema.ts` |
| Datenzugriff mit User-ID-Trennung | `src/lib/data.ts` |
| Login und Rollen | `src/lib/auth.ts` |
| Kontaktformular + E-Mail (Resend) | `src/components/ContactForm.tsx`, `src/lib/mail.ts` |
| Cookie-Banner (nur bei Tracking) | `src/components/ConsentBanner.tsx` |
| Rechtsseiten | `src/app/[lang]/impressum`, `datenschutz`, `agb` |
| Sicherheits-Header | `next.config.ts` |
| Design-Skills für Claude | `.claude/skills/` |

---

## Befehle

```bash
npm install        # einmalig
npm run dev        # lokal starten: http://localhost:3000
npm run check      # Lint + Typen + Build (vor jedem Commit)
npm run db:generate # nach Änderung an src/db/schema.ts: neue Migration erzeugen
npm run db:migrate  # Migrationen manuell ausführen (passiert sonst beim Deployment)
npm run db:studio  # Datenbank im Browser ansehen
```

Umgebungsvariablen: siehe `.env.example`.

---

## Dokumente

- `CLAUDE.md` – Regeln für Claude beim Bauen
- `DESIGN.md` – Design-Regeln
- `LAUNCH-CHECK.md` – Prüfliste vor dem Go-live
- `LEARNINGS.md` – Lernbuch: was beim Bauen jeder App gelernt wurde
- `UEBERGABE.md` – App an Kunden übergeben
- `docs/LOGIN.md` – Login einrichten (Neon Auth)

---

Design-Skills: [Impeccable](https://github.com/pbakaus/impeccable) (Apache-2.0) und [Emil Kowalski Skills](https://github.com/emilkowalski/skills) (MIT), Lizenzen in den jeweiligen Ordnern.

Made with ♥ by Susan Fleet · [lappzz.com](https://lappzz.com)
