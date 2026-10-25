---
title: Cheap Seats vs Bad Popcorn
description: Cheap Seats, the free, self-hosted AI visibility tracker, as a place to start before Bad Popcorn. Markets, engines, grading, fixes and shop feeds, October 2026.
weight: 35
---
Bad Popcorn is a hosted AI visibility platform built for brands selling to shoppers in the Netherlands, Belgium, Germany and France. It asks buying questions in each market's language across ChatGPT, Claude, Gemini and Perplexity, from €890 a year; on Growth it also drafts the content to fix what it finds. [Cheap Seats](/compare/) asks the same two model families in whatever language you write, with no per-country runs, and leaves the writing to you.

## Side by side

As of October 2026, from Cheap Seats' docs and Bad Popcorn's own [home](https://badpopcorn.ai/), [methodology](https://badpopcorn.ai/methodology), [product](https://badpopcorn.ai/product) and [API docs](https://badpopcorn.ai/api-docs) pages:

| | Cheap Seats | Bad Popcorn |
| --- | --- | --- |
| **Price** | Free MIT software; API calls or installed subscription CLIs ([cost and budget](/docs/cost-and-budget/)) | Starter €890/year or €89/month (1 brand, 2 websites, 2 users, 50 monitored prompts), Growth €2,190/year or €219/month (3 brands, 5 websites, 5 users, 150 prompts), Enterprise custom; 30-day free trial |
| **Where it runs** | Self-hosted SQLite; Docker, Helm or exe.dev ([self-hosting](/docs/self-hosting/)) | Hosted |
| **Engines** | Claude and OpenAI models, through their APIs or the Claude Code and Codex CLIs | ChatGPT, Claude, Gemini and Perplexity, "and the others enabled on the account"; its FAQ adds Mistral, Grok, Copilot and DeepSeek on larger plans |
| **How it asks** | The models directly, through the APIs or your own CLI subscriptions; every answer, search and citation kept; daily or every few days, as you schedule it | Provider APIs, "not the same as a logged-in consumer app with personalization"; location and language follow the prompt's country; daily, full answers stored |
| **Noise** | 95% intervals on named, recommended and top pick; changes tested against noise ([how big a change](/docs/noise-and-confidence/)) | Repeated runs, with volatility shown, each reading to be read with its sample size; how many runs, and any interval, not stated |
| **Markets** | One set of questions, as you write them; no per-country runs | Per country, starting with the Netherlands, Belgium, Germany and France, with questions in each market's language |
| **Your prompts** | TOML in your own git repo, changed by pull request; `intent = "info"` marks questions that ask to explain rather than choose | Monitored prompts by plan, suggested from your catalogue and categories; clustered by market and by branded, non-branded, purchase, comparison and research intent |
| **Web search vs memory** | Search and recall, as separate tracks ([two tracks](/docs/how-grading-works/#two-tracks)) | Not stated on its methodology or product pages |
| **Grading** | Recommended, mentioned or absent; position, top pick, objections and optional fact checking ([how grading works](/docs/how-grading-works/)) | Mention, citation (your site used as evidence), position and recommendation strength, and context: sentiment and whether the facts match the catalogue; summed up in a 0 to 100 visibility score, weights unpublished |
| **History** | A run's grades are fixed when it's graded; a change of grading method is marked on the trend, and you can re-grade stored answers to carry it on | Not stated |
| **What to fix** | Ranked fix briefs; before/after attempt checks ([from fix to pull request](/docs/fix-to-pull-request/)) | The reason a competitor gets cited; on Growth, FAQs, collection copy, product facts and schema drafted for you to approve; the same questions asked again to check |
| **Shop and crawler data** | No product feeds; AI crawler visits and AI referrals counted from your own access logs, free | AI-referred visits from Google Analytics 4; shopping and ChatGPT product feeds, and AI crawler visits from Cloudflare logs, on Enterprise |
| **API / MCP** | Web UI, CLI, JSON API and MCP server | API access from Growth; reports and fix lists export to CSV |
| **Data** | Your SQLite file; calls go to configured providers | Hosted by Bad Popcorn, under Dutch law |

## What's the same

Both call models directly rather than reproducing personalized consumer sessions, assess more than a mention, check product facts, separate branded prompts, audit crawl access and re-check after fixes. Bad Popcorn documents its [methodology](https://badpopcorn.ai/methodology) and [product workflow](https://badpopcorn.ai/product); Cheap Seats' [grading](/docs/how-grading-works/) and [fix workflow](/docs/fix-to-pull-request/) describe the corresponding rules.

## What's different

- **Composite score:** Bad Popcorn's [API docs](https://badpopcorn.ai/api-docs) describe a 0–100 score combining mentions, position, sentiment and source quality, with unpublished weights. Cheap Seats reports separate rates and checked evidence quotes.
- **Share of voice:** Bad Popcorn's [FAQ](https://badpopcorn.ai/#faq) doesn't state its denominator. Cheap Seats counts each product once per answer, across every product named ([formula](/docs/metrics/#share-of-voice-and-position)).
- **Search and recall:** Cheap Seats reports required-search and no-tools answers separately. Bad Popcorn's methodology doesn't state whether answers searched.
- **Drafting and shop data:** On Growth, Bad Popcorn drafts copy and schema from confirmed facts; approved work goes to WordPress as drafts or Shopify manually. It syncs Shopify/WooCommerce catalogues and checks ChatGPT shopping on Enterprise ([product](https://badpopcorn.ai/product)). Cheap Seats supplies page briefs for your repo and has no product feeds.

## Start with Cheap Seats if…

You want site changes to go through your own repo and review and don't need country-specific or shopping workflows.

## When to move to Bad Popcorn

- **You sell to shoppers in the Netherlands, Belgium, Germany or France.** Bad Popcorn asks in their languages and reports country by country; Cheap Seats has no per-country runs.
- **You need Gemini or Perplexity.** Bad Popcorn asks both; Cheap Seats asks only Claude and OpenAI models.
- **You run an online shop.** Bad Popcorn checks answers against your catalogue, and on Enterprise handles shopping and ChatGPT product feeds beside AI crawler traffic. Cheap Seats checks answers only against the facts you list, and has no feeds.
- **You want the content drafted for you.** On Growth, Bad Popcorn drafts FAQs, collection copy, product facts and schema for you to approve. Cheap Seats tells you which page to change and what it must say, and leaves the writing to you or Claude Code, with a pull request to review for every fix.

## Taking your prompts with you

Copy your prompt text from TOML: copy them into Bad Popcorn. Its plans count monitored prompts, 50 on Starter and 150 on Growth.

[All comparisons](/compare/).
