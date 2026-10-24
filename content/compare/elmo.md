---
title: Cheap Seats vs Elmo
description: "Cheap Seats and Elmo, both MIT-licensed and self-hosted: engines, how each decides a mention, metrics, noise and history, October 2026, and when to move."
weight: 60
---

Cheap Seats (cheapseats.dev) is a personal open-source project: its author wrote it to make his own product better, drawing on lots of inspiration, Gauge first among them. It's MIT licensed, free and always will be, with no hosted tier, and it runs on the Claude subscription you already have. Elmo is another open-source project in the same space: a self-hosted platform from Blue Whale Software, also MIT, and the open core of Elmo Cloud, from $29 a month. The two take different approaches. Elmo reaches the consumer surfaces, ChatGPT, Google AI Mode and AI Overviews, Gemini, Perplexity and Copilot, through scraping services, and has TypeSafe's Jev model judge every answer that names a company it tracks. Cheap Seats asks only Claude and OpenAI models, through their APIs or the Claude Code and Codex CLIs, grades every answer recommended, mentioned or absent, puts an interval on every number, and ends each run with a ranked fix list. Elmo does more, and does several things better; this page says which.

## Side by side

As of October 2026, from Cheap Seats' docs and Elmo's own [README](https://github.com/elmohq/elmo/blob/cb6bf6e984cfa5f760c02f92775dab25745f575e/README.md), [providers](https://www.elmohq.com/docs/user-guide/providers), [visibility](https://www.elmohq.com/docs/user-guide/visibility), [configuration](https://www.elmohq.com/docs/developer-guide/configuration) and [pricing](https://www.elmohq.com/pricing) pages, and its source code at commit [`cb6bf6e`](https://github.com/elmohq/elmo/tree/cb6bf6e984cfa5f760c02f92775dab25745f575e) (version 0.7.4):

| | Cheap Seats | Elmo |
| --- | --- | --- |
| **License** | MIT | MIT (Blue Whale Software, LLC); contributors sign a CLA |
| **Price** | Free; runs on your existing Claude subscription (ChatGPT optional) | Self-hosted free, plus the services it calls. Elmo Cloud: Starter $29 (1 brand, 50 prompts, ChatGPT once a day), Basic $99, Pro $299, Business $649 a month (5 brands, 350 prompts); white-label custom ([plans](https://github.com/elmohq/elmo/blob/cb6bf6e984cfa5f760c02f92775dab25745f575e/packages/config/src/plans.ts)) |
| **Where it runs** | One Docker container with SQLite, on Docker, Kubernetes (Helm chart) or an exe.dev VM | Docker Compose set up by the `@elmohq/cli` package: a web app, a worker on pg-boss, and PostgreSQL. Node 24 images |
| **Engines** | Claude and OpenAI models, through their APIs or the Claude Code and Codex CLIs | Scrapers (Cloro, BrightData, Oxylabs, SearchApi, Olostep, DataForSEO) for ChatGPT, Google AI Mode, AI Overviews, Gemini, Perplexity and Copilot; direct APIs (OpenAI, Anthropic, Mistral, OpenRouter) for Claude, Grok and others |
| **Keys you need** | None on your own machine with a Claude Code subscription; or an Anthropic API key. A TypeSafe key only for its optional Jev passes (name folding, a second opinion on each grade, clustered objections and more), all off without one | A scraper or model API key, a direct LLM key for onboarding and Opportunities, and a TypeSafe key for Jev, which judges mentions and sentiment. The worker won't start without the TypeSafe key |
| **Markets** | No location or language setting; prompts are asked as written | Scrapers ask from the US, in English ([source](https://github.com/elmohq/elmo/blob/cb6bf6e984cfa5f760c02f92775dab25745f575e/packages/lib/src/providers/registry/cloro.ts)); countries and languages are [planned](https://github.com/elmohq/elmo/blob/cb6bf6e984cfa5f760c02f92775dab25745f575e/apps/www/src/data/upcoming-features.json) |
| **Your prompts** | TOML in your own git repo, changed by pull request | In the app, from an onboarding wizard that reads your site, or by hand; also over the REST API and MCP. Branded prompts are tagged for you |
| **Web search vs memory** | Both, as separate tracks (search and recall) on every prompt, reported separately | Chosen per target: scraped surfaces, which mostly search, or model APIs with or without web search ([source](https://github.com/elmohq/elmo/blob/cb6bf6e984cfa5f760c02f92775dab25745f575e/apps/web/src/lib/platform-groups.ts)) |
| **Grading** | A Claude call grades each answer recommended, mentioned or absent, with position, top pick, every product named, objections, praise and tone; optionally Jev reads each verdict again under the same definitions; with your facts listed, what each answer got wrong about you | A whole-word search for each tracked company's names and domains, then one Jev call per answer: for each company found, positive, neutral, negative, mixed, another meaning, another company, or "no information"; counted when Jev's probability for the four sentiments together passes 30% ([source](https://github.com/elmohq/elmo/blob/cb6bf6e984cfa5f760c02f92775dab25745f575e/apps/worker/src/mention-judge/analyze.ts)) |
| **Sampling** | `samples` per answerer and track, set in your config; optional adaptive extras for the least certain prompts | Each prompt once a day by default, 5 samples per target (`RUNS_PER_PROMPT`); Cloud samples 1 to 4 times a day |
| **Noise** | A 95% interval on every rate; changes tested against noise | None in the app. Its `aeo` skill gives a ±2√(p(1−p)/n) rule to apply yourself ([skill](https://github.com/elmohq/elmo/blob/cb6bf6e984cfa5f760c02f92775dab25745f575e/skills/aeo/references/measurement.md)) |
| **History** | Grades stay as graded; a change of method is marked on the trend; re-grading is a step you take | Past answers re-judged in place when names or the judge change, 90 days back by default (`REPROCESS_DAYS`); older ones keep their old judgement |
| **What to fix** | A ranked fix list every run, and each fix's outcome measured after it ships | Opportunities: one LLM call over a digest of your top 30 prompts, 8 to 12 items in creation, existing content, outreach and social, renewed after 6 days; no outcome tracking ([source](https://github.com/elmohq/elmo/blob/cb6bf6e984cfa5f760c02f92775dab25745f575e/apps/web/src/server/opportunities.ts)) |
| **Brands and teams** | One `[brand]` per config; no agency tier | Unlimited brands self-hosted; Cloud 1 to 5 brands with unlimited seats; white-label adds custom branding, a custom domain and SSO |
| **Reports and API** | Web UI, CLI, JSON API, MCP server, and [read-only share links](/docs/sharing/) to a run | REST API with TypeScript and Python SDKs; MCP server; a report generator with shareable links, for admin users and [not on Elmo Cloud](https://github.com/elmohq/elmo/blob/cb6bf6e984cfa5f760c02f92775dab25745f575e/packages/deployment/src/deployment.ts) |
| **Site checks** | Free site audit, citation check and AI crawler counts from your logs | The README says Elmo doesn't do crawler analytics or on-page audits today; site audits are planned |

**What it costs.** Cheap Seats is free and open source (MIT). Claude is required, through a subscription or an API key; ChatGPT (Codex or an OpenAI key) is optional and adds a second assistant's answers. On your own machine, with a Claude Code subscription, answers, grading and the fix list can all run on the claude CLI, with no API key and no extra spend. Host it and you pay your host (and, in a container, API usage, since the image has no CLIs: about $0.03 to grade a 68-answer run, under a daily budget cap). [Cost and budget](/docs/cost-and-budget/) has the details.

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
- **History.** When you add a competitor or change a name, Elmo re-judges past answers for that company, and a new version of its judge re-judges them all, 90 days back by default (`REPROCESS_DAYS`); older answers keep their old judgement, so a long chart can shift at that point. Cheap Seats keeps each run's grades as graded and marks a change of method on the trend; [re-grading](/docs/regrading/) carries a trend on when you choose to.

## Start with Cheap Seats if…

- You want to start at no cost: no scraper account, no TypeSafe key, no second LLM key, nothing beyond the Claude subscription you have.
- You want each answer graded recommended versus merely mentioned, with the reasoning you can check, and what the models find on the web kept apart from what they already believe, on every prompt.
- You want an interval on every number and a test before a change is called a change, so a fluke doesn't read as a trend.
- You want past numbers to stay as they were graded unless you choose to re-grade.
- You want a fix list that lands as pull requests in your own repo, with each fix's effect measured afterwards, plus free site checks.

## When to move to Elmo

If you outgrow Cheap Seats, do whatever suits you. Its author would suggest [Gauge](/compare/gauge/); that team is great. If what you need is on this list, Elmo is a strong choice, and an open-source one:

- **You need the consumer surfaces.** Elmo scrapes ChatGPT as a person sees it, Google AI Mode and AI Overviews, Gemini, Perplexity and Copilot. Cheap Seats asks the models directly and covers none of the Google, Perplexity or Copilot surfaces. See [Which AI engines Cheap Seats asks](/docs/engines/).
- **You track several brands, or work for clients.** Self-hosted Elmo has no brand limit, Elmo Cloud plans cover up to five brands with unlimited seats, and its white-label option adds custom branding, a custom domain and SSO. A self-hosted or white-label Elmo also builds a report on any brand from its name and website ([source](https://github.com/elmohq/elmo/blob/cb6bf6e984cfa5f760c02f92775dab25745f575e/apps/worker/src/report-worker.ts)), which suits a pitch. Cheap Seats has one `[brand]` per config and no agency tier.
- **You want competitors read as closely as you.** Elmo judges sentiment, place and the passage behind them for every tracked competitor in every answer, and charts each against you by engine ([sentiment](https://www.elmohq.com/docs/user-guide/sentiment)). Cheap Seats grades only your brand; competitors get share of voice, place and head-to-head counts.
- **You want to build on it.** Elmo has TypeScript and Python [SDKs](https://www.elmohq.com/docs/api/sdks) over its REST API, organization API keys you can limit to read-only and to chosen brands, and a PostgreSQL database you can query directly.
- **You want query fan-out from more engines.** Both show what an assistant searched, which words its searches added to or dropped from the prompt, and whether your sites came back. Elmo reads those searches from ChatGPT's app, Perplexity and Copilot as well as the model APIs, where the provider returns them ([providers](https://www.elmohq.com/docs/user-guide/providers)); Cheap Seats' [searches page](/docs/reading-results/#what-the-assistants-searched) covers Claude and OpenAI models only.
- **You'd rather not run anything,** but still want the open-source code behind the numbers. Elmo Cloud runs the same platform for you.

Elmo is also well finished, and candid: a live [demo](https://demo.elmohq.com), sentiment passages you can click through to, published reliability checks of every scraper it supports, and a providers page that says its scraper links are affiliate links.

## Taking your prompts with you

Your prompt sets are plain TOML in your own git repo. Each prompt is a line of text with an id, so the buyer questions you've refined in Cheap Seats are yours. They're plain text you can paste into Elmo's prompt settings, or send through its [`create_prompts`](https://www.elmohq.com/docs/api/mcp) MCP tool or REST API, and your run history stays in your SQLite file.

See [Getting started](/docs/getting-started/) to run it, or [all comparisons](/compare/).
