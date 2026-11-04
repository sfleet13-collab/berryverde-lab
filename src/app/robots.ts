import type { MetadataRoute } from "next";
import { privateMode, site } from "@/config/site";

export default function robots(): MetadataRoute.Robots {
  // Vorschau-Deployments von Vercel nicht indexieren
  const isProduction = process.env.VERCEL_ENV ? process.env.VERCEL_ENV === "production" : true;
  return {
    rules: isProduction && !privateMode
      ? { userAgent: "*", allow: "/", disallow: ["/de/app", "/de/anmelden", "/api/"] }
      : { userAgent: "*", disallow: "/" },
    sitemap: `${site.url}/sitemap.xml`,
  };
}
