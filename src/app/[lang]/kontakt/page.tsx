import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/config/site";
import { getDictionary, href } from "@/i18n";
import { pageMetadata } from "@/lib/seo";
import ContactForm from "@/components/ContactForm";
import { mailConfigured } from "@/lib/mail";
import { site } from "@/config/site";

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
        <h2 style={{ fontSize: "var(--step-1)", marginBottom: "var(--space-4)" }}>{mailConfigured ? t.contact.formTitle : t.contact.directTitle}</h2>
        {mailConfigured ? (
          <ContactForm t={t.contact} privacyHref={href(lang, "/datenschutz")} />
        ) : (
          /* Fallback, solange der E-Mail-Versand nicht eingerichtet ist: nichts darf still verloren gehen */
          <p>
            {t.contact.direct}{" "}
            <a href={`mailto:${site.owner.email}`} style={{ fontWeight: 600 }}>
              {site.owner.email}
            </a>
          </p>
        )}
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
