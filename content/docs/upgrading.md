---
title: Upgrading
description: Cheap Seats keeps your history across upgrades.
weight: 430
group: Running it
---

- **Backups before schema changes.** Before it changes an existing database's schema, Cheap Seats copies it to `cheapseats.db.bak-v<N>` beside it. To roll back, stop Cheap Seats, put the copy back as `cheapseats.db`, and run the previous version.
- **No running old on new.** It refuses to start on a database from a newer version, rather than run an older one on it.
- **Old runs stay useful.** Runs recorded by earlier versions stay readable, comparable and retryable.
- **Config changes come with a migration.** When a release changes the config format, `cheapseats check` says what to change, and a `cheapseats migrate-config` step converts it. Upgrading the app before converting the config loses nothing: Cheap Seats links old results to prompts by their text once the converted config is in place.

With an image per config commit (see [Deploying](../deploying/)), upgrading Cheap Seats is a reviewed change to the `FROM` line in your config repo.

## Upgrading from Popcorn

Cheap Seats was called Popcorn until v0.3.0. An existing deployment upgrades without changes, and can rename at its own pace:

- **Environment.** Every `POPCORN_*` variable still works, with a warning at startup naming the ones to rename to `CHEAPSEATS_*`. Where both are set, `CHEAPSEATS_*` wins.
- **Files.** A config repo's `popcorn.toml` and a data directory's `popcorn.db` are used where `cheapseats.toml` and `cheapseats.db` don't exist. Rename them only with Cheap Seats stopped.
- **Image and chart.** They moved to `ghcr.io/cheapseatsdev/cheapseats` and `oci://ghcr.io/cheapseatsdev/charts/cheapseats`. The old ones stay pullable at the versions they have. Change your config image's `FROM` line.
- **Helm.** Upgrade a release installed from the popcorn chart with `--set nameOverride=popcorn` (or `nameOverride: popcorn` in its values). Without it the chart's resources get new names: the upgrade fails on the Deployment's selector, and a new volume claim would start on an empty disk.
- **exe.dev.** `deploy/exe-dev.sh` moves `~/popcorn` to `~/cheapseats` on its first run, with the service stopped, and copies the database to `backups/pre-rename.db` first.
- **Sign-ins, audits, MCP.** Browsers signed in stay signed in. A robots.txt rule for `Popcorn-Audit` still applies to the site audit, which now sends `CheapSeats-Audit`. An MCP client keeps working at the same URL; its server is now named `cheapseats-<brand>`.

## Upgrading to prompt ids

From a release before prompt ids: run `cheapseats migrate-config` on your config repo, review the generated ids, run `cheapseats check`, and commit; then deploy the new version.

```
cheapseats migrate-config [dir]           give each prompt an id, in sets written before ids
```

## What a release can restart

A release that changes how answers are asked or graded starts trends over, and its release notes should say so. Anything else that changes is annotated on the rankings, not a new trend.

`cheapseats version` prints this build's version and database schema; `GET /api/version` returns the version, config commit and database schema.
