---
title: Cost, API keys and the daily budget
description: Estimate model and hosting costs, choose subscriptions or API keys, and set a daily admission budget.
weight: 140
group: Start here
aliases:
  - /pricing/
  - /docs/cost/
  - /docs/costs/
  - /docs/models-keys-and-budget/
---

Cheap Seats is free and open source (MIT). You pay for hosting, if any, and the providers you use. Model calls can use your existing Claude and ChatGPT subscriptions on a machine with their CLIs, your own API keys billed per token, or a mix.

The daily budget checks estimated reservations before API calls. **It is an admission limit, not a provider billing ceiling:** actual costs can exceed reservations. Configure provider-side spending limits too.

## Your own API keys, or your own subscriptions

| Payment path | Configuration | Requirements |
| --- | --- | --- |
| API keys | answerers use `anthropic` or `openai`; grader and analyst default to `anthropic` | `ANTHROPIC_API_KEY`, plus `OPENAI_API_KEY` for OpenAI; prices in `[pricing]` |
| Subscriptions | answerers use `claude-code` or `codex`; grader and analyst use `claude-code` | logged-in `claude` and `codex` CLIs on the machine running Cheap Seats |
| Mixed | choose a provider for each role | for example, subscription answers and API grading |

API roles can also use a [key-adding proxy](../configuration/#environment). Subscription calls are recorded at $0 API spend; they still use your subscription allowance. Claude is required and OpenAI optional. The Docker image has no CLIs. See [subscription setup](../getting-started/#running-on-your-subscriptions) and [where your data goes](../self-hosting/#where-your-data-goes).

## Where the money goes

| Work | Provider/role | Cost basis |
| --- | --- | --- |
| Answering | configured answerers | subscription allowance or API tokens and searches |
| Grading and re-grading | `[grader]` | one call per answer; subscription or API |
| Fix list and insights | `[analyst]` | one call per run; subscription or API |
| Themes | `[grader]` | one call per run unless `themes = false` |
| Prompt suggestions and proposed review edits | `[analyst]` | one call when requested |
| Fact check | `[grader]` | one call per answer naming the brand, when facts are configured |
| Adaptive sampling | configured answerers, then grader | extra answers and grades, like the planned samples |
| Jev and Exa passes | optional providers | input tokens, searches or page reads; see [Optional providers](../optional-providers/) |
| Audit, citation check, crawler-log import | HTTP and your logs | no model calls; Exa fallback page reads cost money when enabled |

## What a real run cost

On 21 October 2026, Cheap Seats' *Choosing an AI visibility tool* run (`r-20261021-200546-84c081`) asked 17 prompts of two subscription answerers, once with search and once without: **68 answers**.

Answering incurred **$0 extra API spend**. API grading with `claude-haiku-5-5` cost **$0.033**, about $0.0005 per answer. With a subscription grader, that API cost would also have been $0.

The CLIs record token counts. Priced at that run's configured API rates, answering would have cost:

| Answerer and track | Answers | At configured API prices | Per answer |
| --- | ---: | ---: | ---: |
| Claude Opus, search | 17 | $1.63 | $0.096 |
| Claude Opus, recall | 17 | $0.59 | $0.035 |
| `gpt-6.1-sol`, search | 17 | $1.40 | $0.082 |
| `gpt-6.1-sol`, recall | 17 | $0.16 | $0.009 |
| **All** | **68** | **$3.78** | **$0.056** |

These are estimates from CLI token counts, not an API bill. API answerers send different prompts, so usage will differ. The configured rates were Opus $4 input / $20 output / $0.20 cache read / $5 cache write per million tokens; `gpt-6.1-sol` $2 / $10 / $0.10; and $10 per 1,000 searches. Grading used $0.10 input / $0.50 output per million. Check current provider prices and update `[pricing]` before relying on an estimate.

At those rates, running this set daily for 30 days would be about **$1 for API grading with subscription answers**, or **$114 for answering and grading through the APIs**. Both exclude the fix list, themes, fact checks, optional passes and hosting.

### An 11-prompt set, graded twice

Two re-grades of a separate 44-answer run cost $0.031 and $0.036 on 22 October 2026: about $0.0007–$0.0008 per answer. Grade cost varies with answer length.

### Estimate your own

For uniform sampling:

**Answers per run = prompts × tracks × answerers × samples per track.**

With two tracks, two answerers and one sample per track, a 20-prompt set produces 80 answers. The example above suggests roughly $0.04–$0.06 for API grading, or about $4.50 for API answering, before the other passes. Add each role separately; subscription calls add no API spend.

For your actual set, use MCP `start_run` with `dry_run: true`, or `POST /api/runs` with `"dry_run": true`. It starts nothing and returns answers per track, skipped answerers, estimated cost from recent usage, remaining budget and whether the plan would be refused. An estimate is not a quote.

## The daily budget

```toml
[budget]
daily_usd = 40.0
reservation_usd = 0.60
concurrency = 6
```

- **`daily_usd`** limits new billable attempts in a UTC day across all providers and runs.
- **`reservation_usd`** is the allowance reserved for a call before it starts (default $0.60).
- **`concurrency`** limits calls in flight through the budget controller.

Before a billable attempt, Cheap Seats checks the ledger's settled costs and outstanding reservations against `daily_usd`. It settles the entry to known usage afterward; unknown or cancelled attempts retain at least their reservation.

If the next reservation won't fit, the call is refused. A run stopped with status **`budget`** keeps completed work; retry it after the UTC day changes. Today's ledger total is shown on the home and set pages.

**Actual costs can exceed the limit**, including from calls already in flight. Keep `[pricing]` accurate and set provider-side limits. `daily_usd = 0`, or no budget table, disables the admission limit. API models without a price cannot be called. Subscription calls cost $0 in this ledger, including grading, themes and fixes when configured on `claude-code`.

## What a re-grade costs

[Re-grading](../regrading/) calls the current grader once per stored answer; it does not ask the assistants again. It costs $0 API spend with `provider = "claude-code"`, or the API grader's token cost.

The CLI and web page start with a dry run showing runs, answers and estimated cost. API re-grades use the same daily admission budget; an estimate that won't fit is refused, and actual calls remain subject to reservation checks.

## Keeping the spend down

- **Use subscriptions where available**, including for the grader and analyst.
- **Start weekly**, then run more often if you need earlier detection. Daily runs use seven times the answers; recall can vary between runs even without a model release.
- **Use a small grader.** It reads every answer; the analyst runs once per run.
- **Keep samples deliberate.** `samples = { search = 2, recall = 1 }` means three answers per prompt per answerer. [Adaptive sampling](../configuration/#sampling) can add answers where uncertainty is greatest.
- **Leave scheduling off on development machines:** omit `schedule.daily_hour_utc`.
- **Run free checks first** and disable optional passes you don't use.

## How AI visibility tools price their plans

For hosted-tool pricing and coverage, use the [comparison pages](/compare/). Cheap Seats has no per-prompt or seat fee, but covers only its [supported answerers](../engines/) and requires you to operate it.

## Cheap Seats or Otterly.AI on a startup budget

See the [Otterly.AI comparison](/compare/otterly-ai/) for coverage, workflow and hosting tradeoffs.
