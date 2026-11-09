import type { NextConfig } from "next";

/** Sicherheits-Header für alle Seiten */
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
];

/** Seiten, die das Goodie „Öl-Kaskade“ per iframe einbetten dürfen. */
const EINBETTEN_ERLAUBT = [
  "https://berryverde.com",
  "https://www.berryverde.com",
  "https://*.berryverde.com",
];

const nextConfig: NextConfig = {
  cacheComponents: true,
  // Eigene 404 für alle unbekannten Adressen (Hauptlayout liegt unter /[lang])
  experimental: {
    globalNotFound: true,
    // Produktfotos werden im Browser verkleinert; 5 MB Reserve für die Server Action
    serverActions: { bodySizeLimit: "5mb" },
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "*.public.blob.vercel-storage.com" },
    ],
  },
  partialPrefetching: true,
  poweredByHeader: false,
  async headers() {
    return [
      // Alle Seiten ausser dem Goodie: nicht einbettbar
      {
        source: "/((?!oel-kaskade).*)",
        headers: [
          ...securityHeaders,
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
        ],
      },
      // Öl-Kaskade: darf auf berryverde.com per iframe eingebettet werden
      {
        source: "/oel-kaskade",
        headers: [
          ...securityHeaders,
          {
            key: "Content-Security-Policy",
            value: `frame-ancestors 'self' ${EINBETTEN_ERLAUBT.join(" ")}`,
          },
        ],
      },
    ];
  },
};

export default nextConfig;
