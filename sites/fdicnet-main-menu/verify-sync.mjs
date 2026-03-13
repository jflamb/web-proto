import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(process.cwd(), "sites/fdicnet-main-menu");

function read(relativePath) {
  return readFileSync(resolve(root, relativePath), "utf8");
}

function extractBodyMarkup(html) {
  const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  if (!bodyMatch) {
    throw new Error("Unable to locate <body> in index.html");
  }
  return bodyMatch[1]
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .trim();
}

function normalizeSharedShell(markup, { fromTwig = false } = {}) {
  let normalized = markup.trim();
  if (fromTwig) {
    normalized = normalized.replace(/^<div class="fdicnet-main-menu-component">/, "").replace(/<\/div>\s*$/, "");
  }

  normalized = normalized
    .replace(/<h1 id="pageTitle">[\s\S]*?<\/h1>/, '<h1 id="pageTitle"></h1>')
    .replace(/<div id="pageIntro">[\s\S]*?<\/div>/, '<div id="pageIntro"></div>')
    .replace(/\s+>/g, ">")
    .replace(/>\s+</g, "><")
    .replace(/\s{2,}/g, " ")
    .trim();

  return normalized;
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

const indexHtml = read("index.html");
const twigTemplate = read("components/fdicnet-main-menu/fdicnet-main-menu.twig");
const runtimeScript = read("runtime.js");
const css = read("styles.css");

const normalizedIndex = normalizeSharedShell(extractBodyMarkup(indexHtml));
const normalizedTwig = normalizeSharedShell(twigTemplate, { fromTwig: true });

assert(
  normalizedIndex === normalizedTwig,
  "Standalone index.html and fdicnet-main-menu.twig are out of sync."
);

const mobileNavMatch = runtimeScript.match(/mobileNavMax:\s*(\d+)/);
const phoneSearchMatch = runtimeScript.match(/phoneSearchMax:\s*(\d+)/);
const tabletMaxMatch = runtimeScript.match(/tabletMax:\s*(\d+)/);

assert(mobileNavMatch, "Unable to read mobileNavMax from runtime.js");
assert(phoneSearchMatch, "Unable to read phoneSearchMax from runtime.js");
assert(tabletMaxMatch, "Unable to read tabletMax from runtime.js");

const mobileNavMax = mobileNavMatch[1];
const phoneSearchMax = phoneSearchMatch[1];
const tabletMax = tabletMaxMatch[1];
const mobileNavMinDesktop = String(Number(mobileNavMax) + 1);

assert(
  css.includes(`@media (max-width: ${mobileNavMax}px)`),
  `styles.css is missing @media (max-width: ${mobileNavMax}px)`
);
assert(
  css.includes(`@media (max-width: ${phoneSearchMax}px)`),
  `styles.css is missing @media (max-width: ${phoneSearchMax}px)`
);
assert(
  css.includes(`@media (max-width: ${tabletMax}px)`),
  `styles.css is missing @media (max-width: ${tabletMax}px)`
);
assert(
  css.includes(`@media (min-width: ${mobileNavMinDesktop}px) and (max-width: ${tabletMax}px)`),
  `styles.css is missing the tablet range using ${mobileNavMinDesktop}px and ${tabletMax}px`
);

console.log("FDICnet shell parity and breakpoint sync checks passed.");
