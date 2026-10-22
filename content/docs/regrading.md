---
title: Re-grading stored answers
description: Grade the answers older runs already have again, under today's grader, brand and competitors, so a grading change carries the trend on instead of restarting it.
weight: 48
---

**What happens to my trend when the grading changes?** A change to what the grader reads (its prompt or model, the brand's name, aliases or `about`, a set's competitors) starts a new method, and trends start over with it. Re-grading grades the answers older runs already have again, as they would be graded today, so those runs join the new method's trend from their own dates on. Answers are never asked again.

```bash
popcorn regrade <set-id|run-id> [-since 28d]          # a dry run: what it would do and cost
popcorn regrade <set-id|run-id> -since 90d -dry-run=false
```

It's a dry run unless you pass `-dry-run=false`.

## What's re-graded

- **A set**: its finished runs from the last `-since` (`28d`, `72h`, or `all`; default 28 days). **A run**: that one run.
- **Runs already graded the way they would be today are skipped.** Each run is fingerprinted by the grader prompt and model, the brand's name, aliases and `about`, and the competitors' names and aliases.
- **Left alone**: unfinished and running runs, and runs asked under another answer prompt or search policy. How answers are asked is part of the method too, and a re-grade can't change it, so it couldn't join those runs to today's trend.

## What it costs

One grader call per answer.

- On `provider = "claude-code"` it's $0, on your subscription.
- Through the API, the dry run estimates it from token counts (about four characters a token, plus the grader's thinking) and `[pricing]`.
- The real calls go through the same [daily budget](../cost-and-budget/#the-daily-budget) as runs. A run the day's remaining budget can't cover isn't started.

## All or nothing, per run

Every answer of a run is graded first, then the new grades are written together, and only over the run as it was read. If something else changed it meanwhile (another `popcorn regrade`, a retry), nothing is written. A run whose grading fails, or is cut off, is left exactly as it was.

## History stays honest

- The run's snapshot takes today's grading inputs; how its answers were asked stays as it was. Its method is recomputed from the snapshot like any run's, so it trends with today's runs.
- Each replaced grade is kept with its answer (`results.grade_history`).
- Each re-grade is kept with the run (`regrades` in `/api/runs/<id>`): when, how many answers, the cost, and the method and grader it had before.
- The run page says **re-graded &lt;date&gt; (was method X)**.
- Re-grading only some of a set's runs moves the trend's break to before the oldest re-graded run.

## What isn't rebuilt

The run's fix list and themes stay as they were. To have them follow the new grades:

```bash
popcorn fixes <run-id> -rebuild
popcorn themes <run-id> -rebuild
```

## In the web UI and over MCP

- **Web UI**: a set's page links to **Re-grade stored answers** (`/sets/<id>/regrade`). It shows the dry run (runs, answers, method change, estimated cost) for the last 7, 28 or 90 days or all time, and a button that starts it in the background.
- **MCP**: `regrade` takes a set or run as `target`, `since_days` (default 28, 0 for all; negative is an error) and `dry_run`, which is true unless set to false.

See [How grading works](../how-grading-works/) for what the grader records, and [Reading results](../reading-results/#rankings) for how trends handle a change of method.
