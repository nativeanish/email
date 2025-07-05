/**
 * inlineTailwind.ts
 * --------------------------------------------------
 * Convert Tailwind‑class HTML into email‑safe markup
 * by replacing every class name that appears in
 * `tw-inline-map.json` with inline style declarations.
 *
 * Usage:
 *   import { inlineTailwind } from "@/utils/inlineTailwind";
 *   const emailHtml = inlineTailwind(rawHtmlFromLexical);
 *
 * Requirements:
 *   – tsconfig.json must have `"resolveJsonModule": true`
 *     (so the JSON import compiles)
 *   – `tw-inline-map.json` must sit next to this file
 *     or update the import path below.
 */

import inlineMap from "./inline-map.json" assert { type: "json" };

type StyleMap = Record<string, string>;

/** Merge two CSS style strings into one, deduplicating props. */
function mergeStyles(a = "", b = ""): string {
  const toPairs = (s: string) =>
    s
      .split(";")
      .map((d) => d.trim())
      .filter(Boolean)
      .map((d) => {
        const i = d.indexOf(":");
        return [d.slice(0, i).trim(), d.slice(i + 1).trim()] as [string, string];
      });

  const map = new Map<string, string>(toPairs(a));
  toPairs(b).forEach(([prop, val]) => map.set(prop, val));

  return Array.from(map.entries())
    .map(([prop, val]) => `${prop}:${val}`)
    .join(";");
}

/**
 * Inline all Tailwind utilities that exist in tw-inline-map.json
 * @param html Raw HTML that still contains class names
 * @returns HTML string with style="" attributes but no class=""
 */
export function inlineTailwind(html: string): string {
  // Behind the scenes DOMParser works in browsers; for Node ≥20
  // use `globalThis.DOMParser ??= require("jsdom").JSDOM.fragment`.
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");

  doc.querySelectorAll<HTMLElement>("[class]").forEach((el) => {
    const classList = el.className.split(/\s+/).filter(Boolean);

    // Collect CSS declarations for every known utility
    const inlineCss = classList
      .map((cls) => (inlineMap as StyleMap)[cls])
      .filter(Boolean)
      .join(";");

    // Merge with any existing inline style
    const finalStyle = mergeStyles(el.getAttribute("style") ?? "", inlineCss);
    if (finalStyle) el.setAttribute("style", finalStyle);

    // Remove the class attribute entirely
    el.removeAttribute("class");
  });

  return doc.body.innerHTML;
}
