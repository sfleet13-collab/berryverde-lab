import assert from "node:assert/strict";
import { test } from "node:test";
import { seedRezepturen, seedRohstoffe } from "../../db/seed-data";
import { berechne, chargenNummer, inciListe, mengeFuer, mengeText } from "./rechner";
import { pruefe, wendeAn } from "./regeln";
import type { LabPosition, LabRezeptur, LabRohstoff, Phase } from "./types";

const liste: LabRohstoff[] = seedRohstoffe.map((s, i) => ({
  id: i + 1,
  slug: s.slug,
  name: s.name,
  inci: s.inci,
  kategorie: s.kategorie,
  phase: s.phase,
  form: s.form,
  dichte: s.dichte ?? null,
  tropfenfaktor: null,
  phMin: s.phMin ?? null,
  phMax: s.phMax ?? null,
  tempMax: s.tempMax ?? null,
  stufe: s.stufe,
  konsStatus: s.konsStatus ?? null,
  konsRolle: s.konsRolle ?? null,
  kombiPartner: s.kombiPartner ?? null,
  nichtWaessrig: s.nichtWaessrig ?? false,
  emulgatorTyp: s.emulgatorTyp ?? null,
  fettphaseMin: s.fettphase?.[0] ?? null,
  fettphaseMax: s.fettphase?.[1] ?? null,
  emulgatorBezug: s.emulgatorBezug ?? null,
  dosierungen: (s.dos ?? []).map(([produkttyp, min, max, hinweis]) => ({ produkttyp, min, max, hinweis })),
}));
const map = new Map(liste.map((r) => [r.id, r]));
const id = (slug: string) => liste.find((r) => r.slug === slug)!.id;
const R = (slug: string) => liste.find((r) => r.slug === slug)!;

let n = 0;
function pos(slug: string, prozent: number, opt: { phase?: Phase; ad?: boolean } = {}): LabPosition {
  return { key: `k${++n}`, rohstoffId: id(slug), phase: opt.phase ?? R(slug).phase, prozent, adHundert: opt.ad ?? false };
}
function rez(p: Partial<LabRezeptur> & { positionen: LabPosition[] }): LabRezeptur {
  return { produkttyp: "emulsion", bereich: "gesicht", chargeG: 50, phZiel: 5.2, frischcreme: false, ...p };
}
const codes = (r: LabRezeptur) => pruefe(r, map).meldungen.filter((m) => m.art !== "hinweis").map((m) => m.code);

/** Saubere Standard-Creme: 22 % Fettphase mit Xyliance, Xanthan, Cosgard. */
const creme = () =>
  rez({
    positionen: [
      pos("wasser", 0, { ad: true }),
      pos("glycerin", 3),
      pos("xanthan", 0.2),
      pos("xyliance", 4),
      pos("mandeloel", 12),
      pos("sheabutter", 4),
      pos("cetylalkohol", 1.7),
      pos("tocopherol", 0.3),
      pos("panthenol", 1),
      pos("cosgard", 1),
    ],
  });

test("R-001: Summe 100, Gramm stimmen, keine Fehler, Feinwaage nötig", () => {
  const s = seedRezepturen[0];
  const r = rez({ produkttyp: "wasserfrei", chargeG: 30, phZiel: null, positionen: s.positionen.map(([slug, p]) => pos(slug, p)) });
  const p = pruefe(r, map);
  assert.equal(p.berechnung.summe, 100);
  assert.deepEqual(p.berechnung.positionen.map((x) => x.gramm), [15, 6, 4.5, 4.2, 0.3]);
  assert.equal(p.ok, true);
  assert.deepEqual(p.meldungen.filter((m) => m.art !== "hinweis"), []);
  assert.equal(p.stufe, "anfaenger");
  assert.ok(p.geraete.some((g) => g.slug === "feinwaage" && g.pflicht));
  assert.deepEqual(inciListe(p.berechnung), ["Kaolin", "Zea Mays Starch", "Illite", "Sodium Chloride", "Papain"]);
});

test("R-001 sensibel: Summe 100 ohne Salz", () => {
  const s = seedRezepturen[1];
  const p = pruefe(rez({ produkttyp: "wasserfrei", chargeG: 30, phZiel: null, positionen: s.positionen.map(([slug, x]) => pos(slug, x)) }), map);
  assert.equal(p.berechnung.summe, 100);
  assert.equal(p.ok, true);
});

test("ad 100: Wasser füllt auf, Fettphase und Emulgatoranteil", () => {
  const b = berechne(creme(), map);
  assert.equal(b.summe, 100);
  assert.equal(b.positionen[0].prozentEffektiv, 72.8);
  assert.equal(b.positionen[0].gramm, 36.4);
  assert.equal(b.fettphase, 22);
  assert.deepEqual(b.emulgator, { gesamt: 4, aufFettphase: 18.2 });
  assert.equal(b.konserviererGesamt, 1);
});

test("Standard-Creme besteht die Prüfung", () => {
  assert.deepEqual(codes(creme()), []);
});

