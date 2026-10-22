# Cheap Seats — Back Row brand kit

The approved direction is **Back Row**: three rising rounded seat backs on a shared baseline. Preserve the left-to-right rise, relative heights, rounded tops, gaps, and baseline. The brand name is **Cheap Seats**; the domain is **cheapseats.dev**.

## Quick start

- Application header: `logos/cheapseats-horizontal-light.svg` or `logos/cheapseats-horizontal-dark.svg`.
- Compact navigation: `marks/cheapseats-mark-light.svg` or `marks/cheapseats-mark-dark.svg`.
- Favicon: `web/favicon.svg`, with `web/favicon.ico` as the fallback.
- Social avatar: `social/avatar-light.png` or `social/avatar-dark.png`.
- Link preview: `social/og-light.png` or `social/og-dark.png`.
- Review the complete identity in `brand-overview.png`.

Light and dark names refer to the intended **background**. The light logo has a red mark and charcoal lettering; the dark logo has a coral mark and ivory lettering. Logo PNGs and SVGs are transparent. Social cards, app icons, and avatars have opaque backgrounds.

## Included variants

| Folder | Files and purpose |
| --- | --- |
| `logos/` | Horizontal and stacked logos in light, dark, black, and white; SVG masters and 2× PNGs. Standalone outlined wordmarks in SVG. |
| `marks/` | Wide mark in four colors; square transparent symbols in SVG and 1024px PNG; an inline-SVG `currentColor` mark. |
| `web/` | SVG favicon, simplified 16px SVG, 16/32/48px PNGs, multi-resolution ICO, 180px Apple touch icon, 192/512px app icons, 512px maskable icon, web manifest, and CSS palette. |
| `social/` | Light/dark avatars at 1024×1024, social preview cards at 1200×630, and banners at 1500×500. Each has SVG and PNG versions. |
| `source/` | Exact mark geometry and layout generator, outlined lettering data, and the macOS lettering outline helper. |

The 16px favicon uses optically simplified, pixel-aligned geometry. Use it only at tiny sizes; use the main mark for larger placements. The app and maskable icons are full-bleed squares so platforms can apply their own masks. Social avatars keep the mark inside a central circle-safe area. Banners leave space toward the left for common profile-photo overlays; check the crop on the destination platform.

## Color palette

| Token | Light | Dark | Usage |
| --- | --- | --- | --- |
| `--cs-bg` | `#FAF8F5` | `#1B1917` | Main background |
| `--cs-surface` | `#FFFFFF` | `#24211E` | Cards, menus, navigation |
| `--cs-border` | `#E5DFD7` | `#3B3631` | Subtle decorative dividers |
| `--cs-text` | `#252321` | `#F5F1EB` | Main UI text |
| `--cs-muted` | `#6E6862` | `#ADA59C` | Secondary text |
| `--cs-primary` | `#C73532` | `#EF7770` | Primary action and brand mark |
| `--cs-on-primary` | `#FFFFFF` | `#1B1917` | Text/icons on primary fills |
| `--cs-gold` | `#F2B544` | `#F2B544` | Occasional small accent |
| `--cs-gold-bg` | `#FFF0CB` | `#3B2C14` | Highlight badge background |
| `--cs-gold-text` | `#765000` | `#F2B544` | Text on highlight badges |

The logo's dark neutral is `#1B1917` and its reverse lettering is `#FAF8F5`. UI text uses the separate text tokens above.

Keep large areas neutral. Use red for primary actions and gold sparingly. The mark itself is one solid color. Preserve foreground/background pairs, especially dark text on coral buttons. The decorative border colors need a stronger alternative wherever a visible control boundary is essential. Provide clear keyboard focus styles and verify actual component contrast.

## Logo usage

- Prefer SVG for the application and website. All logo lettering is outlined; no font installation is needed to display it.
- Maintain the aspect ratio. Do not stretch, rotate, rearrange, or separate the seat shapes.
- Keep at least one seat-width of clear space around the visible mark when the layout permits. The files include modest canvas padding; add surrounding layout space as needed.
- Recommended minimum: horizontal logo at 180 CSS pixels wide, stacked logo at 160 CSS pixels wide, standalone mark at 24 CSS pixels wide. At 16px use the supplied micro favicon.
- For a clickable logo, use an accessible link name such as “Cheap Seats home”. Avoid duplicate spoken labels when an adjacent wordmark already names the app.
- The `currentColor` file inherits color when its SVG markup is inlined. A separate `<img>` does not inherit the parent's CSS color.
- Source lettering was outlined from Avenir Next Bold; the domain uses Avenir Next Medium. Fonts are not included. UI typography can use the application's existing sans-serif family.

## Website integration

Copy the relevant files into the application's public asset folder. This example assumes the web files are served from `/brand/` and the social card from `/brand/social/`:

```html
<link rel="icon" href="/brand/favicon.ico" sizes="any">
<link rel="icon" href="/brand/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/brand/apple-touch-icon.png">
<link rel="manifest" href="/brand/site.webmanifest">
<meta name="theme-color" content="#1B1917">
<meta property="og:type" content="website">
<meta property="og:title" content="Cheap Seats">
<meta property="og:url" content="https://cheapseats.dev/">
<meta property="og:image" content="https://cheapseats.dev/brand/social/og-light.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="Cheap Seats — three rising red seats beside the company name">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="Cheap Seats">
<meta name="twitter:image" content="https://cheapseats.dev/brand/social/og-light.png">
<meta name="twitter:image:alt" content="Cheap Seats — three rising red seats beside the company name">
```

The manifest icon URLs are relative to the manifest. Keep those files together. Review `id`, `start_url`, and the name fields if deploying below a subpath. Import `brand.css` and set `data-theme="light"` or `data-theme="dark"` on the root element to select the palette. These integration snippets are supplied for handoff; the live site has not been changed.

## Editable source

`source/build.cjs` contains the mark path, layout coordinates, colors, exports, ICO assembly, and overview. `source/lettering.json` contains reusable vector paths for the wordmark and domain. These are sufficient to rebuild the assets without any font dependency.

To rebuild, use Node.js with `sharp` available:

```sh
npm install --no-save sharp
node source/build.cjs
```

If changing the lettering on macOS, `source/outline.swift` can regenerate the paths using installed Avenir Next fonts:

```sh
swift source/outline.swift source/lettering.json
node source/build.cjs
```

The rendered overview uses Arial for specimen labels only; the actual logo and social asset lettering uses vector paths.
