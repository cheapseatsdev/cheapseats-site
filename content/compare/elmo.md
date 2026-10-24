---
title: Cheap Seats vs Elmo
description: "Cheap Seats and Elmo, both MIT-licensed and self-hosted: engines, how each decides a mention, metrics, noise and history, October 2026, and when to move."
weight: 60
---
Elmo is a self-hosted AI visibility platform from Blue Whale Software, MIT licensed like [Cheap Seats](/compare/), and the open core of Elmo Cloud, from $29 a month. It reaches the consumer surfaces, ChatGPT, Google AI Mode and AI Overviews, Gemini, Perplexity and Copilot, through scraping services, and has TypeSafe's Jev model judge every answer that names a company it tracks. Cheap Seats asks only Claude and OpenAI models and has a Claude call grade each answer recommended, mentioned or absent. Elmo does more, and does several things better; this page says which.

## Side by side

As of October 2026, from Cheap Seats' docs and Elmo's own [README](https://github.com/elmohq/elmo/blob/cb6bf6e984cfa5f760c02f92775dab25745f575e/README.md), [providers](https://www.elmohq.com/docs/user-guide/providers), [visibility](https://www.elmohq.com/docs/user-guide/visibility), [configuration](https://www.elmohq.com/docs/developer-guide/configuration) and [pricing](https://www.elmohq.com/pricing) pages, and its source code at commit [`cb6bf6e`](https://github.com/elmohq/elmo/tree/cb6bf6e984cfa5f760c02f92775dab25745f575e) (version 0.7.4):

| | Cheap Seats | Elmo |
| --- | --- | --- |
| **License** | MIT | MIT (Blue Whale Software, LLC); contributors sign a CLA |
| **Price** | Free and open source (MIT); runs on your Claude subscription or API key, ChatGPT optional ([cost and budget](/docs/cost-and-budget/)) | Self-hosted free, plus the services it calls. Elmo Cloud: Starter $29 (1 brand, 50 prompts, ChatGPT once a day), Basic $99, Pro $299, Business $649 a month (5 brands, 350 prompts); white-label custom ([plans](https://github.com/elmohq/elmo/blob/cb6bf6e984cfa5f760c02f92775dab25745f575e/packages/config/src/plans.ts)) |
| **Where it runs** | One Docker container with SQLite; also a Helm chart or an exe.dev VM ([self-hosting](/docs/self-hosting/)) | Docker Compose set up by the `@elmohq/cli` package: a web app, a worker on pg-boss, and PostgreSQL. Node 24 images |
| **Engines** | Claude and OpenAI models, through their APIs or the Claude Code and Codex CLIs | Scrapers (Cloro, BrightData, Oxylabs, SearchApi, Olostep, DataForSEO) for ChatGPT, Google AI Mode, AI Overviews, Gemini, Perplexity and Copilot; direct APIs (OpenAI, Anthropic, Mistral, OpenRouter) for Claude, Grok and others |
| **Keys you need** | None on your own machine with a Claude Code subscription; or an Anthropic API key. A TypeSafe key only for its optional Jev passes (name folding, a second opinion on each grade, clustered objections and more), all off without one | A scraper or model API key, a direct LLM key for onboarding and Opportunities, and a TypeSafe key for Jev, which judges mentions and sentiment. The worker won't start without the TypeSafe key |
| **Markets** | No location or language setting; prompts are asked as written | Scrapers ask from the US, in English ([source](https://github.com/elmohq/elmo/blob/cb6bf6e984cfa5f760c02f92775dab25745f575e/packages/lib/src/providers/registry/cloro.ts)); countries and languages are [planned](https://github.com/elmohq/elmo/blob/cb6bf6e984cfa5f760c02f92775dab25745f575e/apps/www/src/data/upcoming-features.json) |
| **Your prompts** | TOML in your own git repo, changed by pull request | In the app, from an onboarding wizard that reads your site, or by hand; also over the REST API and MCP. Branded prompts are tagged for you |
| **Web search vs memory** | Search and recall, as separate tracks ([two tracks](/docs/how-grading-works/#two-tracks)) | Chosen per target: scraped surfaces, which mostly search, or model APIs with or without web search ([source](https://github.com/elmohq/elmo/blob/cb6bf6e984cfa5f760c02f92775dab25745f575e/apps/web/src/lib/platform-groups.ts)) |
| **Grading** | Recommended, mentioned or absent per answer, with position, top pick, share of voice, objections and tone; what each answer got wrong against your facts ([how grading works](/docs/how-grading-works/)) | A whole-word search for each tracked company's names and domains, then one Jev call per answer: for each company found, positive, neutral, negative, mixed, another meaning, another company, or "no information"; counted when Jev's probability for the four sentiments together passes 30% ([source](https://github.com/elmohq/elmo/blob/cb6bf6e984cfa5f760c02f92775dab25745f575e/apps/worker/src/mention-judge/analyze.ts)) |
| **Sampling** | `samples` per answerer and track, set in your config; optional adaptive extras for the least certain prompts | Each prompt once a day by default, 5 samples per target (`RUNS_PER_PROMPT`); Cloud samples 1 to 4 times a day |
| **Noise** | A 95% interval on every rate; changes tested against noise ([how big a change](/docs/noise-and-confidence/)) | None in the app. Its `aeo` skill gives a ±2√(p(1−p)/n) rule to apply yourself ([skill](https://github.com/elmohq/elmo/blob/cb6bf6e984cfa5f760c02f92775dab25745f575e/skills/aeo/references/measurement.md)) |
| **History** | Grades stay as graded; a change of method is marked on the trend; re-grading is a step you take | Past answers re-judged in place when names or the judge change, 90 days back by default (`REPROCESS_DAYS`); older ones keep their old judgement |
| **What to fix** | A ranked fix list every run, each fix measured after it ships ([from fix to pull request](/docs/fix-to-pull-request/)) | Opportunities: one LLM call over a digest of your top 30 prompts, 8 to 12 items in creation, existing content, outreach and social, renewed after 6 days; no outcome tracking ([source](https://github.com/elmohq/elmo/blob/cb6bf6e984cfa5f760c02f92775dab25745f575e/apps/web/src/server/opportunities.ts)) |
| **Brands and teams** | One `[brand]` per config; no agency tier | Unlimited brands self-hosted; Cloud 1 to 5 brands with unlimited seats; white-label adds custom branding, a custom domain and SSO |
| **Reports and API** | Web UI, CLI, JSON API, MCP server, and [read-only share links](/docs/sharing/) to a run | REST API with TypeScript and Python SDKs; MCP server; a report generator with shareable links, for admin users and [not on Elmo Cloud](https://github.com/elmohq/elmo/blob/cb6bf6e984cfa5f760c02f92775dab25745f575e/packages/deployment/src/deployment.ts) |
| **Site checks** | Free site audit, citation check and AI crawler counts from your logs | The README says Elmo doesn't do crawler analytics or on-page audits today; site audits are planned |

Self-hosted Elmo is free software too, but it calls paid services from the first answer. Its providers page estimates a scraper at about $0.15 to $2.25 per prompt a month, at about 300 evaluations a prompt; and direct model APIs at about $2 to $5 per tracked model per prompt a month; its README puts Jev at about $0.15 to $0.35 per 1,000 answers, or $2 to $4 a month for 25 prompts on 3 platforms. Those figures follow from its five samples a target a day: its configuration page says `RUNS_PER_PROMPT=1` "cuts the bill by five and makes each result a single sample, so day-to-day movement gets noisier."

## What's the same

- **Every raw answer is kept, in a database you own.** Elmo keeps each engine's raw output in PostgreSQL "so any metric can be re-derived" ([README](https://github.com/elmohq/elmo/blob/cb6bf6e984cfa5f760c02f92775dab25745f575e/README.md)); Cheap Seats keeps every answer, search, citation and grade in SQLite.
- **Both use TypeSafe's Jev, for different jobs.** Elmo needs it for every mention and sentiment decision. Cheap Seats runs without it, and, when it's on, uses it for small decisions after a run, such as folding product names and a second opinion on each grade. See [Optional providers](/docs/optional-providers/).
- **The words behind each judgement are shown in the answer.** Elmo has Jev choose the passage from the answer's own sentences and highlights it when you click a company. Cheap Seats has the grader quote one sentence, keeps it only if the answer contains it, and highlights it.
- **What the model believes is kept apart from what it finds.** Elmo labels API targets without web search as what "the model was trained on", apart from those that search. Cheap Seats asks every prompt on a recall track and a search track. See [Which AI engines Cheap Seats asks](/docs/engines/).
- **Branded prompts are set apart.** Elmo tags prompts that name the brand and splits visibility into branded and unbranded; Cheap Seats leads with the unbranded rates. See [Metric definitions](/docs/metrics/#unbranded-and-branded).
- **Citation churn is scored the same way.** Both compare consecutive citation shares by host with Bray–Curtis, as a 0 to 100 stability score ([Elmo's code](https://github.com/elmohq/elmo/blob/cb6bf6e984cfa5f760c02f92775dab25745f575e/apps/web/src/lib/visibility-stats.ts)). Elmo hands it to Opportunities as each prompt's "difficulty"; Cheap Seats shows it per set ([citation stability](/docs/metrics/#citation-stability)).

## What's different

- **How a mention is decided.** Elmo finds each tracked company's names in the text, then asks Jev how the answer portrays each one. Cheap Seats has a Claude call read the whole answer and grade your brand only, recommended, mentioned or absent, with the reason in the answer's words.
- **Where the statistics live.** Cheap Seats puts an interval on every rate and a paired test on every change, in the product. Elmo's dashboard shows plain rates, graded good, fair or poor; its `aeo` skill tells your coding agent how to work out a margin and to say "no detectable change" at small samples.
- **What a fix is.** Elmo's Opportunities are strategy: an LLM, told it "cannot see page contents" and so never to suggest on-page changes, names the roundups, communities and angles to go after. Cheap Seats' fix list names the page to create or change and what it must say, and measures each attempt afterwards ([from fix to pull request](/docs/fix-to-pull-request/)).
- **Getting to a first number.** Self-hosted Elmo needs a scraper or model account, a TypeSafe key and a direct LLM key, then a wizard writes your prompts from your site. Cheap Seats needs a Claude subscription, and you write prompts as TOML; `cheapseats suggest-prompts` proposes some.

## How the numbers differ

The two use some of the same words for different counts. [Metric definitions](/docs/metrics/#how-these-compare-to-other-tools) has the full table; the short version:

- **Visibility.** Elmo's is the share of each prompt's latest answers that mention you; Cheap Seats' named rate pools every graded answer in the run. Neither counts an answer that names you only to say it knows nothing about you: Elmo's Jev picks "no information"; Cheap Seats grades it absent unless the answer also says something about you, even hedged. Elmo counts a link to your site as a mention; Cheap Seats' grader reads the text, not the citations.
- **Recommended.** Cheap Seats grades whether the answer endorses you, not just names you. Elmo reads sentiment toward you (positive, neutral, mixed, negative), and "recommended" is part of what counts as positive; there is no separate recommended rate.
- **Share of voice.** Elmo divides your mentions by yours plus your tracked competitors'. Cheap Seats divides by every product the answers named, so adding a competitor to your config doesn't change your share.
- **Position.** Elmo averages where you rank among the tracked companies an answer names; Cheap Seats counts every product named.
- **Sentiment.** Elmo scores positive 100, neutral and mixed 50, negative 0, on a 0 to 100 scale, for you and each tracked competitor. Cheap Seats' net sentiment is the share positive minus the share negative, from −100 to +100, for your brand only.

## Start with Cheap Seats if…

- You want to start at no cost: no scraper account, no TypeSafe key, no second LLM key, nothing beyond the Claude subscription you have.
- You want past numbers to stay as they were graded unless you choose to re-grade.

The rest of the case for starting here, strict grades, two tracks, intervals, prompts and data you own, is on [the compare index](/compare/#start-here).

## When to move to Elmo

If what you need is on this list, Elmo is a strong choice, and an open-source one:

- **You need the consumer surfaces.** Elmo scrapes ChatGPT as a person sees it, Google AI Mode and AI Overviews, Gemini, Perplexity and Copilot. Cheap Seats asks the models directly and covers none of the Google, Perplexity or Copilot surfaces. See [Which AI engines Cheap Seats asks](/docs/engines/).
- **You track several brands, or work for clients.** Self-hosted Elmo has no brand limit, Elmo Cloud plans cover up to five brands with unlimited seats, and its white-label option adds custom branding, a custom domain and SSO. A self-hosted or white-label Elmo also builds a report on any brand from its name and website ([source](https://github.com/elmohq/elmo/blob/cb6bf6e984cfa5f760c02f92775dab25745f575e/apps/worker/src/report-worker.ts)), which suits a pitch. Cheap Seats has one `[brand]` per config and no agency tier.
- **You want competitors read as closely as you.** Elmo judges sentiment, place and the passage behind them for every tracked competitor in every answer, and charts each against you by engine ([sentiment](https://www.elmohq.com/docs/user-guide/sentiment)). Cheap Seats grades only your brand; competitors get share of voice, place and head-to-head counts.
- **You want to build on it.** Elmo has TypeScript and Python [SDKs](https://www.elmohq.com/docs/api/sdks) over its REST API, organization API keys you can limit to read-only and to chosen brands, and a PostgreSQL database you can query directly.
- **You want query fan-out from more engines.** Both show what an assistant searched, which words its searches added to or dropped from the prompt, and whether your sites came back. Elmo reads those searches from ChatGPT's app, Perplexity and Copilot as well as the model APIs, where the provider returns them ([providers](https://www.elmohq.com/docs/user-guide/providers)); Cheap Seats' [searches page](/docs/reading-results/#what-the-assistants-searched) covers Claude and OpenAI models only.

Elmo is also well finished, and candid: a live [demo](https://demo.elmohq.com), sentiment passages you can click through to, published reliability checks of every scraper it supports, and a providers page that says its scraper links are affiliate links.

## Taking your prompts with you

They're plain text in your own repo ([why that matters](/compare/#if-you-grow-out-of-it)), so paste them into Elmo's prompt settings, or send them through its [`create_prompts`](https://www.elmohq.com/docs/api/mcp) MCP tool or REST API.

[All comparisons](/compare/).
