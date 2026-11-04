import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/config/site";
import { getDictionary, href } from "@/i18n";
import { pageMetadata } from "@/lib/seo";
import ContactForm from "@/components/ContactForm";

export async function generateMetadata({ params }: PageProps<"/[lang]/kontakt">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = getDictionary(lang);
  return pageMetadata({ lang, path: "/kontakt", title: t.seo.contact.title, description: t.seo.contact.description });
}

export default async function ContactPage({ params }: PageProps<"/[lang]/kontakt">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = getDictionary(lang);

  return (
    <section className="section">
      <div className="container" style={{ maxWidth: 680 }}>
        <h1 style={{ fontSize: "var(--step-3)" }}>{t.contact.title}</h1>
        <p className="muted" style={{ marginBottom: "var(--space-8)" }}>
          {t.contact.description}
        </p>
        <h2 style={{ fontSize: "var(--step-1)", marginBottom: "var(--space-4)" }}>{t.contact.formTitle}</h2>
        <ContactForm t={t.contact} privacyHref={href(lang, "/datenschutz")} />
        <h2 style={{ fontSize: "var(--step-1)", marginTop: "var(--space-12)" }}>{t.contact.nextTitle}</h2>
        <ul className="muted">
          {t.contact.next.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}
