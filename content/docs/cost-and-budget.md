---
title: Cost, API keys and the daily budget
description: What Cheap Seats costs on your own Anthropic and OpenAI keys or your Claude and ChatGPT subscriptions, what two real runs cost, and the daily budget.
weight: 140
group: Start here
aliases:
  - /docs/cost/
  - /docs/costs/
  - /docs/models-keys-and-budget/
---

**What does it cost to run Cheap Seats every day?** Cheap Seats itself is free and open source (MIT): no license fee, no seats, no per-prompt, per-engine or per-brand pricing. The only running cost is the model calls, and you choose how to pay for them: **your own Anthropic and OpenAI API keys**, billed per token by the providers, or **the Claude and ChatGPT subscriptions you already have**, through the `claude` and `codex` CLIs on your own machine, at no extra cost. Through the APIs, spend is capped by a **daily budget**, `budget.daily_usd` in `cheapseats.toml`, that every API call is checked against before it goes out. Run it on your own machine and there's no hosting cost; host it on a Docker host, Kubernetes or an exe.dev VM and you pay your host.

In a real run of 17 prompts and 68 answers, answered on Claude and ChatGPT subscriptions and graded through the API, the model spend was **$0.033**, all of it grading; graded on the subscription too, it would have been nothing. The same answers at API prices would have added about $3.78. For comparison, Otterly.AI's entry plan is $29 a month as of October 2026, but it covers assistants Cheap Seats doesn't; see [Cheap Seats or Otterly.AI](#cheap-seats-or-otterlyai-on-a-startup-budget).

## How AI visibility tools price their plans

Hosted AI visibility tools sell a subscription, and four things drive what it costs. The figures are from each vendor's own pricing page as of October 2026; check them before deciding.

- **Prompts.** Every plan caps the questions it tracks. [Otterly.AI](https://otterly.ai/pricing) is 15 prompts on Lite ($29 a month), 100 on Standard ($189) and 400 on Premium ($489), with 100 more for $99 a month. [Peec AI](https://peec.ai/pricing) is 50 on Starter, 150 on Pro and 350 on Advanced (prices on request). [Profound](https://www.tryprofound.com/pricing)'s free trial runs 50 prompts daily for 7 days; Enterprise is a "tailored prompt tracking plan" at a custom price.
- **Engines.** Otterly.AI's plans cover ChatGPT, Google AI Overviews, Perplexity and Copilot; Claude, Gemini and Google AI Mode are paid add-ons (Claude is $29 a month on Lite, $109 on Standard, $439 on Premium). Peec AI's plans are "choose 3 models"; Profound's trial covers three engines and Enterprise up to nine.
- **Brands or projects.** Peec AI's plans allow 1, 2 or 5 projects. An agency tracking many clients needs the plan with enough projects, or an agency plan.
- **Seats.** Peec AI and Profound list unlimited users on every plan; check the others. [Gauge](https://withgauge.com/pricing)'s Growth plan is $599 a month, Enterprise custom.

Cheap Seats has none of those dials. Prompts are TOML files in your config repo, as many as you like; the engines are Claude and OpenAI models, and only those (see [Which AI engines Cheap Seats asks](../engines/)); one instance measures one brand against its competitors; there is no seat count. The cost is the model calls, and the rest of this page measures them.

## Your own API keys, or your own subscriptions

Cheap Seats calls Claude and OpenAI directly. Nothing you ask goes through a vendor in the middle, and nothing is billed but the models:

- **Your own API keys.** `ANTHROPIC_API_KEY` and, if you add a ChatGPT answerer, `OPENAI_API_KEY`, from the environment or `.env`. The providers bill you per token at their own prices; the matching prices in `[pricing]` are what Cheap Seats uses to count the spend and enforce the daily budget. Claude is required; OpenAI is optional.
- **Your own subscriptions.** With `provider = "claude-code"` an answerer, the grader and the analyst run through the `claude` CLI on your Claude subscription, and `provider = "codex"` runs an answerer through the `codex` CLI on your ChatGPT subscription. No API key, and the ledger records each call at $0. This works where the CLIs are installed, on your own machine or a VM, not in the Docker image.
- **Mixed.** cheapseats.dev answers on both subscriptions and grades through the API with a small model, so grading is the whole bill.

Prompts and answers go only to the providers you configure, and every answer, search result and citation stays in your SQLite file. See [Self-hosting](../self-hosting/) and [Configuration](../configuration/#answerers).

## Where the money goes

| what | runs on | billed |
| --- | --- | --- |
| Cheap Seats | your machine or your host | free (MIT); hosting is whatever your host charges |
| **answering** your prompts | `claude-code` or `codex` CLIs, or the `anthropic` or `openai` APIs | your existing Claude or ChatGPT subscription, or per token |
| **grading** every answer | the Anthropic API (`[grader]`) | per token |
| **the fix list**, once per run | the Anthropic API (`[analyst]`) | per token |
| **the theme pass**, once per run | the Anthropic API (`[grader]`) | per token: under a cent a run with Claude Haiku |
| **`cheapseats suggest-prompts`**, when you ask | the Anthropic API (`[analyst]`) | per token: one call |
| **prompt review**, and its proposed edits when you ask | Cheap Seats itself; the edits through `[analyst]` | free; proposed edits are one call |
| **re-grading** stored answers, when you ask | the grader | one grader call per answer: $0 on `claude-code`, per token through the API |
| **adaptive sampling** extras, if on | the same answerers | like any other answer; API extras only within today's budget |
| **site audit, citation check, AI crawlers** | plain HTTP and your logs | free: no model calls |

Claude is required, through a subscription or an API key; ChatGPT is optional. Grading, the theme pass, the fix list and prompt suggestions go through the Anthropic API by default, or with `provider = "claude-code"` through the `claude` CLI on your subscription, so a laptop can run with no API key at all. Subscriptions work only where the `claude` and `codex` CLIs are installed: on your own machine or a VM, not in the Docker image. See [Running on your subscriptions](../getting-started/#running-on-your-subscriptions).

## What a real run cost

Cheap Seats' own run of its *Choosing an AI visibility tool* set on 21 October 2026 (run `r-20261021-200546-84c081`): 17 prompts, two answerers on subscriptions (Claude Opus through `claude-code`, `gpt-6.1-sol` through `codex`), one search and one recall answer each, so **68 answers**.

**Grading: $0.033 for the whole run.** The grader is `claude-haiku-5-5` at $0.10 per million input tokens and $0.50 per million output. The 68 grades cost $0.0326 in all, about $0.0005 each; the most expensive was $0.0009.

**Answering: $0 extra**, on the subscriptions. Every answer still records the tokens it used, so here is what the same tokens would have cost at the API prices in `[pricing]` (Opus $4 in / $20 out / $0.20 cache read / $5 cache write per million; `gpt-6.1-sol` $2 / $10 / $0.10; searches $10 per 1,000):

| answerer and track | answers | at API prices | per answer |
| --- | ---: | ---: | ---: |
| Claude Opus, search | 17 | $1.63 | $0.096 |
| Claude Opus, recall | 17 | $0.59 | $0.035 |
| `gpt-6.1-sol`, search | 17 | $1.40 | $0.082 |
| `gpt-6.1-sol`, recall | 17 | $0.16 | $0.009 |
| **all** | **68** | **$3.78** | **$0.056** |

One answer worked through, a Claude Opus search answer: 4 input tokens × $4/M + 2,585 output × $20/M + 3,373 cache reads × $0.20/M + 3,479 cache writes × $5/M + 2 searches × $10/1,000 = $0.00002 + $0.0517 + $0.0007 + $0.0174 + $0.02 = **$0.090**.

These are the CLIs' own token counts priced at API rates, not an API bill: an `anthropic` or `openai` answerer sends a different prompt, so its counts will differ. Read them as the order of magnitude. Search answers cost more than recall: the searches themselves are $10 per 1,000, and the results they bring back are input.

**The fix list** adds one `claude-opus-5-5` call per run ($4 / $20 per million tokens). **The theme pass** adds one more grader call, under a cent with Claude Haiku at the prices above; `[grader] themes = false` skips it.

So, per run of a 17-prompt set with two answerers, one sample per track:

| answering on | per run, before the fix list | the same set daily for 30 days |
| --- | ---: | ---: |
| subscriptions | $0.03 | about $1 |
| APIs, at the prices above | about $3.81 | about $114 |

cheapseats.dev runs its sets weekly, on subscriptions.

### An 11-prompt set, graded twice

Cheap Seats' *head to heads* set is 11 prompts. Its run on 22 October 2026 (run `r-20261022-051238-0c6344`), the same two subscription answerers, one search and one recall answer each, is **44 answers**, answered for $0 extra. Those 44 answers were then re-graded twice the same day, after grader changes, each time through the API with `claude-haiku-5-5`:

| re-grade of 44 answers | cost | per answer |
| --- | ---: | ---: |
| first | $0.031 | $0.0007 |
| second | $0.036 | $0.0008 |

So a daily run of an 11-prompt set on both tracks, with two models on subscriptions, costs about **three to four cents a day in grading**, and about a dollar a month. At API prices the answering would add about $2.50 a run (44 answers at the $0.056 average above), so about $75 a month daily.

### Estimate your own

Answers a day = prompts × tracks × answerers × samples. Two tracks and two answerers at one sample each is four answers a prompt. Then, from the runs above:

- **Grading:** about $0.0005 to $0.0008 an answer with Claude Haiku through the API, or $0 on `claude-code`.
- **Answering through the APIs:** about $0.06 an answer on average, search answers near $0.09 and recall answers $0.01 to $0.035; or $0 on subscriptions.
- **Per run:** one fix-list call, a few cents with Claude Opus, and one theme call, under a cent.

A 20-prompt set, four answers a prompt, is 80 answers a day: about **$0.06 a day on subscriptions**, grading only, or **about $5 a day through the APIs**. The `start_run` dry run (below) estimates a real set from its own recent answers.

## The daily budget

```toml
[budget]
daily_usd = 40.0
reservation_usd = 0.60
concurrency = 6
```

- **`daily_usd`** is the most Cheap Seats may spend on API calls in a UTC day, across every run, answer, grade, re-grade, theme pass, fix list, prompt suggestion and search probe.
- **`reservation_usd`** is what each call reserves before it goes out (default $0.60).
- **`concurrency`** is how many API calls may be in flight at once.

Before every API call, Cheap Seats reserves `reservation_usd` in a SQLite ledger, and only if today's spend plus that reservation stays within `daily_usd`. When the response comes back it settles the entry to the call's real cost, from the token counts in the response and the prices in `[pricing]`. If the cost can't be read, the reservation stays on the books, so an unknown is never counted as free.

When a reservation would go over the cap, the call isn't made and the run stops with status **`budget`**: *"stopped: today's spend reached the $40 daily budget; retry tomorrow to finish"*. What it had finished is kept; retrying it the next day finishes the rest. Today's spend against the cap is shown on the home page and on each prompt set's page.

Things to know:

- **It's an admission limit, not a billing cap.** A call is admitted on its reservation, and one call can cost more than that, so the day can end slightly over. Set spending limits with your providers too.
- **Subscription answers cost $0** in the ledger and don't count against the budget; only their grading does.
- **`daily_usd = 0`, or no `[budget]` at all, means no cap.** Set it.
- A model with no price in `[pricing]` can't be called, so nothing goes out unpriced. Check the prices against the providers' current price lists; the cost figures are only as right as they are.

## What a re-grade costs

[Re-grading](../regrading/) grades a set's stored answers again under today's grader: one grader call per answer, and nothing is asked again.

- **On `provider = "claude-code"`** it's $0, on your subscription.
- **Through the API**, `cheapseats regrade` and the set's **Re-grade stored answers** page are dry runs first: they show the runs, answers and estimated cost, from the answers' token counts (about four characters a token, plus the grader's thinking) priced by `[pricing]`. At the grading cost measured above, about $0.0005 an answer, re-grading the 68 answers of one run is about three cents.
- **It's budgeted like a run.** The real calls go through the same daily budget, and a run the day's remaining budget can't cover isn't started.

A `start_run` dry run (MCP, or `POST /api/runs` with `"dry_run": true`) estimates a run's cost the same way, from each answerer's recent answers and their grading, with today's remaining budget beside it.

## Keeping the spend down

- **Answer on subscriptions** where you can. On cheapseats.dev, both answerers are subscription CLIs, and grading is the only API spend.
- **Run weekly.** `[tiers.core] every_days` and `[tiers.plg] every_days` set how often the schedule runs each tier. Recall only moves when models change, and search over days to weeks, so daily mostly buys a smoother trend line at seven times the answers. cheapseats.dev runs both tiers weekly.
- **Fewer samples.** `samples = { search = 2, recall = 1 }` per answerer is three answers per prompt; `[tiers.plg] max_samples = 1` caps a tier at one.
- **A cheap grader.** The grader reads every answer; the analyst runs once a run. Use a small model for `[grader]`.
- **Leave the schedule off** on a dev machine: without `schedule.daily_hour_utc`, nothing runs unless you start it.
- **Spend extra answers where they help.** Instead of raising `samples` everywhere, `[sampling] adaptive = true` with `max_extra = N` adds at most N answers to a core run, on the prompts whose rate is least certain, and only within today's budget on API answerers. It's off by default. The set's page says whether your samples are buying precision; see [How big a change Cheap Seats can detect](../noise-and-confidence/#when-more-samples-help).
- **Start with the free checks.** `cheapseats audit`, `cheapseats check-citations` and `cheapseats crawl` make no model calls. See [Free site checks](../site-audit/).

See [Configuration](../configuration/#budget) for the rest of `cheapseats.toml`.

## Cheap Seats or Otterly.AI on a startup budget

Otterly.AI's [pricing page](https://otterly.ai/pricing), as of October 2026, lists **Lite at $29 a month** ($25 with its 15% annual discount): 15 search prompts, tracked daily across ChatGPT, Google AI Overviews, Perplexity and Microsoft Copilot. Claude, Gemini and Google AI Mode are paid add-ons on every plan: Claude is $29 a month on Lite, $109 on Standard ($189 a month, 100 prompts) and $439 on Premium.

The same 15 prompts daily in Cheap Seats, on subscriptions, with two answerers and one sample per track, is 60 answers a day. At the grading cost measured above (about $0.0005 an answer), that's about $0.03 a day, roughly $1 over 30 days, plus the fix list and your hosting if you host it.

What decides it isn't the price:

- **Which assistants.** Cheap Seats asks Claude and OpenAI models, directly through their APIs or CLIs. It doesn't cover Google AI Overviews, AI Mode, Gemini, Perplexity or Copilot. If those are where your buyers ask, Cheap Seats won't tell you about them.
- **What you get back.** Cheap Seats asks each question on two tracks, with and without web search, grades whether each answer recommends you, and keeps every answer, search and citation behind each number. Each run ends in a ranked fix list. See [How grading works](../how-grading-works/).
- **Who runs it.** Otterly.AI is a subscription service you sign up for. Cheap Seats is software you run, on your machine or your own host, with your prompt sets in a config repo you own.
