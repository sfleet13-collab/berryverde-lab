#!/usr/bin/env node
/**
 * typocheck – Typografie ohne KI-Look (siehe DESIGN.md).
 *
 * Prüft alle CSS-Dateien unter src/ statisch:
 *  1. letter-spacing nur in den vier erlaubten Stufen (-0.03em, -0.015em, -0.01em, 0.06em) oder 0/normal
 *  2. positives letter-spacing nur zusammen mit text-transform: uppercase im selben Block
 *  3. kein text-transform: uppercase auf Buttons (button, .btn, [role=button], .button, .cta)
 *  4. Hinweis, wenn mehr als 2 Label-Blöcke (uppercase + gesperrt) in einer Datei stehen
 *
 * Ausnahme: Blöcke mit font-variant-numeric: tabular-nums (Code-Eingabefelder) dürfen gesperrt sein.
 *
 * Aufruf: npm run typocheck   (läuft auch in npm run check)
 * Exit-Code 1 bei Fehlern, 0 bei Warnungen oder grün.
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const ROOT = join(process.cwd(), "src");
const ALLOWED = new Set(["-0.03em", "-0.015em", "-0.01em", "0.06em", "+0.06em", "0", "0em", "normal"]);
const BUTTON_RE = /(^|[\s,>+~])(button|\.btn\b|\.button\b|\.cta\b|\[role=["']?button["']?\])/i;

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    const st = statSync(p);
    if (st.isDirectory()) walk(p, out);
    else if (/\.css$/.test(name)) out.push(p);
  }
  return out;
}

/** Zerlegt CSS grob in Blöcke { selector, body, line } – reicht für diese Prüfung. */
function blocks(css) {
  const out = [];
  let depth = 0;
  let selector = "";
  let body = "";
  let line = 1;
  let startLine = 1;
  let inComment = false;
  for (let i = 0; i < css.length; i++) {
    const ch = css[i];
    if (ch === "\n") line++;
    if (inComment) {
      if (ch === "*" && css[i + 1] === "/") {
        inComment = false;
        i++;
      }
      continue;
    }
    if (ch === "/" && css[i + 1] === "*") {
      inComment = true;
      i++;
      continue;
    }
    if (ch === "{") {
      depth++;
      if (depth === 1) {
        startLine = line;
        body = "";
      } else body += ch;
      continue;
    }
    if (ch === "}") {
      depth--;
      if (depth === 0) {
        out.push({ selector: selector.trim(), body, line: startLine });
        selector = "";
      } else body += ch;
      continue;
    }
    if (depth === 0) selector += ch;
    else body += ch;
  }
  return out;
}

const errors = [];
const warnings = [];
const files = walk(ROOT);

for (const file of files) {
  const rel = relative(process.cwd(), file);
  const css = readFileSync(file, "utf8");
  let labels = 0;
  for (const b of blocks(css)) {
    // Verschachtelte Blöcke (@media …) flach auswerten
    const nested = b.body.includes("{");
    const inner = nested ? blocks(b.body + "}") : [b];
    for (const blk of inner) {
      const sel = (blk.selector || b.selector).trim();
      const body = blk.body;
      const ls = body.match(/letter-spacing\s*:\s*([^;!]+)/i);
      const upper = /text-transform\s*:\s*uppercase/i.test(body);
      const numeric = /font-variant-numeric\s*:\s*tabular-nums/i.test(body);
      const lineNo = nested ? b.line + blk.line - 1 : b.line;
      const where = `${rel}:${lineNo}  ${sel}`;

      if (ls) {
        const value = ls[1].trim().replace(/\s+/g, "");
        if (numeric) {
          // Ausnahme Code-Eingabe
        } else if (!ALLOWED.has(value)) {
          errors.push(`${where}\n    letter-spacing: ${value} – erlaubt sind nur -0.03em, -0.015em, -0.01em, 0.06em (nur mit uppercase) oder 0`);
        } else if ((value === "0.06em" || value === "+0.06em") && !upper) {
          errors.push(`${where}\n    letter-spacing: ${value} ohne text-transform: uppercase – Kleinbuchstaben nie sperren`);
        }
        if (upper && /^\+?0\.06em$/.test(value)) labels++;
      }
      if (upper && BUTTON_RE.test(sel)) {
        errors.push(`${where}\n    text-transform: uppercase auf einem Button – Buttons in normaler Schreibweise`);
      }
    }
  }
  if (labels > 2) warnings.push(`${rel}: ${labels} Label-Blöcke (uppercase + gesperrt) – höchstens 2 kleine Labels pro Seite`);
}

if (errors.length) {
  console.error(`\n✗ typocheck: ${errors.length} Fehler\n`);
  for (const e of errors) console.error("  " + e + "\n");
}
if (warnings.length) {
  console.warn(`\n! typocheck: ${warnings.length} Hinweis(e)\n`);
  for (const w of warnings) console.warn("  " + w);
}
if (!errors.length) {
  console.log(`✓ typocheck: ${files.length} CSS-Dateien, letter-spacing und Buttons regelkonform`);
}
process.exit(errors.length ? 1 : 0);
