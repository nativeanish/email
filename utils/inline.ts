/**
 * inline.ts
 * --------------------------------------------------
 * Convert between Tailwind classes and inline styles for email compatibility.
 *
 * Functions:
 * - inlineTailwind: Convert Tailwind classes to inline styles (for email)
 * - reverseInlineTailwind: Convert inline styles back to Tailwind classes
 *
 * Usage:
 *   import { inlineTailwind, reverseInlineTailwind } from "@/utils/inline";
 *   const emailHtml = inlineTailwind(rawHtmlFromLexical);
 *   const normalHtml = reverseInlineTailwind(emailHtml);
 *
 * Requirements:
 *   – tsconfig.json must have `"resolveJsonModule": true`
 *     (so the JSON import compiles)
 *   – `inline-map.json` must sit next to this file
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
        return [d.slice(0, i).trim(), d.slice(i + 1).trim()] as [
          string,
          string
        ];
      });

  const map = new Map<string, string>(toPairs(a));
  toPairs(b).forEach(([prop, val]) => map.set(prop, val));

  return Array.from(map.entries())
    .map(([prop, val]) => `${prop}:${val}`)
    .join(";");
}

// Create reverse mapping from CSS to Tailwind classes
const reverseMap: Record<string, string> = {};
Object.entries(inlineMap as StyleMap).forEach(([className, cssDeclaration]) => {
  reverseMap[cssDeclaration] = className;
});

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

/**
 * Convert inline styles back to Tailwind classes
 * @param html HTML string with inline styles
 * @returns HTML string with Tailwind classes instead of inline styles
 */
export function reverseInlineTailwind(html: string): string {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");

  doc.querySelectorAll<HTMLElement>("[style]").forEach((el) => {
    const styleAttr = el.getAttribute("style") ?? "";

    // Parse individual CSS declarations
    const cssDeclarations = styleAttr
      .split(";")
      .map((d) => d.trim())
      .filter(Boolean)
      .map((d) => (d.endsWith(";") ? d : `${d};`));

    // Convert CSS declarations to Tailwind classes
    const tailwindClasses: string[] = [];
    const unmatchedStyles: string[] = [];

    cssDeclarations.forEach((declaration) => {
      const tailwindClass = reverseMap[declaration];
      if (tailwindClass) {
        tailwindClasses.push(tailwindClass);
      } else {
        // Keep styles that don't have Tailwind equivalents
        unmatchedStyles.push(declaration);
      }
    });

    // Set class attribute if we found any matching Tailwind classes
    if (tailwindClasses.length > 0) {
      const existingClasses = el.getAttribute("class") ?? "";
      const allClasses = [
        ...existingClasses.split(/\s+/).filter(Boolean),
        ...tailwindClasses,
      ];
      el.setAttribute("class", allClasses.join(" "));
    }

    // Keep only unmatched styles in the style attribute
    if (unmatchedStyles.length > 0) {
      el.setAttribute("style", unmatchedStyles.join(";"));
    } else {
      el.removeAttribute("style");
    }
  });

  return doc.body.innerHTML;
}
