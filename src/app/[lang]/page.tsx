import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDictionary, href } from "@/i18n";
import { isLocale } from "@/config/site";
import { pageMetadata } from "@/lib/seo";
import Reveal from "@/components/Reveal";
import HeroDemo from "@/components/HeroDemo";
import Icon from "@/components/Icon";
import styles from "./home.module.css";

export async function generateMetadata({ params }: PageProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = getDictionary(lang);
  return pageMetadata({ lang, description: t.meta.description });
}

export default async function Home({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = getDictionary(lang);
  const h = t.home;

  return (
    <>
      {/* HERO – genau eine H1 pro Seite */}
      <section className={styles.hero}>
        <div className={`container ${styles.heroGrid}`}>
          <div className={styles.heroText}>
            <h1 className={styles.in}>{h.title}</h1>
            <p className={`${styles.lead} ${styles.in}`} style={{ animationDelay: "90ms" }}>
              {h.lead}
            </p>
            <div className={`${styles.ctas} ${styles.in}`} style={{ animationDelay: "170ms" }}>
              <Link className="btn btn-accent" href={href(lang, "/app")}>
                {h.ctaPrimary}
                <Icon name="arrow" />
              </Link>
              <Link className="btn btn-ghost" href={href(lang, "/kontakt")}>
                {h.ctaSecondary}
              </Link>
            </div>
          </div>
          <div className={`${styles.in} ${styles.demo}`} style={{ animationDelay: "120ms" }}>
            <HeroDemo d={h.demo} />
          </div>
        </div>
      </section>

      {/* FUNKTIONEN – jede Kachel zeigt ein echtes Stück der Vorlage */}
      <section className="section" aria-labelledby="features-title">
        <div className="container">
          <Reveal>
            <h2 id="features-title" className={styles.sectionTitle}>
              {h.featuresTitle}
            </h2>
          </Reveal>

          <div className={styles.bento}>
            <Reveal className={`${styles.tile} ${styles.tileAuth}`}>
              <h3>{h.auth.title}</h3>
              <p>{h.auth.text}</p>
              <ul className={styles.people}>
                {h.auth.people.map((p) => (
                  <li key={p.name}>
                    <span className={styles.initial}>{p.name[0]}</span>
                    <span className={styles.personName}>{p.name}</span>
                    <span className={p.role === "Admin" ? styles.badgeAdmin : styles.badge}>{p.role}</span>
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal className={`${styles.tile} ${styles.tileSeo}`} delay={80}>
              <h3>{h.seo.title}</h3>
              <p>{h.seo.text}</p>
              <div className={styles.serp}>
                <div className={styles.serpBar}>
                  <Icon name="search" size={16} />
                  <span>{h.seo.serpQuery}</span>
                </div>
                <div className={styles.serpUrl}>{h.seo.serpUrl}</div>
                <div className={styles.serpTitle}>{h.seo.serpTitle}</div>
                <div className={styles.serpText}>{h.seo.serpText}</div>
              </div>
            </Reveal>

            <Reveal className={`${styles.tile} ${styles.tilePrivacy}`} delay={60}>
              <Icon name="shield" size={34} className={styles.tileIcon} />
              <h3>{h.privacy.title}</h3>
              <p>{h.privacy.text}</p>
              <ul className={styles.checks}>
                {h.privacy.stats.map((s) => (
                  <li key={s.label}>
                    <Icon name="check" size={16} />
                    {s.value} {s.label}
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal className={`${styles.tile} ${styles.tileLang}`} delay={120}>
              <h3>{h.lang.title}</h3>
              <p>{h.lang.text}</p>
              <div className={styles.flip}>
                <span lang="de">
                  <b>DE</b> {h.lang.de}
                </span>
                <span lang="en">
                  <b>EN</b> {h.lang.en}
                </span>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* SCHRITTE – die Reihenfolge zählt, daher Nummern */}
      <section className={`section ${styles.stepsSection}`} aria-labelledby="steps-title">
        <div className="container">
          <Reveal>
            <h2 id="steps-title" className={styles.sectionTitle}>
              {h.stepsTitle}
            </h2>
          </Reveal>
          <ol className={styles.steps}>
            {h.steps.map((s, i) => (
              <Reveal as="li" key={s.title} delay={i * 90} className={styles.step}>
                <span className={styles.stepNum} aria-hidden="true">
                  {i + 1}
                </span>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* ABSCHLUSS */}
      <section className="section">
        <div className="container">
          <Reveal className={styles.ctaBand}>
            <h2>{h.ctaBandTitle}</h2>
            <p>{h.ctaBandText}</p>
            <Link className="btn btn-accent" href={href(lang, "/kontakt")}>
              {h.ctaSecondary}
              <Icon name="arrow" />
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
