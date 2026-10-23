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

Colors and type follow the app (`internal/server/static/cheapseats.css`). The logo and favicon are the
[Lucide](https://lucide.dev) "cheapseats" icon, under the ISC license in `LICENSES/lucide-ISC.txt`.

The site is [MIT](LICENSE) licensed, like Cheap Seats.
