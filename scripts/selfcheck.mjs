/**
 * Selbst-Check vor jedem Launch-Check: prüft die festen Regeln aus CLAUDE.md
 * an der laufenden App (lokal oder Vorschau).
 *
 *   npm run build && npx next start -p 3100   (zweites Terminal)
 *   node scripts/selfcheck.mjs http://localhost:3100
 */
const base = (process.argv[2] ?? "http://localhost:3100").replace(/\/$/, "");
const pages = ["/de", "/en", "/de/kontakt", "/de/impressum", "/de/datenschutz", "/de/agb", "/de/anmelden", "/de/app", "/en/kontakt"];
const swiss = (s) => s.replace(/&amp;/g, "&").replace(/&#x27;|&#39;/g, "'").replace(/&quot;/g, '"');
let errors = 0;
const fail = (page, msg) => { errors++; console.log(`  ✗ ${page}: ${msg}`); };

for (const path of pages) {
  const res = await fetch(base + path, { redirect: "manual" });
  if (res.status >= 300 && res.status < 400) { console.log(`  · ${path}: Weiterleitung (${res.headers.get("location")}) – übersprungen`); continue; }
  const html = await res.text();
  const head = html.slice(0, html.indexOf("</head>"));
  const body = html.slice(html.indexOf("<body"), html.indexOf('<script>(self.__next_f'));
  const noindex = /name="robots" content="noindex/.test(head);
  const h1 = (body.match(/<h1[\s>]/g) ?? []).length;
  if (h1 !== 1) fail(path, `${h1} H1 statt genau 1`);
  if (!noindex && !/<h2[\s>]/.test(body)) fail(path, "keine H2");
  const title = swiss(head.match(/<title>([^<]*)<\/title>/)?.[1] ?? "");
  if (title.length < 50 || title.length > 60) fail(path, `Title ${title.length} Zeichen: „${title}“`);
  const desc = swiss(head.match(/name="description" content="([^"]*)"/)?.[1] ?? "");
  if (desc.length < 140 || desc.length > 160) fail(path, `Description ${desc.length} Zeichen`);
  const canonical = head.match(/rel="canonical" href="([^"]*)"/)?.[1] ?? "";
  if (!canonical.endsWith(path)) fail(path, `Canonical ${canonical || "fehlt"}`);
  if (!/<html lang="/.test(html)) fail(path, "lang-Attribut fehlt");
  if (!/property="og:image"/.test(head)) fail(path, "og:image fehlt");
  if (/fonts\.(googleapis|gstatic)\.com/.test(html)) fail(path, "Google Fonts extern geladen");
  if (!/href="\/(de|en)\/impressum"/.test(body) || !/href="\/(de|en)\/datenschutz"/.test(body)) fail(path, "Impressum/Datenschutz nicht verlinkt");
  if (res.headers.get("set-cookie")) fail(path, `Cookie ohne Einwilligung: ${res.headers.get("set-cookie").split(";")[0]}`);
  for (const h of ["permissions-policy", "x-content-type-options", "referrer-policy", "x-frame-options"]) if (!res.headers.get(h)) fail(path, `Header ${h} fehlt`);
  console.log(`  ✓ ${path}`);
}

const nf = await fetch(base + "/de/gibt-es-nicht-123");
const nfHtml = await nf.text();
if (nf.status !== 404) fail("404", `Status ${nf.status} statt 404`);
if (!/<h1[^>]*>Seite nicht gefunden/.test(nfHtml.split('<script>(self.__next_f')[0])) fail("404", "Fehlertext steht nicht direkt im HTML");
for (const f of ["/robots.txt", "/sitemap.xml"]) if ((await fetch(base + f)).status !== 200) fail(f, "fehlt");

console.log(errors ? `\n${errors} Problem(e) gefunden.` : "\nAlles grün.");
process.exit(errors ? 1 : 0);
