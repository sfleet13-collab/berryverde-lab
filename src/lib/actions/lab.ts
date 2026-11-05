"use server";

import { del, put } from "@vercel/blob";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { AUSRUESTUNG, BEREICHE, EMULSIONSTYPEN, FORMEN, KATEGORIEN, PHASEN, PRODUKTTYPEN, STUFEN, TENSIDKLASSEN } from "@/db/schema";
import { isAdmin } from "@/lib/auth";
import {
  addZugang,
  alsLab,
  copyRezeptur,
  deleteRezeptur,
  deleteZugang,
  listRohstoffe,
  saveGeraetLink,
  saveRezeptur,
  saveRohstoff,
  setRezepturFoto,
  updateZugang,
  type DosierungEingabe,
  type RezepturEingabe,
  type RohstoffEingabe,
} from "@/lib/data";
import { pruefe } from "@/lib/lab/regeln";
import type { Phase, Produkttyp, Stufe } from "@/lib/lab/types";
import { requireAdmin, requireMitglied } from "@/lib/session";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function text(v: unknown, max: number): string | null {
  const s = typeof v === "string" ? v.trim().slice(0, max) : "";
  return s || null;
}
function num(v: unknown, min: number, max: number): number | null {
  const n = typeof v === "number" ? v : Number(String(v ?? "").replace(",", "."));
  if (!Number.isFinite(n) || String(v ?? "").trim() === "") return null;
  return Math.min(max, Math.max(min, n));
}
function eins<T extends string>(v: unknown, erlaubt: readonly T[], standard: T): T {
  return (erlaubt as readonly string[]).includes(String(v)) ? (v as T) : standard;
}
function link(v: unknown): string | null {
  const s = text(v, 500);
  return s && /^https:\/\//i.test(s) ? s : null;
}

// ---------------------------------------------------------------- Rezepturen

export type SpeicherErgebnis = { ok: true; id: number } | { ok: false; fehler: string };

/** Speichert eine Rezeptur aus dem Rechner. Die Stufe wird aus den Rohstoffen ermittelt. */
export async function speichereRezeptur(id: number | null, roh: unknown): Promise<SpeicherErgebnis> {
  const user = await requireMitglied();
  const e = (roh ?? {}) as Record<string, unknown>;
  const name = text(e.name, 120);
  if (!name) return { ok: false, fehler: "Bitte gib der Rezeptur einen Namen." };

  const rohstoffe = alsLab(await listRohstoffe(user));
  const map = new Map(rohstoffe.map((r) => [r.id, r]));
  const positionen = (Array.isArray(e.positionen) ? e.positionen : [])
    .slice(0, 60)
    .map((p) => p as Record<string, unknown>)
    .filter((p) => map.has(Number(p.rohstoffId)))
    .map((p) => ({
      rohstoffId: Number(p.rohstoffId),
      phase: eins(p.phase, PHASEN, map.get(Number(p.rohstoffId))!.phase) as Phase,
      prozent: num(p.prozent, 0, 100) ?? 0,
      adHundert: p.adHundert === true,
    }));
  // höchstens ein Ausgleichsposten
  let ausgleich = false;
  for (const p of positionen) {
    if (p.adHundert && ausgleich) p.adHundert = false;
    if (p.adHundert) ausgleich = true;
  }

  const produkttyp = eins(e.produkttyp, PRODUKTTYPEN, "emulsion") as Produkttyp;
  const emulsionstyp = produkttyp === "emulsion" ? eins(e.emulsionstyp, EMULSIONSTYPEN, "ow") : null;
  const bereich = eins(e.bereich, BEREICHE, "gesicht");
  const chargeG = num(e.chargeG, 1, 5000) ?? 30;
  const phZiel = num(e.phZiel, 0, 14);
  const frischcreme = e.frischcreme === true;
  const pruefung = pruefe(
    { produkttyp, emulsionstyp, bereich, chargeG, phZiel, frischcreme, positionen: positionen.map((p, i) => ({ ...p, key: `k${i}` })) },
    map,
  );

  const admin = isAdmin(user);
  const status = eins(e.status, ["entwurf", "freigegeben"] as const, "entwurf");
  // Freigeben geht nur ohne Fehler aus der Prüfung
  if (admin && status === "freigegeben" && !pruefung.ok) {
    return { ok: false, fehler: "Freigeben geht erst, wenn die Prüfung keine Fehler mehr zeigt." };
  }

  const eingabe: RezepturEingabe = {
    name,
    untertitel: text(e.untertitel, 160),
    produkttyp,
    emulsionstyp,
    produktart: text(e.produktart, 60),
    bereich,
    hautbeduerfnis:
      String(e.hautbeduerfnis ?? "")
        .split(",")
        .map((s) => s.trim())
        .filter((s) => ["alle", "trocken", "fettig", "sensibel", "reif", "misch"].includes(s))
        .join(",") || "alle",
    ausruestung: eins(e.ausruestung, AUSRUESTUNG, "start"),
    stufe: pruefung.stufe,
    zeitMinuten: num(e.zeitMinuten, 1, 600),
    chargeG,
    haltbarkeitTage: num(e.haltbarkeitTage, 1, 730),
    phZiel,
    frischcreme,
    geraete: pruefung.geraete
      .filter((g) => g.pflicht)
      .map((g) => g.slug)
      .join(","),
    herstellung: text(e.herstellung, 6000),
    anwendung: text(e.anwendung, 3000),
    notiz: text(e.notiz, 3000),
    nummer: text(e.nummer, 20),
    blogText: text(e.blogText, 6000),
    suchbegriff: text(e.suchbegriff, 120),
    blogWarum: text(e.blogWarum, 3000),
    zielLink: link(e.zielLink),
    status,
    bibliothek: e.bibliothek === true,
    positionen,
  };
  if (eingabe.zeitMinuten != null) eingabe.zeitMinuten = Math.round(eingabe.zeitMinuten);
  if (eingabe.haltbarkeitTage != null) eingabe.haltbarkeitTage = Math.round(eingabe.haltbarkeitTage);

  try {
    const neueId = await saveRezeptur(user, id, eingabe);
    revalidatePath("/de/app", "layout");
    return { ok: true, id: neueId };
  } catch (err) {
    console.error("[rezeptur] Speichern:", err);
    return { ok: false, fehler: "Das Speichern hat nicht geklappt. Deine Eingaben sind noch da, bitte versuch es erneut." };
  }
}

