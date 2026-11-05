import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { notFound, redirect } from "next/navigation";
import { isLocale } from "@/config/site";
import { getDictionary } from "@/i18n";
import { L } from "@/i18n/lab";
import { pageMetadata } from "@/lib/seo";
import { getRezeptur } from "@/lib/data";
import { etikettDaten, herstelldatum, mengeAus, type Format } from "@/lib/lab/etikett";
import { ladeRohstoffe } from "@/lib/lab/laden";
import { labRezeptur } from "@/lib/lab/map";
import { inciListe } from "@/lib/lab/rechner";
import { pruefe } from "@/lib/lab/regeln";
import { requireMitglied } from "@/lib/session";
import Icon from "@/components/Icon";
import PrintButtons from "@/components/lab/PrintButtons";
import EtikettBogen from "@/components/lab/EtikettBogen";
import styles from "@/components/lab/lab.module.css";

export async function generateMetadata({ params }: PageProps<"/[lang]/app/rezeptur/[id]/etikett">): Promise<Metadata> {
  const { lang, id } = await params;
  if (!isLocale(lang)) notFound();
  const t = getDictionary(lang);
  return pageMetadata({ lang, path: `/app/rezeptur/${id}/etikett`, title: t.seo.etikett.title, description: t.seo.etikett.description, noindex: true });
}

type Suche = { g?: string; d?: string; format?: string; menge?: string };

export default function EtikettPage({ params, searchParams }: PageProps<"/[lang]/app/rezeptur/[id]/etikett">) {
  const t = getDictionary("de");
  return (
    <section className={styles.seite}>
      <div className="container">
        <Suspense fallback={<p className="muted">{t.loading}</p>}>
          <Inhalt params={params} suche={searchParams as Promise<Suche>} />
        </Suspense>
      </div>
    </section>
  );
}

async function Inhalt({ params, suche }: { params: Promise<{ lang: string; id: string }>; suche: Promise<Suche> }) {
  const { lang, id } = await params;
  const user = await requireMitglied(lang);
  const r = Number.isInteger(Number(id)) ? await getRezeptur(user, Number(id)) : null;
  if (!r) redirect(`/${lang}/app`);
  const s = await suche;
  const format: Format = s.format === "rund" ? "rund" : "rechteck";
  const bogen = s.menge === "bogen";
  const charge = mengeAus(s.g, r.chargeG);
  const { iso, datum } = herstelldatum(s.d);

  const rohstoffe = await ladeRohstoffe(user);
  const p = pruefe(labRezeptur(r, r.positionen, charge), new Map(rohstoffe.map((x) => [x.id, x])));
  const daten = etikettDaten({
    name: r.name,
    nummer: r.nummer,
    id: r.id,
    frischcreme: r.frischcreme,
    haltbarkeitTage: r.haltbarkeitTage,
    haltbarkeitMaxTage: p.haltbarkeitMaxTage,
    hergestellt: datum,
    inci: inciListe(p.berechnung).join(", "),
  });

  const basis = `/${lang}/app/rezeptur/${r.id}`;
  const link = (teil: Partial<Suche>) => {
    const q = new URLSearchParams({ g: String(charge), d: iso, format, menge: bogen ? "bogen" : "einzeln", ...teil } as Record<string, string>);
    return `${basis}/etikett?${q}`;
  };

  return (
    <>
      <div className={`${styles.kartenLeiste} no-print`}>
        <Link href={basis} className={styles.zurueck}>
          <Icon name="arrow" className={styles.pfeilLinks} />
          {L.karte.zurueck}
        </Link>
        <h1 className={styles.seitenTitel}>
          {L.karte.etikettTitel}: {r.name}
        </h1>

        <div className={styles.etikettWahl}>
          <fieldset className={styles.feld}>
            <legend>{L.karte.format}</legend>
            <div className={`${styles.segment} ${styles.segmentZwei}`}>
              <Link href={link({ format: "rechteck" })} data-aktiv={format === "rechteck" || undefined} aria-current={format === "rechteck" || undefined}>
                <span>{L.karte.formatRechteck}</span>
                <small>{L.karte.formatRechteckHilfe}</small>
              </Link>
              <Link href={link({ format: "rund" })} data-aktiv={format === "rund" || undefined} aria-current={format === "rund" || undefined}>
                <span>{L.karte.formatRund}</span>
                <small>{L.karte.formatRundHilfe}</small>
              </Link>
            </div>
          </fieldset>
          <fieldset className={styles.feld}>
            <legend>{L.karte.anzahl}</legend>
            <div className={`${styles.segment} ${styles.segmentZwei}`}>
              <Link href={link({ menge: "einzeln" })} data-aktiv={!bogen || undefined} aria-current={!bogen || undefined}>
                <span>{L.karte.einzeln}</span>
                <small>{L.karte.einzelnHilfe}</small>
              </Link>
              <Link href={link({ menge: "bogen" })} data-aktiv={bogen || undefined} aria-current={bogen || undefined}>
                <span>{L.karte.bogen}</span>
                <small>{L.karte.bogenHilfe}</small>
              </Link>
            </div>
          </fieldset>
          <form className={styles.kartenForm} action={`${basis}/etikett`} method="get">
            <input type="hidden" name="format" value={format} />
            <input type="hidden" name="menge" value={bogen ? "bogen" : "einzeln"} />
            <div className={styles.feld}>
              <label htmlFor="g">{L.karte.menge}</label>
              <input id="g" name="g" type="text" inputMode="decimal" defaultValue={String(charge).replace(".", ",")} />
            </div>
            <div className={styles.feld}>
              <label htmlFor="d">{L.karte.datum}</label>
              <input id="d" name="d" type="date" defaultValue={iso} />
            </div>
            <button type="submit" className="btn btn-ghost">
              {L.karte.aktualisieren}
            </button>
          </form>
          <div className={styles.aktionen}>
            <PrintButtons label={L.karte.etikettDrucken} />
            <Link className="btn btn-ghost" href={`${basis}/karte?g=${charge}&d=${iso}`}>
              {L.karte.zurKarte}
            </Link>
          </div>
          <p className={styles.fussnote}>{L.karte.probedruck}</p>
        </div>
        <h2 className={styles.vorschauTitel}>{L.karte.vorschau}</h2>
      </div>

      <EtikettBogen format={format} bogen={bogen} daten={daten} />
    </>
  );
}
