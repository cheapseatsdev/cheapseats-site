---
title: Upgrading
description: Cheap Seats keeps your history across upgrades.
weight: 430
group: Running it
---

- **Backups before schema changes.** Before it changes an existing database's schema, Cheap Seats copies it to `cheapseats.db.bak-v<N>` beside it. To roll back, stop Cheap Seats, put the copy back as `cheapseats.db`, and run the previous version.
- **No running old on new.** It refuses to open a database with a newer schema.
- **Old runs stay useful.** Runs recorded by earlier versions stay readable and retryable. Comparisons still respect method boundaries.
- **Config changes come with a migration.** When a release changes the config format, `cheapseats check` says what to change, and a `cheapseats migrate-config` step converts it. Upgrading the app before converting the config loses nothing: Cheap Seats links old results to prompts by their text once the converted config is in place.

With an image per config commit (see [Deploying](../deploying/)), upgrading Cheap Seats is a reviewed change to the `FROM` line in your config repo.

## Upgrading to 0.7.1

**No schema change** (still schema 19), so upgrading from 0.7.0 is a plain binary or image swap,
and rolling back to 0.7.0 needs no restore.

**Competitor rows can merge.** Name folding now reads Jev's decisions the same way on every read,
and names whose decisions point at each other fold onto one row. A report that showed "Scrunch" and
"Scrunch AI" as two rows can show one. Configured competitors and aliases still win. See
[provider mechanics](../reference/#optional-provider-mechanics).

**`cheapseats regrade -force`** (MCP `regrade` with `force`) re-grades runs already graded with
today's inputs, so a fix to the grader's code can reach stored answers. It is a dry run by
default; see [After a fix to the grader's code](../regrading/#after-a-fix-to-the-graders-code).

`cheapseats fixes -rebuild` now says "Showing the run's earlier analysis…" once when a failed
rebuild keeps the earlier analysis.

## Upgrading to 0.7.0

**Database schema 13 → 19.** The first start copies the database to
`cheapseats.db.bak-v13` before migrating. Older binaries refuse the migrated
database, so rolling back means stopping Cheap Seats, restoring that copy as
`cheapseats.db` and running the previous version. Work recorded after the
upgrade is not in the copy. 0.7.0 includes 0.6.1's fixes.

**The grader finds a brand split by formatting**: `**Example** **Tracker**`, a
line break or a double space inside the name. Such answers were graded absent
before. Answers graded before 0.7.0 keep their stored grade, and a plain
[re-grade](../regrading/) won't revisit them: the fix is not a grading input,
so a regrade reports those runs as already graded with today's inputs. From
0.7.1, `cheapseats regrade -force` re-grades them; preview its dry run and cost
before passing `-dry-run=false`.

**A failed analysis never replaces a good one.** When a rebuild fails, the
earlier analysis stays and the error is recorded; the hub, dashboard, run page,
`/api/next-steps`, `/api/runs/{id}` and MCP say which analysis they show and why.
See [Next steps](../reading-results/#quick-wins).

**Evaluation is a preview, off by default.** Set `CHEAPSEATS_EVALUATION=1` to
enable it; read-only mode turns it off. Try it on a separate test database first;
see [Reviewing grader labels](../evaluation/).

On exe.dev:

- Re-run `deploy/exe-dev-ops.sh <vm> <email>` to install the new watch. It alerts
  on failed fix-list rebuilds of any age, and its first check skips failures an
  earlier version already reported.
- Optionally deploy with `LIVE_CHECK=1 deploy/exe-dev.sh …`. It runs
  `cheapseats check -live` on the VM before the swap, sending each structured-output
  schema to the API once with the VM's key (a few cents, capped by `LIVE_BUDGET`,
  default 0.25 dollars), and stops the deploy if the API refuses one. Use it when the
  grader or analyst uses the API.
- If a new build fails to start after migrating the database, `exe-dev.sh` stops
  and disables Cheap Seats instead of starting the old build, and prints how to
  restore `bak-v<N>`.

## Upgrading to 0.6.0

**Quick wins becomes Next steps**, with verified actions, bounded investigations
and market findings. Older fix lists retain their work history but appear as
investigations because verification was not recorded. Rebuild a run's analysis
with `cheapseats next-steps -rebuild <run-id>` to apply the new checks; this uses
the configured analyst and can incur charges. An accepted PR is work history,
not proof of a verified action or improved visibility. See [Next steps](../reading-results/#quick-wins).

`[brand.advisory]` optionally adds positioning, goals and deliberate boundaries
for advice; buyer answerers and graders do not receive it. Upgrade the app before
adding the table because older versions reject unknown config keys.

This release uses schema 13 and backs up an existing database before migration.
Rollback requires that backup. `/quick-wins`, `fixes` and `get_quick_wins` remain
compatible aliases or action-only interfaces; [the reference](../reference/)
describes the new interfaces.

Evaluation was not part of 0.6.0; it ships as a preview in 0.7.0.

**0.6.1 is a patch with no schema change.** On 0.6.0, every Next steps analysis
on the Claude API fails; 0.6.1 fixes that, and MCP `get_started` no longer returns
`[brand.advisory]`. Runs whose analysis failed on 0.6.0 keep the error until you
rebuild them with `cheapseats next-steps -rebuild <run-id>`.

## Upgrading to prompt ids

From a release before prompt ids: run `cheapseats migrate-config` on your config repo, review the generated ids, run `cheapseats check`, and commit; then deploy the new version.

```
cheapseats migrate-config [dir]           give each prompt an id, in sets written before ids
```

## Upgrading to 0.5

No schema changes from 0.5.0 to 0.5.8. Four 0.5.0 changes can need something from you first:

- **A Helm ingress needs TLS.** `ingress.enabled: true` without `ingress.tls` fails to install or upgrade, because the sign-in cookie carries the access token. Set `ingress.tls`, or `ingress.externalTLS: true` when TLS ends in front of the Ingress. The chart also refuses a literal key or token in `extraEnv`; use `valueFrom.secretKeyRef` or `existingSecret`.
- **Config limits.** `[budget] concurrency` must be 1 to 64 (unset still means 4), and an answerer's `samples` and `[tiers.plg] max_samples` at most 20 a track. A config above these refuses to start, so run `cheapseats check` first.
- **`.env` can't redirect requests or change sign-in.** A `.env` line setting a `*_BASE_URL`, a proxy or certificate variable, `CHEAPSEATS_CLI_ENV`, `CHEAPSEATS_AUTH_HEADER`, `CHEAPSEATS_ALLOWED_EMAILS`, or a variable that loads code at startup (`LD_*`, `NODE_OPTIONS`...) is ignored with a warning. Export those in the real environment. `CHEAPSEATS_TOKENS` still loads from `.env`.
- **Startup checks its auth settings.** `serve` refuses to start when `CHEAPSEATS_TOKENS` is set but holds no token, or `CHEAPSEATS_AUTH_HEADER` is blank, and runs without sign-in only on `localhost` or a loopback address.

**0.5.6 is a new grading method for runs with a `claude-code` or `codex` answerer.** Codex's search track now searches the live web and its recall track has no web search, and a run's method records the arguments each CLI is called with. Those runs start a new trend at the first run on 0.5.6; earlier Codex answers aren't comparable, and re-grading can't repair how an answer was obtained. Runs with only API answerers carry on. See [What's re-graded](../regrading/#whats-re-graded).

Also in 0.5: a fix can be [dismissed](../reading-results/#quick-wins) with its reason (0.5.7), and `cheapseats crawl import` counts [people's visits](../site-audit/#ai-crawlers) (0.5.5); re-import recent access logs once to backfill them.

## Upgrading to 0.4

- **Two schema migrations**, backed up first as always. An existing deployment upgrades with no config changes.
- **New keys, all optional**: `[brand] category`, the `[typesafe]` and `[exa]` tables and their switches, `[grader] check_facts`, and `[pricing.exa-contents]`. Unknown keys are errors, so upgrade the app before adding any of them to the config. See [Optional providers](../optional-providers/) and [Got wrong about you](../got-wrong/).
- **0.4.0 to 0.4.2 change neither the grader nor the answer prompt**, so every trend carries on through them.
- **0.4.4 is a new grading method.** An answer that names the brand only to say it can't find or verify it is `absent` from 0.4.4 on (0.4.3 had briefly graded it `mentioned`). Trends restart at the first run on it; `cheapseats regrade <set>` (or MCP `regrade`) brings earlier runs onto it without asking the assistants again, and a fix attempt whose runs straddle the change reads *needs regrade* until you do. See [How grading works](../how-grading-works/#three-grades).
- **0.4.2 reads one set of names**: only `CHEAPSEATS_*` from the environment, and only `cheapseats.toml` and `cheapseats.db`. A deployment still on older names renames them before this upgrade.

## What a release can restart

A release that changes how answers are asked or graded starts trends over, and its release notes should say so. Anything else that changes is annotated on the rankings, not a new trend.

`cheapseats version` prints this build's version and database schema; `GET /api/version` returns the version, config commit and database schema.
