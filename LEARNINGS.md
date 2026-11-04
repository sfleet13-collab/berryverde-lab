# Lernbuch – was beim Bauen gelernt wurde

Wird nach jeder App ergänzt (siehe „Lernschleife“ in CLAUDE.md). Neueste Einträge oben.
Status: ✅ in die Vorlage übernommen · 📌 nur Hinweis (gilt für bestimmte App-Arten)

---

## 2026-11-02 · Susan HQ: Morgen-Board, Launch-Check-Meldung

- 📌 **Weiss auf Markenfarbe ist im Dunkelmodus oft zu hell** (`#fff` auf hellem Petrol 2.5:1). In der Vorlage gibt es dafür `--on-brand` und `--accent-ink`, beide für Hell und Dunkel definiert – nie `#fff` hart auf `--brand`/`--accent` setzen. Die Prüfschleife fand vier solche Stellen in neuem CSS.
- 📌 **Prompt-Vorlagen für «An Claude» müssen mit `\n\n` enden**, weil `claudeLink()` die festen Regeln direkt anhängt; variable Teile (z. B. Scan-Punkte) vorher begrenzen, sonst kürzt `slice(0, 4000)` die Regeln statt der Punkte.
- 📌 **Benachrichtigungen an andere Dienste** (Webhook ans HQ) mit `after()` aus `next/server` nach der Antwort senden – sonst wartet der Stream bzw. die Antwort bis zu 8 s auf den fremden Server.
- 📌 **Webhook ohne Nutzerkontext** (Meldung von App zu App): nur im Privat-Modus annehmen, Treffer auf Projekte zugelassener Nutzer (`ALLOWED_EMAILS`) beschränken, Zeitstempel nie in die Zukunft lassen, Enum-Werte validieren. Schlüsselvergleich mit `timingSafeEqual`.
- 📌 **Datum anzeigen:** immer `timeZone: "Europe/Zurich"` mitgeben – Vercel rechnet in UTC, Abend-Ereignisse rutschen sonst auf den Vortag.

---

## 2026-11-02 · Vorlage: Typografie ohne KI-Look, Prüfschleife

- ✅ **Seiten wirkten KI-gebaut, obwohl die Regel „kein KI-Look“ feststand.** Ursache: Susans Typografie-Regeln (vier letter-spacing-Stufen, keine gesperrten Kleinbuchstaben, Buttons nicht in Grossbuchstaben, max. 2 Labels) standen nur in ihren Claude-Einstellungen, nicht in der Vorlage. `DESIGN.md` sagte bloss „enges Letter-Spacing“, und die Vorlage selbst nutzte sieben verschiedene Werte (-0.05em bis 0.4em). Niemand prüfte es.
  Lösung: Regeln wörtlich in `DESIGN.md` („Typografie ohne KI-Look“), alle CSS-Werte der Vorlage auf die vier Stufen gesetzt, neuer statischer Check `npm run typocheck` (läuft in `npm run check`), Block 8 „KI-Look“ in `LAUNCH-CHECK.md`. Der Launch-Check prüft dasselbe live.
- ✅ **Regeln wurden trotz Vorhandensein übergangen.** Eine Regel im Text ist eine Bitte, keine Pflicht. Lösung: „Prüfschleife“ in `CLAUDE.md`: maschinelle Prüfung plus unabhängiger zweiter Agent gegen LAUNCH-CHECK.md, **bevor** Susan das Ergebnis sieht. Rot → zurück zum Bauen, max. drei Runden.
- 📌 **Ausnahme beim Sperren:** Code-Eingabefelder (Ziffern, `tabular-nums`) dürfen gesperrt bleiben; `typocheck` erkennt das am `font-variant-numeric`.
- ✅ **Erster Durchlauf der Prüfschleife (Launch-Check-Umbau):** Der unabhängige Agent fand in Runde 1 vier echte Fehler, die der Bau selbst für richtig hielt (Wortzahl zählte Skript-Text mit; Kontrast verstand kein `oklch()`; Text auf Hero-Bildern als 1:1 gemeldet; Buttons mit Text in `<span>` übersehen), in Runde 2 fünf weitere. Nach drei Runden sauber. Regel bestätigt: Der Bau grädet sich nie selbst.
- 📌 **Messen im fremden Browser:** `getImageData` liefert NICHT vormultiplizierte Farbwerte (keine Alpha-Division). Farben jeder Schreibweise (`oklch`, `color-mix`) über einen Canvas-Kontext nach RGB wandeln. `elementsFromPoint` sieht nur den sichtbaren Ausschnitt – vorher `scrollIntoView`. Tailwinds `outline-none` ist `2px solid transparent`, also Outline-Alpha prüfen.

---

