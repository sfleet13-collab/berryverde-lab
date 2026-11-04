import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { isLocale } from "@/config/site";
import { getDictionary } from "@/i18n";
import { L, fuelle } from "@/i18n/lab";
import { pageMetadata } from "@/lib/seo";
import { isAdmin } from "@/lib/auth";
import { listRezepturen, listRohstoffe, type RezepturMitPositionen } from "@/lib/data";
import { requireMitglied } from "@/lib/session";
import Icon from "@/components/Icon";
import styles from "@/components/lab/lab.module.css";

export async function generateMetadata({ params }: PageProps<"/[lang]/app">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = getDictionary(lang);
  return pageMetadata({ lang, path: "/app", title: t.seo.app.title, description: t.seo.app.description, noindex: true });
}

type Suche = { ansicht?: string; q?: string; typ?: string; haut?: string; box?: string; stufe?: string };

export default async function BibliothekPage({ params, searchParams }: PageProps<"/[lang]/app">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = getDictionary(lang);

  return (
    <section className={styles.seite}>
      <div className="container">
        <Suspense fallback={<Skelett titel={L.bibliothek.titel} text={t.loading} />}>
          <Inhalt lang={lang} suche={searchParams as Promise<Suche>} />
        </Suspense>
      </div>
    </section>
  );
}

function Skelett({ titel, text }: { titel: string; text: string }) {
  return (
    <>
      <h1 className={styles.seitenTitel}>{titel}</h1>
      <p className="muted">{text}</p>
    </>
  );
}

const eins = (v: unknown) => (typeof v === "string" ? v : "");

async function Inhalt({ lang, suche }: { lang: string; suche: Promise<Suche> }) {
  const user = await requireMitglied(lang);
  const s = await suche;
  const meine = s.ansicht === "meine";
  const q = eins(s.q).trim().toLowerCase().slice(0, 60);
  const typ = eins(s.typ);
  const haut = eins(s.haut);
  const box = eins(s.box);
  const stufe = eins(s.stufe);

  const [alle, rohstoffe] = await Promise.all([listRezepturen(user), listRohstoffe(user, { auchInaktive: true })]);
  const namen = new Map(rohstoffe.map((r) => [r.id, r.name.toLowerCase()]));
  const admin = isAdmin(user);

  const inAnsicht = alle.filter((r) => (meine ? !r.bibliothek && (r.userId === user.id || admin) : r.bibliothek));
  const liste = inAnsicht.filter((r) => {
    if (typ && r.produkttyp !== typ) return false;
    if (box && r.ausruestung !== box) return false;
    if (stufe && r.stufe !== stufe) return false;
    if (haut && !r.hautbeduerfnis.split(",").some((h) => h === haut || h === "alle")) return false;
    if (q) {
      const text = [r.name, r.untertitel, r.produktart, r.nummer, ...r.positionen.map((p) => namen.get(p.rohstoffId) ?? "")]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      if (!text.includes(q)) return false;
    }
    return true;
  });
  const gefiltert = Boolean(q || typ || haut || box || stufe);
  const basis = `/${lang}/app`;

  return (
    <>
      <div className={styles.seitenKopf}>
        <h1 className={styles.seitenTitel}>{L.bibliothek.titel}</h1>
        <Link className="btn btn-primary" href={`${basis}/rezeptur/neu`}>
          <Icon name="plus" />
          {L.bibliothek.neu}
        </Link>
      </div>

      <div className={styles.tabs} role="navigation" aria-label={L.bibliothek.titel}>
        <Link href={basis} aria-current={!meine ? "page" : undefined}>
          {L.bibliothek.tabBibliothek}
        </Link>
        <Link href={`${basis}?ansicht=meine`} aria-current={meine ? "page" : undefined}>
          {L.bibliothek.tabMeine}
        </Link>
      </div>

      <form className={styles.filter} action={basis} method="get" role="search">
        {meine && <input type="hidden" name="ansicht" value="meine" />}
        <div className={`${styles.feld} ${styles.filterSuche}`}>
          <label htmlFor="q">{L.bibliothek.suche}</label>
          <input id="q" name="q" type="search" defaultValue={q} placeholder={L.bibliothek.suchePlatzhalter} />
        </div>
        <Auswahl id="typ" label={L.bibliothek.produkttyp} wert={typ} optionen={L.produkttyp} />
        <Auswahl id="haut" label={L.bibliothek.haut} wert={haut} optionen={{ trocken: L.haut.trocken, fettig: L.haut.fettig, sensibel: L.haut.sensibel, reif: L.haut.reif, misch: L.haut.misch }} />
        <Auswahl id="box" label={L.bibliothek.ausruestung} wert={box} optionen={L.ausruestung} />
        <Auswahl id="stufe" label={L.bibliothek.stufe} wert={stufe} optionen={L.stufe} />
        <button type="submit" className="btn btn-ghost">
          {L.bibliothek.filtern}
        </button>
      </form>

      <p className={styles.treffer} role="status">
        {liste.length === 1 ? L.bibliothek.trefferEins : fuelle(L.bibliothek.treffer, { n: liste.length })}
        {gefiltert && (
          <Link href={meine ? `${basis}?ansicht=meine` : basis} className={styles.zurueckLink}>
            {L.bibliothek.zuruecksetzen}
          </Link>
        )}
      </p>

      {liste.length === 0 ? (
        gefiltert ? (
          <p className={styles.leer}>{L.bibliothek.keineTreffer}</p>
        ) : meine ? (
          <div className={styles.leerBox}>
            <h2>{L.bibliothek.leerMeineTitel}</h2>
            <p>{L.bibliothek.leerMeineText}</p>
            <div className={styles.aktionen}>
              <Link className="btn btn-primary" href={`${basis}/rezeptur/neu`}>
                <Icon name="plus" />
                {L.bibliothek.neu}
              </Link>
              <Link className="btn btn-ghost" href={basis}>
                {L.bibliothek.tabBibliothek}
              </Link>
            </div>
          </div>
        ) : (
          <p className={styles.leer}>{L.bibliothek.leerBibliothek}</p>
        )
      ) : (
        <ul className={styles.rezeptListe}>
          {liste.map((r) => (
            <RezeptZeile key={r.id} r={r} basis={basis} zeigeStatus={admin || meine} />
          ))}
        </ul>
      )}
    </>
  );
}

