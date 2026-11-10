import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDictionary, href } from "@/i18n";
import { isLocale, lab, site } from "@/config/site";
import { pageMetadata } from "@/lib/seo";
import { seedRohstoffe } from "@/db/seed-data";
import type { LabPosition, LabRohstoff } from "@/lib/lab/types";
import Reveal from "@/components/Reveal";
import Icon from "@/components/Icon";
import HeroRechner from "@/components/lab/HeroRechner";
import SpreitDemo from "@/components/lab/SpreitDemo";
import VideoTeaser from "@/components/lab/VideoTeaser";
import styles from "./home.module.css";

export async function generateMetadata({
  params,
}: PageProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = getDictionary(lang);
  return pageMetadata({ lang, description: t.meta.description });
}

/** Beispiel für den Rechner auf der Startseite (keine Rezeptur aus der Bibliothek). */
const DEMO: [string, number, boolean?][] = [
  ["wasser", 0, true],
  ["glycerin", 3],
  ["xanthan", 0.2],
  ["xyliance", 4],
  ["mandeloel", 12],
  ["sheabutter", 4],
  ["cetylalkohol", 1.7],
  ["tocopherol", 0.3],
  ["panthenol", 1],
  ["cosgard", 1],
];

function demoDaten(): { rohstoffe: LabRohstoff[]; start: LabPosition[] } {
  const rohstoffe: LabRohstoff[] = DEMO.map(([slug], i) => {
    const s = seedRohstoffe.find((r) => r.slug === slug)!;
    return {
      id: i + 1,
      slug: s.slug,
      name: s.name,
      inci: s.inci,
      kategorie: s.kategorie,
      phase: s.phase,
      form: s.form,
      dichte: s.dichte ?? null,
      tropfenfaktor: null,
      phMin: s.phMin ?? null,
      phMax: s.phMax ?? null,
      tempMax: s.tempMax ?? null,
      stufe: s.stufe,
      konsStatus: s.konsStatus ?? null,
      konsRolle: s.konsRolle ?? null,
      kombiPartner: s.kombiPartner ?? null,
      nichtWaessrig: s.nichtWaessrig ?? false,
      emulgatorTyp: s.emulgatorTyp ?? null,
      fettphaseMin: s.fettphase?.[0] ?? null,
      fettphaseMax: s.fettphase?.[1] ?? null,
      emulgatorBezug: s.emulgatorBezug ?? null,
      tensidKlasse: s.tensidKlasse ?? null,
      wasProzent: s.wasProzent ?? null,
      dosierungen: (s.dos ?? []).map(([produkttyp, min, max, hinweis]) => ({
        produkttyp,
        min,
        max,
        hinweis,
      })),
    };
  });
  const start: LabPosition[] = DEMO.map(([, prozent, ad], i) => ({
    key: `d${i}`,
    rohstoffId: i + 1,
    phase: rohstoffe[i].phase,
    prozent,
    adHundert: Boolean(ad),
  }));
  return { rohstoffe, start };
}