## 2026-10-19 · Frenetico Hauptseite: Repo statt ZIP

- ✅ **Überschrift nach Grösse statt nach Gliederung gewählt** (Angebotskarten als H4 direkt unter H2). Verstoss gegen Regel 3. Lösung: Ebene nach Gliederung wählen (H2 → H3), Optik nur über die CSS-Klasse steuern (`.card h3`). Vor jedem Commit prüfen: keine Ebene darf übersprungen werden.
- ✅ **Kundenseite lag nur beim Hoster, ohne Repo.** Deshalb griffen weder Regeln noch Lernbuch, und jede Korrektur lief als ZIP von Hand. Regel: Jede Kundenseite bekommt ein GitHub-Repo, auch reines HTML bei Hostinger. Erster Commit = exakter Live-Stand (per Hash gegen die Live-Seite geprüft), Korrekturen als eigene Commits danach.
- 📌 **Launch-Check-Fehlalarm „Bild defekt“:** Bilder mit `loading="lazy"` unterhalb des sichtbaren Bereichs sind beim Scan noch nicht geladen und wurden als defekt gemeldet. Live per Abruf geprüft: alle vier Partner-Bilder 200 OK. Vor „neu hochladen“ immer die Bild-Adresse direkt abrufen.
- 📌 **429-Fehler in der Konsole beim Scan von Hostinger-Seiten** sind die Bremse des Hosters gegen viele schnelle Abrufe (drei Durchläufe + Basis-Scan), kein Fehler der Seite. Im normalen Browser: keine Fehler.

---

## 2026-10-19 · Erste echte App aus der Vorlage: Susan HQ

- 📌 **Neue App anlegen – Ablauf, der funktioniert:** Susan klickt „Use this template“ (Claude darf keine Repos anlegen) → Claude: Vercel-Projekt verknüpfen, Datenbank, Login, Env-Variablen, Domain freigeben, Region fra1.
- 📌 **Neon ist über Vercel verwaltet:** Neue Neon-Projekte lassen sich nicht direkt anlegen („organization is managed by Vercel“). Lösung: im bestehenden Neon-Projekt eine eigene **Datenbank** pro App anlegen; Neon Auth kann geteilt werden (gleiche Anmeldung für Susans eigene Tools). Für Kunden-Apps: eigenes Neon-Projekt über die Vercel-Integration (Storage → Neon).
- 📌 **Neue Vercel-Projekte sind standardmässig auch in Produktion geschützt** (`all_except_custom_domains`). Für Apps mit eigenem Login auf `preview` stellen, sonst landet man (und der Launch-Check) auf vercel.com/login.
- 📌 **Region nach dem Anlegen setzen** (`fra1`) und danach neu deployen – das erste Deployment läuft sonst in den USA.
- 📌 **Private Werkzeug-Apps:** Footer nur mit Signatur, Kopf ohne Sprachumschalter/Kontakt, Start direkt im App-Bereich.

---

## 2026-10-19 · Starter-Vorlage: Demo-Bereich und Privat-Modus

- ✅ **Ein Demo-Bereich ohne Zweck verwirrt** („Ich trage etwas ein – und dann?“). Ein technischer Test darf nie wie eine Funktion aussehen. Jede Eingabe braucht eine sichtbare Folge und einen erkennbaren Nutzen.
  Lösung: „Mein Bereich“ ist jetzt eine echte, nützliche Ideen-Sammlung (Idee + Details, abhaken, löschen, „An Claude“ öffnet einen Chat mit der Idee).
- ✅ **Eigene Werkzeug-Apps gehören nicht öffentlich ins Netz.** Neuer Privat-Modus: `PRIVATE_MODE=1` + `ALLOWED_EMAILS` (siehe docs/LOGIN.md). Vercel-Schutz statt App-Login ist ungeeignet, weil er auf dem Handy-Home-Bildschirm stört.
- 📌 **Darstellung von Daten trennen** (`AppView` getrennt von Login/Datenabruf): So lässt sich die Oberfläche mit Beispieldaten prüfen, ohne echten Login.

---

## 2026-10-18 · Starter-Vorlage: Login (Neon Auth) + SEO auf Unterseiten

- ✅ **Unterseiten hatten kein og:image, zu kurze Titles/Descriptions** (z. B. „Mein Bereich“, 32 Zeichen). Ursache: Unterseiten überschreiben `openGraph` der Startseite komplett, und als Title wurde die H1 wiederverwendet.
  Lösung: `pageMetadata()` setzt og:image + Twitter-Bild auf JEDER Seite; eigene SEO-Texte pro Seite in `i18n → seo` (Title 50–60 inkl. „| Name“, Description 140–160).
