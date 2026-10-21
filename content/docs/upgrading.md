---
title: Upgrading
description: Popcorn keeps your history across upgrades.
weight: 60
---

- **Backups before schema changes.** Before it changes an existing database's schema, Popcorn copies it to `popcorn.db.bak-v<N>` beside it. To roll back, stop Popcorn, put the copy back as `popcorn.db`, and run the previous version.
- **No running old on new.** It refuses to start on a database from a newer version, rather than run an older one on it.
- **Old runs stay useful.** Runs recorded by earlier versions stay readable, comparable and retryable.
- **Config changes come with a migration.** When a release changes the config format, `popcorn check` says what to change, and a `popcorn migrate-config` step converts it. Upgrading the app before converting the config loses nothing: Popcorn links old results to prompts by their text once the converted config is in place.

With an image per config commit (see [Deploying](../deploying/)), upgrading Popcorn is a reviewed change to the `FROM` line in your config repo.

## Upgrading to prompt ids

From a release before prompt ids: run `popcorn migrate-config` on your config repo, review the generated ids, run `popcorn check`, and commit; then deploy the new version.

```
popcorn migrate-config [dir]           give each prompt an id, in sets written before ids
```

## What a release can restart

A release that changes how answers are asked or graded starts trends over, and its release notes should say so. Anything else that changes is annotated on the rankings, not a new trend.

`popcorn version` prints this build's version and database schema; `GET /api/version` returns the version, config commit and database schema.
