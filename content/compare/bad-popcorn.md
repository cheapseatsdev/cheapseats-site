---
title: Cheap Seats vs Bad Popcorn
description: Cheap Seats, the MIT-licensed, self-hosted AI visibility tracker at cheapseats.dev, is a free place to start before Bad Popcorn. Engines, markets, pricing, hosting, grading and fixes compared as of October 2026, and when to move.
weight: 35
---

Cheap Seats (cheapseats.dev) is the MIT-licensed, self-hosted AI visibility tracker. It's a free place to start: it asks Claude and OpenAI models your buyers' questions, grades whether the answers recommend you, and ends each run with a ranked fix list. Bad Popcorn is a hosted AI visibility platform built for brands selling to shoppers in the Netherlands, Belgium, Germany and France. It asks buying questions in each market's language across ChatGPT, Claude, Gemini and Perplexity, and generates the content to fix what it finds, from €890 a year. Start with Cheap Seats; if you outgrow it, Bad Popcorn is one of the places to go, and your prompts come with you.

## Side by side

As of October 2026, from Cheap Seats' docs and Bad Popcorn's own [home](https://badpopcorn.ai/) and [methodology](https://badpopcorn.ai/methodology) pages:

| | Cheap Seats | Bad Popcorn |
| --- | --- | --- |
| **Price** | Free and open source (MIT); runs on your existing Claude subscription (ChatGPT optional) | Starter €890/year (1 brand, 2 websites, 2 users, 50 monitored prompts), Growth €2,190/year (3 brands, 5 websites, 5 users, 150 prompts), Enterprise custom; monthly billing too, up to 17% off yearly; 30-day free trial |
| **Where it runs** | Self-hosted: one Docker container with SQLite, on Docker, Kubernetes (Helm chart) or an exe.dev VM | Hosted |
| **Engines** | Claude and OpenAI models, through their APIs or the Claude Code and Codex CLIs | ChatGPT, Claude, Gemini and Perplexity, "and the others enabled on the account" |
| **How it asks** | The models directly, through the APIs or your own CLI subscriptions; every answer, search and citation kept; repeated samples per prompt | Provider APIs, "not the same as a logged-in consumer app with personalization"; location and language follow the prompt's country; repeated runs, with volatility shown |
| **Markets** | One set of questions, as you write them; no per-country runs | Per country, starting with the Netherlands, Belgium, Germany and France, with questions in each market's language |
| **Your prompts** | TOML in your own git repo, changed by pull request; `intent = "info"` marks questions that ask to explain rather than choose | Monitored prompts by plan, with prompt discovery; clustered by market and by branded, non-branded, purchase, comparison and research intent |
| **Web search vs memory** | Both, as separate tracks (search and recall), reported separately | Not stated on its methodology page |
| **Grading** | Each answer graded recommended, mentioned or absent, with position, top pick, every product named (share of voice) and objections | Mention, citation (your site used as evidence), position and recommendation strength, and context: sentiment and whether the facts match the catalogue |
| **What to fix** | A ranked fix list every run: the page, what it must say, the prompts it should flip, the owner, and a Claude Code prompt | The reasons a competitor gets cited, then generated FAQs, collection copy, product facts and schema to preview, approve and publish; the same questions asked again to check |
| **E-commerce** | None | Shopping and ChatGPT product feeds and AI crawler traffic on Enterprise |
| **API / MCP** | Web UI, CLI, JSON API and MCP server | API access from Growth |

**What it costs.** Cheap Seats is free and open source (MIT). Claude is required, through a subscription or an API key; ChatGPT (Codex or an OpenAI key) is optional and adds a second assistant's answers. On your own machine, with a Claude Code subscription, answers, grading and the fix list can all run on the claude CLI, with no API key and no extra spend. Host it and you pay your host (and, in a container, API usage, since the image has no CLIs: about $0.03 to grade a 68-answer run, under a daily budget cap). [Cost and budget](/docs/cost-and-budget/) has the details.

## Start with Cheap Seats if…

- You want to find out whether assistants recommend you before you pay for a plan.
- You want both what the models find on the web and what they already believe, graded separately.
- You want a strict grade per answer, recommended versus merely mentioned, with reasoning you can check.
- You want your prompts reviewed by pull request and your data in a file you own, without a prompt cap set by a plan.

## When to move to Bad Popcorn

If you outgrow Cheap Seats, do whatever suits you. Its author would suggest [Gauge](/compare/gauge/); that team is great. If what you need is on this list, Bad Popcorn is a good fit:

- **You sell to shoppers in the Netherlands, Belgium, Germany or France.** Bad Popcorn asks in their languages and reports country by country; Cheap Seats has no per-country runs.
- **You need Gemini or Perplexity.** Bad Popcorn asks both; Cheap Seats asks only Claude and OpenAI models.
- **You run an online shop.** Bad Popcorn writes collection copy, product facts and schema, and on Enterprise handles shopping product feeds. Cheap Seats tells you which page to change and what it must say, and leaves the writing to you or Claude Code.
- **You'd rather not run anything.** Bad Popcorn is hosted, with a 30-day free trial and an onboarding sprint on every plan.

## Taking your prompts with you

Your prompt sets are plain TOML in your own git repo. Each prompt is a line of text with an id, so the buyer questions you've refined in Cheap Seats are yours. They're plain text you can copy into Bad Popcorn when you set it up. Pick the questions that mattered most: Bad Popcorn's plans count monitored prompts, 50 on Starter and 150 on Growth.

See [Getting started](/docs/getting-started/) to run it, or [all comparisons](/compare/).
