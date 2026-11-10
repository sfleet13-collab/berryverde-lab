import "server-only";

/**
 * Anbindung an Tentary (Shop für die Mitgliedschaft) über den offiziellen MCP-Server.
 * Gebraucht wird nur eine Frage: Hat diese E-Mail-Adresse gerade Zugang zu einem der Dein-Lab-Produkte?
 * Tentary kennt den Stand der Abos (aktiv, gekündigt mit Restlaufzeit, Zahlung fehlgeschlagen, beendet)
 * und liefert ihn als „products_with_access“ beim Kunden.
 *
 * Umgebungsvariablen:
 * - TENTARY_API_KEY      API-Schlüssel aus Tentary (Seite „KI & API“). Ohne Schlüssel bleibt alles manuell.
 * - TENTARY_PRODUKT_IDS  kommagetrennte Produkt-IDs, die Zugang geben (Monat, Jahr).
 * - TENTARY_MCP_URL      optional, Standard https://mcp.tentary.com/mcp
 */

export type TentaryAntwort = "aktiv" | "kein" | "fehler";

const MCP_URL = process.env.TENTARY_MCP_URL ?? "https://mcp.tentary.com/mcp";

export function tentaryEingerichtet(): boolean {
  return Boolean(process.env.TENTARY_API_KEY && produktIds().length > 0);
}

function produktIds(): number[] {
  return (process.env.TENTARY_PRODUKT_IDS ?? "")
    .split(",")
    .map((s) => Number(s.trim()))
    .filter((n) => Number.isInteger(n) && n > 0);
}

type Kunde = {
  deactivated?: boolean;
  products_with_access?: { id: number }[];
  buyer_data?: { email?: string };
};

/** Liest die JSON-RPC-Antwort aus JSON oder aus einem Server-Sent-Events-Strom. */
export function leseRpc(
  text: string,
  contentType: string | null,
): { result?: unknown; error?: { message?: string } } | null {
  if (contentType?.includes("text/event-stream")) {
    const daten = text
      .split(/\r?\n/)
      .filter((z) => z.startsWith("data:"))
      .map((z) => z.slice(5).trim())
      .filter(Boolean);
    for (const d of daten.reverse()) {
      try {
        const j = JSON.parse(d);
        if (j && (j.result !== undefined || j.error)) return j;
      } catch {
        // nächste Zeile versuchen
      }
    }
    return null;
  }
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

/** Ergebnis eines Tool-Aufrufs: der erste Textblock als JSON. */
export function toolDaten(result: unknown): unknown {
  const r = result as
    | {
        structuredContent?: unknown;
        content?: { type: string; text?: string }[];
        isError?: boolean;
      }
    | undefined;
  if (!r || r.isError) return null;
  if (r.structuredContent) return r.structuredContent;
  const text = r.content?.find((c) => c.type === "text")?.text;
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

/** Entscheidung aus der Kundenliste von search_customers: exakte E-Mail, nicht deaktiviert, Zugang zu einem Lab-Produkt. */
export function hatZugang(
  daten: unknown,
  email: string,
  ids: number[],
): boolean {
  const kunden = ((daten as { customers?: Kunde[] } | null)?.customers ??
    []) as Kunde[];
  const ziel = email.trim().toLowerCase();
  return kunden.some(
    (k) =>
      !k.deactivated &&
      k.buyer_data?.email?.trim().toLowerCase() === ziel &&
      (k.products_with_access ?? []).some((p) => ids.includes(Number(p.id))),
  );
}

async function rpc(
  body: object,
  sessionId: string | null,
  signal: AbortSignal,
) {
  const res = await fetch(MCP_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json, text/event-stream",
      Authorization: `Bearer ${process.env.TENTARY_API_KEY}`,
      ...(sessionId ? { "Mcp-Session-Id": sessionId } : {}),
    },
    body: JSON.stringify(body),
    signal,
    cache: "no-store",
  });
  return res;
}

/** Fragt Tentary, ob diese Adresse gerade Zugang zu Dein Lab hat. Bei Problemen „fehler“ (nie still freischalten). */
export async function tentaryZugang(email: string): Promise<TentaryAntwort> {
  if (!tentaryEingerichtet()) return "fehler";
  const ids = produktIds();
  const abbruch = AbortSignal.timeout(8000);
  try {
    const init = await rpc(
      {
        jsonrpc: "2.0",
        id: 1,
        method: "initialize",
        params: {
          protocolVersion: "2025-06-18",
          capabilities: {},
          clientInfo: { name: "dein-lab", version: "1.0" },
        },
      },
      null,
      abbruch,
    );
    if (!init.ok) {
      console.error("[tentary] initialize", init.status);
      return "fehler";
    }
    const sessionId = init.headers.get("mcp-session-id");
    await init.text();
    await rpc(
      { jsonrpc: "2.0", method: "notifications/initialized" },
      sessionId,
      abbruch,
    ).then((r) => r.text());

    const res = await rpc(
      {
        jsonrpc: "2.0",
        id: 2,
        method: "tools/call",
        params: {
          name: "search_customers",
          arguments: { query: email.trim().toLowerCase(), limit: 10 },
        },
      },
      sessionId,
      abbruch,
    );
    if (!res.ok) {
      console.error("[tentary] search_customers", res.status);
      return "fehler";
    }
    const antwort = leseRpc(await res.text(), res.headers.get("content-type"));
    if (!antwort || antwort.error) {
      console.error("[tentary] Antwort", antwort?.error?.message ?? "unlesbar");
      return "fehler";
    }
    const daten = toolDaten(antwort.result);
    if (!daten) return "fehler";
    return hatZugang(daten, email, ids) ? "aktiv" : "kein";
  } catch (e) {
    console.error("[tentary]", e instanceof Error ? e.message : e);
    return "fehler";
  }
}

/** Verbindungstest ohne Kundendaten: ok, wenn Tentary eine gültige Antwort auf eine Suche liefert. */
export async function tentaryVerbindungstest(): Promise<{
  ok: boolean;
  schritt?: string;
}> {
  if (!process.env.TENTARY_API_KEY)
    return { ok: false, schritt: "kein Schlüssel" };
  const abbruch = AbortSignal.timeout(8000);
  try {
    const init = await rpc(
      {
        jsonrpc: "2.0",
        id: 1,
        method: "initialize",
        params: {
          protocolVersion: "2025-06-18",
          capabilities: {},
          clientInfo: { name: "dein-lab", version: "1.0" },
        },
      },
      null,
      abbruch,
    );
    if (!init.ok) return { ok: false, schritt: `initialize ${init.status}` };
    const sessionId = init.headers.get("mcp-session-id");
    await init.text();
    await rpc(
      { jsonrpc: "2.0", method: "notifications/initialized" },
      sessionId,
      abbruch,
    ).then((r) => r.text());
    const res = await rpc(
      {
        jsonrpc: "2.0",
        id: 2,
        method: "tools/call",
        params: {
          name: "search_customers",
          arguments: { query: "verbindungstest@dein-lab.invalid", limit: 1 },
        },
      },
      sessionId,
      abbruch,
    );
    if (!res.ok) return { ok: false, schritt: `tools/call ${res.status}` };
    const antwort = leseRpc(await res.text(), res.headers.get("content-type"));
    if (!antwort || antwort.error)
      return {
        ok: false,
        schritt: `antwort ${antwort?.error?.message ?? "unlesbar"}`,
      };
    return toolDaten(antwort.result)
      ? { ok: true }
      : { ok: false, schritt: "tool-ergebnis leer" };
  } catch (e) {
    return { ok: false, schritt: e instanceof Error ? e.message : "unbekannt" };
  }
}
