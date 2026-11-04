import Icon from "@/components/Icon";
import { L } from "@/i18n/lab";
import { mengeText, zahl, type Berechnung, type BerechnetePosition } from "@/lib/lab/rechner";
import type { Phase } from "@/lib/lab/types";
import styles from "./lab.module.css";

export type RohstoffInfo = {
  funktion: string | null;
  hinweis: string | null;
  was: string | null;
  chemisch: string | null;
  wirkung: string | null;
  stufe: "anfaenger" | "mittel" | "profi";
};

const REIHENFOLGE: Phase[] = ["fett", "wasser", "kalt", "pulver"];

/**
 * Formel-Tabelle wie im Laborprotokoll: nach Phasen gegliedert (A Fett, B Wasser, C Kalt),
 * mit Anteil, Gramm und der Angabe zum Abmessen (Tropfen, ml oder Gramm).
 * Reine Darstellung: wird in der Rezeptur-Ansicht, im Rechner und auf der Rezeptkarte verwendet.
 */
export default function Formel({
  b,
  infos,
  markiert,
  idPrefix = "f",
  druck = false,
}: {
  b: Berechnung;
  infos?: Record<number, RohstoffInfo>;
  markiert?: Set<string>;
  idPrefix?: string;
  druck?: boolean;
}) {
  const phasen = REIHENFOLGE.filter((ph) => b.positionen.some((p) => p.phase === ph));
  const gesamtG = b.positionen.reduce((s, p) => s + p.gramm, 0);
  const mehrerePhasen = phasen.length > 1;

  return (
    <div className={styles.formelWrap}>
      <table className={styles.formel}>
        <caption className="sr-only">{L.rezeptur.formel}</caption>
        <thead>
          <tr>
            <th scope="col">{L.rezeptur.rohstoff}</th>
            <th scope="col" className={styles.num}>
              {L.rezeptur.prozent}
            </th>
            <th scope="col" className={styles.num}>
              {L.rezeptur.gewicht}
            </th>
            <th scope="col" className={styles.num}>
              {L.rezeptur.abmessen}
            </th>
          </tr>
        </thead>
        {phasen.map((ph) => {
          const zeilen = b.positionen.filter((p) => p.phase === ph);
          const anteil = zeilen.reduce((s, p) => s + p.prozentEffektiv, 0);
          return (
            <tbody key={ph} data-phase={ph}>
              {mehrerePhasen && (
                <tr className={styles.phaseRow}>
                  <th scope="rowgroup" colSpan={4}>
                    <span className={styles.phaseTag} data-phase={ph}>
                      {L.phaseKurz[ph]}
                    </span>
                    <span className={styles.phaseName}>{L.phase[ph]}</span>
                    <span className={styles.phaseHilfe}>{L.phaseHilfe[ph]}</span>
                    <span className={styles.phaseSumme}>{zahl(anteil, 2)} %</span>
                  </th>
                </tr>
              )}
              {zeilen.map((p) => (
                <Zeile key={p.key} p={p} info={infos?.[p.rohstoffId]} markiert={markiert?.has(p.key)} id={`${idPrefix}-${p.key}`} druck={druck} />
              ))}
            </tbody>
          );
        })}
        <tfoot>
          <tr>
            <th scope="row">{L.rezeptur.summe}</th>
            <td className={styles.num} data-falsch={Math.abs(b.summe - 100) > 0.005 || undefined}>
              {zahl(b.summe, 2)} %
            </td>
            <td className={styles.num}>{zahl(gesamtG, 2, true)} g</td>
            <td />
          </tr>
        </tfoot>
      </table>
    </div>
  );
}

function Zeile({ p, info, markiert, id, druck }: { p: BerechnetePosition; info?: RohstoffInfo; markiert?: boolean; id: string; druck: boolean }) {
  const m = p.menge;
  return (
    <tr data-markiert={markiert || undefined}>
      <th scope="row" className={styles.stoff}>
        <span className={styles.stoffName}>
          {p.rohstoff.name}
          {p.adHundert && <span className={styles.ad}>{L.editor.adHundert}</span>}
          {info && !druck && (info.was || info.hinweis) && (
            <>
              <button type="button" className={styles.infoBtn} popoverTarget={id} aria-label={`${L.rezeptur.steckbrief}: ${p.rohstoff.name}`}>
                <Icon name="info" size={16} />
              </button>
              <div id={id} popover="auto" className={styles.steckbrief}>
                <Steckbrief name={p.rohstoff.name} inci={p.rohstoff.inci} info={info} />
              </div>
            </>
          )}
        </span>
        {info?.funktion && <span className={styles.stoffFunktion}>{info.funktion}</span>}
      </th>
      <td className={styles.num}>{zahl(p.prozentEffektiv, 2)}</td>
      <td className={styles.num}>{zahl(p.gramm, 2, true)}</td>
      <td className={`${styles.num} ${styles.abmessen}`}>
        {m.art === "gramm" ? (
          <>
            <span>{mengeText(m)}</span>
            {m.feinwaage && <span className={styles.waage}>{L.rezeptur.feinwaage}</span>}
          </>
        ) : (
          <span className={styles.tropfen}>{mengeText(m)}</span>
        )}
      </td>
    </tr>
  );
}

export function Steckbrief({ name, inci, info }: { name: string; inci: string; info: RohstoffInfo }) {
  return (
    <div className={styles.steckbriefInhalt}>
      <p className={styles.steckbriefName}>{name}</p>
      <p className={styles.steckbriefInci}>{inci}</p>
      <dl>
        {info.was && (
          <>
            <dt>{L.rohstoffe.was}</dt>
            <dd>{info.was}</dd>
          </>
        )}
        {info.chemisch && (
          <>
            <dt>{L.rohstoffe.chemisch}</dt>
            <dd>{info.chemisch}</dd>
          </>
        )}
        {info.wirkung && (
          <>
            <dt>{L.rohstoffe.wirkung}</dt>
            <dd>{info.wirkung}</dd>
          </>
        )}
        {info.hinweis && (
          <>
            <dt>{L.rohstoffe.hinweis}</dt>
            <dd>{info.hinweis}</dd>
          </>
        )}
      </dl>
    </div>
  );
}