test("Tropfen-Regel: bis 20 Tropfen, darüber ml, Festes in Gramm", () => {
  assert.deepEqual(mengeFuer(R("tocopherol"), 0.15), { art: "tropfen", tropfen: 3, gramm: 0.15 });
  assert.equal(mengeText(mengeFuer(R("cosgard"), 0.9)), "20 Tropfen");
  const ml = mengeFuer(R("mandeloel"), 6);
  assert.equal(ml.art, "ml");
  assert.equal(mengeText(ml), "6,6 ml");
  assert.equal(mengeText(mengeFuer(R("glycerin"), 2.52)), "2 ml");
  assert.deepEqual(mengeFuer(R("papain"), 0.3), { art: "gramm", gramm: 0.3, feinwaage: true });
  assert.equal(mengeText(mengeFuer(R("sheabutter"), 2)), "2,00 g");
});

test("Emulgator außerhalb des Bereichs: Vorschlag ist der nächste gültige Wert", () => {
  const r = creme();
  r.positionen.find((p) => p.rohstoffId === id("xyliance"))!.prozent = 2;
  const m = pruefe(r, map).meldungen.find((x) => x.code === "emulgator-menge")!;
  assert.equal(m.art, "fehler");
  assert.equal(m.korrektur!.setze![0].prozent, 3);
  const neu = wendeAn(r.positionen, m.korrektur!, map, () => "neu");
  assert.ok(!codes({ ...r, positionen: neu }).includes("emulgator-menge"));
});

test("Fettphase zu klein: Vorschlag hebt das größte Öl an", () => {
  const r = creme();
  r.positionen.find((p) => p.rohstoffId === id("mandeloel"))!.prozent = 5;
  const p = pruefe(r, map);
  const m = p.meldungen.find((x) => x.code === "fettphase")!;
  assert.equal(p.berechnung.fettphase, 15);
  assert.equal(m.korrektur!.setze![0].prozent, 10);
  const neu = wendeAn(r.positionen, m.korrektur!, map, () => "neu");
  assert.equal(berechne({ ...r, positionen: neu }, map).fettphase, 20);
});

test("Xyliance unter 25 % Fettphase ohne Xanthan: Warnung mit Ergänzung", () => {
  const r = creme();
  r.positionen = r.positionen.filter((p) => p.rohstoffId !== id("xanthan"));
  const m = pruefe(r, map).meldungen.find((x) => x.code === "xyliance-xanthan")!;
  assert.equal(m.art, "warnung");
  const neu = wendeAn(r.positionen, m.korrektur!, map, () => "neu");
  assert.ok(neu.some((p) => p.rohstoffId === id("xanthan") && p.prozent === 0.2));
  assert.equal(berechne({ ...r, positionen: neu }, map).summe, 100);
});

test("Wasser ohne Konservierer: Fehler, als Frischcreme nur Warnung mit 7 Tagen", () => {
  const r = creme();
  r.positionen = r.positionen.filter((p) => p.rohstoffId !== id("cosgard"));
  const p = pruefe(r, map);
  assert.ok(!p.ok);
  const m = p.meldungen.find((x) => x.code === "kons-fehlt")!;
  assert.equal(m.korrektur!.hinzu![0].slug, "cosgard");
  const frisch = pruefe({ ...r, frischcreme: true }, map);
  assert.ok(frisch.ok);
  assert.equal(frisch.meldungen.find((x) => x.code === "frischcreme")!.art, "warnung");
  assert.equal(frisch.haltbarkeitMaxTage, 7);
});

test("Konservierer: Dosierung, pH, Kaltphase", () => {
  const r = creme();
  const c = r.positionen.find((p) => p.rohstoffId === id("cosgard"))!;
  c.prozent = 0.6;
  assert.ok(codes(r).includes("kons-menge"));
  // 0,5 % Cosgard + 0,2 % Kaliumsorbat ist erlaubt
  c.prozent = 0.5;
  r.positionen.push(pos("kaliumsorbat", 0.2));
  assert.ok(!codes(r).includes("kons-menge"));
  // zu hoher pH
  assert.ok(codes({ ...creme(), phZiel: 7.5 }).includes("kons-ph"));
  // in der Wasserphase mit erhitzt
  const heiss = creme();
  heiss.positionen.find((p) => p.rohstoffId === id("cosgard"))!.phase = "wasser";
  const m = pruefe(heiss, map).meldungen.find((x) => x.code === "zu-heiss")!;
  assert.equal(m.korrektur!.phase![0].phase, "kalt");
});

test("Rokonsal: nur unter pH 5,4", () => {
  const r = creme();
  r.positionen = r.positionen.map((p) => (p.rohstoffId === id("cosgard") ? { ...p, rohstoffId: id("rokonsal-bsb-n") } : p));
  assert.deepEqual(codes({ ...r, phZiel: 5.2 }), []);
  assert.ok(codes({ ...r, phZiel: 5.5 }).includes("kons-ph"));
});

