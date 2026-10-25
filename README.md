# cheapseats.dev

The website, docs and blog for [Cheap Seats](https://github.com/cheapseatsdev/cheapseats), built with
[Hugo](https://gohugo.io) and a small theme in `layouts/` and `assets/css/site.css`. No web fonts,
CDN assets or analytics. Navigation works without JavaScript; a small inline script remembers the
chosen appearance.

```bash
hugo server          # http://localhost:1313
hugo --minify        # build into public/
```

Every pull request builds with Hugo 0.166.0 (`.github/workflows/build.yml`). cheapseats.dev is
served from its own server, which rebuilds `main` within five minutes of a merge.

- `content/docs/`: docs pages, grouped by `group` (one of `docGroups` in `hugo.toml`) and ordered by `weight`. Adapted from the Cheap Seats repo's README and
  `docs/`; keep them true of Cheap Seats as it ships.
- `content/blog/`: posts, with `date` and `author`. The feed is at `/blog/index.xml`.

## Brand tokens

`brand/web/tokens.css` is the one source of the brand's colors (light and dark), chart colors, type
stacks, spacing, radii, shadows and layout sizes, as `--cs-*` custom properties, one a line with
its usage note. The site builds it into its stylesheet ahead of `assets/css/site.css` (mounts in
`hugo.toml`, concatenated in `layouts/baseof.html`) and serves it at `/brand/tokens.css`; styles use
the tokens rather than repeating their values. Two copies follow it:

- **The app** keeps a copy at `internal/server/static/tokens.css`: in the app repo run
  `deploy/sync-brand.sh <path to this checkout>` and open a PR there; a test in the app fails when
  its copy is stale or styles use a token this file lacks.
- **The design system** (Cheap Seats on Claude) reads `brand/design-system/tokens.json`, generated
  by `node brand/design-system/build.mjs`; CI fails when it is stale. Type styles live in
  `brand/design-system/type.json`. After a merge, ask Claude to re-sync the design system from
  this repo.

The logo and favicon are the
[Lucide](https://lucide.dev) "cheapseats" icon, under the ISC license in `LICENSES/lucide-ISC.txt`.

The site is [MIT](LICENSE) licensed, like Cheap Seats.
