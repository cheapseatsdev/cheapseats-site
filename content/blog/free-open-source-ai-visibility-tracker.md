---
title: A free, open-source AI visibility tracker
date: 2026-10-21
author: Chad Metcalf
description: "A free, MIT-licensed AI visibility tracker you run yourself: what it costs, a five-minute quickstart, a real graded answer and fix, and the free checkers."
---

**Is there a free AI visibility tracker that's actually useful?** Yes: Cheap Seats is free, open source under the MIT license, and can run as one Docker container with SQLite. It asks Claude and OpenAI models your buyers' questions on a schedule, grades whether each answer recommends you, merely mentions you or leaves you out, and ends every run with a ranked list of fixes.

The software costs nothing, and on your own machine it can run entirely on the Claude subscription you already pay for (ChatGPT's too, optionally), with no API key. In one measured run, subscription answerers produced 68 answers to 17 questions; API grading alone cost **$0.03**. Analysis and optional passes are separate.

<!--more-->

## What a cheap start looks like

Budget separately for answering, grading and analysis:

- **Answers.** Each question is asked of each assistant on two tracks: **search**, where it must search the web first, and **recall**, from what the model already believes. On a laptop, answerers can be the `claude` and `codex` CLIs on your existing subscriptions, with no API bill. API answerers are billed by the providers; subscription CLIs require a machine or VM where they're installed and logged in.
- **Grading.** The configured Claude grader reads every answer, through the API or, with `provider = "claude-code"`, on your Claude subscription. Through the API, grading the 68 answers in the run above cost $0.033 in total; the most expensive single grade was under a tenth of a cent.
- **Analysis.** Theme and fix-list passes also use the configured Claude provider. Optional passes can add costs; see [Cost and budget](/docs/cost-and-budget/).
- **Admission control.** Each API call reserves against `budget.daily_usd` before starting. Settled costs can exceed the reservation; it is not a guaranteed final-bill ceiling.

There are no software seats or per-prompt plans. Subscription usage limits still apply, and optional providers may charge separately.

## Five-minute quickstart

Choose the route that matches your model access:

| Route | What you need | Model costs |
| --- | --- | --- |
| [Go with subscriptions](/docs/getting-started/#go-with-subscriptions) | Go 1.27+ and an installed, logged-in `claude` CLI; `codex` is optional. | No API spend; calls share your subscription allowance. |
| [Docker with API keys](/docs/getting-started/#docker-with-api-keys) — quickest API setup | Docker and an Anthropic API key; an OpenAI key is optional. No Go installation. | Paid API usage. |

The Docker image has neither subscription CLI. Both routes start with Cheap Seats itself as the example brand. Pick a prompt set in the web UI and run it. Our 17-question run on subscriptions took under six minutes.

To [measure your own brand](/docs/getting-started/#measure-your-own-brand), use `init` on the Go/subscription route or edit the API config template on the Docker route. Your brand, competitors and buyer questions live in TOML you change by pull request. [Deploying](/docs/deploying/) covers Docker, the Helm chart and exe.dev.

## A real graded answer

{{< figure name="tracker-answer" >}}

The grader distinguishes active endorsement from a passing mention and retains its evidence. Across that run's 68 answers, Peec AI was named in 78% and Profound in 76%; Cheap Seats ranked 27th. Stored answers, returned results and citations let you inspect the numbers. See [the grade definitions](/guides/mentioned-vs-recommended/).

## A real fix

The top item in that run's **Fix these first** list:

{{< figure name="tracker-fix" >}}

You're reading it. Fixes also identify target prompts and the page to displace, and include a prompt for Claude Code. [From fix to pull request](/docs/fix-to-pull-request/) walks through that loop.

## How it compares with the free options

As of October 2026, from each vendor's own pages:

| | Cheap Seats | [HubSpot AI Search Grader](https://www.hubspot.com/ai-search-grader) | [Ahrefs AI Visibility Checker](https://ahrefs.com/ai-visibility-checker) | [Amplitude AI Visibility](https://amplitude.com/docs/amplitude-ai/ai-visibility) |
| --- | --- | --- | --- | --- |
| **Free** | The software; model/provider usage depends on setup | Yes; a form for the full report | Yes; no signup | A limited free report; full product in Amplitude plans |
| **Ongoing tracking** | Yes, on a schedule | No, one-time; HubSpot AEO is $50/month | No, one-time; Brand Radar is paid | Yes, in an Amplitude plan |
| **Assistants** | Claude and OpenAI models | GPT-5.4 mini, Perplexity, Gemini | ChatGPT, Gemini, Perplexity, Copilot, AI Overviews (AI Mode in a separate free tracker) | ChatGPT, Google AI Overviews |
| **Your own questions** | Yes, in your git repo | No | No (Brand Radar has custom prompts) | Generated for you; editable |
| **Web search or memory** | Both, graded separately | Training data | Search-backed prompts | Not stated |
| **Recommended vs. mentioned** | Yes | Sentiment and presence scores | Mention counts | Mentions, position, sentiment |
| **What to fix** | A ranked fix list per run | A written interpretation | Top 5 cited pages | Recommendations and content tools |
| **Where your data lives** | Your SQLite file | HubSpot | Ahrefs | Your Amplitude project |

**When to use something else.** Cheap Seats doesn't ask Gemini, Perplexity, Copilot or Google AI Overviews. If those are where your buyers are, Ahrefs' checker covers them in one free snapshot, and Amplitude covers AI Overviews. HubSpot's grader is a quick read on how three models describe you from memory. They pair well: run Cheap Seats for the questions you choose, on a schedule, with fixes, and take a free snapshot of the engines it doesn't cover.

## Try it

The code is on [GitHub](https://github.com/cheapseatsdev/cheapseats), and [Getting started](/docs/getting-started/) takes you from a checkout to your first run.
