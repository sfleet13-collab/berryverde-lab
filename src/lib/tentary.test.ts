import assert from "node:assert/strict";
import { test } from "node:test";
import { hatZugang, leseRpc, toolDaten } from "./tentary";

const kunden = {
  customers: [
    {
      deactivated: false,
      products_with_access: [{ id: 111 }],
      buyer_data: { email: "anna@beispiel.de" },
    },
    {
      deactivated: false,
      products_with_access: [{ id: 356131 }],
      buyer_data: { email: "Berta@Beispiel.de" },
    },
    {
      deactivated: true,
      products_with_access: [{ id: 356130 }],
      buyer_data: { email: "carla@beispiel.de" },
    },
    {
      deactivated: false,
      products_with_access: [{ id: 356130 }],
      buyer_data: { email: "dora@beispiel.de.evil" },
    },
  ],
};
const ids = [356130, 356131];

test("Tentary: Zugang nur bei exakter Adresse, aktivem Kunden und Lab-Produkt", () => {
  assert.equal(
    hatZugang(kunden, " berta@beispiel.de ", ids),
    true,
    "Gross/Klein und Leerzeichen egal",
  );
  assert.equal(
    hatZugang(kunden, "anna@beispiel.de", ids),
    false,
    "anderes Produkt",
  );
  assert.equal(
    hatZugang(kunden, "carla@beispiel.de", ids),
    false,
    "deaktiviert",
  );
  assert.equal(
    hatZugang(kunden, "dora@beispiel.de", ids),
    false,
    "nur Teil der Adresse",
  );
  assert.equal(hatZugang(null, "berta@beispiel.de", ids), false);
});

test("Tentary: Antwort als JSON und als Event-Stream lesen", () => {
  const ergebnis = {
    content: [{ type: "text", text: JSON.stringify(kunden) }],
  };
  const json = leseRpc(
    JSON.stringify({ jsonrpc: "2.0", id: 2, result: ergebnis }),
    "application/json",
  );
  assert.deepEqual(toolDaten(json?.result), kunden);
  const sse = `event: message\ndata: ${JSON.stringify({ jsonrpc: "2.0", id: 2, result: ergebnis })}\n\n`;
  assert.deepEqual(
    toolDaten(leseRpc(sse, "text/event-stream")?.result),
    kunden,
  );
  assert.equal(
    toolDaten({ isError: true, content: [{ type: "text", text: "{}" }] }),
    null,
    "Tool-Fehler = kein Zugang",
  );
  assert.equal(leseRpc("kaputt", "application/json"), null);
});