export async function kopiereRezeptur(form: FormData) {
  const user = await requireMitglied();
  const id = Number(form.get("id"));
  const neu = await copyRezeptur(user, id);
  revalidatePath("/de/app", "layout");
  redirect(`/de/app/rezeptur/${neu}/bearbeiten`);
}

export async function loescheRezeptur(form: FormData) {
  const user = await requireMitglied();
  await deleteRezeptur(user, Number(form.get("id")));
  revalidatePath("/de/app", "layout");
  redirect("/de/app?ansicht=meine");
}

// ---------------------------------------------------------------- Admin: Produktfoto

export type FotoErgebnis = { ok: true; url: string | null } | { ok: false; fehler: "zuGross" | "keinBild" | "fehler" };

const FOTO_MAX = 4 * 1024 * 1024; // nach dem Verkleinern im Browser; Reserve unter dem Limit der Server Action
const FOTO_TYPEN = ["image/webp", "image/jpeg", "image/png"];

/** Lädt das (im Browser verkleinerte) Foto hoch oder entfernt es (ohne Datei). Nur Admin. */
export async function fotoSpeichern(form: FormData): Promise<FotoErgebnis> {
  const user = await requireAdmin();
  const id = Number(form.get("id"));
  if (!Number.isInteger(id) || id <= 0) return { ok: false, fehler: "fehler" };
  const datei = form.get("foto");
  try {
    let url: string | null = null;
    if (datei instanceof File && datei.size > 0) {
      if (!FOTO_TYPEN.includes(datei.type)) return { ok: false, fehler: "keinBild" };
      if (datei.size > FOTO_MAX) return { ok: false, fehler: "zuGross" };
      const endung = datei.type === "image/png" ? "png" : datei.type === "image/jpeg" ? "jpg" : "webp";
      const blob = await put(`rezepturen/${id}.${endung}`, datei, { access: "public", addRandomSuffix: true, contentType: datei.type });
      url = blob.url;
    }
    const alt = await setRezepturFoto(user, id, url);
    if (alt && alt !== url) await del(alt).catch(() => undefined); // alte Datei aufräumen; Fehler hier sind unkritisch
    revalidatePath("/de/app", "layout");
    return { ok: true, url };
  } catch (e) {
    console.error("fotoSpeichern", e);
    return { ok: false, fehler: "fehler" };
  }
}

