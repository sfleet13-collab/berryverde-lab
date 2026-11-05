"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useId, useMemo, useRef, useState, useTransition } from "react";
import Icon from "@/components/Icon";
import { L, fuelle } from "@/i18n/lab";
import { speichereRezeptur } from "@/lib/actions/lab";
import { mengeText, zahl } from "@/lib/lab/rechner";
import { pruefe, wendeAn, type Korrektur } from "@/lib/lab/regeln";
import type { Bereich, Emulsionstyp, Kategorie, LabPosition, LabRohstoff, Phase, Produkttyp } from "@/lib/lab/types";
import Meldungen from "./Meldungen";
import type { RohstoffClient } from "./Rechner";
import styles from "./lab.module.css";

export type EditorStart = {
  id: number | null;
  name: string;
  untertitel: string;
  produkttyp: Produkttyp;
  emulsionstyp: Emulsionstyp | null;
  produktart: string;
  bereich: Bereich;
  hautbeduerfnis: string;
  ausruestung: "start" | "pro" | "zusatz";
  chargeG: number;
  phZiel: number | null;
  haltbarkeitTage: number | null;
  zeitMinuten: number | null;
  frischcreme: boolean;
  herstellung: string;
  anwendung: string;
  notiz: string;
  nummer: string;
  blogText: string;
  bibliothek: boolean;
  status: "entwurf" | "freigegeben";
  positionen: { rohstoffId: number; phase: Phase; prozent: number; adHundert: boolean }[];
};

type Zeile = { key: string; rohstoffId: number; phase: Phase; prozent: string; adHundert: boolean };

const PHASEN: Phase[] = ["fett", "wasser", "kalt", "pulver"];
const KAT_ORDNUNG: Kategorie[] = [
  "wasser", "oel", "butter", "wachs", "emulgator", "coemulgator", "konsistenzgeber", "tensid", "feuchtigkeit", "wirkstoff", "antioxidans",
  "konservierer", "aetherisches_oel", "pulver", "peeling", "ph_regler", "sonstiges",
];
const HAUT = ["alle", "trocken", "fettig", "sensibel", "reif", "misch"] as const;

const alsZahl = (s: string) => {
  const n = Number(s.replace(",", "."));
  return Number.isFinite(n) && s.trim() !== "" ? n : 0;
};
const alsText = (n: number | null) => (n == null ? "" : String(n).replace(".", ","));
/** Gültiger Anteil: leer (= 0) oder Zahl von 0 bis 100. */
const anteilGueltig = (s: string) => {
  if (s.trim() === "") return true;
  const n = Number(s.replace(",", "."));
  return Number.isFinite(n) && n >= 0 && n <= 100;
};

