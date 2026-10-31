---
title: Re-grading stored answers
description: Apply today's grading inputs to stored answers while retaining replaced grades and leaving the original answers intact.
weight: 270
group: Reading what it finds
---

Re-grading applies today's grader to stored answers without asking the assistants again. Use it after a grading change to reconnect eligible runs to today's trend, or after a competitor change to update name folding.

{{< figure name="regrade-or-recollect" >}}

If you are testing a candidate grader, use the [Evaluation preview](../evaluation/) against frozen references before changing production. Re-grading is an explicit update to stored grades. It does not tell you what assistants believe today.

The grader prompt, model and brand identity (name, aliases, `about`) affect the trend's **method**. Competitor names and aliases affect **grading inputs**, but changing competitors alone does not restart a trend.

```bash
cheapseats regrade <set-id|run-id> [-since 28d]          # dry run: work and estimated cost
cheapseats regrade <set-id|run-id> -since 90d -dry-run=false
```

Nothing is written unless you pass `-dry-run=false`.

## What's re-graded

{{< figure name="method-timeline" >}}

- **Set:** finished runs in `-since` (`28d`, `72h` or `all`; default 28 days). **Run:** that run only.
- **Skipped:** runs already matching today's grading-input fingerprint: grader prompt and model, brand name, aliases and `about`, and competitors' names and aliases.
- **Ineligible:** unfinished or running runs, or answers asked under another answer prompt, search policy or set of CLI arguments (a `claude-code` or `codex` answerer called differently, as in 0.5.6). Re-grading cannot change how an answer was obtained.

## When to run it, and what success means

Preview after a shipped grading-input change, after competitor changes that affect name folding, or when an outcome says **needs regrade**. There is no need to re-grade on a calendar when the inputs already match.

| Preview or execution result | Next step |
| --- | --- |
| Already current | Stop; there is nothing to refresh for those runs |
| Eligible old grading inputs | Review the planned answers and cost, then explicitly start |
| Asked differently or unfinished | Keep the boundary or complete the run; a different answer prompt/search policy needs a new baseline |
| Failed or interrupted | Inspect the reason; each run commits all its new grades together or retains the old ones |
| Completed | Inspect the new interpretation and history; rebuild advice or other optional passes explicitly when needed |

**Success:** eligible stored answers use the intended grading inputs, with original evidence and history retained. It is not a new measurement of the web or proof your visibility improved. [Measuring success](../measuring-success/) explains the later observation step.

## What it costs

One grader call per answer. With `provider = "claude-code"`, your subscription covers the calls. API dry runs estimate from `[pricing]`, about four characters per token and the grader's thinking. Actual calls use the [daily budget](../cost-and-budget/#the-daily-budget); a run estimated to exceed the remainder isn't started.

## All or nothing, per run

All new grades are calculated before writing them together. If grading fails, stops, or the run changes meanwhile (for example, another re-grade or retry), that run is left untouched.

## History stays honest

The snapshot adopts today's grading inputs while retaining how answers were asked. Its recomputed method determines trend compatibility.

- Replaced grades remain in `results.grade_history`.
- `/api/runs/<id>` records `regrades`: date, answer count, cost, previous method and grader.
- The run page says **re-graded &lt;date&gt; (was method X)**.
- Untouched runs can still create method breaks when only some runs are re-graded.

## What isn't rebuilt

Fix lists, themes and the [fact check](../got-wrong/) remain as stored. Rebuild derived reports if needed:

```bash
cheapseats fixes -rebuild <run-id>
cheapseats themes <run-id> -rebuild
```

Rerun `cheapseats misstatements <run-id>` if changed verdicts make different answers eligible for the fact check.

## In the web UI and over MCP

- **Web:** `/sets/<id>/regrade`, linked from the set, previews runs, answers, method changes and estimated cost for 7, 28 or 90 days or all time. Its button starts work in the background.
- **MCP:** `regrade` takes `target` (set or run), `since_days` (default 28; 0 means all; negative is an error) and `dry_run` (true unless set false).

See [How grading works](../how-grading-works/) and [Rankings](../reading-results/#rankings).
