import "server-only";
import type { GeraetClient, RohstoffClient } from "@/components/lab/Rechner";
import type { SessionUser } from "@/lib/auth";
import { listGeraete, listRohstoffe, type RohstoffMitDosierung } from "@/lib/data";
import { labRohstoff } from "./map";

/** Rohstoff für den Browser: Rechenwerte plus Steckbrief. */
export function alsClient(r: RohstoffMitDosierung): RohstoffClient {
  return {
    ...labRohstoff(r, r.dosierungen),
    funktion: r.funktion,
    hinweis: r.hinweis,
    was: r.steckbriefWas,
    chemisch: r.steckbriefChemisch,
    wirkung: r.steckbriefWirkung,
  };
}

export async function ladeRohstoffe(user: SessionUser): Promise<RohstoffClient[]> {
  return (await listRohstoffe(user)).map(alsClient);
}

export async function ladeGeraete(user: SessionUser): Promise<GeraetClient[]> {
  return (await listGeraete(user)).map((g) => ({ slug: g.slug, name: g.name, beschreibung: g.beschreibung, link: g.link, linkAffiliate: g.linkAffiliate }));
}