export default function Editor({ start, rohstoffe, admin }: { start: EditorStart; rohstoffe: RohstoffClient[]; admin: boolean }) {
  const router = useRouter();
  const uid = useId();
  const zaehler = useRef(0);
  const neuerKey = () => `n${++zaehler.current}`;

  const [k, setK] = useState({
    name: start.name,
    untertitel: start.untertitel,
    produkttyp: start.produkttyp,
    emulsionstyp: (start.emulsionstyp ?? "ow") as Emulsionstyp,
    produktart: start.produktart,
    bereich: start.bereich,
    haut: start.hautbeduerfnis.split(",").filter(Boolean),
    ausruestung: start.ausruestung,
    chargeG: alsText(start.chargeG),
    phZiel: alsText(start.phZiel),
    haltbarkeitTage: alsText(start.haltbarkeitTage),
    zeitMinuten: alsText(start.zeitMinuten),
    frischcreme: start.frischcreme,
    herstellung: start.herstellung,
    anwendung: start.anwendung,
    notiz: start.notiz,
    nummer: start.nummer,
    blogText: start.blogText,
    bibliothek: start.bibliothek,
    status: start.status,
  });
  const [zeilen, setZeilen] = useState<Zeile[]>(() =>
    start.positionen.map((p, i) => ({ key: `s${i}`, rohstoffId: p.rohstoffId, phase: p.phase, prozent: alsText(p.prozent), adHundert: p.adHundert })),
  );
  const [geaendert, setGeaendert] = useState(false);
  const [fehler, setFehler] = useState<string | null>(null);
  const [speichert, startSpeichern] = useTransition();
  const [auswahl, setAuswahl] = useState("");

  const map = useMemo(() => new Map(rohstoffe.map((r) => [r.id, r as LabRohstoff])), [rohstoffe]);
  const gruppen = useMemo(
    () =>
      KAT_ORDNUNG.map((kat) => ({ kat, liste: rohstoffe.filter((r) => r.kategorie === kat) })).filter((g) => g.liste.length > 0),
    [rohstoffe],
  );

  // Ungültige Eingaben (negativ, über 100, keine Zahl) rechnen als 0, bis sie korrigiert sind
  const labPositionen: LabPosition[] = zeilen.map((z) => ({
    key: z.key,
    rohstoffId: z.rohstoffId,
    phase: z.phase,
    prozent: anteilGueltig(z.prozent) ? alsZahl(z.prozent) : 0,
    adHundert: z.adHundert,
  }));
  const charge = alsZahl(k.chargeG);
  const pruefung = pruefe(
    {
      produkttyp: k.produkttyp,
      emulsionstyp: k.emulsionstyp,
      bereich: k.bereich,
      chargeG: charge,
      phZiel: k.phZiel.trim() === "" ? null : alsZahl(k.phZiel),
      frischcreme: k.frischcreme,
      positionen: labPositionen,
    },
    map,
  );
  const b = pruefung.berechnung;
  const berechnet = new Map(b.positionen.map((p) => [p.key, p]));
  const markiert = new Set(pruefung.meldungen.filter((m) => m.art === "fehler").flatMap((m) => m.zeilen ?? []));
  const ungueltig = new Set(zeilen.filter((z) => !z.adHundert && !anteilGueltig(z.prozent)).map((z) => z.key));
  const chargeOk = charge > 0 && charge <= 5000;
  const anzahlFehler = pruefung.meldungen.filter((m) => m.art === "fehler").length + ungueltig.size;
  const hinzuRef = useRef<HTMLSelectElement>(null);
  const meldungen = ungueltig.size
    ? [
        {
          code: "ungueltig",
          art: "fehler" as const,
          titel: L.editor.ungueltigTitel,
          text: fuelle(L.editor.ungueltigText, {
            namen: zeilen
              .filter((z) => ungueltig.has(z.key))
              .map((z) => map.get(z.rohstoffId)?.name ?? "")
              .join(", "),
          }),
          zeilen: [...ungueltig],
        },
        ...pruefung.meldungen,
      ]
    : pruefung.meldungen;

  // Warnung beim Verlassen mit ungespeicherten Änderungen
  useEffect(() => {
    if (!geaendert) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [geaendert]);

  function kopf<T extends keyof typeof k>(feld: T, wert: (typeof k)[T]) {
    setK((alt) => ({ ...alt, [feld]: wert }));
    setGeaendert(true);
  }
  function zeile(key: string, teil: Partial<Zeile>) {
    setZeilen((alt) => alt.map((z) => (z.key === key ? { ...z, ...teil } : teil.adHundert ? { ...z, adHundert: false } : z)));
    setGeaendert(true);
  }
  function hinzu(rohstoffId: number) {
    const r = map.get(rohstoffId);
    if (!r) return;
    const phase: Phase = k.produkttyp === "wasserfrei" && r.phase === "kalt" ? "fett" : r.phase;
    const ersterWasser = r.kategorie === "wasser" && !zeilen.some((z) => z.adHundert);
    const key = neuerKey();
    setZeilen((alt) => [...alt, { key, rohstoffId, phase, prozent: "", adHundert: ersterWasser }]);
    setGeaendert(true);
    // Fokus direkt in das Anteil-Feld der neuen Zeile
    requestAnimationFrame(() => (document.getElementById(`${uid}-pz-${key}`) as HTMLElement | null)?.focus());
  }
  function entferne(key: string) {
    setZeilen((alt) => alt.filter((z) => z.key !== key));
    setGeaendert(true);
    // Die Zeile mit dem Fokus verschwindet: Fokus auf die Rohstoff-Auswahl
    requestAnimationFrame(() => hinzuRef.current?.focus());
  }
  function korrigiere(kor: Korrektur) {
    const neu = wendeAn(labPositionen, kor, map, neuerKey);
    setZeilen(neu.map((p) => ({ key: p.key, rohstoffId: p.rohstoffId, phase: p.phase, prozent: p.adHundert ? "" : alsText(p.prozent), adHundert: p.adHundert })));
    setGeaendert(true);
  }
  function haut(wert: string) {
    const hat = k.haut.includes(wert);
    let neu = hat ? k.haut.filter((h) => h !== wert) : [...k.haut, wert];
    if (wert === "alle" && !hat) neu = ["alle"];
    else neu = neu.filter((h) => h !== "alle");
    kopf("haut", neu.length ? neu : ["alle"]);
  }

  function speichern() {
    setFehler(null);
    if (ungueltig.size > 0 || !chargeOk) {
      setFehler(L.editor.speichernGesperrt);
      return;
    }
    startSpeichern(async () => {
      const ergebnis = await speichereRezeptur(start.id, {
        ...k,
        hautbeduerfnis: k.haut.join(","),
        chargeG: alsZahl(k.chargeG),
        phZiel: k.phZiel.trim() === "" ? null : alsZahl(k.phZiel),
        haltbarkeitTage: k.haltbarkeitTage.trim() === "" ? null : alsZahl(k.haltbarkeitTage),
        zeitMinuten: k.zeitMinuten.trim() === "" ? null : alsZahl(k.zeitMinuten),
        positionen: labPositionen.map((p) => ({ rohstoffId: p.rohstoffId, phase: p.phase, prozent: p.adHundert ? 0 : p.prozent, adHundert: p.adHundert })),
      });
      if (!ergebnis.ok) {
        setFehler(ergebnis.fehler);
        return;
      }
      setGeaendert(false);
      router.push(`/de/app/rezeptur/${ergebnis.id}`);
      router.refresh();
    });
  }

  const f = (name: string) => `${uid}-${name}`;
  const phasenImEinsatz = PHASEN.filter((ph) => zeilen.some((z) => z.phase === ph));

  return (
    <div className={styles.editor}>
      <div className={styles.editorHaupt}>
        {/* ---------- Kopfdaten ---------- */}
        <section className={styles.karte} aria-labelledby={f("kopf")}>
          <h2 id={f("kopf")} className="sr-only">
            {L.editor.kopfdaten}
          </h2>
          <div className={styles.felder}>
            <div className={`${styles.feld} ${styles.breit}`}>
              <label htmlFor={f("name")}>{L.editor.name}</label>
              <input id={f("name")} type="text" value={k.name} maxLength={120} onChange={(e) => kopf("name", e.target.value)} required />
            </div>
            <div className={`${styles.feld} ${styles.breit}`}>
              <label htmlFor={f("untertitel")}>{L.editor.untertitel}</label>
              <input id={f("untertitel")} type="text" value={k.untertitel} maxLength={160} onChange={(e) => kopf("untertitel", e.target.value)} />
            </div>

            <fieldset className={`${styles.feld} ${styles.breit}`}>
              <legend>{L.editor.produkttyp}</legend>
              <div className={styles.segment}>
                {(["emulsion", "wasserfrei", "waessrig", "tensid"] as const).map((t) => (
                  <label key={t} data-aktiv={k.produkttyp === t || undefined}>
                    <input type="radio" name={f("typ")} checked={k.produkttyp === t} onChange={() => kopf("produkttyp", t)} />
                    <span>{L.produkttyp[t]}</span>
                    <small>{L.produkttypHilfe[t]}</small>
                  </label>
                ))}
              </div>
            </fieldset>

            {k.produkttyp === "emulsion" && (
              <fieldset className={`${styles.feld} ${styles.breit}`}>
                <legend>{L.editor.emulsionstyp}</legend>
                <div className={`${styles.segment} ${styles.segmentZwei}`}>
                  {(["ow", "wo"] as const).map((t) => (
                    <label key={t} data-aktiv={k.emulsionstyp === t || undefined}>
                      <input type="radio" name={f("etyp")} checked={k.emulsionstyp === t} onChange={() => kopf("emulsionstyp", t)} />
                      <span>{L.emulsionstyp[t]}</span>
                      <small>{L.emulsionstypHilfe[t]}</small>
                    </label>
                  ))}
                </div>
              </fieldset>
            )}
            <div className={styles.feld}>
              <label htmlFor={f("art")}>{L.editor.produktart}</label>
              <input id={f("art")} type="text" value={k.produktart} maxLength={60} placeholder={L.editor.produktartPlatzhalter} onChange={(e) => kopf("produktart", e.target.value)} />
            </div>
            <div className={styles.feld}>
              <label htmlFor={f("bereich")}>{L.editor.bereich}</label>
              <select id={f("bereich")} value={k.bereich} onChange={(e) => kopf("bereich", e.target.value as Bereich)}>
                <option value="gesicht">{L.bereich.gesicht}</option>
                <option value="koerper">{L.bereich.koerper}</option>
              </select>
            </div>
            <div className={styles.feld}>
              <label htmlFor={f("box")}>{L.editor.ausruestung}</label>
              <select id={f("box")} value={k.ausruestung} onChange={(e) => kopf("ausruestung", e.target.value as "start" | "pro" | "zusatz")}>
                <option value="start">{L.ausruestung.start}</option>
                <option value="pro">{L.ausruestung.pro}</option>
                <option value="zusatz">{L.ausruestung.zusatz}</option>
              </select>
            </div>
            <div className={styles.feld}>
              <label htmlFor={f("charge")}>{L.editor.charge}</label>
              <input
                id={f("charge")}
                type="text"
                inputMode="decimal"
                value={k.chargeG}
                onChange={(e) => kopf("chargeG", e.target.value)}
                aria-describedby={f("charge-h")}
                aria-invalid={!chargeOk || undefined}
              />
              <small id={f("charge-h")} data-fehler={!chargeOk || undefined}>
                {chargeOk ? L.editor.chargeVorschlag : fuelle(L.rezeptur.chargeUngueltig, { n: 30 }).split(".")[0] + "."}
              </small>
            </div>
            {k.produkttyp !== "wasserfrei" && (
              <div className={styles.feld}>
                <label htmlFor={f("ph")}>{L.editor.phZiel}</label>
                <input id={f("ph")} type="text" inputMode="decimal" value={k.phZiel} onChange={(e) => kopf("phZiel", e.target.value)} aria-describedby={f("ph-h")} />
                <small id={f("ph-h")}>{L.editor.phHilfe}</small>
              </div>
            )}
            <div className={styles.feld}>
              <label htmlFor={f("haltbar")}>{L.editor.haltbarkeit}</label>
              <input id={f("haltbar")} type="text" inputMode="numeric" value={k.haltbarkeitTage} onChange={(e) => kopf("haltbarkeitTage", e.target.value)} />
            </div>
            <div className={styles.feld}>
              <label htmlFor={f("zeit")}>{L.editor.zeit}</label>
              <input id={f("zeit")} type="text" inputMode="numeric" value={k.zeitMinuten} onChange={(e) => kopf("zeitMinuten", e.target.value)} />
            </div>

            <fieldset className={`${styles.feld} ${styles.breit}`}>
              <legend>{L.editor.haut}</legend>
              <div className={styles.chips}>
                {HAUT.map((h) => (
                  <label key={h} data-aktiv={k.haut.includes(h) || undefined}>
                    <input type="checkbox" checked={k.haut.includes(h)} onChange={() => haut(h)} />
                    {L.haut[h]}
                  </label>
                ))}
              </div>
            </fieldset>

            {k.produkttyp !== "wasserfrei" && (
              <label className={`${styles.haken} ${styles.breit}`}>
                <input type="checkbox" checked={k.frischcreme} onChange={(e) => kopf("frischcreme", e.target.checked)} />
                {L.editor.frischcreme}
              </label>
            )}
          </div>
        </section>

        {/* ---------- Formel ---------- */}
        <section className={styles.karte} aria-labelledby={f("formel")}>
          <div className={styles.karteKopf}>
            <h2 id={f("formel")}>{L.editor.formel}</h2>
            <div className={styles.hinzu}>
              <label htmlFor={f("hinzu")} className="sr-only">
                {L.editor.hinzufuegen}
              </label>
              {/* Auswahl und Knopf getrennt: Pfeiltasten blättern nur, hinzugefügt wird erst mit dem Knopf */}
              <select ref={hinzuRef} id={f("hinzu")} value={auswahl} onChange={(e) => setAuswahl(e.target.value)}>
                <option value="">{L.editor.waehlen}</option>
                {gruppen.map((g) => (
                  <optgroup key={g.kat} label={L.kategorie[g.kat]}>
                    {g.liste.map((r) => (
                      <option key={r.id} value={r.id} disabled={zeilen.some((z) => z.rohstoffId === r.id)}>
                        {r.name}
                        {r.stufe !== "anfaenger" ? ` (${L.stufe[r.stufe]})` : ""}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
              <button
                type="button"
                className="btn btn-ghost"
                disabled={!auswahl}
                onClick={() => {
                  hinzu(Number(auswahl));
                  setAuswahl("");
                }}
              >
                <Icon name="plus" />
                {L.editor.hinzufuegenKurz}
              </button>
            </div>
          </div>

          {zeilen.length === 0 ? (
            <p className={styles.leer}>{L.editor.leer}</p>
          ) : (
            <div className={styles.zeilen}>
              {phasenImEinsatz.map((ph) => (
                <div key={ph} className={styles.phaseGruppe} role="group" aria-label={L.phase[ph]}>
                  <p className={styles.phaseKopf}>
                    <span className={styles.phaseTag} data-phase={ph}>
                      {L.phaseKurz[ph]}
                    </span>
                    <span className={styles.phaseName}>{L.phase[ph]}</span>
                    <span className={styles.phaseHilfe}>{L.phaseHilfe[ph]}</span>
                  </p>
                  {zeilen
                    .filter((z) => z.phase === ph)
                    .map((z) => {
                      const r = map.get(z.rohstoffId);
                      const p = berechnet.get(z.key);
                      if (!r) return null;
                      return (
                        <div key={z.key} className={styles.zeile} data-markiert={markiert.has(z.key) || ungueltig.has(z.key) || undefined}>
                          <p className={styles.zeileName}>
                            {r.name}
                            <small>{(r as RohstoffClient).funktion}</small>
                          </p>
                          <div className={styles.zeilePhase}>
                            <label htmlFor={f(`ph-${z.key}`)} className="sr-only">
                              {L.editor.phase}: {r.name}
                            </label>
                            <select id={f(`ph-${z.key}`)} value={z.phase} onChange={(e) => zeile(z.key, { phase: e.target.value as Phase })}>
                              {PHASEN.map((x) => (
                                <option key={x} value={x}>
                                  {L.phaseKurz[x]} · {L.phase[x]}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div className={styles.zeileProzent}>
                            <label htmlFor={f(`pz-${z.key}`)} className="sr-only">
                              {L.editor.anteil}: {r.name}
                            </label>
                            {z.adHundert ? (
                              <output id={f(`pz-${z.key}`)} className={styles.adWert}>
                                {zahl(p?.prozentEffektiv ?? 0, 2)}
                              </output>
                            ) : (
                              <input
                                id={f(`pz-${z.key}`)}
                                type="text"
                                inputMode="decimal"
                                value={z.prozent}
                                placeholder="0"
                                onChange={(e) => zeile(z.key, { prozent: e.target.value })}
                                aria-invalid={ungueltig.has(z.key) || undefined}
                                aria-describedby={ungueltig.has(z.key) ? f(`pz-${z.key}-f`) : undefined}
                              />
                            )}
                            <span aria-hidden="true">%</span>
                          </div>
                          <label className={styles.adSchalter} title={L.editor.adHundertHilfe}>
                            <input type="checkbox" checked={z.adHundert} onChange={(e) => zeile(z.key, { adHundert: e.target.checked })} />
                            {L.editor.adHundert}
                            <span className="sr-only">: {r.name}</span>
                          </label>
                          {ungueltig.has(z.key) && (
                            <p id={f(`pz-${z.key}-f`)} className={styles.zeileFehler} role="alert">
                              {L.editor.ungueltig}
                            </p>
                          )}
                          <p className={styles.zeileMenge}>
                            {p ? (
                              <>
                                <strong>{zahl(p.gramm, 2, true)} g</strong>
                                {p.menge.art !== "gramm" && <span>{mengeText(p.menge)}</span>}
                                {p.menge.art === "gramm" && p.menge.feinwaage && <span>{L.rezeptur.feinwaage}</span>}
                              </>
                            ) : null}
                          </p>
                          <button type="button" className={styles.entfernen} onClick={() => entferne(z.key)} aria-label={`${L.editor.entfernen}: ${r.name}`} title={L.editor.entfernen}>
                            <Icon name="x" size={18} />
                          </button>
                        </div>
                      );
                    })}
                </div>
              ))}
            </div>
          )}
        </section>

        {/* ---------- Texte ---------- */}
        <section className={styles.karte} aria-labelledby={f("texte")}>
          <h2 id={f("texte")}>{L.editor.herstellung}</h2>
          <div className={styles.felder}>
            <div className={`${styles.feld} ${styles.breit}`}>
              <label htmlFor={f("herstellung")}>{L.editor.herstellung}</label>
              <textarea id={f("herstellung")} rows={6} value={k.herstellung} onChange={(e) => kopf("herstellung", e.target.value)} aria-describedby={f("herstellung-h")} />
              <small id={f("herstellung-h")}>{L.editor.herstellungHilfe}</small>
            </div>
            <div className={`${styles.feld} ${styles.breit}`}>
              <label htmlFor={f("anwendung")}>{L.editor.anwendung}</label>
              <textarea id={f("anwendung")} rows={4} value={k.anwendung} onChange={(e) => kopf("anwendung", e.target.value)} />
            </div>
            <div className={`${styles.feld} ${styles.breit}`}>
              <label htmlFor={f("notiz")}>{L.editor.notiz}</label>
              <textarea id={f("notiz")} rows={3} value={k.notiz} onChange={(e) => kopf("notiz", e.target.value)} />
            </div>
          </div>
        </section>

        {admin && (
          <section className={styles.karte} aria-labelledby={f("admin")}>
            <h2 id={f("admin")}>{L.editor.adminTitel}</h2>
            <div className={styles.felder}>
              <div className={styles.feld}>
                <label htmlFor={f("nummer")}>{L.editor.nummer}</label>
                <input id={f("nummer")} type="text" value={k.nummer} maxLength={20} placeholder={L.editor.nummerPlatzhalter} onChange={(e) => kopf("nummer", e.target.value)} />
              </div>
              <div className={styles.feld}>
                <label htmlFor={f("status")}>{L.editor.status}</label>
                <select id={f("status")} value={k.status} onChange={(e) => kopf("status", e.target.value as "entwurf" | "freigegeben")}>
                  <option value="entwurf">{L.editor.statusEntwurf}</option>
                  <option value="freigegeben">{L.editor.statusFreigegeben}</option>
                </select>
              </div>
              <label className={`${styles.haken} ${styles.breit}`}>
                <input type="checkbox" checked={k.bibliothek} onChange={(e) => kopf("bibliothek", e.target.checked)} />
                {L.editor.bibliothek}
              </label>
              <div className={`${styles.feld} ${styles.breit}`}>
                <label htmlFor={f("blog")}>{L.editor.blogText}</label>
                <textarea id={f("blog")} rows={5} value={k.blogText} onChange={(e) => kopf("blogText", e.target.value)} />
              </div>
            </div>
          </section>
        )}
      </div>

      {/* ---------- Seitenleiste: Kennzahlen, Prüfung, Speichern ---------- */}
      {/* Handy: Status und Speichern bleiben unten sichtbar */}
      <div className={styles.mobilLeiste}>
        <a href={`#${f("pruefung")}`} className={styles.mobilStatus} data-ok={anzahlFehler === 0 || undefined}>
          <Icon name={anzahlFehler === 0 ? "check" : "alert"} size={16} />
          {anzahlFehler === 0 ? `${L.rezeptur.summe} ${zahl(b.summe, 2)} %` : anzahlFehler === 1 ? L.rezeptur.pruefungFehlerEins : fuelle(L.rezeptur.pruefungFehler, { n: anzahlFehler })}
        </a>
        <button type="button" className="btn btn-primary" onClick={speichern} disabled={speichert}>
          {speichert ? L.editor.speichert : L.editor.speichernKurz}
        </button>
      </div>

      <aside className={styles.editorSeite} aria-label={L.rezeptur.pruefung} id={f("pruefung")} tabIndex={-1}>
        <div className={styles.seiteInnen}>
          <div className={styles.aktionen}>
            <button type="button" className="btn btn-primary" onClick={speichern} disabled={speichert}>
              {speichert ? L.editor.speichert : L.editor.speichern}
            </button>
            <Link className="btn btn-ghost" href={start.id ? `/de/app/rezeptur/${start.id}` : "/de/app"}>
              {L.editor.abbrechen}
            </Link>
          </div>
          {fehler && (
            <p className={styles.formFehler} role="alert">
              {fehler}
            </p>
          )}
          <dl className={styles.kennzahlen} data-kompakt>
            <div data-falsch={(zeilen.length > 0 && Math.abs(b.summe - 100) > 0.005) || undefined}>
              <dt>{L.rezeptur.summe}</dt>
              <dd>{zahl(b.summe, 2)} %</dd>
            </div>
            {b.wasGesamt > 0 && (
              <div>
                <dt>{L.rezeptur.was}</dt>
                <dd>{zahl(b.wasGesamt, 1)} %</dd>
              </div>
            )}
            {k.produkttyp === "emulsion" && (
              <div>
                <dt>{L.rezeptur.fettphase}</dt>
                <dd>{zahl(b.fettphase, 1)} %</dd>
              </div>
            )}
            {b.emulgator && (
              <div>
                <dt>{L.rezeptur.emulgator}</dt>
                <dd>
                  {zahl(b.emulgator.gesamt, 2)} %<small>{fuelle(L.rezeptur.emulgatorAufFett, { n: zahl(b.emulgator.aufFettphase, 1) })}</small>
                </dd>
              </div>
            )}
            {b.konserviererGesamt > 0 && (
              <div>
                <dt>{L.rezeptur.konservierer}</dt>
                <dd>{zahl(b.konserviererGesamt, 2)} %</dd>
              </div>
            )}
            <div>
              <dt>{L.editor.stufeErmittelt}</dt>
              <dd>{L.stufe[pruefung.stufe]}</dd>
            </div>
          </dl>

          <Meldungen meldungen={meldungen} onKorrektur={korrigiere} />
        </div>
      </aside>
    </div>
  );
}
