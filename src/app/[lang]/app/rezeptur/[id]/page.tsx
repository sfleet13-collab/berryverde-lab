import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { isLocale } from "@/config/site";
import { getDictionary } from "@/i18n";
import { L, fuelle } from "@/i18n/lab";
import { pageMetadata } from "@/lib/seo";
import { isAdmin } from "@/lib/auth";
import { darfAendern, getRezeptur } from "@/lib/data";
import { kopiereRezeptur, loescheRezeptur } from "@/lib/actions/lab";
import { veroeffentlichung } from "@/lib/lab/blog";
import { ladeGeraete, ladeRohstoffe } from "@/lib/lab/laden";
import { labRezeptur } from "@/lib/lab/map";
import { berechne, inciListe } from "@/lib/lab/rechner";
import { requireMitglied } from "@/lib/session";
import Icon from "@/components/Icon";
import CopyBox from "@/components/lab/CopyBox";
import FotoUpload from "@/components/lab/FotoUpload";
import { site } from "@/config/site";
import Rechner from "@/components/lab/Rechner";
import styles from "@/components/lab/lab.module.css";

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/app/rezeptur/[id]">): Promise<Metadata> {
  const { lang, id } = await params;
  if (!isLocale(lang)) notFound();
  const t = getDictionary(lang);
  return pageMetadata({
    lang,
    path: `/app/rezeptur/${id}`,
    title: t.seo.rezeptur.title,
    description: t.seo.rezeptur.description,
    noindex: true,
  });
}

export default function RezepturPage({
  params,
}: PageProps<"/[lang]/app/rezeptur/[id]">) {
  // Hülle ohne Zugriff auf params: Die ID ist erst zur Laufzeit bekannt und wird im Suspense-Teil gelesen.
  const t = getDictionary("de");
  return (
    <section className={styles.seite}>
      <div className="container">
        <Suspense fallback={<p className="muted">{t.loading}</p>}>
          <Inhalt params={params} />
        </Suspense>
      </div>
    </section>
  );
}

function haltbarText(tage: number): string {
  return tage >= 60
    ? fuelle(L.rezeptur.haltbarMonate, { n: Math.round(tage / 30.4) })
    : fuelle(L.rezeptur.haltbarTage, { n: tage });
}

