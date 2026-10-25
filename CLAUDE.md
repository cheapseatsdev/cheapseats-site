# cheapseats.dev: how we work in this repo

The website, docs and blog for Cheap Seats, built with Hugo. `README.md` has the layout and
commands; `content/docs/` must stay true of Cheap Seats as it ships.

For prose and explanatory visuals, follow the [Cheap Seats editor skill](skills/cheapseats-editor/SKILL.md).

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

The **Cheap Seats design system** is a Claude design-system artifact:
https://claude.ai/artifact/8R8Ud5FkRwU3oobBeQTWdr (private to its owner; share it from its page).
It is the reference for how anything Cheap Seats looks and reads: colors, type, spacing, logos,
icons, components, and the written rules. Claude can read it with its Artifact tool; start with
`project/README.md`, then the sections below.

What it holds:

- **Tokens** (Colors, Typography, Spacing, Corner radius, Shadows, Font, Focus, Opacity, Layout,
  Breakpoint): every `--cs-*` token, light and dark, with a usage note saying where it goes.
- **Components**: cards for each pattern the app renders (Button, Chip, Status, SeatMeter, Card,
  ProgressBar, Field, Masthead, Table, TrendChart, FixList, FilterToolbar, ChartColors), each
  with its markup and when to use it.
- **Assets**: logos, marks, favicons, social images and the 24 Lucide icons.
- **Brand book** (Overview): voice, visual foundations, logo use, plus three rule sections:
  **Product vocabulary**, **Accessibility** and **Icon rules**.

Using it when you build or change UI:

- **Use tokens, never raw values.** Colors, spacing, radii, shadows, focus and sizes come from
  `--cs-*`. If no token fits, add one to cheapseats-site `brand/web/tokens.css` (with its usage
  note) rather than hard-coding a value.
- **Reuse a component before inventing one.** Match an existing card's markup and classes; a new
  pattern is a new card, so say so in the PR.
- **Follow the written rules**: words and labels from Product vocabulary (lowercase values,
  sentence-case labels, a denominator with every rate, no composite scores); every screen meets
  Accessibility in both themes; icons only from Icon rules' table, with their one meaning.
- **Red is for the one primary action and the brand; gold is news; status colors are state.**
  Charts color series `--cs-data-1` (your brand) to `--cs-data-4` in order, then Other in
  `--cs-muted`.
- **Designing something new?** Ask Claude to mock it up with the Cheap Seats design system before
  writing the template, then build from the mock.

Keeping it current: its tokens come from `brand/design-system/tokens.json` (generated from
`brand/web/tokens.css`), its logos and marks from `brand/`, its components from the app's
`internal/server/static/cheapseats.css`. After a PR that changes those merges, ask Claude to
re-sync the design system.

Product vocabulary, Accessibility and Icon rules live only in the design system, not in either
repo. A re-sync won't catch it when the docs or icons change, so when a PR adds or renames a
metric, a verdict, a fix state (gap, priority, effort, attempt or outcome) or a term the docs
define, say so in the PR body and ask Claude to review those sections after it merges. The docs'
Metric definitions win over the vocabulary section; update the section to match.
