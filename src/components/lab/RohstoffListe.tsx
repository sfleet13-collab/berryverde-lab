"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import Icon from "@/components/Icon";
import { L, fuelle, nbsp } from "@/i18n/lab";
import { zahl } from "@/lib/lab/rechner";
import styles from "./lab.module.css";

export type RohstoffZeile = {
  id: number;
  slug: string;
  name: string;
  handelsnamen: string | null;
  inci: string;
  kategorie: keyof typeof L.kategorie;
  funktion: string | null;
  form: keyof typeof L.form;
  stufe: keyof typeof L.stufe;
  phMin: number | null;
  phMax: number | null;
  tempMax: number | null;
  loeslichkeit: keyof typeof L.loeslichkeit | null;
  hinweis: string | null;
  was: string | null;
  chemisch: string | null;
  wirkung: string | null;
  lieferant: string | null;
  kaufLink: string | null;
  kaufLinkAffiliate: boolean;
  wirk: [string | null, string | null, string | null];
  breitband: boolean | null;
  konsStatus: keyof typeof L.konsStatus | null;
  konsRolle: keyof typeof L.konsRolle | null;
  fettphaseMin: number | null;
  fettphaseMax: number | null;
  hautgefuehl: string | null;
  aktiv: boolean;
  dosierungen: { produkttyp: string; min: number; max: number; hinweis: string | null }[];
};

const DOS_LABEL: Record<string, string> = { emulsion: "Emulsion", wasserfrei: "wasserfrei", waessrig: "wässrig", alle: "" };

function ph(r: RohstoffZeile): string | null {
  if (r.phMin != null && r.phMax != null) return `${zahl(r.phMin, 1)} bis ${zahl(r.phMax, 1)}`;
  if (r.phMax != null) return `unter ${zahl(r.phMax, 1)}`;
  if (r.phMin != null) return `ab ${zahl(r.phMin, 1)}`;
  return null;
}

