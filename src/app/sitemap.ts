import type { MetadataRoute } from "next";
import { locales, site } from "@/config/site";

/** Öffentliche Seiten für Google. Neue öffentliche Seite? Hier ergänzen. */
const publicPaths = ["/", "/kontakt", "/impressum", "/datenschutz", "/agb"];

export default function sitemap(): MetadataRoute.Sitemap {
  return publicPaths.flatMap((path) =>
    locales.map((lang) => ({
      url: `${site.url}/${lang}${path === "/" ? "" : path}`,
      changeFrequency: "monthly" as const,
      priority: path === "/" ? 1 : 0.5,
      alternates: {
        languages: Object.fromEntries(locales.map((l) => [l, `${site.url}/${l}${path === "/" ? "" : path}`])),
      },
    })),
  );
}