- ✅ **404 zeigte zuerst einen Ladekreis bzw. eine leere Fehlerseite.** Ursache: `[lang]/loading.tsx` startet das Streaming vor `notFound()`; ohne loading.tsx greift `[lang]/not-found.tsx` bei dynamischem Hauptlayout nicht.
  Lösung: `app/global-not-found.tsx` (+ `experimental.globalNotFound`), Catch-all `[...rest]` entfernt. Kein globales `loading.tsx` – Suspense gezielt pro Bereich.
- ✅ **Neuer Selbst-Check** `npm run selfcheck <url>` prüft die festen Regeln (H1/H2, Title/Description-Länge, Canonical, lang, og:image, lokale Schriften, Rechtslinks, Cookies, Header, echte 404) – vor dem Launch-Check laufen lassen.
- 📌 **Launch-Check auf Vercel-Vorschauen:** Vorschauen sind durch Vercel geschützt, der Scan landet sonst auf vercel.com/login und meldet deren Fehler. Live-Adresse scannen oder „Protection Bypass for Automation“ nutzen.
- 📌 **Neon Auth:** Jede Domain (Live und Vorschau) muss in Neon unter Auth → Domains freigegeben sein, sonst „Invalid origin“ beim Code-Versand.
- 📌 **Neue Kontakt-/Rechtsseiten** brauchen mindestens eine H2 (Formular-Titel, „So geht es weiter“, Abschnitte).

---

## 2026-10-18 · Erster echter Launch-Check (Kunden-Landingpage)

- ✅ **Regeln wurden beim Bauen einer Landingpage außerhalb der Vorlage nicht umgesetzt** (Google Fonts extern geladen, lang-Attribut, Canonical, og:image, robots.txt und Sitemap fehlten), obwohl sie feststanden.
  Ursache: Die Regeln stehen in dieser Vorlage, die Seite wurde aber ohne sie gebaut.
  Lösung: Launch-Check-Scan ist jetzt Pflicht vor jeder Übergabe (CLAUDE.md → Arbeitsweise), für alle Webseiten. Bei Seiten außerhalb der Vorlage die festen Regeln aus CLAUDE.md trotzdem anwenden.
- ✅ **Impressum war eine Kopie der Startseite** – die Seite lud fehlerfrei, deshalb war der Check grün. Launch-Check prüft jetzt den Inhalt (Anschrift mit PLZ, § 5 DDG, nicht identisch mit der Startseite).
  Regel beim Bauen: Rechtsseiten nach dem Hochladen einmal öffnen und Titel/Inhalt kontrollieren.
- 📌 **Animationen, die von ausserhalb einfliegen** (`translate(38vw, …)`), verbreitern die Seite am Handy beim Laden. Lösung: `main{overflow-x:clip}` – der Effekt bleibt, die Seite wird nicht breiter.
- 📌 **Statische Seiten bei Hostinger:** Sicherheits-Header, 404-Seite, www- und /index.html-Weiterleitung per `.htaccess`; für Vercel dasselbe in `vercel.json`.
- ✅ **Eigene Webseite (susanfleet.de) war technisch sauber, aber für Google nur eine Visitenkarte:** 1 Seite, ~470 Wörter, H1 = Name, Suchbegriffe fehlten. Folge: gefunden nur bei Namenssuche.
  Lösung: Vorlage gilt jetzt ausdrücklich auch für Webseiten, mit „SEO-System für Webseiten“ in CLAUDE.md (eine Seite pro Suchabsicht, Keyword-Plan vor dem Bauen).
- 📌 **Claude direkt aus einer App öffnen:** `https://claude.ai/new?q=<Text>` öffnet Claude mit vorausgefülltem Eingabefeld. Text vorher zusätzlich in die Zwischenablage legen (Fallback) und bei sehr langen Texten (über ca. 6000 Zeichen kodiert) nur öffnen + einfügen lassen.
- 📌 **Bei mehrdeutigen Fehlern die Ursache unterscheiden:** z. B. „www nicht erreichbar“ kann fehlender DNS-Eintrag ODER fehlendes Zertifikat sein (Hostinger: www zeigte aufs CDN) – Lösungstext je Ursache, mit Klickpfad im Hoster.
- 📌 **Ablauf bei gefundenen Problemen:** Im Board „Fix-Auftrag kopieren“ → bei Claude einfügen → beheben → erneut scannen.

---

## 2026-10-18 · Launch-Check (Website-Prüf-Board)

- ✅ **`npm run check` war auf frischem Klon rot.** Die Next-Typen (`PageProps`, `LayoutProps`) entstehen erst beim Build.
  Lösung: `"typecheck": "next typegen && tsc --noEmit"` in `package.json`.
