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

**Evaluation is a separate unreleased preview**, not part of this upgrade. It
uses schema 19 and needs its own test database and explicit enablement. See the
[preview guide](../evaluation/#backups-and-rollback) before trying it.

## Upgrading to prompt ids

From a release before prompt ids: run `cheapseats migrate-config` on your config repo, review the generated ids, run `cheapseats check`, and commit; then deploy the new version.

```
cheapseats migrate-config [dir]           give each prompt an id, in sets written before ids
```

## Upgrading to 0.4

- **Two schema migrations**, backed up first as always. An existing deployment upgrades with no config changes.
- **New keys, all optional**: `[brand] category`, the `[typesafe]` and `[exa]` tables and their switches, `[grader] check_facts`, and `[pricing.exa-contents]`. Unknown keys are errors, so upgrade the app before adding any of them to the config. See [Optional providers](../optional-providers/) and [Got wrong about you](../got-wrong/).
- **0.4.0 to 0.4.2 change neither the grader nor the answer prompt**, so every trend carries on through them.
- **0.4.4 is a new grading method.** An answer that names the brand only to say it can't find or verify it is `absent` from 0.4.4 on (0.4.3 had briefly graded it `mentioned`). Trends restart at the first run on it; `cheapseats regrade <set>` (or MCP `regrade`) brings earlier runs onto it without asking the assistants again, and a fix attempt whose runs straddle the change reads *needs regrade* until you do. See [How grading works](../how-grading-works/#three-grades).
- **0.4.2 reads one set of names**: only `CHEAPSEATS_*` from the environment, and only `cheapseats.toml` and `cheapseats.db`. A deployment still on older names renames them before this upgrade.

## What a release can restart

A release that changes how answers are asked or graded starts trends over, and its release notes should say so. Anything else that changes is annotated on the rankings, not a new trend.

`cheapseats version` prints this build's version and database schema; `GET /api/version` returns the version, config commit and database schema.
