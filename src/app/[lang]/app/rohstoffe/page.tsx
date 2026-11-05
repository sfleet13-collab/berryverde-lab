import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { isLocale } from "@/config/site";
import { getDictionary } from "@/i18n";
import { L } from "@/i18n/lab";
import { pageMetadata } from "@/lib/seo";
import { isAdmin } from "@/lib/auth";
import { listRohstoffe } from "@/lib/data";
import { requireMitglied } from "@/lib/session";
import Icon from "@/components/Icon";
import RohstoffListe, { type RohstoffZeile } from "@/components/lab/RohstoffListe";
import styles from "@/components/lab/lab.module.css";

export async function generateMetadata({ params }: PageProps<"/[lang]/app/rohstoffe">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = getDictionary(lang);
  return pageMetadata({ lang, path: "/app/rohstoffe", title: t.seo.rohstoffe.title, description: t.seo.rohstoffe.description, noindex: true });
}

export default async function RohstoffePage({ params }: PageProps<"/[lang]/app/rohstoffe">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = getDictionary(lang);
  return (
    <section className={styles.seite}>
      <div className="container">
        <Suspense
          fallback={
            <>
              <h1 className={styles.seitenTitel}>{L.rohstoffe.titel}</h1>
              <p className="muted">{t.loading}</p>
            </>
          }
        >
          <Inhalt lang={lang} />
        </Suspense>
      </div>
    </section>
  );
}

async function Inhalt({ lang }: { lang: string }) {
  const user = await requireMitglied(lang);
  const admin = isAdmin(user);
  const rows = await listRohstoffe(user, { auchInaktive: true });
  const rohstoffe: RohstoffZeile[] = rows.map((r) => ({
    id: r.id,
    slug: r.slug,
    name: r.name,
    handelsnamen: r.handelsnamen,
    inci: r.inci,
    kategorie: r.kategorie,
    funktion: r.funktion,
    form: r.form,
    stufe: r.stufe,
    phMin: r.phMin,
    phMax: r.phMax,
    tempMax: r.tempMax,
    loeslichkeit: r.loeslichkeit,
    hinweis: r.hinweis,
    was: r.steckbriefWas,
    chemisch: r.steckbriefChemisch,
    wirkung: r.steckbriefWirkung,
    lieferant: r.lieferant,
    kaufLink: r.kaufLink,
    kaufLinkAffiliate: r.kaufLinkAffiliate,
    wirk: [r.wirkBakterien, r.wirkHefen, r.wirkSchimmel],
    breitband: r.breitband,
    konsStatus: r.konsStatus,
    konsRolle: r.konsRolle,
    fettphaseMin: r.fettphaseMin,
    fettphaseMax: r.fettphaseMax,
    hautgefuehl: r.hautgefuehl,
    emulgatorTyp: r.emulgatorTyp,
    spreitung: r.spreitung,
    oxidation: r.oxidation,
    haltbarMonate: r.haltbarMonate,
    fettsaeuren: r.fettsaeuren,
    verseifungszahlKoh: r.verseifungszahlKoh,
    schmelzpunkt: r.schmelzpunkt,
    geeignetFuer: r.geeignetFuer,
    tensidKlasse: r.tensidKlasse,
    wasProzent: r.wasProzent,
    vertraeglichkeit: r.vertraeglichkeit,
    tensidRolle: r.tensidRolle,
    aktiv: r.aktiv,
    dosierungen: r.dosierungen.map((d) => ({ produkttyp: d.produkttyp, min: d.min, max: d.max, hinweis: d.hinweis })),
  }));

  return (
    <>
      <div className={styles.seitenKopf}>
        <div>
          <h1 className={styles.seitenTitel}>{L.rohstoffe.titel}</h1>
          <p className={styles.seitenLead}>{L.rohstoffe.lead}</p>
        </div>
        {admin && (
          <Link className="btn btn-primary" href={`/${lang}/app/rohstoffe/neu`}>
            <Icon name="plus" />
            {L.rohstoffe.neu}
          </Link>
        )}
      </div>
      <RohstoffListe rohstoffe={rohstoffe} admin={admin} />
    </>
  );
}
