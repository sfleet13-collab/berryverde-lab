"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { L } from "@/i18n/lab";
import { rohstoffSpeichern, type RohstoffState } from "@/lib/actions/lab";
import type { RohstoffMitDosierung } from "@/lib/data";
import styles from "./lab.module.css";

const t = L.rohstoffForm;
const txt = (v: number | string | null | undefined) => (v == null ? "" : String(v).replace(".", ","));

/** Formular für die Rohstoff-Datenbank (nur Admin). Zusatzfelder erscheinen je nach Gruppe. */
export default function RohstoffForm({ r }: { r: RohstoffMitDosierung | null }) {
  const [state, action, pending] = useActionState<RohstoffState, FormData>(rohstoffSpeichern, {});
  const [kategorie, setKategorie] = useState<string>(r?.kategorie ?? "wirkstoff");
  const dos = (typ: string) => r?.dosierungen.find((d) => d.produkttyp === typ);

  const feld = (name: string, label: string, wert: string, opt: { breit?: boolean; hilfe?: string; mode?: "decimal" | "numeric"; pflicht?: boolean; platz?: string } = {}) => (
    <div className={`${styles.feld} ${opt.breit ? styles.breit : ""}`}>
      <label htmlFor={`rf-${name}`}>{label}</label>
      <input
        id={`rf-${name}`}
        name={name}
        type="text"
        inputMode={opt.mode}
        defaultValue={wert}
        required={opt.pflicht}
        placeholder={opt.platz}
        aria-describedby={opt.hilfe ? `rf-${name}-h` : undefined}
      />
      {opt.hilfe && <small id={`rf-${name}-h`}>{opt.hilfe}</small>}
    </div>
  );
  const bereich = (name: string, label: string, wert: string, rows = 3) => (
    <div className={`${styles.feld} ${styles.breit}`}>
      <label htmlFor={`rf-${name}`}>{label}</label>
      <textarea id={`rf-${name}`} name={name} rows={rows} defaultValue={wert} />
    </div>
  );
  const auswahl = (name: string, label: string, wert: string, optionen: Record<string, string>, leer = false, onChange?: (v: string) => void) => (
    <div className={styles.feld}>
      <label htmlFor={`rf-${name}`}>{label}</label>
      <select id={`rf-${name}`} name={name} defaultValue={wert} onChange={onChange ? (e) => onChange(e.target.value) : undefined}>
        {leer && <option value="">{t.keineAuswahl}</option>}
        {Object.entries(optionen).map(([k, v]) => (
          <option key={k} value={k}>
            {v}
          </option>
        ))}
      </select>
    </div>
  );
  const haken = (name: string, label: string, an: boolean) => (
    <label className={`${styles.haken} ${styles.breit}`}>
      <input type="checkbox" name={name} defaultChecked={an} />
      {label}
    </label>
  );
  const WIRK = { "++": "++ sehr gut", "+": "+ gut", o: "o schwach", "-": "– keine" };

  return (
    <form action={action} className={styles.editorHaupt}>
      {r && <input type="hidden" name="id" value={r.id} />}

      <section className={styles.karte}>
        <h2>{t.grund}</h2>
        <div className={styles.felder}>
          {feld("name", t.name, r?.name ?? "", { pflicht: true })}
          {feld("slug", t.slug, r?.slug ?? "", { hilfe: t.slugHilfe })}
          {feld("inci", t.inci, r?.inci ?? "", { breit: true, pflicht: true })}
          {feld("handelsnamen", t.handelsnamen, r?.handelsnamen ?? "")}
          {feld("funktion", t.funktion, r?.funktion ?? "")}
          {auswahl("kategorie", t.kategorie, kategorie, L.kategorie, false, setKategorie)}
          {auswahl("phase", t.phase, r?.phase ?? "wasser", L.phase)}
          {auswahl("form", t.form, r?.form ?? "fluessig", L.form)}
          {auswahl("stufe", t.stufe, r?.stufe ?? "anfaenger", L.stufe)}
        </div>
      </section>

      <section className={styles.karte}>
        <h2>{t.werte}</h2>
        <div className={styles.felder}>
          {feld("dichte", t.dichte, txt(r?.dichte), { mode: "decimal" })}
          {feld("tropfenfaktor", t.tropfenfaktor, txt(r?.tropfenfaktor), { mode: "decimal", hilfe: t.tropfenHilfe })}
          {feld("phMin", t.phMin, txt(r?.phMin), { mode: "decimal" })}
          {feld("phMax", t.phMax, txt(r?.phMax), { mode: "decimal" })}
          {feld("tempMax", t.tempMax, txt(r?.tempMax), { mode: "numeric" })}
          {auswahl("loeslichkeit", t.loeslichkeit, r?.loeslichkeit ?? "", L.loeslichkeit, true)}
        </div>
        <fieldset className={styles.dosierung}>
          <legend>{t.dosierung}</legend>
          {(["emulsion", "wasserfrei", "waessrig", "tensid", "alle"] as const).map((typ) => (
            <div key={typ} className={styles.dosZeile}>
              <span className={styles.dosTyp}>{t.dosTyp[typ]}</span>
              <label className="sr-only" htmlFor={`rf-dos-${typ}-min`}>
                {t.dosTyp[typ]} {t.min}
              </label>
              <input id={`rf-dos-${typ}-min`} name={`dos_${typ}_min`} type="text" inputMode="decimal" defaultValue={txt(dos(typ)?.min)} placeholder={t.min} />
              <label className="sr-only" htmlFor={`rf-dos-${typ}-max`}>
                {t.dosTyp[typ]} {t.max}
              </label>
              <input id={`rf-dos-${typ}-max`} name={`dos_${typ}_max`} type="text" inputMode="decimal" defaultValue={txt(dos(typ)?.max)} placeholder={t.max} />
              <label className="sr-only" htmlFor={`rf-dos-${typ}-h`}>
                {t.dosTyp[typ]} {t.dosHinweis}
              </label>
              <input id={`rf-dos-${typ}-h`} name={`dos_${typ}_hinweis`} type="text" defaultValue={dos(typ)?.hinweis ?? ""} placeholder={t.dosHinweis} />
            </div>
          ))}
        </fieldset>
      </section>

      {kategorie === "konservierer" && (
        <section className={styles.karte}>
          <h2>{t.konservierer}</h2>
          <div className={styles.felder}>
            {auswahl("wirkBakterien", L.rohstoffe.bakterien, r?.wirkBakterien ?? "+", WIRK)}
            {auswahl("wirkHefen", L.rohstoffe.hefen, r?.wirkHefen ?? "+", WIRK)}
            {auswahl("wirkSchimmel", L.rohstoffe.schimmel, r?.wirkSchimmel ?? "+", WIRK)}
            {auswahl("konsStatus", t.konsStatus, r?.konsStatus ?? "konservierungsmittel", L.konsStatus)}
            {auswahl("konsRolle", t.konsRolle, r?.konsRolle ?? "standard", L.konsRolle)}
            {feld("kombiPartner", t.kombiPartner, r?.kombiPartner ?? "")}
            {haken("breitband", t.breitband, r?.breitband ?? false)}
            {haken("nichtWaessrig", t.nichtWaessrig, r?.nichtWaessrig ?? false)}
          </div>
        </section>
      )}

      {["oel", "butter", "wachs"].includes(kategorie) && (
        <section className={styles.karte}>
          <h2>{t.oele}</h2>
          <div className={styles.felder}>
            {auswahl("spreitung", t.spreitung, r?.spreitung ?? "", L.spreitung, true)}
            {auswahl("oxidation", t.oxidation, r?.oxidation ?? "", L.oxidation, true)}
            {feld("haltbarMonate", t.haltbarMonate, txt(r?.haltbarMonate), { mode: "numeric" })}
            {feld("verseifungszahlKoh", t.verseifungszahl, txt(r?.verseifungszahlKoh), { mode: "decimal", hilfe: t.verseifungszahlHilfe })}
            {feld("schmelzpunkt", t.schmelzpunkt, txt(r?.schmelzpunkt), { mode: "numeric" })}
            {feld("geeignetFuer", t.geeignetFuer, r?.geeignetFuer ?? "")}
            {feld("fettsaeuren", t.fettsaeuren, r?.fettsaeuren ?? "", { breit: true, platz: "Ölsäure ca. 65 %, Linolsäure ca. 20 %" })}
          </div>
        </section>
      )}

      {kategorie === "tensid" && (
        <section className={styles.karte}>
          <h2>{t.tensid}</h2>
          <div className={styles.felder}>
            {auswahl("tensidKlasse", t.tensidKlasse, r?.tensidKlasse ?? "anionisch", L.tensidKlasse)}
            {auswahl("tensidRolle", t.tensidRolle, r?.tensidRolle ?? "basistensid", L.tensidRolle)}
            {feld("wasProzent", t.wasProzent, txt(r?.wasProzent), { mode: "decimal", hilfe: t.wasHilfe })}
            {auswahl("vertraeglichkeit", t.vertraeglichkeit, r?.vertraeglichkeit ?? "gut", { "sehr gut": "sehr gut", gut: "gut", akzeptabel: "akzeptabel" })}
          </div>
        </section>
      )}

      {(kategorie === "emulgator" || kategorie === "coemulgator") && (
        <section className={styles.karte}>
          <h2>{t.emulgator}</h2>
          <div className={styles.felder}>
            {auswahl("emulgatorTyp", t.emulgatorTyp, r?.emulgatorTyp ?? "ow", { ow: "O/W", wo: "W/O" })}
            {feld("hlb", t.hlb, txt(r?.hlb), { mode: "decimal" })}
            {feld("fettphaseMin", t.fettMin, txt(r?.fettphaseMin), { mode: "decimal" })}
            {feld("fettphaseMax", t.fettMax, txt(r?.fettphaseMax), { mode: "decimal" })}
            {auswahl("emulgatorBezug", t.bezug, r?.emulgatorBezug ?? "gesamt", { gesamt: t.bezugGesamt, fettphase: t.bezugFett })}
            {feld("hautgefuehl", t.hautgefuehl, r?.hautgefuehl ?? "")}
            {haken("konsistenzgeberNoetig", t.konsistenz, r?.konsistenzgeberNoetig ?? false)}
          </div>
        </section>
      )}

      <section className={styles.karte}>
        <h2>{t.steckbrief}</h2>
        <div className={styles.felder}>
          {bereich("steckbriefWas", L.rohstoffe.was, r?.steckbriefWas ?? "")}
          {bereich("steckbriefChemisch", L.rohstoffe.chemisch, r?.steckbriefChemisch ?? "", 2)}
          {bereich("steckbriefWirkung", L.rohstoffe.wirkung, r?.steckbriefWirkung ?? "", 2)}
          {bereich("hinweis", t.hinweis, r?.hinweis ?? "", 2)}
        </div>
      </section>

      <section className={styles.karte}>
        <h2>{t.einkauf}</h2>
        <div className={styles.felder}>
          {feld("lieferant", t.lieferant, r?.lieferant ?? "")}
          {feld("kaufLink", t.kaufLink, r?.kaufLink ?? "", { platz: "https://" })}
          {haken("kaufLinkAffiliate", L.admin.affiliate, r?.kaufLinkAffiliate ?? false)}
          {feld("quelle", t.quelle, r?.quelle ?? "", { breit: true })}
          <label className={`${styles.haken} ${styles.breit}`}>
            <input type="checkbox" name="aktiv" value="1" defaultChecked={r?.aktiv ?? true} />
            {t.aktiv}
          </label>
        </div>
      </section>

      {state.fehler && (
        <p className={styles.formFehler} role="alert">
          {state.fehler}
        </p>
      )}
      <div className={styles.aktionen}>
        <button type="submit" className="btn btn-primary" disabled={pending}>
          {pending ? t.speichert : t.speichern}
        </button>
        <Link className="btn btn-ghost" href="/de/app/rohstoffe">
          {L.editor.abbrechen}
        </Link>
      </div>
    </form>
  );
}
