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

// tokens.css is read a line at a time, not as CSS: its contract is one token a line, with the
// usage note after it on the same line, inside four blocks that each open on their own line.
// Braces inside a note therefore cannot confuse the parse, and a note that wraps onto a second
// line is reported as such rather than as a missing note.
const openers = {
  light: /^:root\{color-scheme:light;$/,
  darkMedia: /^@media \(prefers-color-scheme:dark\)\{:root:not\(\[data-theme="light"\]\)\{color-scheme:dark;$/,
  darkAttr: /^:root\[data-theme="dark"\]\{color-scheme:dark;$/,
  shared: /^:root\{$/,
};
const decl = /^\s*--([a-z0-9-]+)\s*:\s*([^;]+);[ \t]*(?:\/\*\s*(.*?)\s*\*\/)?\s*$/;
const blocks = { light: [], darkMedia: [], darkAttr: [], shared: [] };
let open = null;
css.split("\n").forEach((line, i) => {
  const n = i + 1;
  if (open === null) {
    const name = Object.keys(openers).find((k) => openers[k].test(line));
    if (!name) return; // between blocks: comments and blank lines
    if (blocks[name].length) fail(`line ${n}: a second ${name} block`);
    open = name;
    blocks[name].push(null); // marks the block as seen even when it holds no declarations
    return;
  }
  if (/^\}/.test(line)) {
    open = null;
    return;
  }
  if (/^\s*$/.test(line)) return;
  const m = decl.exec(line);
  if (!m) fail(`line ${n}: expected \`--name:value; /* note */\` on one line, got: ${line.trim()}`);
  blocks[open].push({ name: m[1], value: m[2].trim(), usage: m[3] || "" });
});
if (open !== null) fail(`the ${open} block is never closed`);
for (const name of Object.keys(blocks)) {
  if (!blocks[name].length) fail(`tokens.css has no ${name} block (expected a line matching ${openers[name]})`);
  blocks[name] = blocks[name].filter(Boolean);
}
const { light, darkMedia, darkAttr, shared } = blocks;

if (JSON.stringify(darkMedia) !== JSON.stringify(darkAttr))
  fail('the two dark blocks differ: @media (prefers-color-scheme:dark) and :root[data-theme="dark"] must hold the same values');

const dark = Object.fromEntries(darkAttr.map((d) => [d.name, d.value]));
for (const name of Object.keys(dark))
  if (!light.some((d) => d.name === name)) fail(`--${name} has a dark value but no light one`);
for (const d of light)
  if (!dark[d.name] && !d.value.startsWith("var("))
    fail(`--${d.name} has a light value but no dark one: add it to both dark blocks, or make it an alias of a token that has one`);

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

// Every shared token belongs to exactly one family; a new token that fits none fails the build
// rather than landing somewhere misleading.
const layoutNames = ["cs-content", "cs-prose", "cs-masthead", "cs-touch-target"];
const familyOf = (name) =>
  name.startsWith("cs-space-") ? "spacing"
    : name.startsWith("cs-radius") || name === "cs-control-radius" ? "radius"
    : name.startsWith("cs-shadow-") ? "shadow"
    : name === "cs-sans" || name === "cs-mono" ? "font"
    : name.startsWith("cs-focus-") ? "focus"
    : name.startsWith("cs-opacity-") ? "opacity"
    : layoutNames.includes(name) ? "layout"
    : name.startsWith("cs-app-bp-") ? "breakpoint"
    : fail(`--${name} fits no token family (spacing, radius, shadow, font, focus, opacity, layout, breakpoint): add a rule for it in build.mjs`);
const families = { spacing: [], radius: [], shadow: [], font: [], focus: [], opacity: [], layout: [], breakpoint: [] };
for (const d of shared) {
  const family = familyOf(d.name);
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
  focus: { note: "The focus ring: a solid cs-primary outline on every focusable element.", tokens: families.focus },
  opacity: { note: "Unitless alpha values applied to whole elements.", tokens: families.opacity },
  layout: { tokens: families.layout },
  breakpoint: { note: "The app's breakpoints; the site's own are 400, 720 and 800px. Media queries repeat these as literals; the custom properties are for scripts and reference.", tokens: families.breakpoint },
};

const text = JSON.stringify(tokens, null, 1) + "\n";
if (process.argv.includes("--check")) {
  let current = "";
  try {
    current = readFileSync(outPath, "utf8");
  } catch {}
  if (current !== text) fail("brand/design-system/tokens.json is stale: run node brand/design-system/build.mjs and commit it");
  const typeText = readFileSync(typePath, "utf8");
  if (typeText !== JSON.stringify(type, null, 1) + "\n")
    fail("brand/design-system/type.json is not in its canonical form: run node brand/design-system/build.mjs and commit it");
  console.log("brand/design-system/tokens.json is up to date");
} else {
  writeFileSync(outPath, text);
  writeFileSync(typePath, JSON.stringify(type, null, 1) + "\n");
  console.log(`wrote brand/design-system/tokens.json: ${color.length} colors, ${shared.length} other tokens`);
}
