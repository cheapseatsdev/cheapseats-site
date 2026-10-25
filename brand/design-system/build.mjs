#!/usr/bin/env node
// Builds the design system's tokens.json from brand/web/tokens.css (every --cs-* token, its light
// and dark values, and the usage note after it) and brand/design-system/type.json (the type styles).
//
//   node brand/design-system/build.mjs          write brand/design-system/tokens.json
//   node brand/design-system/build.mjs --check  exit 1 if tokens.json is stale (CI runs this)
//
// tokens.json is what the Cheap Seats design system on Claude holds: to update the system, merge
// a change here and ask Claude to re-sync the design system from cheapseats-site.
// No dependencies; Node 18 or later.
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const cssPath = join(here, "..", "web", "tokens.css");
const typePath = join(here, "type.json");
const outPath = join(here, "tokens.json");
const css = readFileSync(cssPath, "utf8");

function fail(msg) {
  console.error(`build.mjs: ${msg}`);
  process.exit(1);
}

// The body of the first block that opens with `opener`, up to its matching brace.
function block(opener) {
  const start = css.indexOf(opener);
  if (start < 0) fail(`tokens.css has no block starting ${opener}`);
  let depth = 0;
  for (let i = start; i < css.length; i++) {
    if (css[i] === "{") depth++;
    if (css[i] === "}" && --depth === 0) return css.slice(css.indexOf("{", start) + 1, i);
  }
  fail(`unclosed block ${opener}`);
}

// `--name:value; /* note */` lines, in order.
function decls(body) {
  const out = [];
  const re = /--([a-z0-9-]+)\s*:\s*([^;]+);[ \t]*(?:\/\*\s*(.*?)\s*\*\/)?/g;
  for (const m of body.matchAll(re)) out.push({ name: m[1], value: m[2].trim(), usage: m[3] || "" });
  return out;
}

const light = decls(block(":root{color-scheme:light;"));
const darkMedia = decls(block(':root:not([data-theme="light"]){'));
const darkAttr = decls(block(':root[data-theme="dark"]{'));
const shared = decls(css.slice(css.lastIndexOf("/* The same in both themes")).replace(/^[^{]*\{/, ""));

if (JSON.stringify(darkMedia) !== JSON.stringify(darkAttr))
  fail('the two dark blocks differ: @media (prefers-color-scheme:dark) and :root[data-theme="dark"] must hold the same values');

const dark = Object.fromEntries(darkAttr.map((d) => [d.name, d.value]));
for (const name of Object.keys(dark))
  if (!light.some((d) => d.name === name)) fail(`--${name} has a dark value but no light one`);

const alias = (v) => {
  const m = /^var\(--([a-z0-9-]+)\)$/.exec(v);
  return m ? `{${m[1]}}` : v.toLowerCase();
};
const missingNote = [];
const note = (d) => {
  if (!d.usage) missingNote.push(d.name);
  return d.usage;
};

const color = light.map((d) => ({
  name: d.name,
  // An alias with no dark value of its own follows its target in both themes: say so in both.
  value: dark[d.name] ? { light: alias(d.value), dark: alias(dark[d.name]) }
    : d.value.startsWith("var(") ? { light: alias(d.value), dark: alias(d.value) }
    : alias(d.value),
  usage: note(d),
}));

const families = { spacing: [], radius: [], shadow: [], font: [], layout: [], breakpoint: [] };
for (const d of shared) {
  const family = d.name.startsWith("cs-space-") ? "spacing"
    : d.name.includes("radius") ? "radius"
    : d.name.startsWith("cs-shadow-") ? "shadow"
    : d.name === "cs-sans" || d.name === "cs-mono" ? "font"
    : d.name.startsWith("cs-bp-") ? "breakpoint"
    : "layout";
  const value = family === "font" ? d.value.replace(/"/g, "").replace(/,/g, ", ") : d.value;
  families[family].push({ name: d.name, value, usage: note(d) });
}
if (missingNote.length) fail(`tokens without a usage note: ${missingNote.map((n) => "--" + n).join(", ")}`);

const sans = shared.find((d) => d.name === "cs-sans");
const mono = shared.find((d) => d.name === "cs-mono");
if (!sans || !mono) fail("tokens.css must define --cs-sans and --cs-mono");
const type = JSON.parse(readFileSync(typePath, "utf8"));

const tokens = {
  name: "Cheap Seats",
  version: 1,
  meta: {
    source: "github",
    repo: "cheapseatsdev/cheapseats-site",
    paths: { tokens: ["brand/web/tokens.css"], type: ["brand/design-system/type.json"] },
    generatedBy: "brand/design-system/build.mjs",
  },
  color: { themes: [{ id: "light", name: "Light" }, { id: "dark", name: "Dark" }], tokens: color },
  type: {
    fonts: type.fonts,
    families: { sans: sans.value.replace(/,/g, ", "), mono: mono.value.replace(/,/g, ", ") },
    groups: type.groups,
  },
  spacing: { tokens: families.spacing },
  radius: { tokens: families.radius },
  shadow: { note: "Only floating layers get a shadow; cards use a border.", tokens: families.shadow },
  font: { note: "The type stacks under their codebase names.", tokens: families.font },
  layout: { tokens: families.layout },
  breakpoint: { note: "Media queries repeat these as literals; the custom properties are for scripts and reference.", tokens: families.breakpoint },
};

const text = JSON.stringify(tokens, null, 1) + "\n";
if (process.argv.includes("--check")) {
  let current = "";
  try {
    current = readFileSync(outPath, "utf8");
  } catch {}
  if (current !== text) fail("brand/design-system/tokens.json is stale: run node brand/design-system/build.mjs and commit it");
  console.log("brand/design-system/tokens.json is up to date");
} else {
  writeFileSync(outPath, text);
  console.log(`wrote brand/design-system/tokens.json: ${color.length} colors, ${shared.length} other tokens`);
}
