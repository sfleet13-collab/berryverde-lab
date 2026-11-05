import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { notFound, redirect } from "next/navigation";
import { isLocale } from "@/config/site";
import { getDictionary } from "@/i18n";
import { L, fuelle } from "@/i18n/lab";
import { pageMetadata } from "@/lib/seo";
import { getRezeptur } from "@/lib/data";
import { ladeRohstoffe } from "@/lib/lab/laden";
import { labRezeptur } from "@/lib/lab/map";
import { inciListe, zahl } from "@/lib/lab/rechner";
import { herstelldatum, mengeAus } from "@/lib/lab/etikett";
import { pruefe } from "@/lib/lab/regeln";
import { requireMitglied } from "@/lib/session";
import Icon from "@/components/Icon";
import Formel from "@/components/lab/Formel";
import PrintButtons from "@/components/lab/PrintButtons";
import styles from "@/components/lab/lab.module.css";

export async function generateMetadata({ params }: PageProps<"/[lang]/app/rezeptur/[id]/karte">): Promise<Metadata> {
  const { lang, id } = await params;
  if (!isLocale(lang)) notFound();
  const t = getDictionary(lang);
  return pageMetadata({ lang, path: `/app/rezeptur/${id}/karte`, title: t.seo.karte.title, description: t.seo.karte.description, noindex: true });
}

export default function KartePage({ params, searchParams }: PageProps<"/[lang]/app/rezeptur/[id]/karte">) {
  // Hülle ohne Zugriff auf params: Die ID ist erst zur Laufzeit bekannt und wird im Suspense-Teil gelesen.
  const t = getDictionary("de");
  return (
    <section className={styles.seite}>
      <div className="container">
        <Suspense fallback={<p className="muted">{t.loading}</p>}>
          <Inhalt params={params} suche={searchParams as Promise<{ g?: string; d?: string }>} />
        </Suspense>
      </div>
    </section>
  );
}

async function Inhalt({ params, suche }: { params: Promise<{ lang: string; id: string }>; suche: Promise<{ g?: string; d?: string }> }) {
  const { lang, id } = await params;
  const user = await requireMitglied(lang);
  const r = Number.isInteger(Number(id)) ? await getRezeptur(user, Number(id)) : null;
  if (!r) redirect(`/${lang}/app`);
  const s = await suche;
  const charge = mengeAus(s.g, r.chargeG);
  const datumIso = herstelldatum(s.d).iso;

  const rohstoffe = await ladeRohstoffe(user);
  const map = new Map(rohstoffe.map((x) => [x.id, x]));
  const p = pruefe(labRezeptur(r, r.positionen, charge), map);
  const b = p.berechnung;
  const inci = inciListe(b).join(", ");
  const schritte = (r.herstellung ?? "").split("\n").map((x) => x.trim()).filter(Boolean);
  const haut = r.hautbeduerfnis
    .split(",")
    .map((h) => L.haut[h as keyof typeof L.haut])
    .filter(Boolean)
    .join(", ");
  const basis = `/${lang}/app/rezeptur/${r.id}`;
  const hatTropfen = b.positionen.some((x) => x.menge.art !== "gramm");

  return (
    <>
      <div className={`${styles.kartenLeiste} no-print`}>
        <Link href={basis} className={styles.zurueck}>
          <Icon name="arrow" className={styles.pfeilLinks} />
          {L.karte.zurueck}
        </Link>
        <form className={styles.kartenForm} action={`${basis}/karte`} method="get">
          <div className={styles.feld}>
            <label htmlFor="g">{L.karte.menge}</label>
            <input id="g" name="g" type="text" inputMode="decimal" defaultValue={String(charge).replace(".", ",")} />
          </div>
          <div className={styles.feld}>
            <label htmlFor="d">{L.karte.datum}</label>
            <input id="d" name="d" type="date" defaultValue={datumIso} />
          </div>
          <button type="submit" className="btn btn-ghost">
            {L.karte.aktualisieren}
          </button>
        </form>
        <div className={styles.aktionen}>
          <PrintButtons />
          <Link className="btn btn-ghost" href={`${basis}/etikett?g=${charge}&d=${datumIso}`}>
            {L.karte.zumEtikett}
          </Link>
        </div>
        <p className={styles.fussnote}>{L.karte.pdfHinweis}</p>
      </div>

      <article className={styles.blatt}>
        <header className={styles.blattKopf}>
          <p className={styles.blattMarke}>berryverde · Dein Lab</p>
          <div>
            {r.nummer && <p className={styles.nummer}>{r.nummer}</p>}
            <h1>{r.name}</h1>
            {r.untertitel && <p className={styles.untertitel}>{r.untertitel}</p>}
          </div>
          <dl className={styles.blattDaten}>
            <div>
              <dt>{L.karte.kopf.typ}</dt>
              <dd>{r.produktart ?? L.produkttyp[r.produkttyp]}</dd>
            </div>
            <div>
              <dt>{L.karte.kopf.haut}</dt>
              <dd>{haut}</dd>
            </div>
            <div>
              <dt>{L.karte.kopf.box}</dt>
              <dd>{L.ausruestung[r.ausruestung]}</dd>
            </div>
            <div>
              <dt>{L.karte.kopf.stufe}</dt>
              <dd>{L.stufe[p.stufe]}</dd>
            </div>
            {r.zeitMinuten && (
              <div>
                <dt>{L.karte.kopf.zeit}</dt>
                <dd>{fuelle(L.bibliothek.minuten, { n: r.zeitMinuten })}</dd>
              </div>
            )}
            <div>
              <dt>{L.rezeptur.charge}</dt>
              <dd>{zahl(charge, 2)} g</dd>
            </div>
          </dl>
        </header>

        <section aria-labelledby="k-formel">
          <h2 id="k-formel">{L.rezeptur.formel}</h2>
          <Formel b={b} druck idPrefix="k" infos={Object.fromEntries(rohstoffe.map((x) => [x.id, { ...x, was: null, chemisch: null, wirkung: null, hinweis: null }]))} />
          {hatTropfen && <p className={styles.fussnote}>{L.rezeptur.tropfenHinweis}</p>}
        </section>

        {schritte.length > 0 && (
          <section aria-labelledby="k-herstellung">
            <h2 id="k-herstellung">{L.rezeptur.herstellung}</h2>
            <ol className={styles.schritte}>
              {schritte.map((x, i) => (
                <li key={i}>{x}</li>
              ))}
            </ol>
          </section>
        )}
        {r.anwendung && (
          <section aria-labelledby="k-anwendung">
            <h2 id="k-anwendung">{L.rezeptur.anwendung}</h2>
            <p>{r.anwendung}</p>
          </section>
        )}
        <section aria-labelledby="k-inci">
          <h2 id="k-inci">{L.rezeptur.inci}</h2>
          <p>{inci}</p>
        </section>

        <p className={styles.eigengebrauch}>{L.rezeptur.eigengebrauch}</p>
      </article>
    </>
  );
}
