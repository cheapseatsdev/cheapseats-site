# cheapseats.dev: how we work in this repo

The website, docs and blog for Cheap Seats, built with Hugo. `README.md` has the layout and
commands; `content/docs/` must stay true of Cheap Seats as it ships.

## Before you push

```sh
hugo --minify --panicOnWarning      # what CI runs, with Hugo 0.166.0
node brand/design-system/build.mjs --check
```

## Brand tokens

`brand/web/tokens.css` is the one source of the brand's `--cs-*` tokens, one a line with its
usage note. Styles use the tokens rather than repeating their values. After changing it:

- run `node brand/design-system/build.mjs` and commit `brand/design-system/tokens.json` with it;
- in the app repo, run `deploy/sync-brand.sh <this checkout>` once this merges, and open a PR there;
- ask Claude to re-sync the Cheap Seats design system.

## The design system

The Cheap Seats design system on Claude is built from this repo and the app: its tokens from
`brand/design-system/tokens.json`, its logos and marks from `brand/`.

Three of its sections live only in the design system, not in either repo: **Product
vocabulary**, **Accessibility** and **Icon rules**. A re-sync won't catch it when the docs or
icons change, so when a PR adds or renames a metric, a verdict, a fix state (gap, priority,
effort, attempt or outcome) or a term the docs define, say so in the PR body and ask Claude to
review those sections after it merges.