test("Wässrig: Cosgard löst sich nicht, Ersatz Verstatil BL", () => {
  const r = rez({ produkttyp: "waessrig", chargeG: 100, phZiel: 5, positionen: [pos("wasser", 0, { ad: true }), pos("glycerin", 3), pos("cosgard", 1)] });
  const m = pruefe(r, map).meldungen.find((x) => x.code === "kons-loeslich")!;
  assert.equal(m.art, "fehler");
  const neu = wendeAn(r.positionen, m.korrektur!, map, () => "neu");
  assert.deepEqual(codes({ ...r, positionen: neu }), []);
});

test("Additiv allein reicht nicht, Kombi-Partner wird verlangt", () => {
  const r = creme();
  r.positionen = r.positionen.map((p) => (p.rohstoffId === id("cosgard") ? { ...p, rohstoffId: id("dermosoft-1388-eco"), prozent: 3.5 } : p));
  const c = codes(r);
  assert.ok(c.includes("kons-nicht-ausreichend"));
  assert.ok(c.includes("kombi-partner"));
  r.positionen.push(pos("dermosoft-gmcy", 0.5));
  const c2 = codes(r);
  assert.ok(!c2.includes("kons-nicht-ausreichend") && !c2.includes("kombi-partner"));
  assert.ok(c2.includes("kons-additiv"));
});

test("Kaliumsorbat allein ist nur Ko-Konservierer", () => {
  const r = creme();
  r.positionen = r.positionen.map((p) => (p.rohstoffId === id("cosgard") ? { ...p, rohstoffId: id("kaliumsorbat"), prozent: 0.2 } : p));
  assert.ok(codes(r).includes("kons-nicht-ausreichend"));
});

test("Alkohol konserviert ab 12 % der Wasserphase", () => {
  const r = creme();
  r.positionen = r.positionen.map((p) => (p.rohstoffId === id("cosgard") ? { ...p, rohstoffId: id("alkohol"), prozent: 5 } : p));
  assert.ok(codes(r).includes("alkohol-zu-wenig"));
  r.positionen.find((p) => p.rohstoffId === id("alkohol"))!.prozent = 12;
  // Wasserphase = Wasser 61,8 + Glycerin 3 + Xanthan 0,2 = 65 → 12/65 = 18,5 %
  assert.ok(!codes(r).includes("alkohol-zu-wenig") && !codes(r).includes("kons-fehlt"));
});

test("Ätherisches Öl: 0,5 % im Gesicht, 1 % am Körper", () => {
  const r = creme();
  r.positionen.push(pos("aetherisches-oel", 0.8));
  const m = pruefe(r, map).meldungen.find((x) => x.code === "aetherisch")!;
  assert.equal(m.korrektur!.setze![0].prozent, 0.5);
  assert.ok(!codes({ ...r, bereich: "koerper" }).includes("aetherisch"));
});

test("Summe ohne Ausgleich: Fehler mit Vorschlag", () => {
  const r = rez({ produkttyp: "wasserfrei", phZiel: null, positionen: [pos("jojobaoel", 60), pos("mandeloel", 30), pos("tocopherol", 0.3)] });
  const p = pruefe(r, map);
  const m = p.meldungen.find((x) => x.code === "summe")!;
  assert.equal(m.korrektur!.setze![0].prozent, 69.7);
  const neu = wendeAn(r.positionen, m.korrektur!, map, () => "neu");
  assert.deepEqual(codes({ ...r, positionen: neu }), []);
});

test("Gesichtsöl ohne Tocopherol: Warnung, Ergänzung hält die Summe bei 100", () => {
  const r = rez({ produkttyp: "wasserfrei", phZiel: null, positionen: [pos("jojobaoel", 60), pos("squalan", 40)] });
  const m = pruefe(r, map).meldungen.find((x) => x.code === "antioxidans")!;
  const neu = wendeAn(r.positionen, m.korrektur!, map, () => "neu");
  const b = berechne({ ...r, positionen: neu }, map);
  assert.equal(b.summe, 100);
  assert.deepEqual(codes({ ...r, positionen: neu }), []);
});

test("Wasser in wasserfreier Rezeptur ist ein Fehler", () => {
  const r = rez({ produkttyp: "wasserfrei", phZiel: null, positionen: [pos("jojobaoel", 89.7), pos("wasser", 10), pos("tocopherol", 0.3)] });
  assert.ok(codes(r).includes("wasser-in-wasserfrei"));
});

test("Stufe der Rezeptur = höchste Stufe der Rohstoffe", () => {
  assert.equal(pruefe(creme(), map).stufe, "mittel"); // Xanthan
  const r = creme();
  r.positionen = r.positionen.map((p) => (p.rohstoffId === id("xyliance") ? { ...p, rohstoffId: id("dermofeel-gsc"), prozent: 3 } : p));
  assert.equal(pruefe(r, map).stufe, "profi");
});

test("Chargennummer", () => {
  assert.equal(chargenNummer(new Date(2026, 10, 15), "R-001"), "261115-R001");
});