- 📌 **Headless-Chrome auf Vercel** (`playwright-core` + `@sparticuz/chromium`): Chrome läuft im Single-Process-Modus und beendet sich, wenn man einen Browser-Kontext schließt.
  Lösung: Kontexte nicht schließen, sondern auf `about:blank` „parken“; erst am Ende den Browser schließen.
  Außerdem in `next.config.ts` unter `outputFileTracingIncludes` BEIDE Pakete komplett mitpacken: `node_modules/@sparticuz/chromium/bin/**` UND `node_modules/playwright-core/**` – sonst fehlt auf Vercel `browsers.json` („Cannot find module …/playwright-core/browsers.json“), obwohl lokal alles läuft.
  Gegenprüfen vor dem Push: nur die Dateien aus `.next/server/app/<route>/route.js.nft.json` in einen leeren Ordner kopieren und Chrome von dort starten.
- 📌 **Fehler im Fallback immer auch per `console.error` loggen** – sonst stehen sie nur in der Oberfläche und nicht in den Vercel-Logs.
- 📌 **Code, der im fremden Browser läuft** (`page.evaluate`), als reinen JavaScript-Text schreiben – Build-Tools fügen sonst Hilfsfunktionen ein, die dort fehlen.
- 📌 **Lange Server-Aufgaben** (über 10 s): Fortschritt als Stream (NDJSON) an die Oberfläche schicken statt die Nutzerin warten zu lassen; `maxDuration` in der Route setzen.
- 📌 **Daten an Client-Komponenten:** Texte im Wörterbuch (`i18n`) dürfen keine Funktionen enthalten – sie lassen sich nicht an den Browser übergeben. Platzhalter wie `{n}` nutzen.
- 📌 **Werkzeug-Apps** (nur für Susan/Team): Startseite `noindex`, `robots.txt` sperrt alles, Zugriff per Schlüssel in Umgebungsvariable, bis ein Login (Neon Auth) nötig ist.

---

## 2026-10-18 (Abend) · Launch-Check und susanfleet.de

- ✅ **Browser-Scan hing endlos bei „Cookies vor der Einwilligung“.** Ursache: Chrome auf Vercel lief an die Ressourcengrenze (`ERR_INSUFFICIENT_RESOURCES`) und fror ein; Playwright-Aufrufe wie `page.evaluate()` oder `page.content()` haben **kein eigenes Zeitlimit**.
  Lösung: Jeden Browser-Schritt mit hartem Zeitlimit umschliessen (`withTimeout`, `Promise.race`), bei Zeitüberschreitung Schritt als „fail“ melden, offene Schritte schliessen und mit dem Basis-Scan weitermachen. Auch `browser.close()` nur mit Zeitlimit abwarten.
  Regel: **Keine lange Server-Aufgabe ohne Gesamt- und Schritt-Zeitlimit** – die Oberfläche darf nie endlos „läuft …“ zeigen.
- ✅ **Fix-Auftrag bezog sich auf die falsche Seite:** Gescannt wurde eine geschützte Vercel-Vorschau, bewertet wurde die Vercel-Login-Seite. Lösung: Vor dem Beheben prüfen, ob die gescannte Adresse wirklich die Kundenseite ist (H1/Title/Canonical passen?). Launch-Check soll Weiterleitungen auf Login-Seiten erkennen und den Scan abbrechen statt Punkte zu melden.
- 📌 **Cookie-Banner nur bei Bedarf:** Ohne Cookies, Tracking und externe Einbettungen ist kein Banner nötig. Gegenprüfen im echten Browser (Cookies, localStorage, alle Anfragen nur an die eigene Domain), nicht aus dem Quelltext schliessen. Datenschutzerklärung trotzdem mit Hoster und Satz „keine Cookies“.
- 📌 **Stand vor jedem Rat prüfen:** Hosting- und DNS-Entscheidungen können in einem anderen Chat gefallen sein. Vor Empfehlungen zu Hosting, DNS oder Löschen zuerst Projekt-Notizen bzw. frühere Chats und den Live-Stand (DNS, Vercel-Domains) prüfen. Nie ein Projekt zum Löschen vorschlagen, ohne das zu tun.
- 📌 **Halber Domain-Umzug:** Wird nur `www` oder nur `@` umgestellt, sehen Besucher je nach Adresse alte oder neue Seite. Nach DNS-Änderung beide Einträge prüfen (Vercel → Domains → Konfiguration) und erst dann Zertifikats-Themen beim alten Hoster angehen – nach dem Umzug stellt Vercel die Zertifikate selbst aus.
- 📌 **Vercel-Eintrag auf GitHub ist normal:** Ein mit Vercel verbundenes Repo zeigt „Deployments“ mit `*.vercel.app`. In GitHub unter About → Website die echte Domain eintragen.
