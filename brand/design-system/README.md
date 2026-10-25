# Design system

The Cheap Seats design system on Claude is built from this repo:

| File | What | Edited by hand? |
| --- | --- | --- |
| `../web/tokens.css` | every `--cs-*` token, its light and dark values, and its usage note | yes: the source |
| `type.json` | the type styles (sizes, weights, line heights) | yes |
| `build.mjs` | turns those two into `tokens.json` | rarely |
| `tokens.json` | what the design system holds | no: generated |

After changing `tokens.css` or `type.json`, run `node brand/design-system/build.mjs` and commit
`tokens.json` with the change; CI runs it with `--check` and fails on a stale copy. Every token
needs a usage note (the comment after it, on the same line), or the build fails. Every color needs
a value in both dark blocks or must be an alias of one that has. A shared token must fit one of
the families `build.mjs` knows (spacing, radius, shadow, font, focus, opacity, layout, breakpoint),
so a new kind of token needs a rule there first. The build also rewrites `type.json` in its
canonical form, and `--check` fails when it is not.

To update the design system itself, merge here and ask Claude to re-sync the Cheap Seats design
system from `cheapseatsdev/cheapseats-site`. A token edited on the design system's page is
overwritten by the next sync: change it here instead.

Components, the brand book and assets are kept in the design system itself; their styles come
from the app's `internal/server/static/cheapseats.css`.
