"use client";

import { usePathname } from "next/navigation";
import type { Locale } from "@/config/site";
import LangLinks from "./LangLinks";

/** Wechselt die Sprache und bleibt auf derselben Seite. */
export default function LangToggle({ lang, label }: { lang: Locale; label: string }) {
  const pathname = usePathname() ?? `/${lang}`;
  const rest = pathname.replace(/^\/(de|en)(?=\/|$)/, "");
  return <LangLinks lang={lang} label={label} rest={rest} />;
}
