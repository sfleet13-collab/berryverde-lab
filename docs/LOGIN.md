# Login einrichten (Neon Auth)

Der Login läuft über **Neon Auth**. Nutzer und Sitzungen liegen in derselben Neon-Datenbank wie die App-Daten (Schema `neon_auth`). Kein zusätzlicher Dienst, kein zusätzliches Konto.

**Anmeldearten in der Vorlage:**
- Code per E-Mail (6 Ziffern, kein Passwort)
- Google

## Einrichten – Schritt für Schritt

1. **Neon Auth aktivieren**
   Neon Console → Projekt → **Auth** → aktivieren. Vercel übernimmt `NEON_AUTH_BASE_URL` automatisch (über die Neon-Integration).

2. **Cookie-Schlüssel setzen**
   In Vercel → Settings → Environment Variables:
   `NEON_AUTH_COOKIE_SECRET` = zufälliger Wert, mindestens 32 Zeichen, als **Sensitive** markieren.
   Erzeugen (Terminal): `openssl rand -base64 32`

3. **Domain freigeben**
   Neon Console → Auth → **Domains**: die Live-Domain eintragen (z. B. `https://meine-app.ch`).
   Für Vercel-Vorschauen die feste Branch-Adresse ergänzen (`https://<projekt>-git-<branch>-<team>.vercel.app`).
   Ohne Eintrag lehnt Neon den Code-Versand ab (Fehler im Log: "Invalid origin").

4. **E-Mail-Absender (für den Code)**
   Neon Console → Auth → **Email**: eigenen SMTP-Absender eintragen (z. B. Resend), damit der Code von der App-Domain kommt.

5. **Google (für Produktion)**
   Google Cloud Console → OAuth-Client (Web) anlegen.
   Weiterleitungs-URL aus der Neon Console übernehmen, Client-ID und Secret in Neon Auth → Google eintragen.
   Ohne eigene Zugangsdaten nutzt Neon Test-Zugangsdaten, das reicht nur für Entwicklung.

6. **Neu deployen** – fertig. `/de/app` ist jetzt geschützt.

## Wie es im Code aufgebaut ist

| Datei | Aufgabe |
|---|---|
| `src/lib/neon-auth.ts` | Verbindung zu Neon Auth (nur hier) |
| `src/lib/auth.ts` | **Einzige Schnittstelle für die App:** `getCurrentUser()`, `isAdmin()` |
| `src/proxy.ts` | Schützt `/de/app` und `/en/app`, leitet sonst zur Anmeldung |
| `src/app/api/auth/[...path]/route.ts` | Technischer Endpunkt für Neon Auth |
| `src/app/[lang]/anmelden/page.tsx` | Anmeldeseite (noindex) |
| `src/lib/actions/auth.ts` | Code senden, Code prüfen, Abmelden |

## Privat-Modus (eigene Werkzeug-Apps)

`PRIVATE_MODE=1` → jede Seite nur mit Login, Startseite führt direkt in den App-Bereich, `noindex` + robots sperrt alles.
`ALLOWED_EMAILS=a@b.ch,c@d.ch` → nur diese Adressen bekommen einen Code (gilt auch für Google-Login).
Impressum, Datenschutz, AGB und die Anmeldeseite bleiben ohne Login erreichbar.

## Rollen

Beim ersten Login entsteht ein Eintrag in `profiles` mit Rolle `user`.
Admin vergeben: in Neon → Tables → `profiles` → `role` auf `admin` setzen.

## Fallback

Ohne `NEON_AUTH_COOKIE_SECRET` läuft die App weiter, der geschützte Bereich zeigt einen Hinweis und eine Vorschau.
Wechsel zu einem anderen Anbieter (z. B. Clerk): nur `src/lib/neon-auth.ts`, `src/lib/auth.ts` und die Anmeldeseite anpassen – der Rest der App bleibt gleich.