/** Rohstoff-Liste mit Suche und Gruppen-Filter. Der Steckbrief klappt direkt in der Liste auf. */
export default function RohstoffListe({ rohstoffe, admin }: { rohstoffe: RohstoffZeile[]; admin: boolean }) {
  const [q, setQ] = useState("");
  const [kat, setKat] = useState("");
  const kategorien = useMemo(() => [...new Set(rohstoffe.map((r) => r.kategorie))], [rohstoffe]);
  // „oel“ findet „Öl“, „weisse“ findet „Weiße“
  const norm = (t: string) =>
    t.toLowerCase().replace(/ä/g, "ae").replace(/ö/g, "oe").replace(/ü/g, "ue").replace(/ß/g, "ss");
  const suche = norm(q.trim());
  const liste = rohstoffe.filter(
    (r) =>
      (!kat || r.kategorie === kat) &&
      (!suche || norm([r.name, r.handelsnamen, r.inci, r.funktion].filter(Boolean).join(" ")).includes(suche)),
  );

  return (
    <>
      <div className={styles.filter} role="search">
        <div className={`${styles.feld} ${styles.filterSuche}`}>
          <label htmlFor="rq">{L.rohstoffe.suche}</label>
          <input id="rq" type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder={L.rohstoffe.suchePlatzhalter} />
        </div>
        <div className={styles.feld}>
          <label htmlFor="rk">{L.rohstoffForm.kategorie}</label>
          <select id="rk" value={kat} onChange={(e) => setKat(e.target.value)}>
            <option value="">{L.rohstoffe.alleKategorien}</option>
            {kategorien.map((k) => (
              <option key={k} value={k}>
                {L.kategorie[k]}
              </option>
            ))}
          </select>
        </div>
      </div>
      <p className={styles.treffer} role="status">
        {liste.length === 1 ? L.rohstoffe.anzahlEins : fuelle(L.rohstoffe.anzahl, { n: liste.length })}
      </p>

      {liste.length === 0 ? (
        <p className={styles.leer}>{L.rohstoffe.keine}</p>
      ) : (
        <ul className={styles.stoffListe}>
          {liste.map((r) => (
            <li key={r.id} id={r.slug}>
              <details>
                <summary>
                  <span className={styles.stoffKopf}>
                    <strong>{r.name}</strong>
                    <span>{r.funktion}</span>
                  </span>
                  <span className={styles.stoffMeta}>
                    <span>{L.kategorie[r.kategorie]}</span>
                    <span>{L.stufe[r.stufe]}</span>
                    {!r.aktiv && <span className={styles.entwurf}>{L.rohstoffe.inaktiv}</span>}
                  </span>
                </summary>
                <div className={styles.stoffDetail}>
                  <p className={styles.steckbriefInci}>
                    {r.inci}
                    {r.handelsnamen ? ` · ${r.handelsnamen}` : ""}
                  </p>
                  <div className={styles.stoffSpalten}>
                    <dl className={styles.steckbriefText}>
                      {r.was && (
                        <>
                          <dt>{L.rohstoffe.was}</dt>
                          <dd>{nbsp(r.was)}</dd>
                        </>
                      )}
                      {r.chemisch && (
                        <>
                          <dt>{L.rohstoffe.chemisch}</dt>
                          <dd>{nbsp(r.chemisch)}</dd>
                        </>
                      )}
                      {r.wirkung && (
                        <>
                          <dt>{L.rohstoffe.wirkung}</dt>
                          <dd>{nbsp(r.wirkung)}</dd>
                        </>
                      )}
                      {r.hinweis && (
                        <>
                          <dt>{L.rohstoffe.hinweis}</dt>
                          <dd>{nbsp(r.hinweis)}</dd>
                        </>
                      )}
                    </dl>
                    <dl className={styles.werte}>
                      {r.dosierungen.length > 0 && (
                        <div>
                          <dt>{L.rohstoffe.dosierung}</dt>
                          <dd>
                            {r.dosierungen.map((d) => (
                              <span key={d.produkttyp}>
                                {d.min === d.max ? zahl(d.min, 2) : `${zahl(d.min, 2)} bis ${zahl(d.max, 2)}`} %
                                {d.hinweis ? ` ${d.hinweis}` : DOS_LABEL[d.produkttyp] ? ` (${DOS_LABEL[d.produkttyp]})` : ""}
                              </span>
                            ))}
                          </dd>
                        </div>
                      )}
                      {ph(r) && (
                        <div>
                          <dt>{L.rohstoffe.ph}</dt>
                          <dd>{ph(r)}</dd>
                        </div>
                      )}
                      {r.tempMax != null && (
                        <div>
                          <dt>{L.rohstoffe.temp}</dt>
                          <dd>{r.tempMax} °C</dd>
                        </div>
                      )}
                      {r.fettphaseMin != null && r.fettphaseMax != null && (
                        <div>
                          <dt>{L.rohstoffe.fettphase}</dt>
                          <dd>
                            {zahl(r.fettphaseMin, 0)} bis {zahl(r.fettphaseMax, 0)} %
                          </dd>
                        </div>
                      )}
                      {r.hautgefuehl && (
                        <div>
                          <dt>{L.rohstoffe.hautgefuehl}</dt>
                          <dd>{r.hautgefuehl}</dd>
                        </div>
                      )}
                      {r.wirk[0] && (
                        <div>
                          <dt>{L.rohstoffe.wirkspektrum}</dt>
                          <dd>
                            <span>
                              {L.rohstoffe.bakterien} {r.wirk[0]}
                            </span>
                            <span>
                              {L.rohstoffe.hefen} {r.wirk[1]}
                            </span>
                            <span>
                              {L.rohstoffe.schimmel} {r.wirk[2]}
                            </span>
                            <small className={styles.legende}>{L.rohstoffe.legende}</small>
                          </dd>
                        </div>
                      )}
                      {r.konsStatus && (
                        <div>
                          <dt>{L.rohstoffForm.konsStatus}</dt>
                          <dd>
                            <span>{L.konsStatus[r.konsStatus]}</span>
                            {r.konsRolle && <span>{L.konsRolle[r.konsRolle]}</span>}
                          </dd>
                        </div>
                      )}
                      <div>
                        <dt>{L.rohstoffForm.form}</dt>
                        <dd>
                          {L.form[r.form]}
                          {r.loeslichkeit ? `, ${L.loeslichkeit[r.loeslichkeit]}` : ""}
                        </dd>
                      </div>
                      {r.lieferant && (
                        <div>
                          <dt>{L.rohstoffe.lieferant}</dt>
                          <dd>{r.lieferant}</dd>
                        </div>
                      )}
                    </dl>
                  </div>
                  <div className={styles.stoffAktionen}>
                    {r.kaufLink && (
                      <a href={r.kaufLink} target="_blank" rel={`noopener${r.kaufLinkAffiliate ? " sponsored" : ""}`} className={styles.extern}>
                        {L.rohstoffe.nachbestellen}
                        <span className="sr-only">: {r.name}</span>
                        <Icon name="external" size={15} />
                        {r.kaufLinkAffiliate && <span className={styles.affiliate}>{L.rezeptur.affiliate}</span>}
                      </a>
                    )}
                    {admin && (
                      <Link href={`/de/app/rohstoffe/${r.id}`} className={styles.extern}>
                        <Icon name="edit" size={15} />
                        {L.rohstoffe.bearbeiten}
                        <span className="sr-only">: {r.name}</span>
                      </Link>
                    )}
                  </div>
                </div>
              </details>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
