---
title: Cheap Seats vs Elmo
description: "Recommendation grades and judgments of brand portrayal: engines, setup, metrics and history, October 2026."
weight: 60
---
Choose Elmo for consumer surfaces, multi-brand work and competitor sentiment. Choose Cheap Seats for recommendation grades with uncertainty and explicit re-grading. Elmo is Blue Whale Software's MIT-licensed platform and the open core of Elmo Cloud.

## What's different

{{< figure name="compare-elmo" >}}

- **Uncertainty:** Cheap Seats displays intervals and paired comparisons. Elmo's dashboard labels plain rates good/fair/poor; its `aeo` skill explains manual margins and inconclusive changes.
- **Fix scope:** Elmo's Opportunities model cannot see page contents; it proposes sources, communities and angles. Cheap Seats proposes specific pages and measures subsequent attempts ([workflow](/docs/fix-to-pull-request/)).

## Side by side

As of October 2026, from Cheap Seats' docs and Elmo's own [README](https://github.com/elmohq/elmo/blob/cb6bf6e984cfa5f760c02f92775dab25745f575e/README.md), [providers](https://www.elmohq.com/docs/user-guide/providers), [visibility](https://www.elmohq.com/docs/user-guide/visibility), [configuration](https://www.elmohq.com/docs/developer-guide/configuration) and [pricing](https://www.elmohq.com/pricing) pages, and its source code at commit [`cb6bf6e`](https://github.com/elmohq/elmo/tree/cb6bf6e984cfa5f760c02f92775dab25745f575e) (version 0.7.4; 0.7.7 of 29 October is current, and its changes since are noted below):

| | Cheap Seats | Elmo |
| --- | --- | --- |
| **License** | MIT | MIT (Blue Whale Software, LLC); contributors sign a CLA |
| **Price** | Free MIT software; API calls or installed subscription CLIs ([cost and budget](/docs/cost-and-budget/)) | Self-hosted free, plus the services it calls. Elmo Cloud: Starter $29 (1 brand, 50 prompts, ChatGPT once a day), Basic $99, Pro $299, Business $649 a month (5 brands, 350 prompts); white-label custom ([plans](https://github.com/elmohq/elmo/blob/cb6bf6e984cfa5f760c02f92775dab25745f575e/packages/config/src/plans.ts)) |
| **Where it runs** | Self-hosted SQLite; Docker, Helm or exe.dev ([self-hosting](/docs/self-hosting/)) | Docker Compose set up by the `@elmohq/cli` package: a web app, a worker on pg-boss, and PostgreSQL. Node 24 images |
| **Engines** | Claude and OpenAI models, through their APIs or the Claude Code and Codex CLIs | Scrapers (Cloro, BrightData, Oxylabs, SearchApi, Olostep, DataForSEO) for ChatGPT, Google AI Mode, AI Overviews, Gemini, Perplexity and Copilot; direct APIs (OpenAI, Anthropic, Mistral, OpenRouter) for Claude, Grok and others |
| **Keys you need** | None on your own machine with a Claude Code subscription; or an Anthropic API key. A TypeSafe key only for its optional Jev passes (name folding, a second opinion on each grade, clustered objections and more), all off without one | A scraper or model API key, a direct LLM key for onboarding and Opportunities, and a key for Jev, which judges mentions and sentiment: TypeSafe's, or since 0.7.5 an OpenRouter key that calls Jev through OpenRouter ([configuration](https://www.elmohq.com/docs/developer-guide/configuration)). The worker won't start without one |
| **Markets** | No location or language setting; prompts are asked as written | Scrapers ask from the US, in English ([source](https://github.com/elmohq/elmo/blob/cb6bf6e984cfa5f760c02f92775dab25745f575e/packages/lib/src/providers/registry/cloro.ts)); countries and languages are [planned](https://github.com/elmohq/elmo/blob/cb6bf6e984cfa5f760c02f92775dab25745f575e/apps/www/src/data/upcoming-features.json) |
| **Your prompts** | TOML in your own git repo, changed by pull request | In the app, from an onboarding wizard that reads your site, or by hand; also over the REST API and MCP. Branded prompts are tagged for you |
| **Web search vs memory** | Search and recall, as separate tracks ([two tracks](/docs/how-grading-works/#two-tracks)) | Chosen per target: scraped surfaces, which mostly search, or model APIs with or without web search ([source](https://github.com/elmohq/elmo/blob/cb6bf6e984cfa5f760c02f92775dab25745f575e/apps/web/src/lib/platform-groups.ts)) |
| **Grading** | Recommended, mentioned or absent; position, top pick, objections and optional fact checking ([how grading works](/docs/how-grading-works/)) | Name candidates, then Jev portrayal judgments, as shown above ([source](https://github.com/elmohq/elmo/blob/cb6bf6e984cfa5f760c02f92775dab25745f575e/apps/worker/src/mention-judge/analyze.ts)) |
| **Sampling** | `samples` per answerer and track, set in your config; optional adaptive extras for the least certain prompts | Each prompt once a day by default, 5 samples per target (`RUNS_PER_PROMPT`); Cloud samples 1 to 4 times a day |
| **Noise** | 95% intervals on named, recommended and top pick; changes tested against noise ([how big a change](/docs/noise-and-confidence/)) | None in the app. Its `aeo` skill gives a \(\pm 2\sqrt{\frac{p(1-p)}{n}}\) rule to apply yourself ([skill](https://github.com/elmohq/elmo/blob/cb6bf6e984cfa5f760c02f92775dab25745f575e/skills/aeo/references/measurement.md)) |
| **History** | Grades stay as graded; a change of method is marked on the trend; re-grading is a step you take | Past answers re-judged in place when names or the judge change, 90 days back by default (`REPROCESS_DAYS`); older ones keep their old judgement |
| **What to fix** | Ranked fix briefs; before/after attempt checks ([from fix to pull request](/docs/fix-to-pull-request/)) | Opportunities: one LLM call over a digest of your top 30 prompts, 8 to 12 items in creation, existing content, outreach and social, renewed after 6 days; no outcome tracking ([source](https://github.com/elmohq/elmo/blob/cb6bf6e984cfa5f760c02f92775dab25745f575e/apps/web/src/server/opportunities.ts)) |
| **Brands and teams** | One `[brand]` per config; no agency tier | Unlimited brands self-hosted; Cloud 1 to 5 brands with unlimited seats; white-label adds custom branding, a custom domain and SSO |
| **Reports and API** | Web UI, CLI, JSON API, MCP server, and [read-only share links](/docs/sharing/) to a run | REST API with TypeScript and Python SDKs; MCP server; a report generator with shareable links, for admin users and [not on Elmo Cloud](https://github.com/elmohq/elmo/blob/cb6bf6e984cfa5f760c02f92775dab25745f575e/packages/deployment/src/deployment.ts) |
| **Site checks** | Free site audit, citation check and AI crawler counts from your logs | The README says Elmo doesn't do crawler analytics or on-page audits today; site audits are planned |

Self-hosted Elmo calls paid services from the first answer. Its providers page estimates scrapers at $0.15–$2.25 per prompt/month for about 300 evaluations, and direct APIs at $2–$5 per tracked model per prompt/month. Its README puts Jev at $0.15–$0.35 per 1,000 answers, or $2–$4/month for 25 prompts on 3 platforms. These assume five samples per target/day; `RUNS_PER_PROMPT=1` cuts that bill fivefold but makes day-to-day results noisier ([configuration](https://www.elmohq.com/docs/developer-guide/configuration)).

## What's the same

Both retain raw answers and evidence passages, distinguish branded prompts and separate search-backed from no-search answers. Jev is required for Elmo's judgments and [optional for Cheap Seats](/docs/optional-providers/).

Both use Bray–Curtis similarity for host-level citation stability. Elmo feeds this into Opportunities as prompt “difficulty”; Cheap Seats reports it per set ([Elmo code](https://github.com/elmohq/elmo/blob/cb6bf6e984cfa5f760c02f92775dab25745f575e/apps/web/src/lib/visibility-stats.ts), [Cheap Seats metric](/docs/metrics/#citation-stability)).

## How the numbers differ

[Metric definitions](/docs/comparing-metrics/) has the full table. The consequential differences:

- **Visibility.** Elmo uses each prompt's latest answers; Cheap Seats pools every graded answer in the run. Both exclude name-only disclaimers. Elmo counts a link to your site as a mention; Cheap Seats grades answer text, not citations.
- **Recommended.** Elmo includes recommendations in positive sentiment, without a separate recommended rate. Cheap Seats distinguishes endorsement from being named.
- **Share of voice.** Elmo divides your mentions by yours plus your tracked competitors'. Cheap Seats divides by every product the answers named, so adding a competitor to your config doesn't change your share.
- **Position.** Elmo averages where you rank among the tracked companies an answer names; Cheap Seats counts every product named.
- **Sentiment.** Elmo scores positive 100, neutral and mixed 50, negative 0, on a 0 to 100 scale, for you and each tracked competitor. Cheap Seats' net sentiment is the share positive minus the share negative, from −100 to +100, for your brand only.

## Start with Cheap Seats if…

You want checkable recommendation grades, uncertainty and controlled re-grading. Local subscription CLIs can avoid API charges ([cost and budget](/docs/cost-and-budget/)).

## When to move to Elmo

- **You need consumer surfaces.** Elmo scrapes ChatGPT, Google AI Mode and AI Overviews, Gemini, Perplexity and Copilot; Cheap Seats asks [Claude and OpenAI models directly](/docs/engines/).
- **You work across brands or clients.** Beyond the team limits in the table, self-hosted or white-label Elmo generates a report from any brand's name and website ([source](https://github.com/elmohq/elmo/blob/cb6bf6e984cfa5f760c02f92775dab25745f575e/apps/worker/src/report-worker.ts)).
- **You need competitor sentiment.** Elmo judges each tracked competitor's sentiment, place and evidence passage, charted by engine ([sentiment](https://www.elmohq.com/docs/user-guide/sentiment)). Cheap Seats grades your brand; competitors get share of voice, place and head-to-head counts.
- **You want to build on it.** Elmo has TypeScript and Python [SDKs](https://www.elmohq.com/docs/api/sdks) over its REST API, organization API keys you can limit to read-only and to chosen brands, and a PostgreSQL database you can query directly.
- **You need query fan-out from more engines.** Both show searches, prompt-word changes and whether your sites returned. Where providers expose searches, Elmo adds ChatGPT's app, Perplexity and Copilot ([providers](https://www.elmohq.com/docs/user-guide/providers)); Cheap Seats covers [Claude and OpenAI models](/docs/reading-results/#what-the-assistants-searched).

Elmo has a live [demo](https://demo.elmohq.com) and publishes scraper reliability checks; its providers page discloses affiliate links.

Since the pinned 0.7.4, Elmo's [changelog](https://www.elmohq.com/changelog) adds: Jev through OpenRouter when no TypeSafe key is set (0.7.5), Kimi on Elmo Cloud and an `/api/health` endpoint (0.7.6), and a citation flow chart showing which engines cite which sections of a domain, with a paginated citation API (0.7.7). None of it changes the table above.

## Taking your prompts with you

Copy your prompt text from TOML: paste them into Elmo's prompt settings, or send them through its [`create_prompts`](https://www.elmohq.com/docs/api/mcp) MCP tool or REST API.

[All comparisons](/compare/).
