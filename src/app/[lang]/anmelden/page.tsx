import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, lab } from "@/config/site";
import { getDictionary, href } from "@/i18n";
import { pageMetadata } from "@/lib/seo";
import SignInForm from "@/components/SignInForm";
import styles from "@/components/SignInForm.module.css";

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/anmelden">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = getDictionary(lang);
  return pageMetadata({
    lang,
    path: "/anmelden",
    title: t.seo.auth.title,
    description: t.seo.auth.description,
    noindex: true,
  });
}

export default async function SignInPage({
  params,
}: PageProps<"/[lang]/anmelden">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = getDictionary(lang);

  return (
    <section className="section">
      <div className={`container ${styles.wrap}`}>
        <div className={styles.card}>
          <h1 className={styles.title}>{t.auth.title}</h1>
          <p className="muted">{t.auth.description}</p>
          <SignInForm lang={lang} t={t.auth} />
          <p className={styles.hinweis}>
            {t.auth.notMember}{" "}
            <a href={`${href(lang, "/")}#${lab.mitgliedAnker}`}>
              {t.auth.join}
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
