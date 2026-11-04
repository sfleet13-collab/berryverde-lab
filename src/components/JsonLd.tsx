import { site, type Locale } from "@/config/site";

/** Strukturierte Daten für Google (Organisation + Website). */
export default function JsonLd({ lang }: { lang: Locale }) {
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${site.url}/#organization`,
        name: site.owner.name,
        url: site.owner.url,
        sameAs: site.social.map((s) => s.url),
      },
      {
        "@type": "WebSite",
        "@id": `${site.url}/#website`,
        name: site.name,
        url: `${site.url}/${lang}`,
        inLanguage: lang,
        publisher: { "@id": `${site.url}/#organization` },
      },
    ],
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
