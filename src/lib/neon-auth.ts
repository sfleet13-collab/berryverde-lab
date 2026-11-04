import { createNeonAuth } from "@neondatabase/auth/next/server";

/**
 * Neon Auth (Better Auth) – Nutzer und Sitzungen liegen in der eigenen Neon-Datenbank (Schema "neon_auth").
 * Benötigt: NEON_AUTH_BASE_URL (setzt Vercel/Neon automatisch) und NEON_AUTH_COOKIE_SECRET (mind. 32 Zeichen).
 * Ohne diese Werte läuft die App weiter, geschützte Bereiche zeigen dann einen Hinweis.
 */
export const authConfigured = Boolean(
  process.env.NEON_AUTH_BASE_URL && (process.env.NEON_AUTH_COOKIE_SECRET?.length ?? 0) >= 32,
);

let instance: ReturnType<typeof createNeonAuth> | null = null;

export function getAuth() {
  if (!authConfigured) return null;
  instance ??= createNeonAuth({
    baseUrl: process.env.NEON_AUTH_BASE_URL!,
    cookies: { secret: process.env.NEON_AUTH_COOKIE_SECRET! },
    logLevel: "warn",
  });
  return instance;
}
