---
title: Cheap Seats vs Limelit Open
description: "Recommendation judgments and reproducible name counts: engines, setup, history and open-core limits, October 2026."
weight: 70
---
Choose Limelit Open for broader engine coverage, reproducible text matching and a single-binary install. Choose Cheap Seats for recommendation judgments, uncertainty and measured fix attempts. Limelit Open is Apache-2.0 software with SQLite and MCP access; its hosted counterpart, Limelit Cloud, sells prepaid credits.

## What's different

{{< figure name="compare-limelit" >}}

Cheap Seats grades the whole answer, uses brand context to reject namesakes, then checks for a name or alias. Limelit's [text search](https://github.com/limelit-co/open/blob/982668c4b3974558d900565f4a10bf9bf4e2dc88/docs/methodology.md#finding-brands-a-text-search-on-purpose) stores match offsets. Its [competitor config](https://github.com/limelit-co/open/blob/982668c4b3974558d900565f4a10bf9bf4e2dc88/internal/config/config.go) accepts names and domains, without aliases; discovery is a Cloud feature.

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

Limelit Open charges no license fee or separate grading call. Its `runs_per_day` ceiling defaults to 200 answers, checked before a pass starts. The free Cloud allowance covers ChatGPT, Gemini, Perplexity and Google's AI surfaces, not Claude ([providers](https://github.com/limelit-co/open/blob/982668c4b3974558d900565f4a10bf9bf4e2dc88/docs/providers.md#the-free-allowance)). Beyond it, Google's surfaces need DataForSEO or SearchApi, billed per request. Cloud estimates about 9 credits ($0.09) per prompt refresh across five standard engines, more with Claude ([pricing](https://limelit.co/pricing)).

## What's the same

Both keep answers in SQLite, expose search traces, separate branded prompts, provide MCP and public read-only access, and offer a dry run.

Unlike Limelit's answer ceiling, Cheap Seats reserves estimated API spend against a daily admission budget, then settles actual cost ([details](/docs/cost-and-budget/#the-daily-budget)).

## How the numbers differ

[Metric definitions](/docs/comparing-metrics/) has the full table. Beyond the examples above:

- **Visibility.** Limelit divides unbranded answers containing your brand string by unbranded answers. Cheap Seats divides answers graded recommended or mentioned by every graded answer, excluding name-only disclaimers and namesakes.
- **Recommended.** Cheap Seats distinguishes endorsement; Limelit has no recommendation judgment.
- **Share of voice.** Besides the occurrence/product distinction above, Limelit counts only configured brands. Cheap Seats includes every product named, whether configured or not.
- **Position.** Limelit averages list-item ranks, counting each occurrence; prose mentions have no rank. Cheap Seats counts your place among every product named, once per answer.

## Start with Cheap Seats if…

You need recommendation evidence, especially for a common product name. Local subscription CLIs can avoid API charges ([cost and budget](/docs/cost-and-budget/)).

## When to move to Limelit

- **You need more engines.** Limelit adds Perplexity, Gemini, Google AI Overviews, AI Mode and Copilot to [Cheap Seats' Claude and OpenAI coverage](/docs/engines/).
- **You want a single-file install.** No container required; the wizard reads your brand from your site, with a first number in about ten minutes.
- **You need reproducible counts.** Limelit publishes a [check](https://github.com/limelit-co/open/blob/982668c4b3974558d900565f4a10bf9bf4e2dc88/docs/qa/overview-from-export.md) that rebuilds every Overview number from its export. Cheap Seats' model grades can vary on close calls.
- **You want history to follow your setup.** Adding a competitor recounts every stored answer automatically.
- **You need hourly runs** or an answer-count spending guard.
- **You want inline charts in MCP Apps hosts such as Claude.** Build from `main` for now. ChatGPT requires syncing answers to Cloud ([guide](https://github.com/limelit-co/open/blob/982668c4b3974558d900565f4a10bf9bf4e2dc88/docs/chatgpt.md)).
- **You want a hosted path.** Cloud keeps the same metric definitions and adds sentiment, prompt generation and multi-brand portfolios. `limelit upgrade` copies history without deleting it locally or sending provider keys.

## Taking your prompts with you

Copy your prompt text from TOML: add them on Limelit's Prompts page, in place of or beside its starter pack.

[All comparisons](/compare/).
