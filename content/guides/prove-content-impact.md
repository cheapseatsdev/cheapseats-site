---
title: Measure whether your content changed AI answers
description: Set a re-check cadence, compare target prompts before and after a content change, and report the result with its uncertainty.
weight: 60
---

Re-check weekly and pool runs before judging a change. When you ship a fix, record its PR and target prompts. Compare those prompts before and after using the same method, retain the answers and citations, and show uncertainty. A before/after change alone doesn't prove your content caused it.

## How often to re-check

Weekly is a useful starting cadence. Daily runs buy more observations over time at roughly seven times the calls; they don't make a single answer reliable. Recall uses no tools, so today's new page can't directly enter it. Search can respond to web changes, but retrieval and answers still vary between runs.

Set the schedule in `cheapseats.toml`:

```toml
[schedule]
daily_hour_utc = 13

[tiers.core]
every_days = 7        # 1 for daily

[tiers.plg]
every_days = 7
max_samples = 1

[budget]
daily_usd = 10.0
```

From that UTC hour, due sets run sequentially. API calls reserve against the daily budget before starting; actual costs settle afterward, so this is an admission limit rather than a guaranteed final-bill ceiling. Finished work is kept if budget admission stops a run. Subscription calls record $0 in the ledger; API grading and optional paid passes still count. See [Cost and budget](/docs/cost-and-budget/).

You can also run a set manually after shipping. It joins the same trend; don't choose only favorable runs for the comparison.

## Tracking the change over time

**Rankings** (`/rankings` and each set's page) shows daily rates per set and track, with each prompt counting once, and a 7-, 14- or 28-day rolling average with a 95% band. Day-over-day rate comparisons use matching prompts and answerers. A method change starts a new comparison; [re-grading](/docs/regrading/) can align compatible stored answers.

A change whose 95% interval includes zero is **within noise**. For our *head to heads* search track on 22 October 2026:

| measure | result |
| --- | --- |
| rank | #10, previously #13; movement **within noise** |
| named | 18% of 22 answers, interval 0–36% |
| 7-day rolling named | 16%, band 6–26% |
| named change | +4.5 points, margin ±25 |
| recommended change | 0 points, margin ±22 |

These readings don't establish an improvement. Under the assumptions in [Noise and confidence](/docs/noise-and-confidence/), a 17-prompt set with two answers per prompt has a worst-case single-reading margin near ±17 points; the margin for a change between two such runs is about ±24. Keep those two margins distinct.

Chart markers connect proposed and accepted fixes to their PRs. They help investigate timing; they don't establish causation. The API and MCP expose the same series; see [the reference](/docs/reference/).

## Tie each fix to the prompts it should flip

Record the target prompts before starting work. Mark the fix with its commit or PR URL: **proposed** while open, **accepted** when merged, or **withdrawn** if closed. Use the fix card or the API/MCP tools in [From fix to pull request](/docs/fix-to-pull-request/).

Subsequent runs compare exactly those prompts:

- **Before:** the fix's run and up to four earlier same-method runs within 28 days.
- **After:** same-method runs since the attempt was marked, within 28 days of the newest run.
- **Measures:** named and recommended changes with margins; whether the target page was returned or cited; whether its host was cited.

| outcome | when |
| --- | --- |
| pending | no subsequent run |
| needs regrade | subsequent runs use a grading method that can be aligned |
| not comparable | answers were asked differently; re-grading can't repair this |
| too early | fewer than 7 days, or fewer than 4 answers per target prompt on average |
| moved | named or recommended rose beyond its margin, with neither falling beyond its margin |
| worse | one fell beyond its margin, with neither rising beyond its margin |
| mixed | one rose and the other fell beyond their margins |
| no detectable change (±X pts) | neither moved beyond its margin; the evidence remains compatible with a range of effects |

A still-losing fix can return as **retry**, with its previous outcome attached. The attempts list retains each PR and result.

## A real outcome

{{< figure name="fix-impact" >}}

On 22 October 2026 we shipped *How grading works* for five prompts on our *head to heads* set and marked the fix accepted. Another run finished the same day:

| measure | result |
| --- | --- |
| status | **too early**: 0 days, one run on each side |
| sample | 5 prompts × 4 answers: 20 before, 20 after |
| named | 65% → 65%, change 0 ±29 points |
| recommended | 0% → 5%, change +5 ±20 points |
| target page | neither returned nor cited on either side |
| our host | not cited on either side |

One answer changed from mentioned to recommended; the margins are wide. The page's absence from retrieval suggests checking indexing, query relevance and third-party sources before rewriting it. It doesn't identify which of those caused the gap.

The outcome is re-evaluated on later runs. Pooling more comparable answers narrows sampling uncertainty, while model and web changes can still complicate attribution.

## The one-page report

Build a report from the attempt and its stored answers:

> **Did the grading page change our AI visibility?** Too early to tell, judged 22 October 2026, the day it shipped.
>
> **Shipped:** *How grading works*, PR #8, merged 22 October.
>
> **Target:** five preselected questions on *head to heads*, both tracks, two assistants.
>
> **Before → after:** named 65% → 65% of 20 answers (0 ±29 points); recommended 0% → 5% (+5 ±20). Neither change exceeds its margin.
>
> **Retrieval:** the page was neither returned nor cited. Check indexing and query coverage, then re-check on schedule.
>
> **Evidence:** link the PR, attempt and run pages.

Use a [share link](/docs/sharing/) for a read-only run summary; choose whether to include answer text. For several fixes, add one row per attempt and link the rankings trend.

Preselecting prompts and retaining the before pool reduces cherry-picking. Report an observed change as an association unless a stronger study design supports a causal claim.
