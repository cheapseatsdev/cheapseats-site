# popcorn.zone

The website, docs and blog for [Popcorn](https://github.com/metcalfc/popcorn), built with
[Hugo](https://gohugo.io) and a small theme in `layouts/` and `assets/css/site.css`. No JavaScript,
no web fonts, no CDN assets, no analytics.

```bash
hugo server          # http://localhost:1313
hugo --minify        # build into public/
```

Every push to `main` builds with Hugo 0.166.0 and deploys to GitHub Pages
(`.github/workflows/pages.yml`).

- `content/docs/`: docs pages, ordered by `weight`. Adapted from the Popcorn repo's README and
  `docs/`; keep them true of Popcorn as it ships.
- `content/blog/`: posts, with `date` and `author`. The feed is at `/blog/index.xml`.

Colors and type follow the app (`internal/server/static/popcorn.css`). The logo and favicon are the
[Lucide](https://lucide.dev) "popcorn" icon, under the ISC license in `LICENSES/lucide-ISC.txt`.

The site is [MIT](LICENSE) licensed, like Popcorn.