// ---------------------------------------------------------------- Admin: Zugänge

export type ZugangState = { fehler?: string; ok?: string };

export async function zugangHinzufuegen(_prev: ZugangState, form: FormData): Promise<ZugangState> {
  const user = await requireAdmin();
  const email = String(form.get("email") ?? "").trim().toLowerCase();
  if (!EMAIL_RE.test(email)) return { fehler: "Bitte gib eine gültige E-Mail-Adresse ein." };
  await addZugang(user, email, text(form.get("name"), 120), eins(form.get("stufe"), STUFEN, "anfaenger") as Stufe, text(form.get("notiz"), 300));
  revalidatePath("/de/app/admin");
  return { ok: `${email} ist freigeschaltet.` };
}

export async function zugangSetzen(form: FormData) {
  const user = await requireAdmin();
  const id = Number(form.get("id"));
  const aktiv = form.get("aktiv");
  const stufe = form.get("stufe");
  await updateZugang(user, id, {
    ...(aktiv != null ? { aktiv: aktiv === "1" } : {}),
    ...(stufe != null ? { stufe: eins(stufe, STUFEN, "anfaenger") as Stufe } : {}),
  });
  revalidatePath("/de/app/admin");
}

export async function zugangLoeschen(form: FormData) {
  const user = await requireAdmin();
  await deleteZugang(user, Number(form.get("id")));
  revalidatePath("/de/app/admin");
}

// ---------------------------------------------------------------- Admin: Geräte und Rohstoffe

export async function geraetSpeichern(form: FormData) {
  const user = await requireAdmin();
  await saveGeraetLink(user, Number(form.get("id")), link(form.get("link")), form.get("affiliate") === "on");
  revalidatePath("/de/app", "layout");
}

export type RohstoffState = { fehler?: string; ok?: boolean };

