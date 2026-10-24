---
title: Cheap Seats vs Elmo
description: Cheap Seats and Elmo are both MIT-licensed, self-hosted AI visibility trackers. Engines, keys, grading, metrics and history, October 2026, and when to move.
weight: 60
---

Cheap Seats (cheapseats.dev) is a personal open-source project: its author wrote it to make his own product better, drawing on lots of inspiration, Gauge first among them. It's MIT licensed, free and always will be, with no hosted tier, and it runs on the Claude subscription you already have. Elmo is another open-source project in the same space: a self-hosted platform from Blue Whale Software, also MIT, and the open core of Elmo Cloud, from $29 a month. The two take different approaches. Elmo reaches the consumer surfaces, ChatGPT, Google AI Mode and AI Overviews, Gemini, Perplexity and Copilot, through scraping services, and checks each mention with TypeSafe's Jev model. Cheap Seats asks only Claude and OpenAI models, through their APIs or the Claude Code and Codex CLIs, grades every answer recommended, mentioned or absent, puts an interval on every number, and ends each run with a ranked fix list. Elmo does more, and does several things better; this page says which.

## Side by side

As of October 2026, from Cheap Seats' docs and Elmo's own [README](https://github.com/elmohq/elmo/blob/ed3c6a23227f90e653df8b8722ee3a8fb6c4e5e6/README.md), [providers](https://www.elmohq.com/docs/user-guide/providers), [visibility](https://www.elmohq.com/docs/user-guide/visibility), [configuration](https://www.elmohq.com/docs/developer-guide/configuration) and [pricing](https://www.elmohq.com/pricing) pages:

| | Cheap Seats | Elmo |
| --- | --- | --- |
| **License** | MIT | MIT (Blue Whale Software, LLC); contributors sign a CLA |
| **Price** | Free; runs on your existing Claude subscription (ChatGPT optional) | Self-hosted free. Elmo Cloud: Starter $29, Basic $99, Pro $299, Business $649 a month; white-label custom |
| **Where it runs** | One Docker container with SQLite, on Docker, Kubernetes (Helm chart) or an exe.dev VM | Docker Compose set up by the `@elmohq/cli` package: a web app, a worker on pg-boss, and PostgreSQL. Node 24 |
| **Engines** | Claude and OpenAI models, through their APIs or the Claude Code and Codex CLIs | Scrapers (Cloro, BrightData, Oxylabs, SearchApi, Olostep, DataForSEO) for ChatGPT, Google AI Mode, AI Overviews, Gemini, Perplexity and Copilot; direct APIs (OpenAI, Anthropic, Mistral, OpenRouter) for Claude, Grok and others |
| **Keys you need** | None on your own machine with a Claude Code subscription; or an Anthropic API key. A TypeSafe key only for its optional Jev passes (name folding, a second opinion on each grade, clustered objections and more), all off without one | A scraper or model API key, a direct LLM key for onboarding and Opportunities, and a TypeSafe key for Jev, which judges mentions and sentiment. The worker won't start without the TypeSafe key |
| **Your prompts** | TOML in your own git repo, changed by pull request | In the app, from an onboarding wizard that reads your site, or by hand; also over the REST API and MCP |
| **Web search vs memory** | Both, as separate tracks (search and recall), reported separately | Web search; scraped surfaces always search |
| **Grading** | A Claude call grades each answer recommended, mentioned or absent, with position, top pick, every product named, objections, praise and tone; optionally Jev reads each verdict again under the same definitions; with your facts listed, what each answer got wrong about you | A text search for each tracked company's names and domains, then Jev decides whether each match really means that company, with its sentiment and the passage behind it |
| **Samples** | `samples` per answerer and track, set in your config | `RUNS_PER_PROMPT` samples per platform per run, 5 by default |
| **Confidence** | A 95% interval on every rate; changes tested against noise | Not published |
| **What to fix** | A ranked fix list every run, and each fix's outcome measured after it ships | Opportunities: one structured LLM call over a digest of your data, refreshed about weekly, sorted into creation, existing content, outreach and social |
| **Reports and API** | Web UI, CLI, JSON API and MCP server | Shareable reports for people without an account; REST API with TypeScript and Python SDKs; MCP server |
| **Site checks** | Free site audit, citation check and AI crawler counts from your logs | The README says Elmo doesn't do crawler analytics or on-page audits today |

**What it costs.** Cheap Seats is free and open source (MIT). Claude is required, through a subscription or an API key; ChatGPT (Codex or an OpenAI key) is optional and adds a second assistant's answers. On your own machine, with a Claude Code subscription, answers, grading and the fix list can all run on the claude CLI, with no API key and no extra spend. Host it and you pay your host (and, in a container, API usage, since the image has no CLIs: about $0.03 to grade a 68-answer run, under a daily budget cap). [Cost and budget](/docs/cost-and-budget/) has the details.

Self-hosted Elmo is free software too, but it calls paid services. Its providers page estimates a scraper at about $0.15 to $2.25 per prompt a month, at about 300 evaluations a prompt; and direct model APIs at about $2 to $5 per tracked model per prompt a month; its README puts Jev at about $0.15 to $0.35 per 1,000 answers, or $2 to $4 a month for 25 prompts on 3 platforms.

## How the numbers differ

The two use some of the same words for different counts. [Metric definitions](/docs/metrics/#how-these-compare-to-other-tools) has the full table; the short version:

- **Visibility.** Elmo's is the share of each prompt's latest answers that mention you. An answer saying it has no information about your brand isn't counted. Cheap Seats' named rate counts every graded answer that names you, and leaves out one that names you only to say it can't find you, unless it also states something about you.
- **Recommended.** Cheap Seats grades whether the answer endorses you, not just names you. Elmo reads sentiment toward you (positive, neutral, mixed, negative) but doesn't grade recommendation.
- **Share of voice.** Elmo divides your mentions by yours plus your tracked competitors'. Cheap Seats divides by every product the answers named, so adding a competitor to your config doesn't change your share.
- **Position.** Elmo averages where you rank among the tracked companies an answer names; Cheap Seats counts every product named.
- **Sentiment.** Elmo scores positive 100, neutral and mixed 50, negative 0, on a 0 to 100 scale. Cheap Seats' net sentiment is the share positive minus the share negative, from −100 to +100.
- **History.** When you add a competitor or change a name, Elmo re-judges past answers for that company, 90 days back by default (`REPROCESS_DAYS`); older answers keep their old judgement, so a long chart can shift at that point. Cheap Seats keeps each run's grades as graded, and marks a change of method on the trend instead.

## Start with Cheap Seats if…

- You want to start at no cost: no scraper account, no TypeSafe key, nothing beyond the Claude subscription you have.
- You want each answer graded recommended versus merely mentioned, with the reasoning you can check, and what the models find on the web kept apart from what they already believe.
- You want an interval on every number and a test before a change is called a change, so a fluke doesn't read as a trend.
- You want a fix list that lands as pull requests in your own repo, with each fix's effect measured afterwards, plus free site checks.

## When to move to Elmo

If you outgrow Cheap Seats, do whatever suits you. Its author would suggest [Gauge](/compare/gauge/); that team is great. If what you need is on this list, Elmo is a strong choice, and an open-source one:

- **You need the consumer surfaces.** Elmo scrapes ChatGPT as a person sees it, Google AI Mode and AI Overviews, Gemini, Perplexity and Copilot. Cheap Seats asks the models directly and covers none of the Google, Perplexity or Copilot surfaces. See [Which AI engines Cheap Seats asks](/docs/engines/).
- **You track several brands, or work for clients.** Elmo is multi-brand, and its white-label option adds custom branding, a custom domain and SSO. Cheap Seats has one `[brand]` per config and no agency tier.
- **You report to people who won't log in.** Elmo's shareable reports open without an account.
- **You want to build on it.** Elmo has TypeScript and Python SDKs over its REST API, and a PostgreSQL database you can query directly.
- **You want deeper query fan-out analysis.** Cheap Seats' searches page shows what the assistants searched, whether your sites came back, and which names they added. Elmo goes further across more engines: which words each one adds, drops or keeps, and which searches your content wins or misses.
- **You'd rather not run anything,** but still want the open-source code behind the numbers. Elmo Cloud runs the same platform for you.

Elmo is also well finished: a live [demo](https://demo.elmohq.com), sentiment passages you can click through to, and published reliability checks of every scraper it supports.

## Taking your prompts with you

Your prompt sets are plain TOML in your own git repo. Each prompt is a line of text with an id, so the buyer questions you've refined in Cheap Seats are yours. They're plain text you can paste into Elmo's prompt settings, or send through its `create_prompts` MCP tool or REST API, and your run history stays in your SQLite file.

See [Getting started](/docs/getting-started/) to run it, or [all comparisons](/compare/).