async function Inhalt({
  params,
}: {
  params: Promise<{ lang: string; id: string }>;
}) {
  const { lang, id } = await params;
  const user = await requireMitglied(lang);
  const basis = `/${lang}/app`;
  const rezepturId = Number(id);
  const r = Number.isInteger(rezepturId)
    ? await getRezeptur(user, rezepturId)
    : null;
  if (!r) {
    return (
      <>
        <h1 className={styles.seitenTitel}>{L.rezeptur.zurueck}</h1>
        <p className={styles.leer}>{L.rezeptur.nichtGefunden}</p>
        <Link className="btn btn-ghost" href={basis}>
          {L.rezeptur.zurueck}
        </Link>
      </>
    );
  }

  const [rohstoffe, geraete] = await Promise.all([
    ladeRohstoffe(user),
    ladeGeraete(user),
  ]);
  const lab = labRezeptur(r, r.positionen);
  const map = new Map(rohstoffe.map((x) => [x.id, x]));
  const b = berechne(lab, map);
  const inci = inciListe(b).join(", ");
  const schritte = (r.herstellung ?? "")
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
  const haut = r.hautbeduerfnis
    .split(",")
    .map((h) => L.haut[h as keyof typeof L.haut])
    .filter(Boolean)
    .join(", ");
  const aendern = darfAendern(user, r);
  const admin = isAdmin(user);
  const haltbar = r.frischcreme
    ? L.rezeptur.frischcreme
    : r.haltbarkeitTage
      ? haltbarText(r.haltbarkeitTage)
      : null;

  return (
    <article className={styles.rezeptur}>
      <Link
        href={r.bibliothek ? basis : `${basis}?ansicht=meine`}
        className={styles.zurueck}
      >
        <Icon name="arrow" className={styles.pfeilLinks} />
        {L.rezeptur.zurueck}
      </Link>

      {r.fotoUrl && (
        <div className={styles.rezepturFoto}>
          <Image
            src={r.fotoUrl}
            alt={r.name}
            fill
            priority
            sizes="(max-width: 1100px) 100vw, 1100px"
          />
        </div>
      )}

      <header className={styles.rezepturKopf}>
        <div>
          {r.nummer && <p className={styles.nummer}>{r.nummer}</p>}
          <h1 className={styles.seitenTitel}>{r.name}</h1>
          {r.untertitel && <p className={styles.untertitel}>{r.untertitel}</p>}
        </div>
        <dl className={styles.eckdaten}>
          <div>
            <dt>{L.karte.kopf.typ}</dt>
            <dd>
              {r.produktart
                ? `${r.produktart}, ${L.produkttyp[r.produkttyp].toLowerCase()}`
                : L.produkttyp[r.produkttyp]}
              {r.produkttyp === "emulsion" &&
                ` ${L.emulsionstyp[r.emulsionstyp ?? "ow"]}`}
            </dd>
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
            <dd>{L.stufe[r.stufe]}</dd>
          </div>
          {r.zeitMinuten && (
            <div>
              <dt>{L.karte.kopf.zeit}</dt>
              <dd>{fuelle(L.bibliothek.minuten, { n: r.zeitMinuten })}</dd>
            </div>
          )}
          {haltbar && (
            <div>
              <dt>{L.karte.kopf.haltbar}</dt>
              <dd>{haltbar}</dd>
            </div>
          )}
          {r.phZiel != null && (
            <div>
              <dt>{L.rezeptur.phZiel}</dt>
              <dd>{String(r.phZiel).replace(".", ",")}</dd>
            </div>
          )}
        </dl>
      </header>

      <div className={styles.rezepturRaster}>
        <div>
          <Rechner
            rezeptur={lab}
            rohstoffe={rohstoffe}
            geraete={geraete}
            kartenLink={`${basis}/rezeptur/${r.id}/karte`}
          />
        </div>

        <div className={styles.rezepturText}>
          {schritte.length > 0 && (
            <section
              className={styles.block}
              aria-labelledby="herstellung-titel"
            >
              <h2 id="herstellung-titel">{L.rezeptur.herstellung}</h2>
              <ol className={styles.schritte}>
                {schritte.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ol>
            </section>
          )}
          {r.anwendung && (
            <section className={styles.block} aria-labelledby="anwendung-titel">
              <h2 id="anwendung-titel">{L.rezeptur.anwendung}</h2>
              <p>{r.anwendung}</p>
            </section>
          )}
          <section className={styles.block} aria-labelledby="inci-titel">
            <h2 id="inci-titel">{L.rezeptur.inci}</h2>
            <p className="muted">{L.rezeptur.inciHilfe}</p>
            <CopyBox text={inci} label={L.rezeptur.inci} kompakt />
          </section>
          {aendern && r.notiz && (
            <section className={styles.block} aria-labelledby="notiz-titel">
              <h2 id="notiz-titel">{L.rezeptur.notiz}</h2>
              <p>{r.notiz}</p>
            </section>
          )}
          <p className={styles.eigengebrauch}>{L.rezeptur.eigengebrauch}</p>

          <div className={`${styles.aktionen} ${styles.rezepturAktionen}`}>
            {aendern && (
              <Link
                className="btn btn-ghost"
                href={`${basis}/rezeptur/${r.id}/bearbeiten`}
              >
                <Icon name="edit" />
                {L.rezeptur.bearbeiten}
              </Link>
            )}
            <form action={kopiereRezeptur}>
              <input type="hidden" name="id" value={r.id} />
              <button type="submit" className="btn btn-ghost">
                <Icon name="copy" />
                {L.rezeptur.kopieren}
              </button>
            </form>
            {aendern && (
              <details className={styles.loeschen}>
                <summary>{L.rezeptur.loeschen}</summary>
                <form action={loescheRezeptur}>
                  <input type="hidden" name="id" value={r.id} />
                  <p>{L.rezeptur.loeschenFrage}</p>
                  <button type="submit" className={styles.loeschenBtn}>
                    <Icon name="trash" size={16} />
                    {L.rezeptur.loeschenJa}
                  </button>
                </form>
              </details>
            )}
          </div>
        </div>
      </div>

      {admin && (
        <Veroeffentlichen
          r={r}
          b={b}
          funktionen={Object.fromEntries(
            rohstoffe.map((x) => [x.id, x.funktion]),
          )}
        />
      )}
    </article>
  );
}

function hautFuerPin(hautbeduerfnis: string): string | null {
  const teile = hautbeduerfnis
    .split(",")
    .map((h) => L.hautPin[h.trim() as keyof typeof L.hautPin])
    .filter(Boolean);
  if (teile.length === 0) return null;
  return teile.length === 1
    ? teile[0]
    : `${teile.slice(0, -1).join(", ")} und ${teile[teile.length - 1]}`;
}

function Zeichen({ n, max }: { n: number; max: number }) {
  return (
    <p className={styles.zeichen} data-zuviel={n > max || undefined}>
      {fuelle(L.rezeptur.pinZeichen, { n, max })}
    </p>
  );
}

/** Nur Admin: Produktfoto, Pin-Texte und Blog-Entwurf aus derselben Rezeptur (ohne Mengen). */
function Veroeffentlichen({
  r,
  b,
  funktionen,
}: {
  r: NonNullable<Awaited<ReturnType<typeof getRezeptur>>>;
  b: ReturnType<typeof berechne>;
  funktionen: Record<number, string | null>;
}) {
  const v = veroeffentlichung({
    name: r.name,
    untertitel: r.untertitel,
    suchbegriff: r.suchbegriff,
    idee: r.blogText,
    warum: r.blogWarum,
    herstellung: r.herstellung,
    anwendung: r.anwendung,
    zielLink: r.zielLink,
    fotoUrl: r.fotoUrl,
    haut: hautFuerPin(r.hautbeduerfnis),
    labUrl: site.url,
    b,
    funktionen,
  });
  return (
    <>
      <section className={styles.block} aria-labelledby="foto-titel">
        <h2 id="foto-titel">{L.rezeptur.foto}</h2>
        <FotoUpload rezepturId={r.id} fotoUrl={r.fotoUrl} name={r.name} />
      </section>

      <section
        className={`${styles.block} ${styles.veroeffentlichen}`}
        aria-labelledby="pin-titel"
      >
        <h2 id="pin-titel">{L.rezeptur.pin}</h2>
        <p className="muted">{L.rezeptur.pinHilfe}</p>
        {!r.suchbegriff && (
          <p className={styles.fussnote}>{L.rezeptur.blogOhneSuchbegriff}</p>
        )}
        <div className={styles.pinRaster}>
          <div>
            <CopyBox label={L.rezeptur.pinTitel} text={v.pin.titel} kompakt />
            <Zeichen n={v.pin.titel.length} max={100} />
          </div>
          <div>
            <CopyBox label={L.rezeptur.pinLink} text={v.pin.link} kompakt />
          </div>
          <div>
            <CopyBox
              label={L.rezeptur.pinBeschreibung}
              text={v.pin.beschreibung}
              kompakt
            />
            <Zeichen n={v.pin.beschreibung.length} max={500} />
          </div>
          <div>
            <CopyBox label={L.rezeptur.pinAlt} text={v.pin.alt} kompakt />
          </div>
        </div>
      </section>

      <section
        className={`${styles.block} ${styles.veroeffentlichen}`}
        aria-labelledby="blog-titel"
      >
        <h2 id="blog-titel">{L.rezeptur.blog}</h2>
        <p className="muted">{L.rezeptur.blogHilfe}</p>
        <CopyBox label={L.rezeptur.blogHtml} text={v.html} />
        <CopyBox label={L.rezeptur.blogMarkdown} text={v.markdown} />
      </section>
    </>
  );
}
