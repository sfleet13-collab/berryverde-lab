"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import Icon from "@/components/Icon";
import { L, fuelle } from "@/i18n/lab";
import { zahl } from "@/lib/lab/rechner";
import { pruefe } from "@/lib/lab/regeln";
import type { LabRezeptur, LabRohstoff } from "@/lib/lab/types";
import Formel, { type RohstoffInfo } from "./Formel";
import Meldungen from "./Meldungen";
import styles from "./lab.module.css";

export type RohstoffClient = LabRohstoff & RohstoffInfo;
export type GeraetClient = { slug: string; name: string; beschreibung: string | null; link: string | null; linkAffiliate: boolean };

const SCHNELL = [30, 50, 100];

/** Rezeptur-Ansicht: Menge ändern, alles rechnet um. Zeigt Formel, Kennzahlen, Prüfung und Geräte. */
export default function Rechner({
  rezeptur,
  rohstoffe,
  geraete,
  kartenLink,
}: {
  rezeptur: LabRezeptur;
  rohstoffe: RohstoffClient[];
  geraete: GeraetClient[];
  kartenLink: string;
}) {
  const [eingabe, setEingabe] = useState(String(rezeptur.chargeG).replace(".", ","));
  const charge = Number(eingabe.replace(",", "."));
  const gueltig = Number.isFinite(charge) && charge > 0 && charge <= 5000;

  const map = useMemo(() => new Map(rohstoffe.map((r) => [r.id, r as LabRohstoff])), [rohstoffe]);
  const infos = useMemo(() => Object.fromEntries(rohstoffe.map((r) => [r.id, r as RohstoffInfo])), [rohstoffe]);
  const p = useMemo(() => pruefe({ ...rezeptur, chargeG: gueltig ? charge : rezeptur.chargeG }, map), [rezeptur, charge, gueltig, map]);
  const b = p.berechnung;
  const hatTropfen = b.positionen.some((x) => x.menge.art !== "gramm");

  return (
    <div className={styles.rechner}>
      <div className={styles.chargeLeiste}>
        <div className={styles.chargeFeld}>
          <label htmlFor="charge">{L.rezeptur.charge}</label>
          <div className={styles.chargeEingabe}>
            <input
              id="charge"
              type="text"
              inputMode="decimal"
              value={eingabe}
              onChange={(e) => setEingabe(e.target.value)}
              aria-invalid={!gueltig || undefined}
              aria-describedby="charge-hilfe"
            />
            <span aria-hidden="true">{L.rezeptur.gramm}</span>
          </div>
        </div>
        <div className={styles.schnell} role="group" aria-label={L.rezeptur.charge}>
          {SCHNELL.map((g) => (
            <button key={g} type="button" onClick={() => setEingabe(String(g))} aria-pressed={charge === g}>
              {g} g
            </button>
          ))}
        </div>
        <div className={styles.kartenBtns}>
          <Link className="btn btn-primary" href={`${kartenLink}?g=${gueltig ? charge : rezeptur.chargeG}`}>
            <Icon name="print" />
            {L.rezeptur.karte}
          </Link>
          <Link className="btn btn-ghost" href={`${kartenLink.replace(/\/karte$/, "/etikett")}?g=${gueltig ? charge : rezeptur.chargeG}`}>
            {L.rezeptur.etikett}
          </Link>
        </div>
        <p id="charge-hilfe" className={styles.chargeHilfe} data-fehler={!gueltig || undefined} role={gueltig ? undefined : "alert"}>
          {gueltig ? L.rezeptur.chargeHilfe : fuelle(L.rezeptur.chargeUngueltig, { n: zahl(rezeptur.chargeG, 2) })}
        </p>
      </div>

      <Formel b={b} infos={infos} />

      {(b.fettphase > 0 && b.wasserphase > 0) || b.emulgator || b.konserviererGesamt > 0 || b.wasGesamt > 0 ? (
        <dl className={styles.kennzahlen}>
          {b.wasGesamt > 0 && (
            <div>
              <dt>{L.rezeptur.was}</dt>
              <dd>{zahl(b.wasGesamt, 1)} %</dd>
            </div>
          )}
          {b.fettphase > 0 && b.wasserphase > 0 && (
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
        </dl>
      ) : null}

      {hatTropfen && <p className={styles.fussnote}>{L.rezeptur.tropfenHinweis}</p>}

      <section className={styles.block} aria-labelledby="pruefung-titel">
        <h2 id="pruefung-titel">{L.rezeptur.pruefung}</h2>
        <Meldungen meldungen={p.meldungen} />
      </section>

      {p.geraete.length > 0 && (
        <section className={styles.block} aria-labelledby="geraete-titel">
          <h2 id="geraete-titel">{L.rezeptur.geraete}</h2>
          <ul className={styles.geraete}>
            {p.geraete.map((g) => {
              const geraet = geraete.find((x) => x.slug === g.slug);
              return (
                <li key={g.slug}>
                  <Icon name={g.slug === "feinwaage" ? "scale" : g.slug === "ph-meter" ? "drop" : "flask"} size={22} />
                  <div>
                    <p className={styles.geraetName}>
                      {geraet?.name ?? g.slug}
                      <span className={styles.geraetArt} data-pflicht={g.pflicht || undefined}>
                        {g.pflicht ? L.rezeptur.geraetPflicht : L.rezeptur.geraetEmpfohlen}
                      </span>
                    </p>
                    <p className={styles.geraetGrund}>{g.grund}</p>
                    {geraet?.link && (
                      <a href={geraet.link} target="_blank" rel={`noopener${geraet.linkAffiliate ? " sponsored" : ""}`} className={styles.extern}>
                        {L.rezeptur.geraetLink}
                        <Icon name="external" size={15} />
                        {geraet.linkAffiliate && <span className={styles.affiliate}>{L.rezeptur.affiliate}</span>}
                      </a>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      )}
    </div>
  );
}
