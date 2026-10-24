---
title: Cheap Seats vs Limelit Open
description: "Cheap Seats (MIT) and Limelit Open (Apache-2.0) are free, self-hosted AI visibility trackers: engines, detection, metrics and history, October 2026."
weight: 70
---

Cheap Seats (cheapseats.dev) is a personal open-source project: its author wrote it to make his own product better, drawing on lots of inspiration, Gauge first among them. It's MIT licensed, free and always will be, with no hosted tier, and it runs on the Claude subscription you already have. Limelit Open is another free, open-source tracker: a single Go binary with SQLite, under Apache-2.0, built MCP-first, and the open core of Limelit Cloud, a hosted product sold in prepaid credit packs. The two take different approaches. Limelit Open asks seven engines, ChatGPT, Claude, Perplexity and Gemini through their APIs, and Google AI Overviews, AI Mode and Bing Copilot through scrapers, and finds your brand with a deterministic text search rather than a model. Cheap Seats asks only Claude and OpenAI models, through their APIs or the Claude Code and Codex CLIs, has a Claude call grade every answer recommended, mentioned or absent, puts an interval on every number, and ends each run with a ranked fix list. Limelit does several things better; this page says which.

## Side by side

As of October 2026, from Cheap Seats' docs and Limelit's own [README](https://github.com/limelit-co/open/blob/982668c4b3974558d900565f4a10bf9bf4e2dc88/README.md), [methodology](https://github.com/limelit-co/open/blob/982668c4b3974558d900565f4a10bf9bf4e2dc88/docs/methodology.md), [MCP tool catalog](https://github.com/limelit-co/open/blob/982668c4b3974558d900565f4a10bf9bf4e2dc88/docs/tools.md), [providers](https://github.com/limelit-co/open/blob/982668c4b3974558d900565f4a10bf9bf4e2dc88/docs/providers.md), [releases](https://github.com/limelit-co/open/releases), [Limelit Open](https://limelit.co/open) and [pricing](https://limelit.co/pricing) pages, and its code at the same commit:

| | Cheap Seats | Limelit Open |
| --- | --- | --- |
| **License** | MIT | Apache-2.0; contributions under the DCO, no CLA |
| **Price** | Free; runs on your existing Claude subscription (ChatGPT optional) | Free; bring your own provider keys, or start on a free Limelit Cloud allowance. Limelit Cloud sells credit packs from $19.99 (2,000 credits) to $399.99 (40,000), with 1,000 credits free on signup |
| **Where it runs** | One Docker container with SQLite, on Docker, Kubernetes (Helm chart) or an exe.dev VM | One binary with SQLite, no Docker, Node or Postgres needed; also `go install` or a Docker image. Pre-release: the newest tag is `v0.1.0-rc.14`, of 1 October |
| **Engines** | Claude and OpenAI models, through their APIs or the Claude Code and Codex CLIs | ChatGPT, Claude, Perplexity and Gemini through vendor APIs; Google AI Overviews and AI Mode through DataForSEO or SearchApi, and Copilot through SearchApi. ChatGPT and Gemini as a person sees them only through the free Limelit Cloud allowance. Four more scrapers and OpenRouter are listed but not built yet |
| **Your prompts** | TOML in your own git repo, changed by pull request | A setup wizard fills up to 14 template prompts from your category and competitors; add more on the Prompts page. `limelit.yaml` holds the brand, competitors and targets |
| **Web search vs memory** | Both, as separate tracks: search must search, recall has no tools; reported separately | The search tool is offered and the model decides whether to use it. An API target and a scraped one on the same engine are tracked apart, never averaged |
| **Grading** | A Claude call grades each answer recommended, mentioned or absent, with position, top pick, every product named, objections, praise and tone; with your facts listed, what each answer got wrong about you | A whole-word search for your brand's name, aliases and domain, and each competitor's name and domain, kept at byte offsets; rank from the list item a name appears in. No model reads the answer |
| **Samples** | `samples` per answerer and track, set in your config | One answer per prompt per target per pass, on demand, daily or hourly |
| **Noise** | A 95% interval on every rate; changes tested against noise | Every number shows `n`, the answers behind it; under 20 it's captioned a small sample, and a grid cell under 5 answers can't take the top colour |
| **History** | Grades stay as graded; a grading change starts a new method on the trend, and you can re-grade stored answers to carry it on | Every stored answer is read again when a brand, a competitor or a matching rule changes, so past numbers follow today's setup |
| **Markets** | Prompts are asked as written; no country or language setting | A country per prompt is passed to the scrapers, but no screen sets one in v0.1; DataForSEO defaults to the United States and English |
| **What to fix** | A ranked fix list every run, and each fix's outcome measured after it ships | Not in the open core; opportunities, sentiment and prompt generation are Limelit Cloud features |
| **Data** | A SQLite file on your machine; prompts go only to the model providers you configure | A SQLite file on your machine; on the free allowance, prompts pass through Limelit Cloud, which keeps the engine and cost, not the prompt or answer |
| **Alerts** | On the exe.dev setup, an email when a run fails, stalls or runs out of budget | None in the open core; digest emails are Limelit Cloud's |
| **API / MCP** | Web UI, CLI, JSON API and MCP server | Dashboard, JSON API and an MCP server whose tools share Limelit Cloud's names. Chart tools that draw inline in MCP Apps hosts are on `main`, not yet in a release |
| **Site checks** | Free site audit, citation check and AI crawler counts from your logs | Two Claude skills, `ai-crawler-check` (robots.txt, through Limelit's free checker) and `llms-txt-check`, in its plugin marketplace |

**What it costs.** Cheap Seats is free and open source (MIT). Claude is required, through a subscription or an API key; ChatGPT (Codex or an OpenAI key) is optional and adds a second assistant's answers. On your own machine, with a Claude Code subscription, answers, grading and the fix list can all run on the claude CLI, with no API key and no extra spend. Host it and you pay your host (and, in a container, API usage, since the image has no CLIs: about $0.03 to grade a 68-answer run, under a daily budget cap). [Cost and budget](/docs/cost-and-budget/) has the details.

Limelit Open has no pricing of its own: you pay your providers directly, and since mention detection is a text search, the answer is the only call you pay for. Its spend guard counts answers, not money: a `runs_per_day` ceiling, 200 by default, checked before a pass starts. Its free start is a Limelit Cloud key, whose allowance reaches ChatGPT, Gemini, Perplexity and Google's AI surfaces, but not Claude ([providers](https://github.com/limelit-co/open/blob/982668c4b3974558d900565f4a10bf9bf4e2dc88/docs/providers.md#the-free-allowance)). Past it, Google's AI surfaces need a DataForSEO or SearchApi account, billed per request. Cloud's [pricing page](https://limelit.co/pricing) puts a prompt refresh across its five standard engines at about 9 credits (about $0.09), more with Claude.

## What's the same

- **Branded prompts stay out of the headline.** Both tag a prompt that names your brand as a whole word, keep it on screen, tagged, and leave it out of the headline rates. Limelit tags it with the same matcher that reads answers; Cheap Seats leads with the unbranded rates and shows the branded ones underneath.
- **Your data is one SQLite file.** Each keeps every answer in a file on your machine, its settings in a file meant for git that never holds a key, and exports everything.
- **Searches are evidence.** Both ask the vendor APIs with their web search tools and store the searches the engine ran beside each answer, so you can see what it looked for.
- **An MCP server built for assistants.** Each has a first tool that says where the instance stands and what to do next (Limelit's `get_active_property`, Cheap Seats' `get_started`), a dry run before anything is spent, and prompt templates of the same shape: a weekly pulse, a competitor radar, and why one prompt isn't cited or recommended.
- **A spend guard before the run.** Limelit refuses a pass that would pass `runs_per_day`; Cheap Seats keeps API spend under a daily budget.
- **A public read-only mode.** `LIMELIT_DEMO=1` and `CHEAPSEATS_READONLY=1` each serve a dashboard anyone can read and nobody can change, with a banner saying so.

## What's different

- **How a mention is found.** Limelit searches the stored text for your name, aliases and domain, and each competitor's name and domain, and stores the byte offsets of each match. Cheap Seats has a Claude call read the whole answer and grade it, then checks the text: an answer that never contains your name or an alias is absent whatever the model said.
- **What counts as named.** In Limelit, "I could not find Acme" is a mention, as its [methodology](https://github.com/limelit-co/open/blob/982668c4b3974558d900565f4a10bf9bf4e2dc88/docs/methodology.md#finding-brands-a-text-search-on-purpose) says, and so is an unrelated product that shares your name. Cheap Seats grades both absent: the first only echoes the question, and the second is told apart by your brand's `about`.
- **Competitor names.** Limelit's competitors have a name and a domain, no aliases ([config](https://github.com/limelit-co/open/blob/982668c4b3974558d900565f4a10bf9bf4e2dc88/internal/config/config.go)), so a rival written another way isn't counted. Cheap Seats folds the aliases you list onto one name.
- **Who is on the board.** Limelit counts only the brands you listed; finding others is a Limelit Cloud feature. Cheap Seats' share of voice counts every product the answers named.

## How the numbers differ

[Metric definitions](/docs/metrics/#how-these-compare-to-other-tools) has the full table. The differences that move a number:

- **Visibility.** Limelit's is the unbranded answers whose text contains your brand string, over unbranded answers. Cheap Seats' named rate is the answers graded recommended or mentioned, over every graded answer, so on the same answers it leaves out the ones that only say they can't find you, and the ones about another product with your name.
- **Recommended.** Cheap Seats grades whether the answer endorses you. Limelit counts whether you appear, with your rank when you're in a list.
- **Share of voice.** Limelit divides your mentions by every tracked brand's mentions in the window's answers, counting each occurrence: an answer that names you once and a rival five times is a 1:5 share. Cheap Seats counts each product once per answer, and over every product the answers named, not only the ones you configured.
- **Position.** Limelit's is the mean rank of the list items your name appears in, each occurrence counted; a mention in prose has no rank. Cheap Seats' avg place is your place among every product an answer names, once per answer.
- **History.** Limelit re-reads every stored answer when you add or rename a brand or a matching rule changes, so a competitor added today is counted in last month's answers. Cheap Seats keeps each run's grades as graded and marks a change of method on the trend; to carry the trend on, you [re-grade](/docs/regrading/) the stored answers, and the replaced grades are kept. One keeps the past comparable with today's setup; the other keeps a past number from moving until you choose.

## Start with Cheap Seats if…

- You want to start at no cost on a subscription you already have, with no provider key, no account elsewhere and nothing routed through a vendor.
- You want each answer graded recommended versus merely mentioned, with reasoning you can check, rather than whether your name appears. That matters most when your name is a common word, or when you're new enough that answers say they can't find you.
- You want what the models find on the web kept apart from what they already believe, and an interval and a noise test on every change.
- You want a ranked fix list that lands as pull requests in your repo, each fix's effect measured afterwards, and free site audits and crawler counts.

## When to move to Limelit

If you outgrow Cheap Seats, do whatever suits you. Its author would suggest [Gauge](/compare/gauge/); that team is great. If what you need is on this list, Limelit Open is a strong choice, and an open-source one:

- **You need Perplexity, Gemini, Google AI Overviews, AI Mode or Copilot.** Limelit Open asks all of them; Cheap Seats asks only Claude and OpenAI models. See [Which AI engines Cheap Seats asks](/docs/engines/).
- **You want the simplest install there is.** One file, no container, a setup wizard that reads your brand from your site, and a first number in about ten minutes.
- **You want numbers anyone can recompute.** A text search gives the same mentions every time, costs nothing per answer, and points at the byte offsets it matched; Limelit publishes a [check](https://github.com/limelit-co/open/blob/982668c4b3974558d900565f4a10bf9bf4e2dc88/docs/qa/overview-from-export.md) that rebuilds every Overview number from its export. Cheap Seats' grades come from a model, which reads better but can disagree with itself on a close call.
- **You want history to follow your setup.** Add a competitor and every past answer is counted for it, with no re-grade to run.
- **You want hourly runs,** or a spend limit counted in answers rather than dollars.
- **You want the charts inside Claude.** Limelit's chart tools draw inline in hosts that support MCP Apps, built from `main` for now. ChatGPT reaches them only through Limelit Cloud: its [ChatGPT guide](https://github.com/limelit-co/open/blob/982668c4b3974558d900565f4a10bf9bf4e2dc88/docs/chatgpt.md) has you sync each run's answers there.
- **You want a hosted path with the same definitions.** Limelit Cloud uses the open core's metric definitions, adds sentiment, prompt generation and multi-brand portfolios, and `limelit upgrade` moves your history there without deleting it here or sending your provider keys.

## Taking your prompts with you

Your prompt sets are plain TOML in your own git repo. Each prompt is a line of text with an id, so the buyer questions you've refined in Cheap Seats are yours. They're plain text you can add on Limelit's Prompts page, in place of or beside its starter pack, and your run history stays in your SQLite file.

See [Getting started](/docs/getting-started/) to run it, or [all comparisons](/compare/).
