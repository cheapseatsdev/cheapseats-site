---
title: Cheap Seats vs Limelit Open
description: "Cheap Seats (MIT) and Limelit Open (Apache-2.0) are free, self-hosted AI visibility trackers: engines, detection, metrics and history, October 2026."
weight: 70
---
Limelit Open is a free, open-source tracker: a single Go binary with SQLite, under Apache-2.0, built MCP-first, and the open core of Limelit Cloud, a hosted product sold in prepaid credit packs. It asks seven engines, ChatGPT, Claude, Perplexity and Gemini through their APIs and Google AI Overviews, AI Mode and Bing Copilot through scrapers, and finds your brand with a deterministic text search rather than a model. [Cheap Seats](/compare/) asks only Claude and OpenAI models and has a Claude call grade every answer. Limelit does several things better; this page says which.

## Side by side

As of October 2026, from Cheap Seats' docs and Limelit's own [README](https://github.com/limelit-co/open/blob/982668c4b3974558d900565f4a10bf9bf4e2dc88/README.md), [methodology](https://github.com/limelit-co/open/blob/982668c4b3974558d900565f4a10bf9bf4e2dc88/docs/methodology.md), [MCP tool catalog](https://github.com/limelit-co/open/blob/982668c4b3974558d900565f4a10bf9bf4e2dc88/docs/tools.md), [providers](https://github.com/limelit-co/open/blob/982668c4b3974558d900565f4a10bf9bf4e2dc88/docs/providers.md), [releases](https://github.com/limelit-co/open/releases), [Limelit Open](https://limelit.co/open) and [pricing](https://limelit.co/pricing) pages, and its code at the same commit:

| | Cheap Seats | Limelit Open |
| --- | --- | --- |
| **License** | MIT | Apache-2.0; contributions under the DCO, no CLA |
| **Price** | Free MIT software; API calls or installed subscription CLIs ([cost and budget](/docs/cost-and-budget/)) | Free; bring your own provider keys, or start on a free Limelit Cloud allowance. Limelit Cloud sells credit packs from $19.99 (2,000 credits) to $399.99 (40,000), with 1,000 credits free on signup |
| **Where it runs** | Self-hosted SQLite; Docker, Helm or exe.dev ([self-hosting](/docs/self-hosting/)) | One binary with SQLite, no Docker, Node or Postgres needed; also `go install` or a Docker image. Pre-release: the newest tag is `v0.1.0-rc.14`, of 1 October |
| **Engines** | Claude and OpenAI models, through their APIs or the Claude Code and Codex CLIs | ChatGPT, Claude, Perplexity and Gemini through vendor APIs; Google AI Overviews and AI Mode through DataForSEO or SearchApi, and Copilot through SearchApi. ChatGPT and Gemini as a person sees them only through the free Limelit Cloud allowance. Four more scrapers and OpenRouter are listed but not built yet |
| **Your prompts** | TOML in your own git repo, changed by pull request | A setup wizard fills up to 14 template prompts from your category and competitors; add more on the Prompts page. `limelit.yaml` holds the brand, competitors and targets |
| **Web search vs memory** | Search and recall, as separate tracks ([two tracks](/docs/how-grading-works/#two-tracks)) | The search tool is offered and the model decides whether to use it. An API target and a scraped one on the same engine are tracked apart, never averaged |
| **Grading** | Recommended, mentioned or absent; position, top pick, objections and optional fact checking ([how grading works](/docs/how-grading-works/)) | A whole-word search for your brand's name, aliases and domain, and each competitor's name and domain, kept at byte offsets; rank from the list item a name appears in. No model reads the answer |
| **Samples** | `samples` per answerer and track, set in your config | One answer per prompt per target per pass, on demand, daily or hourly |
| **Noise** | 95% intervals on named, recommended and top pick; changes tested against noise ([how big a change](/docs/noise-and-confidence/)) | Every number shows `n`, the answers behind it; under 20 it's captioned a small sample, and a grid cell under 5 answers can't take the top colour |
| **History** | Grades stay as graded; a grading change starts a new method on the trend, and you can re-grade stored answers to carry it on | Every stored answer is read again when a brand, a competitor or a matching rule changes, so past numbers follow today's setup |
| **Markets** | Prompts are asked as written; no country or language setting | A country per prompt is passed to the scrapers, but no screen sets one in v0.1; DataForSEO defaults to the United States and English |
| **What to fix** | Ranked fix briefs; before/after attempt checks ([from fix to pull request](/docs/fix-to-pull-request/)) | Not in the open core; opportunities, sentiment and prompt generation are Limelit Cloud features |
| **Data** | A SQLite file on your machine; prompts go only to the model providers you configure | A SQLite file on your machine; on the free allowance, prompts pass through Limelit Cloud, which keeps the engine and cost, not the prompt or answer |
| **Alerts** | On the exe.dev setup, an email when a run fails, stalls or runs out of budget | None in the open core; digest emails are Limelit Cloud's |
| **API / MCP** | Web UI, CLI, JSON API and MCP server | Dashboard, JSON API and an MCP server whose tools share Limelit Cloud's names. Chart tools that draw inline in MCP Apps hosts are on `main`, not yet in a release |
| **Site checks** | Free site audit, citation check and AI crawler counts from your logs | Two Claude skills, `ai-crawler-check` (robots.txt, through Limelit's free checker) and `llms-txt-check`, in its plugin marketplace |

Limelit Open has no pricing of its own: you pay your providers directly, and since mention detection is a text search, the answer is the only call you pay for. Its spend guard counts answers, not money: a `runs_per_day` ceiling, 200 by default, checked before a pass starts. Its free start is a Limelit Cloud key, whose allowance reaches ChatGPT, Gemini, Perplexity and Google's AI surfaces, but not Claude ([providers](https://github.com/limelit-co/open/blob/982668c4b3974558d900565f4a10bf9bf4e2dc88/docs/providers.md#the-free-allowance)). Past it, Google's AI surfaces need a DataForSEO or SearchApi account, billed per request. Cloud's [pricing page](https://limelit.co/pricing) puts a prompt refresh across its five standard engines at about 9 credits (about $0.09), more with Claude.

## What's the same

Both keep answers in SQLite, expose stored search traces, separate branded prompts, provide MCP access and a public read-only mode. Both offer a dry run before spending.

Their limits differ: Limelit gates passes by `runs_per_day`; Cheap Seats reserves estimated API spend against a daily admission budget, then settles actual cost ([budget details](/docs/cost-and-budget/#the-daily-budget)).

## What's different

- **Matching:** Limelit searches names, aliases and domains and stores match offsets. Cheap Seats grades the whole answer, then checks that a name or alias is present.
- **Disclaimers and namesakes:** Limelit's [methodology](https://github.com/limelit-co/open/blob/982668c4b3974558d900565f4a10bf9bf4e2dc88/docs/methodology.md#finding-brands-a-text-search-on-purpose) counts “I could not find Acme” as a mention. Cheap Seats treats that alone as absent and uses brand context to distinguish namesakes.
- **Competitors:** Limelit Open counts configured brands, and its [competitor config](https://github.com/limelit-co/open/blob/982668c4b3974558d900565f4a10bf9bf4e2dc88/internal/config/config.go) has names and domains without aliases. Cheap Seats normalizes configured aliases and includes every product named on its board. Discovery is a Limelit Cloud feature.

## How the numbers differ

[Metric definitions](/docs/comparing-metrics/) has the full table. The differences that move a number:

- **Visibility.** Limelit's is the unbranded answers whose text contains your brand string, over unbranded answers. Cheap Seats' named rate is the answers graded recommended or mentioned, over every graded answer, so on the same answers it leaves out the ones that only say they can't find you, and the ones about another product with your name.
- **Recommended.** Cheap Seats grades whether the answer endorses you. Limelit counts whether you appear, with your rank when you're in a list.
- **Share of voice.** Limelit divides your mentions by every tracked brand's mentions in the window's answers, counting each occurrence: an answer that names you once and a rival five times is a 1:5 share. Cheap Seats counts each product once per answer, and over every product the answers named, not only the ones you configured.
- **Position.** Limelit's is the mean rank of the list items your name appears in, each occurrence counted; a mention in prose has no rank. Cheap Seats' avg place is your place among every product an answer names, once per answer.

## Start with Cheap Seats if…

You want recommendation judgments with checkable evidence, particularly for a common product name. Local subscription CLIs can avoid API charges; [cost and budget](/docs/cost-and-budget/) explains the setup.

## When to move to Limelit

- **You need Perplexity, Gemini, Google AI Overviews, AI Mode or Copilot.** Limelit Open asks all of them; Cheap Seats asks only Claude and OpenAI models. See [Which AI engines Cheap Seats asks](/docs/engines/).
- **You want the simplest install there is.** One file, no container, a setup wizard that reads your brand from your site, and a first number in about ten minutes.
- **You want numbers anyone can recompute.** A text search gives the same mentions every time, costs nothing per answer, and points at the byte offsets it matched; Limelit publishes a [check](https://github.com/limelit-co/open/blob/982668c4b3974558d900565f4a10bf9bf4e2dc88/docs/qa/overview-from-export.md) that rebuilds every Overview number from its export. Cheap Seats' grades come from a model, which reads better but can disagree with itself on a close call.
- **You want history to follow your setup.** Add a competitor and every past answer is counted for it, with no re-grade to run.
- **You want hourly runs,** or a spend limit counted in answers rather than dollars.
- **You want the charts inside Claude.** Limelit's chart tools draw inline in hosts that support MCP Apps, built from `main` for now. ChatGPT reaches them only through Limelit Cloud: its [ChatGPT guide](https://github.com/limelit-co/open/blob/982668c4b3974558d900565f4a10bf9bf4e2dc88/docs/chatgpt.md) has you sync each run's answers there.
- **You want a hosted path with the same definitions.** Limelit Cloud uses the open core's metric definitions, adds sentiment, prompt generation and multi-brand portfolios, and `limelit upgrade` moves your history there without deleting it here or sending your provider keys.

## Taking your prompts with you

Copy your prompt text from TOML: add them on Limelit's Prompts page, in place of or beside its starter pack.

[All comparisons](/compare/).
