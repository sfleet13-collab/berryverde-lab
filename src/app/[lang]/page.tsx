import type { Metadata } from "next";
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
import styles from "./home.module.css";

export async function generateMetadata({ params }: PageProps<"/[lang]">): Promise<Metadata> {
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
      dosierungen: (s.dos ?? []).map(([produkttyp, min, max, hinweis]) => ({ produkttyp, min, max, hinweis })),
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

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: h.faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd).replace(/</g, "\\u003c") }} />

      {/* HERO – genau eine H1 pro Seite */}
      <section className={styles.hero}>
        <div className={`container ${styles.heroGrid}`}>
          <div className={styles.heroText}>
            <h1>{h.title}</h1>
            <p className={styles.lead}>{h.lead}</p>
            <div className={styles.ctas}>
              <a className="btn btn-primary" href={lab.mitgliedschaftUrl}>
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
            <HeroRechner rohstoffe={demo.rohstoffe} start={demo.start} t={h.demo} />
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
                    <dd>15.11.2026</dd>
                  </div>
                  <div>
                    <dt>{h.label.best}</dt>
                    <dd>13.02.2027</dd>
                  </div>
                  <div>
                    <dt>{h.label.batch}</dt>
                    <dd>261115-LAB</dd>
                  </div>
                </dl>
                <p className={styles.miniInci}>Aqua, Prunus Amygdalus Dulcis Oil, Butyrospermum Parkii Butter, Cetearyl Wheat Straw Glycosides, Cetearyl Alcohol, Glycerin, Cetyl Alcohol, Panthenol, Benzyl Alcohol, Dehydroacetic Acid, Tocopherol, Xanthan Gum</p>
                <p className={styles.miniEigen}>{h.label.own}</p>
              </div>
            </Reveal>
          </div>
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
          <a className={`btn ${styles.bandBtn}`} href={lab.mitgliedschaftUrl}>
            {h.ctaPrimary}
            <Icon name="arrow" />
          </a>
        </div>
        <div className="container">
          <p className={styles.bandNote}>
            {h.ownUse} <a href={lab.blogUrl}>{site.owner.url.replace("https://", "")}</a>
          </p>
        </div>
      </section>
    </>
  );
}
