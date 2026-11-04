import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/config/site";
import { getDictionary } from "@/i18n";
import { pageMetadata } from "@/lib/seo";
import LegalPage from "@/components/LegalPage";

export async function generateMetadata({ params }: PageProps<"/[lang]/impressum">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = getDictionary(lang);
  return pageMetadata({ lang, path: "/impressum", title: t.seo.imprint.title, description: t.seo.imprint.description });
}

export default async function Page({ params }: PageProps<"/[lang]/impressum">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = getDictionary(lang);
  return <LegalPage title={t.legal.imprint} t={t} />;
}
