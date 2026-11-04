import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/config/site";
import { getDictionary } from "@/i18n";
import { pageMetadata } from "@/lib/seo";
import LegalPage from "@/components/LegalPage";
import { Datenschutz } from "@/content/legal";

export async function generateMetadata({ params }: PageProps<"/[lang]/datenschutz">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = getDictionary(lang);
  return pageMetadata({ lang, path: "/datenschutz", title: t.seo.privacy.title, description: t.seo.privacy.description });
}

export default async function Page({ params }: PageProps<"/[lang]/datenschutz">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = getDictionary(lang);
  return (
    <LegalPage title={t.legal.privacy} t={t}>
      <Datenschutz />
    </LegalPage>
  );
}
