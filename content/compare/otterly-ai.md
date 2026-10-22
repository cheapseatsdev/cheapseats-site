---
title: Cheap Seats vs Otterly.AI
description: Cheap Seats, the MIT-licensed, self-hosted AI visibility tracker at cheapseats.dev, is a free place to start before Otterly.AI. Engines, pricing, hosting, prompts, grading, fixes and API compared as of October 2026, and when to move.
weight: 30
---

Cheap Seats (cheapseats.dev) is the MIT-licensed, self-hosted AI visibility tracker. It's a free place to start, inspired by tools like Otterly.AI: it asks Claude and OpenAI models your buyers' questions, grades whether the answers recommend you, and ends each run with a ranked fix list. Otterly.AI is a hosted AI search monitoring tool with published self-serve prices, from $29 a month for 15 prompts. It includes ChatGPT, Google AI Overviews, Perplexity and Copilot on every plan, with Gemini, AI Mode and Claude as paid add-ons. Start with Cheap Seats; if you outgrow it, Otterly.AI is one of the places to go, and your prompts come with you.

## Side by side

As of October 2026, from Cheap Seats' docs and Otterly.AI's own [pricing](https://otterly.ai/pricing) and [home](https://otterly.ai/) pages:

| | Cheap Seats | Otterly.AI |
| --- | --- | --- |
| **Price** | Free and open source (MIT); runs on your existing Claude subscription (ChatGPT optional) | Lite $29/month (15 prompts), Standard $189/month (100 prompts), Premium $489/month (400 prompts), Enterprise custom; 15% off annually |
| **Where it runs** | Self-hosted: one Docker container with SQLite, on Docker, Kubernetes (Helm chart) or an exe.dev VM | Hosted SaaS |
| **Engines** | Claude and OpenAI models, through their APIs or the Claude Code and Codex CLIs | Included: ChatGPT, Google AI Overviews, Perplexity, Microsoft Copilot. Add-ons: Google AI Mode and Gemini (from $9/month on Lite), Claude (from $29/month on Lite) |
| **Your prompts** | TOML in your own git repo, changed by pull request | Your search prompts, by plan; +100 prompts for $99/month on Standard and Premium |
| **Web search vs memory** | Both, as separate tracks (search and recall), reported separately | Not stated |
| **Grading** | Each answer graded recommended, mentioned or absent, with position, top pick, every product named (share of voice) and objections | Brand reports, prompts and citations |
| **What to fix** | A ranked fix list every run: the page, what it must say, the prompts it should flip, the owner, and a Claude Code prompt | Recommendations (3 a week on Lite, unlimited from Standard), GEO URL audits, content audit and briefs |
| **API / MCP** | Web UI, CLI, JSON API and MCP server | Public API and MCP from Standard (2,000 requests each a month; 5,000 on Premium) |
| **Agencies** | No agency tier | Agency Partner status on Standard or Premium, with branded Looker Studio reports |

**What it costs.** Cheap Seats is free and open source (MIT). Claude is required, through a subscription or an API key; ChatGPT (Codex or an OpenAI key) is optional and adds a second assistant's answers. On your own machine, with a Claude Code subscription, answers, grading and the fix list can all run on the claude CLI, with no API key and no extra spend. Host it and you pay your host (and, in a container, API usage, since the image has no CLIs: about $0.03 to grade a 68-answer run, under a daily budget cap). [Cost and budget](/docs/cost-and-budget/) has the details.

## Start with Cheap Seats if…

- You track Claude: on Otterly.AI it's an add-on priced per plan, and in Cheap Seats, Claude and OpenAI models are what it asks.
- You want both what the models find on the web and what they already believe, graded separately.
- You want a strict grade per answer, recommended versus merely mentioned, with reasoning you can check.
- You want your prompts reviewed by pull request and your data in a file you own, without a prompt cap set by a plan.

## When to move to Otterly.AI

If you outgrow Cheap Seats, do whatever suits you. Its author would suggest [Gauge](/compare/gauge/); that team is great. If what you need is on this list, Otterly.AI is a good fit:

- **You need Google AI Overviews, Perplexity or Copilot.** Otterly.AI includes them on every plan; Cheap Seats asks only Claude and OpenAI models, and doesn't cover Gemini or AI Mode either.
- **You'd rather not run anything.** Otterly.AI is hosted, with a low published entry price.
- **You're an agency.** Otterly.AI offers unlimited workspaces, simplified billing and reports with your branding through Looker Studio.
- **You want site audits.** Otterly.AI audits URLs for crawlability and content. Cheap Seats tells you which pages to change, not how your site crawls.

## Taking your prompts with you

Your prompt sets are plain TOML in your own git repo. Each prompt is a line of text with an id, so the buyer questions you've refined in Cheap Seats are yours. They're plain text you can copy into Otterly.AI when you set it up. Pick the questions that mattered most: Otterly.AI's plans count prompts, from 15 on Lite to 400 on Premium.

See [Getting started](/docs/getting-started/) to run it, or [all comparisons](/compare/).