export async function rohstoffSpeichern(_prev: RohstoffState, form: FormData): Promise<RohstoffState> {
  const user = await requireAdmin();
  const id = form.get("id") ? Number(form.get("id")) : null;
  const name = text(form.get("name"), 120);
  const inci = text(form.get("inci"), 400);
  if (!name || !inci) return { fehler: "Name und INCI sind Pflicht. Ohne INCI kommt kein Rohstoff in Dein Lab." };
  const slug =
    text(form.get("slug"), 80) ??
    name
      .toLowerCase()
      .replace(/ä/g, "ae")
      .replace(/ö/g, "oe")
      .replace(/ü/g, "ue")
      .replace(/ß/g, "ss")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  const kategorie = eins(form.get("kategorie"), KATEGORIEN, "sonstiges");
  const istKons = kategorie === "konservierer";
  const istEmu = kategorie === "emulgator" || kategorie === "coemulgator";
  const istFett = kategorie === "oel" || kategorie === "butter" || kategorie === "wachs";
  const istTensid = kategorie === "tensid";
  const ganz = (n: number | null) => (n == null ? null : Math.round(n));
  const wirk = (k: string) => (istKons ? eins(form.get(k), ["++", "+", "o", "-"] as const, "o") : null);

  const werte: RohstoffEingabe = {
    slug,
    name,
    handelsnamen: text(form.get("handelsnamen"), 200),
    inci,
    kategorie,
    funktion: text(form.get("funktion"), 200),
    phase: eins(form.get("phase"), PHASEN, "wasser"),
    form: eins(form.get("form"), FORMEN, "fluessig"),
    dichte: num(form.get("dichte"), 0.3, 3),
    tropfenfaktor: num(form.get("tropfenfaktor"), 0.005, 0.2),
    phMin: num(form.get("phMin"), 0, 14),
    phMax: num(form.get("phMax"), 0, 14),
    tempMax: num(form.get("tempMax"), 0, 200),
    loeslichkeit: form.get("loeslichkeit") ? eins(form.get("loeslichkeit"), ["wasser", "oel", "beides", "unloeslich"] as const, "wasser") : null,
    stufe: eins(form.get("stufe"), STUFEN, "anfaenger"),
    lieferant: text(form.get("lieferant"), 120),
    kaufLink: link(form.get("kaufLink")),
    kaufLinkAffiliate: form.get("kaufLinkAffiliate") === "on",
    steckbriefWas: text(form.get("steckbriefWas"), 1500),
    steckbriefChemisch: text(form.get("steckbriefChemisch"), 1500),
    steckbriefWirkung: text(form.get("steckbriefWirkung"), 1500),
    hinweis: text(form.get("hinweis"), 800),
    quelle: text(form.get("quelle"), 400),
    wirkBakterien: wirk("wirkBakterien"),
    wirkHefen: wirk("wirkHefen"),
    wirkSchimmel: wirk("wirkSchimmel"),
    breitband: istKons ? form.get("breitband") === "on" : null,
    konsStatus: istKons ? eins(form.get("konsStatus"), ["konservierungsmittel", "additiv", "rohstoff"] as const, "konservierungsmittel") : null,
    konsRolle: istKons ? eins(form.get("konsRolle"), ["standard", "ko", "kombi"] as const, "standard") : null,
    kombiPartner: istKons ? text(form.get("kombiPartner"), 120) : null,
    nichtWaessrig: istKons && form.get("nichtWaessrig") === "on",
    emulgatorTyp: istEmu ? eins(form.get("emulgatorTyp"), ["ow", "wo"] as const, "ow") : null,
    hlb: istEmu ? num(form.get("hlb"), 0, 20) : null,
    fettphaseMin: istEmu ? num(form.get("fettphaseMin"), 0, 100) : null,
    fettphaseMax: istEmu ? num(form.get("fettphaseMax"), 0, 100) : null,
    emulgatorBezug: istEmu ? eins(form.get("emulgatorBezug"), ["gesamt", "fettphase"] as const, "gesamt") : null,
    hautgefuehl: istEmu ? text(form.get("hautgefuehl"), 200) : null,
    konsistenzgeberNoetig: istEmu ? form.get("konsistenzgeberNoetig") === "on" : null,
    spreitung: istFett && form.get("spreitung") ? eins(form.get("spreitung"), ["schnell", "mittel", "langsam"] as const, "mittel") : null,
    oxidation: istFett && form.get("oxidation") ? eins(form.get("oxidation"), ["stabil", "mittel", "empfindlich"] as const, "mittel") : null,
    haltbarMonate: istFett ? ganz(num(form.get("haltbarMonate"), 1, 60)) : null,
    verseifungszahlKoh: istFett ? num(form.get("verseifungszahlKoh"), 0, 400) : null,
    schmelzpunkt: istFett ? ganz(num(form.get("schmelzpunkt"), -40, 120)) : null,
    geeignetFuer: istFett ? text(form.get("geeignetFuer"), 200) : null,
    fettsaeuren: istFett ? text(form.get("fettsaeuren"), 300) : null,
    tensidKlasse: istTensid ? eins(form.get("tensidKlasse"), TENSIDKLASSEN, "anionisch") : null,
    tensidRolle: istTensid ? eins(form.get("tensidRolle"), ["basistensid", "kotensid", "mischtensid"] as const, "basistensid") : null,
    wasProzent: istTensid ? num(form.get("wasProzent"), 0, 100) : null,
    vertraeglichkeit: istTensid ? eins(form.get("vertraeglichkeit"), ["sehr gut", "gut", "akzeptabel"] as const, "gut") : null,
    aktiv: form.getAll("aktiv").includes("1"),
  };
  if (werte.tempMax != null) werte.tempMax = Math.round(werte.tempMax);

  const dosierungen: DosierungEingabe[] = [];
  for (const typ of [...PRODUKTTYPEN, "alle"] as const) {
    const min = num(form.get(`dos_${typ}_min`), 0, 100);
    const max = num(form.get(`dos_${typ}_max`), 0, 100);
    if (min == null || max == null) continue;
    if (min > max) return { fehler: "Bei einer Dosierung ist der Mindestwert größer als der Höchstwert." };
    dosierungen.push({ produkttyp: typ, min, max, hinweis: text(form.get(`dos_${typ}_hinweis`), 200) });
  }

  try {
    await saveRohstoff(user, id, werte, dosierungen);
  } catch (err) {
    console.error("[rohstoff] Speichern:", err);
    return { fehler: "Das Speichern hat nicht geklappt. Gibt es das Kürzel (Slug) schon?" };
  }
  revalidatePath("/de/app", "layout");
  redirect("/de/app/rohstoffe");
}