function Auswahl({ id, label, wert, optionen }: { id: string; label: string; wert: string; optionen: Record<string, string> }) {
  return (
    <div className={styles.feld}>
      <label htmlFor={id}>{label}</label>
      <select id={id} name={id} defaultValue={wert}>
        <option value="">{L.bibliothek.alle}</option>
        {Object.entries(optionen).map(([k, v]) => (
          <option key={k} value={k}>
            {v}
          </option>
        ))}
      </select>
    </div>
  );
}

function RezeptZeile({ r, basis, zeigeStatus }: { r: RezepturMitPositionen; basis: string; zeigeStatus: boolean }) {
  const haut = r.hautbeduerfnis
    .split(",")
    .map((h) => L.haut[h as keyof typeof L.haut])
    .filter(Boolean)
    .join(", ");
  return (
    <li>
      <Link href={`${basis}/rezeptur/${r.id}`} className={styles.rezeptLink}>
        <span className={styles.rezeptNummer}>{r.nummer ?? (r.bibliothek ? "" : L.bibliothek.eigene)}</span>
        <span className={styles.rezeptName}>
          <strong>{r.name}</strong>
          {r.untertitel && <span>{r.untertitel}</span>}
        </span>
        <span className={styles.rezeptMeta}>
          <span>{r.produktart ?? L.produkttyp[r.produkttyp]}</span>
          <span>{haut}</span>
          <span>{L.ausruestung[r.ausruestung]}</span>
          <span>{L.stufe[r.stufe]}</span>
          {r.zeitMinuten && <span>{fuelle(L.bibliothek.minuten, { n: r.zeitMinuten })}</span>}
          {zeigeStatus && r.status === "entwurf" && r.bibliothek && <span className={styles.entwurf}>{L.bibliothek.entwurf}</span>}
        </span>
        <Icon name="arrow" className={styles.rezeptPfeil} />
      </Link>
    </li>
  );
}