export default async function Home({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = getDictionary(lang);
  const h = t.home;
  const demo = demoDaten();
  const zumPreis = `#${lab.mitgliedAnker}`;
  const p = h.pricing;

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: h.faq.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqLd).replace(/</g, "\\u003c"),
        }}
      />

      {/* HERO – genau eine H1 pro Seite */}
      <section className={styles.hero}>
        <div className={`container ${styles.heroGrid}`}>
          <div className={styles.heroText}>
            <h1>{h.title}</h1>
            <p className={styles.lead}>{h.lead}</p>
            <div className={styles.ctas}>
              <a className="btn btn-primary" href={zumPreis}>
                {h.ctaPrimary}
                <Icon name="arrow" />
              </a>
              <Link className="btn btn-ghost" href={href(lang, "/anmelden")}>
                {h.ctaSecondary}
              </Link>
            </div>
            <p className={styles.preis}>{h.priceNote}</p>
          </div>
          <div className={styles.demoRahmen}>
            <h2 className={styles.demoTitel}>{h.demo.title}</h2>
            <HeroRechner
              rohstoffe={demo.rohstoffe}
              start={demo.start}
              t={h.demo}
            />
          </div>
        </div>
      </section>

      {/* ZWEITES „PROBIER ES AUS“: Spreitkaskade als Teaser, führt direkt zur Mitgliedschaft */}
      <section className={styles.spreit} aria-labelledby="spreit-title">
        <div className="container">
          <div className={styles.spreitGrid}>
            <Reveal className={styles.spreitText}>
              <h2 id="spreit-title" className={styles.spreitTitel}>
                {h.spreit.title}
              </h2>
              <p className={styles.fliess}>{h.spreit.lead}</p>
            </Reveal>
            <Reveal delay={80}>
              <SpreitDemo t={h.spreit} />
            </Reveal>
          </div>

          <h3 className={styles.ebenenTitel}>{h.spreit.levelsTitle}</h3>
          <ul className={styles.ebenen}>
            {h.spreit.levels.map((l) => (
              <li key={l.key} className={styles.ebene} data-tempo={l.key}>
                <h4>{l.title}</h4>
                <p>{l.text}</p>
              </li>
            ))}
          </ul>

          <div className={styles.spreitCta}>
            <a className="btn btn-primary" href={zumPreis}>
              {h.spreit.cta}
            </a>
            <p>{h.spreit.ctaNote}</p>
          </div>
        </div>
      </section>

      {/* WAS DEIN LAB KANN – jeder Punkt mit einem echten Stück der App */}
      <section className={styles.features} aria-labelledby="features-title">
        <div className="container">
          <Reveal>
            <h2 id="features-title" className={styles.sectionTitle}>
              {h.featuresTitle}
            </h2>
          </Reveal>

          <div className={styles.feature}>
            <Reveal className={styles.featureText}>
              <h3>{h.features[0].title}</h3>
              <p>{h.features[0].text}</p>
            </Reveal>
            <Reveal className={styles.featureBild} delay={80}>
              <div className={styles.miniMeldung}>
                <span className={styles.miniArt}>{h.check.kind}</span>
                <p className={styles.miniTitel}>{h.check.title}</p>
                <p>{h.check.text}</p>
                <span className={styles.miniFix}>
                  <Icon name="check" size={16} />
                  {h.check.fix}
                </span>
              </div>
            </Reveal>
          </div>

          <div className={`${styles.feature} ${styles.featureGedreht}`}>
            <Reveal className={styles.featureText}>
              <h3>{h.features[1].title}</h3>
              <p>{h.features[1].text}</p>
            </Reveal>
            <Reveal className={styles.featureBild} delay={80}>
              <ul className={styles.miniTropfen}>
                {h.drops.map((d) => (
                  <li key={d.name}>
                    <span>{d.name}</span>
                    <strong>{d.amount}</strong>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>

          <div className={styles.feature}>
            <Reveal className={styles.featureText}>
              <h3>{h.features[2].title}</h3>
              <p>{h.features[2].text}</p>
            </Reveal>
            <Reveal className={styles.featureBild} delay={80}>
              <div className={styles.miniEtikett}>
                <p className={styles.miniEtikettName}>{h.label.name}</p>
                <dl>
                  <div>
                    <dt>{h.label.made}</dt>
                    <dd>02.12.2026</dd>
                  </div>
                  <div>
                    <dt>{h.label.best}</dt>
                    <dd>02.03.2027</dd>
                  </div>
                  <div>
                    <dt>{h.label.batch}</dt>
                    <dd>261202-LAB</dd>
                  </div>
                </dl>
                <p className={styles.miniInci}>
                  Aqua, Prunus Amygdalus Dulcis Oil, Butyrospermum Parkii
                  Butter, Cetearyl Wheat Straw Glycosides, Cetearyl Alcohol,
                  Glycerin, Cetyl Alcohol, Panthenol, Benzyl Alcohol,
                  Dehydroacetic Acid, Tocopherol, Xanthan Gum
                </p>
                <p className={styles.miniEigen}>{h.label.own}</p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* VIDEOS – Susan als Person: Vertrauen vor dem Preis */}
      <section className={styles.videos} aria-labelledby="videos-title">
        <div className="container">
          <Reveal>
            <VideoTeaser
              steps={h.videos.steps}
              heat={h.videos.heat}
              cool={h.videos.cool}
              kopf={
                <>
                  <h2 id="videos-title" className={styles.videoTitel}>
                    {h.videos.title}
                  </h2>
                  <p className={styles.fliess}>{h.videos.lead}</p>
                </>
              }
              fuss={
                <>
                  <dl className={styles.videoArten}>
                    {h.videos.kinds.map((k) => (
                      <div key={k.title}>
                        <dt>{k.title}</dt>
                        <dd>{k.text}</dd>
                      </div>
                    ))}
                  </dl>
                  <p className={styles.videoNotiz}>{h.videos.note}</p>
                </>
              }
            />
          </Reveal>
        </div>
      </section>

      {/* BIBLIOTHEK */}
      <section className={styles.bibliothek} aria-labelledby="library-title">
        <div className={`container ${styles.bibliothekGrid}`}>
          <Reveal>
            <h2 id="library-title" className={styles.sectionTitle}>
              {h.libraryTitle}
            </h2>
          </Reveal>
          <Reveal delay={80}>
            {h.libraryText.map((p) => (
              <p key={p} className={styles.fliess}>
                {p}
              </p>
            ))}
          </Reveal>
        </div>
      </section>

      {/* ÜBER SUSAN – ein Mensch hinter dem Rechner, direkt vor dem Preis */}
      <section className={styles.ueber} aria-labelledby="ueber-title">
        <div className={`container ${styles.ueberGrid}`}>
          <Reveal className={styles.ueberBild}>
            <Image
              src="/susan-labor.webp"
              alt={h.about.alt}
              width={800}
              height={1000}
              sizes="(max-width: 760px) 70vw, 360px"
            />
          </Reveal>
          <Reveal delay={80}>
            <h2 id="ueber-title" className={styles.sectionTitle}>
              {h.about.title}
            </h2>
            {h.about.text.map((t) => (
              <p key={t} className={styles.fliess}>
                {t}
              </p>
            ))}
            <p className={styles.unterschrift}>{h.about.sign}</p>
            <a
              className={`btn btn-ghost ${styles.ueberBtn}`}
              href={lab.blogUrl}
              target="_blank"
              rel="noopener"
            >
              {h.about.more}
              <Icon name="arrow" />
              <span className="sr-only">{h.about.moreNote}</span>
            </a>
          </Reveal>
        </div>
      </section>

      {/* PREISE – Jahr zuerst und hervorgehoben, Buttons direkt zur Tentary-Kasse */}
      <section
        id={lab.mitgliedAnker}
        className={styles.preise}
        aria-labelledby="preise-title"
      >
        <div className="container">
          <Reveal>
            <h2 id="preise-title" className={styles.sectionTitle}>
              {p.title}
            </h2>
            <p className={`${styles.fliess} ${styles.preiseLead}`}>{p.lead}</p>
          </Reveal>
          <div className={styles.tarife}>
            {[
              {
                t: p.yearly,
                badge: p.yearly.badge,
                url: lab.checkoutJahr,
                empfohlen: true,
              },
              {
                t: p.monthly,
                badge: null,
                url: lab.checkoutMonat,
                empfohlen: false,
              },
            ].map(({ t: tarif, badge, url, empfohlen }, i) => (
              <Reveal
                key={tarif.name}
                delay={i * 80}
                className={`${styles.tarif} ${empfohlen ? styles.empfohlen : ""}`}
              >
                {badge && <span className={styles.marker}>{badge}</span>}
                <h3>{tarif.name}</h3>
                <p className={styles.betrag}>
                  {tarif.price} <small>{tarif.per}</small>
                </p>
                <p className={styles.tarifSub}>{tarif.sub}</p>
                <ul className={styles.enthalten}>
                  {p.included.map((x) => (
                    <li key={x}>
                      <Icon name="check" size={16} />
                      {x}
                    </li>
                  ))}
                  <li>
                    <Icon name="check" size={16} />
                    {tarif.terms}
                  </li>
                </ul>
                <a
                  className={`btn ${empfohlen ? "btn-primary" : "btn-ghost"} ${styles.tarifBtn}`}
                  href={url}
                >
                  {tarif.cta}
                </a>
              </Reveal>
            ))}
            <Reveal as="aside" delay={160} className={styles.preisInfo}>
              <h3>{p.asideTitle}</h3>
              <ul>
                {p.aside.map((x) => (
                  <li key={x}>{x}</li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ABLAUF – die Reihenfolge ist die Information, darum nummeriert */}
      <section className={styles.ablauf} aria-labelledby="steps-title">
        <div className="container">
          <Reveal>
            <h2 id="steps-title" className={styles.sectionTitle}>
              {h.stepsTitle}
            </h2>
          </Reveal>
          <ol className={styles.schritte}>
            {h.steps.map((s, i) => (
              <Reveal as="li" key={s.title} delay={i * 70}>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* FAQ */}
      <section className={styles.faq} aria-labelledby="faq-title">
        <div className={`container ${styles.faqGrid}`}>
          <h2 id="faq-title" className={styles.sectionTitle}>
            {h.faqTitle}
          </h2>
          <div>
            {h.faq.map((f) => (
              <details key={f.q} className={styles.frage}>
                <summary>
                  <h3>{f.q}</h3>
                  <Icon name="plus" />
                </summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ABSCHLUSS */}
      <section className={styles.band}>
        <div className={`container ${styles.bandInner}`}>
          <div>
            <h2>{h.ctaBandTitle}</h2>
            <p>{h.ctaBandText}</p>
          </div>
          <a className={`btn ${styles.bandBtn}`} href={zumPreis}>
            {h.ctaPrimary}
            <Icon name="arrow" />
          </a>
        </div>
        <div className="container">
          <p className={styles.bandNote}>
            {h.ownUse}{" "}
            <a href={lab.blogUrl}>{site.owner.url.replace("https://", "")}</a>
          </p>
        </div>
      </section>
    </>
  );
}
