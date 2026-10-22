---
title: A free, open-source AI visibility tracker
date: 2026-10-21
author: Chad Metcalf
description: Cheap Seats is a free, MIT-licensed AI visibility tracker you run yourself. What it costs to run, a five-minute quickstart, a real graded answer and fix, and how it compares with HubSpot's AEO Grader, Ahrefs' free checker and Amplitude AI Visibility.
---

**Is there a free AI visibility tracker that's actually useful?** Yes: Cheap Seats is free, open source under the MIT license, and runs as one Docker container with a SQLite database. It asks Claude and OpenAI models your buyers' questions on a schedule, grades whether each answer recommends you, merely mentions you or leaves you out, and ends every run with a ranked list of fixes.

The software costs nothing, and on your own machine it can run entirely on the Claude subscription you already pay for (ChatGPT's too, optionally), with no API key. Through the APIs the model calls are small: one of our own runs, 17 questions and 68 answers answered on subscriptions, cost **$0.03** in grading.

<!--more-->

## What a cheap start looks like

If you're a small startup measuring AI visibility for the first time, you need three things: your buyers' questions, asked of the assistants they use, repeatedly; a judgment on each answer that's stricter than "were we named"; and a list of what to change. Cheap Seats does all three, and here's what each part costs:

- **Answers.** Each question is asked of each assistant on two tracks: **search**, where it must search the web first, and **recall**, from what the model already believes. On a laptop, answerers can be the `claude` and `codex` CLIs on your existing subscriptions, with no API bill. On a server, they're the Anthropic and OpenAI APIs, billed per token.
- **Grading.** Claude Haiku grades every answer, through the API or, with `provider = "claude-code"`, on your Claude subscription. Through the API, grading the 68 answers in the run above cost $0.033 in total; the most expensive single grade was under a tenth of a cent.
- **The fix list.** One Claude Opus call per run: a few cents through the API, or on the subscription.
- **A ceiling.** `budget.daily_usd` caps API spend: every call reserves against it before it goes out.

There are no seats, no per-brand or per-prompt plans, and nothing to cancel. Prompts and answers go only to the model providers you configure.

## Five-minute quickstart

You need Go 1.25 or later and Claude: the `claude` CLI logged in to your Claude subscription, or an Anthropic API key. The `codex` CLI (or an OpenAI key) is optional and adds ChatGPT's answers. On your subscriptions, with no API key:

```bash
git clone https://github.com/cheapseatsdev/cheapseats && cd cheapseats
CHEAPSEATS_CONFIG=examples/cheapseats-config/cheapseats.subscriptions.toml go run ./cmd/cheapseats serve
```

That example config measures Cheap Seats itself, with every model on the CLIs. (With an API key instead: `cp .env.example .env`, fill in `ANTHROPIC_API_KEY`, and run `go run ./cmd/cheapseats serve`.) Then open <http://127.0.0.1:3000>, pick a prompt set and run it. Our 17-question run on subscriptions took under six minutes.

To measure your own brand, start a config repo from the [template](https://github.com/cheapseatsdev/cheapseats-config-template): your brand, competitors and buyer questions, as TOML you change by pull request. [Getting started](/docs/getting-started/) has the details, and [Deploying](/docs/deploying/) covers Docker, the Helm chart and exe.dev.

## A real graded answer

We asked Claude Opus, on the search track, the question this post answers: *"Is there a free AI visibility tracker that's actually useful?"* It searched five times and began: *"Mostly no. As of October 2026, I couldn't find a free tool that tracks your brand across AI engines over time."* It recommended Amplitude AI Visibility, and never named Cheap Seats. Here's the grade:

```text
verdict:   absent
position:  none
top pick:  Amplitude AI Visibility
named:     Amplitude AI Visibility, Google Search Console, Bing Webmaster Tools,
           Ahrefs Free AI Visibility Checker, HubSpot AEO Grader, Ahrefs Brand Radar,
           Otterly.AI, Profound, Trakkr, Semrush AI Visibility, AthenaHQ, …
reasoning: The answer never names Cheap Seats or any of its aliases; it discusses free AI
           visibility trackers and recommends Amplitude AI Visibility.
```

Every answer is graded the same way: **recommended** (the top pick, or one of at most three it actively endorses), **mentioned** (named, but as one of many, in passing or with reservations) or **absent**, with your position, the top pick, every product named and the objections raised. The products named add up to share of voice. Across that run's 68 answers, Peec AI was named in 78% and Profound in 76%, and Cheap Seats was 27th. Every search, result URL and citation behind each answer is kept, so you can check any number on the page against the answers it came from.

## A real fix

Every run ends with **Fix these first**. This was the top fix from that same run, shortened:

> **Publish cheapseats.dev/blog/free-open-source-ai-visibility-tracker with quickstart**
>
> **Where:** cheapseats.dev/blog · **Effort:** small · **Priority:** urgent · **Gap:** documentation
>
> **Why:** On "Is there a free AI visibility tracker that's actually useful?", the top pick was Amplitude AI Visibility, and no Cheap Seats page surfaced in any search.
>
> **Must say:** Cheap Seats is a free, MIT-licensed AI visibility tracker that runs as one Docker container with SQLite, on subscriptions you already pay for or API keys with a daily budget cap. Include a five-minute quickstart, a sample graded answer and fix list, and compare it with HubSpot AEO Grader, Ahrefs' free checker and Amplitude AI Visibility.
>
> **Done when:** a re-run of the free and cheap questions shows this page among the pages that shaped the answers.

You're reading it. Each fix names the page to create or change, what it must say, the questions it should flip and the page it would displace, and comes with a prompt for Claude Code. [From fix to pull request](/docs/fix-to-pull-request/) walks through that loop.

## How it compares with the free options

As of October 2026, from each vendor's own pages:

| | Cheap Seats | [HubSpot AEO Grader](https://www.hubspot.com/aeo-grader) | [Ahrefs AI Visibility Checker](https://ahrefs.com/ai-visibility-checker) | [Amplitude AI Visibility](https://amplitude.com/docs/amplitude-ai/ai-visibility) |
| --- | --- | --- | --- | --- |
| **Free** | The software, always; you pay model calls | Yes; a form for the full report | Yes; no signup | A limited free report; full product in Amplitude plans |
| **Ongoing tracking** | Yes, on a schedule | No, one-time; HubSpot AEO is $50/month | No, one-time; Brand Radar is paid | Yes, in an Amplitude plan |
| **Assistants** | Claude and OpenAI models | GPT-5.4 mini, Perplexity, Gemini | ChatGPT, Gemini, Perplexity, Copilot, AI Overviews, AI Mode | ChatGPT, Google AI Overviews |
| **Your own questions** | Yes, in your git repo | No | No (Brand Radar has custom prompts) | Generated for you |
| **Web search or memory** | Both, graded separately | Training data | Search-backed prompts | Not stated |
| **Recommended vs. mentioned** | Yes | Sentiment and presence scores | Mention counts | Mentions, position, sentiment |
| **What to fix** | A ranked fix list per run | A written interpretation | Top 5 cited pages | Recommendations and content tools |
| **Where your data lives** | Your SQLite file | HubSpot | Ahrefs | Your Amplitude project |

**When to use something else.** Cheap Seats doesn't ask Gemini, Perplexity, Copilot or Google AI Overviews. If those are where your buyers are, Ahrefs' checker covers them in one free snapshot, and Amplitude covers AI Overviews. HubSpot's grader is a quick read on how three models describe you from memory. They pair well: run Cheap Seats for the questions you choose, on a schedule, with fixes, and take a free snapshot of the engines it doesn't cover.

## Try it

The code is on [GitHub](https://github.com/cheapseatsdev/cheapseats), and [Getting started](/docs/getting-started/) takes you from a checkout to your first run.
