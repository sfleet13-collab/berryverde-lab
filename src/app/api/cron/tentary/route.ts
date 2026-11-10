import { systemTentaryErgebnis, systemTentaryZugaenge } from "@/lib/data";
import { tentaryEingerichtet, tentaryZugang } from "@/lib/tentary";

/**
 * Täglicher Abgleich mit Tentary (Vercel Cron, siehe vercel.json):
 * Zugänge aus Tentary-Käufen, deren Abo beendet ist, werden deaktiviert.
 * Bei einem Fehler von Tentary bleibt der Zugang unverändert (nie wegen einer Störung aussperren).
 */
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) {
    return Response.json({ ok: false }, { status: 401 });
  }
  if (!tentaryEingerichtet())
    return Response.json({ ok: false, grund: "Tentary nicht eingerichtet" });

  const liste = await systemTentaryZugaenge();
  let aktiv = 0;
  let beendet = 0;
  let fehler = 0;
  for (const z of liste) {
    const r = await tentaryZugang(z.email);
    if (r === "fehler") {
      fehler++;
      continue;
    }
    await systemTentaryErgebnis(z.id, r === "aktiv");
    if (r === "aktiv") aktiv++;
    else beendet++;
  }
  console.log(
    `[tentary-abgleich] geprüft ${liste.length}, aktiv ${aktiv}, beendet ${beendet}, fehler ${fehler}`,
  );
  return Response.json({
    ok: true,
    geprueft: liste.length,
    aktiv,
    beendet,
    fehler,
  });
}
