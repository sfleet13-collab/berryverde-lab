import { tentaryEingerichtet, tentaryVerbindungstest } from "@/lib/tentary";

/** Nur in Vorschau-Deployments (passwortgeschützt): prüft die Verbindung zu Tentary, ohne Kundendaten auszugeben. */
export async function GET() {
  if (process.env.VERCEL_ENV !== "preview")
    return new Response("Not found", { status: 404 });
  const test = await tentaryVerbindungstest();
  return Response.json({ eingerichtet: tentaryEingerichtet(), ...test });
}
