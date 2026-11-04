import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale, lab } from "@/config/site";
import { getDictionary } from "@/i18n";
import { L } from "@/i18n/lab";
import { pageMetadata } from "@/lib/seo";
import { signOut } from "@/lib/actions/auth";
import styles from "@/components/lab/lab.module.css";

export async function generateMetadata({ params }: PageProps<"/[lang]/kein-zugang">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = getDictionary(lang);
  return pageMetadata({ lang, path: "/kein-zugang", title: t.seo.keinZugang.title, description: t.seo.keinZugang.description, noindex: true });
}

export default async function KeinZugangPage({ params }: PageProps<"/[lang]/kein-zugang">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  return (
    <section className="section">
      <div className={`container ${styles.schmal}`}>
        <h1 className={styles.seitenTitel}>{L.keinZugang.titel}</h1>
        <p>{L.keinZugang.text}</p>
        <div className={styles.aktionen}>
          <a className="btn btn-primary" href={lab.mitgliedschaftUrl}>
            {L.keinZugang.mitglied}
          </a>
          <Link className="btn btn-ghost" href={`/${lang}/kontakt`}>
            {L.keinZugang.kontakt}
          </Link>
          <form action={signOut}>
            <input type="hidden" name="lang" value={lang} />
            <button type="submit" className="btn btn-ghost">
              {L.keinZugang.abmelden}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
