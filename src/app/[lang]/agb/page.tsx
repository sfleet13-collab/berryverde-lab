import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/config/site";
import { getDictionary } from "@/i18n";
import { pageMetadata } from "@/lib/seo";
import LegalPage from "@/components/LegalPage";
import { Nutzungsbedingungen } from "@/content/legal";

export async function generateMetadata({ params }: PageProps<"/[lang]/agb">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = getDictionary(lang);
  return pageMetadata({ lang, path: "/agb", title: t.seo.terms.title, description: t.seo.terms.description });
}

export default async function Page({ params }: PageProps<"/[lang]/agb">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = getDictionary(lang);
  return (
    <LegalPage title={t.legal.terms} t={t}>
      <Nutzungsbedingungen />
    </LegalPage>
  );
}
