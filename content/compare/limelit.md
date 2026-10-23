---
title: Cheap Seats vs Limelit Open
description: Cheap Seats (MIT) and Limelit Open (Apache-2.0) are both free, self-hosted AI visibility trackers. Engines, grading, metrics and history as of October 2026.
weight: 70
---

Cheap Seats (cheapseats.dev) is a personal open-source project: its author wrote it to make his own product better, drawing on lots of inspiration, Gauge first among them. It's MIT licensed, free and always will be, with no hosted tier, and it runs on the Claude subscription you already have. Limelit Open is another free, open-source tracker: a single Go binary with SQLite, under Apache-2.0, built MCP-first, and the open core of Limelit Cloud, a hosted product sold in prepaid credit packs. The two take different approaches. Limelit Open asks seven engines, ChatGPT, Claude, Perplexity and Gemini through their APIs, and Google AI Overviews, AI Mode and Bing Copilot through scrapers, and finds your brand with a deterministic text search rather than a model. Cheap Seats asks only Claude and OpenAI models, through their APIs or the Claude Code and Codex CLIs, has a Claude call grade every answer recommended, mentioned or absent, puts an interval on every number, and ends each run with a ranked fix list. Limelit does several things better; this page says which.

## Side by side

As of October 2026, from Cheap Seats' docs and Limelit's own [README](https://github.com/limelit-co/open/blob/982668c4b3974558d900565f4a10bf9bf4e2dc88/README.md), [methodology](https://github.com/limelit-co/open/blob/982668c4b3974558d900565f4a10bf9bf4e2dc88/docs/methodology.md), [MCP tool catalog](https://github.com/limelit-co/open/blob/982668c4b3974558d900565f4a10bf9bf4e2dc88/docs/tools.md), [Limelit Open](https://limelit.co/open) and [pricing](https://limelit.co/pricing) pages:

| | Cheap Seats | Limelit Open |
| --- | --- | --- |
| **License** | MIT | Apache-2.0; contributions under the DCO, no CLA |
| **Price** | Free; runs on your existing Claude subscription (ChatGPT optional) | Free; bring your own provider keys, or start on a free Limelit Cloud allowance. Limelit Cloud sells credit packs from $19.99 (2,000 credits) to $399.99 (40,000), with 1,000 credits free on signup |
| **Where it runs** | One Docker container with SQLite, on Docker, Kubernetes (Helm chart) or an exe.dev VM | One binary with SQLite, no Docker, Node or Postgres needed; also `go install` or a Docker image. Marked pre-release |
| **Engines** | Claude and OpenAI models, through their APIs or the Claude Code and Codex CLIs | ChatGPT, Claude, Perplexity and Gemini through vendor APIs with web search on; Google AI Overviews, AI Mode and Bing Copilot through scrapers (DataForSEO, SearchApi and others) |
| **Your prompts** | TOML in your own git repo, changed by pull request | A setup wizard fills a starter pack from your category; add more on the Prompts page. `limelit.yaml` holds the brand, competitors and targets |
| **Web search vs memory** | Both, as separate tracks (search and recall), reported separately | Web search on; an API target and a scraped target on the same engine are tracked separately, never averaged |
| **Grading** | A Claude call grades each answer recommended, mentioned or absent, with position, top pick, every product named, objections, praise and tone; with your facts listed, what each answer got wrong about you | A deterministic search for your brand's and competitors' names, aliases and domains; rank from the list item a name appears in. No model reads the answer |
| **Samples** | `samples` per answerer and track, set in your config | One answer per prompt per target per pass, on demand, daily or hourly |
| **Confidence** | A 95% interval on every rate; changes tested against noise | Every number shows `n`, the answers behind it; under 20 it's captioned a small sample |
| **What to fix** | A ranked fix list every run, and each fix's outcome measured after it ships | Not in the open core; opportunities, sentiment and prompt generation are Limelit Cloud features |
| **API / MCP** | Web UI, CLI, JSON API and MCP server | Dashboard, JSON API and an MCP server whose tools share Limelit Cloud's names, with charts drawn inline in hosts that support MCP Apps |
| **Site checks** | Free site audit, citation check and AI crawler counts from your logs | Two Claude skills, `ai-crawler-check` (robots.txt) and `llms-txt-check`, in its plugin marketplace |

**What it costs.** Cheap Seats is free and open source (MIT). Claude is required, through a subscription or an API key; ChatGPT (Codex or an OpenAI key) is optional and adds a second assistant's answers. On your own machine, with a Claude Code subscription, answers, grading and the fix list can all run on the claude CLI, with no API key and no extra spend. Host it and you pay your host (and, in a container, API usage, since the image has no CLIs: about $0.03 to grade a 68-answer run, under a daily budget cap). [Cost and budget](/docs/cost-and-budget/) has the details.

Limelit Open has no pricing of its own: you pay your providers directly, and since mention detection is a text search, the answer is the only call you pay for. Its free start is a Limelit Cloud key, whose allowance reaches ChatGPT, Gemini, Perplexity and Google's AI surfaces; your prompts then pass through Limelit Cloud to the engines. Cloud's pricing page puts a prompt refresh across its five standard engines at about 9 credits (about $0.09), more with Claude.

## How the numbers differ

[Metric definitions](/docs/metrics/#how-these-compare-to-other-tools) has the full table. The differences that move a number:

- **Visibility.** Limelit's is the answers whose text contains your brand string, over unbranded answers. Its methodology is candid that a sentence such as "I could not find Acme" counts as a mention, because telling otherwise needs a model. Cheap Seats' named rate counts that answer too, but its grader marks it mentioned rather than recommended, and records why.
- **Recommended.** Cheap Seats grades whether the answer endorses you. Limelit counts whether you appear, with your rank when you're in a list.
- **Share of voice.** Limelit divides your mentions by every tracked brand's mentions in the same answers, counting each occurrence: an answer that names you once and a rival five times is a 1:5 share. Cheap Seats counts each product once per answer, and over every product the answers named, not only the ones you configured.
- **Position.** Limelit's is the mean rank of the list items you appear in; a mention in prose has no rank. Cheap Seats' avg place is your place among every product an answer names.
- **History.** Limelit re-reads every stored answer when you add or rename a brand or a matching rule changes, so a competitor added today is counted in last month's answers. Cheap Seats keeps each run's grades as graded and marks a change of method on the trend instead. Each choice has a cost: one keeps the past comparable with today's setup, the other keeps a past number from moving.

## Start with Cheap Seats if…

- You want to start at no cost on a subscription you already have, with no provider key and no account elsewhere.
- You want each answer graded recommended versus merely mentioned, with reasoning you can check, rather than whether your name appears.
- You want what the models find on the web kept apart from what they already believe, and an interval and a noise test on every change.
- You want a ranked fix list that lands as pull requests in your repo, each fix's effect measured afterwards, and free site audits and crawler counts.

## When to move to Limelit

If you outgrow Cheap Seats, do whatever suits you. Its author would suggest [Gauge](/compare/gauge/); that team is great. If what you need is on this list, Limelit Open is a strong choice, and an open-source one:

- **You need Perplexity, Gemini, Google AI Overviews, AI Mode or Copilot.** Limelit Open asks all of them; Cheap Seats asks only Claude and OpenAI models. See [Which AI engines Cheap Seats asks](/docs/engines/).
- **You want the simplest install there is.** One file, no container, a setup wizard that reads your brand from your site, and a first number in minutes.
- **You want numbers anyone can recompute.** A text search gives the same mentions every time, costs nothing per answer, and points at the byte offsets it matched. Cheap Seats' grades come from a model, which reads better but can disagree with itself on a close call.
- **You want the charts inside Claude or ChatGPT.** Limelit's MCP tools draw charts inline in hosts that support MCP Apps.
- **You want a public read-only demo** of your own instance: set `LIMELIT_DEMO=1`, as [demo.limelit.co](https://demo.limelit.co) does.
- **You want a hosted path with the same definitions.** Limelit Cloud uses the open core's metric definitions, adds sentiment, prompt generation and multi-brand portfolios, and `limelit upgrade` moves your history there without deleting it here.

## Taking your prompts with you

Your prompt sets are plain TOML in your own git repo. Each prompt is a line of text with an id, so the buyer questions you've refined in Cheap Seats are yours. They're plain text you can add on Limelit's Prompts page, in place of or beside its starter pack, and your run history stays in your SQLite file.

See [Getting started](/docs/getting-started/) to run it, or [all comparisons](/compare/).
