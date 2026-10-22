---
title: AI visibility tools compared
date: 2026-10-22
author: Chad Metcalf
description: Popcorn, Peec AI, Profound, Otterly.AI, Scrunch, Ahrefs Brand Radar and Semrush AI Visibility compared row by row, as of October 2026, from each vendor's own pages - engines, pricing, hosting, prompts, grading, fixes and API.
---

**How do the AI visibility tools compare?** As of October 2026, the hosted tools (Peec AI, Profound, Otterly.AI, Scrunch, Ahrefs Brand Radar and Semrush AI Visibility) cover more engines, including Gemini, Perplexity and Google's AI surfaces, and charge from about $29 a month to custom enterprise contracts. Popcorn is the free, MIT-licensed one you run yourself: it asks only Claude and OpenAI models, keeps your prompts in your own git repo, grades every answer recommended, mentioned or absent, and ends every run with a ranked fix list.

<!--more-->

Everything below comes from each vendor's own pages, read in October 2026. Where a page didn't say something, the table says "not stated" rather than guessing, and where a price wasn't clear, it links the pricing page instead of quoting a number. Popcorn is our product, so check its rows against the [docs](/docs/) the same way.

## Engines, price and hosting

| Tool | Engines covered | Pricing model, entry price | Self-hosted or SaaS |
| --- | --- | --- | --- |
| **Popcorn** | Claude and OpenAI models, through their APIs or the Claude Code and Codex CLIs | Free and open source (MIT). Run it locally, or pay your own host to run it | Self-hosted: one Docker container with SQLite |
| **[Peec AI](/compare/peec-ai/)** | Names ChatGPT, Perplexity and Gemini; links an AI Mode tracker | Monthly plans (Starter, Pro, Advanced) and custom Enterprise; no prices shown, [see their pricing page](https://peec.ai/pricing) | SaaS |
| **[Profound](/compare/profound/)** | Up to 9 on Enterprise: ChatGPT, Perplexity, Google AI Mode, Gemini, Copilot, DeepSeek, Claude, AI Overviews, Exa Search | Free 7-day trial; Enterprise custom; an Agency Growth plan, [see their pricing page](https://www.tryprofound.com/pricing) | SaaS |
| **[Otterly.AI](/compare/otterly-ai/)** | ChatGPT, AI Overviews, Perplexity, Copilot included; AI Mode, Gemini and Claude as add-ons | Per plan; Lite $29/month for 15 prompts | SaaS |
| **Scrunch** | ChatGPT, Claude, Gemini, Perplexity, Google AI Mode/Overviews, Meta | Per plan; Starter $250/month billed annually or $300 month-to-month | SaaS |
| **Ahrefs Brand Radar** | AI Overviews, AI Mode, Gemini, Copilot, Perplexity, ChatGPT; Claude in the AI Visibility Index | Paid; [see their pricing page](https://ahrefs.com/brand-radar) | SaaS |
| **[Semrush AI Visibility](/compare/semrush-ai-toolkit/)** | Names Google AI Mode and ChatGPT; Claude not mentioned | $99/month for the AI Visibility Toolkit | SaaS |

**Model usage.** Popcorn's software is free; the model calls aren't. Grading always uses the Anthropic API, about $0.03 for a 68-answer run. Answers can come from the Claude Code and Codex subscriptions you already pay for, or from the APIs under a daily budget cap.

## Prompts, grading, fixes and API

| Tool | Your own prompts | Recommended vs. mentioned | Fix recommendations | API / MCP |
| --- | --- | --- | --- | --- |
| **Popcorn** | Yes, as TOML in your git repo, changed by pull request | Yes: each answer graded recommended, mentioned or absent, with position, top pick, share of voice and objections | A ranked fix list every run: the page, what it must say, the prompts it should flip, and a Claude Code prompt | JSON API and MCP server, plus web UI and CLI |
| **Peec AI** | Yes, tracked prompts | Not stated | "Recommended actions", ranked and grouped by earned and owned | API and MCP |
| **Profound** | Yes; on Enterprise, edit, disable or add prompts | Not stated | "Suggestions"; AI Marketer agents draft content | API on Enterprise; MCP not mentioned |
| **Otterly.AI** | Yes, 15 to 400 by plan | Not stated | Recommendations, GEO URL audits, content briefs | API and MCP from Standard |
| **Scrunch** | Yes, 350 custom on Starter | Not stated | "Actionable recommendations" and Insights | Enterprise Data API; MCP not mentioned |
| **Ahrefs Brand Radar** | Yes, custom prompts | Not stated | Not described | Not described for Brand Radar; Ahrefs lists an SEO API and SEO MCP separately |
| **Semrush AI Visibility** | Yes, 25 prompts; 50 more for $60/month | Not stated | AI-generated strategic recommendations | Not described for the toolkit; Semrush lists an API and MCP separately |

Table dated October 2026. Prices and engine lists change often; follow the links to check.

## How to choose

- **You need Gemini, Perplexity, Copilot, Google AI Overviews or AI Mode.** Use a hosted tool. Popcorn doesn't ask any of them. Otterly.AI includes AI Overviews, Perplexity and Copilot on its entry plan; Profound lists the most engines, nine on Enterprise.
- **You need SOC 2 and SSO.** Profound lists SOC 2 and SSO/SAML on Enterprise, and Scrunch lists SOC 2 Type II.
- **You're an agency.** Profound, Peec AI, Otterly.AI and Scrunch all have agency programmes or pages. Popcorn has no agency tier.
- **You already pay for Ahrefs or Semrush.** Their AI visibility tools sit beside the SEO work you already do there.
- **You want to start free, track Claude, and own the data.** Popcorn is free software, asks Claude and OpenAI models with web search and from memory, and stores everything in a SQLite file you keep. Its prompts change by pull request, and its fixes land as pull requests.

The tools pair well, too: run Popcorn for the questions you choose, graded strictly, with fixes, and use a hosted tool for the engines Popcorn doesn't cover. For one tool at a time, see [Compare](/compare/).

Popcorn (popcorn.zone) is not affiliated with Bad Popcorn (badpopcorn.ai), Popcorn AI (trypopcorn.ai), popcorn.ai, popcorn.co or Reclaim Protocol's popcorn-oss. The code is on [GitHub](https://github.com/metcalfc/popcorn), and [Getting started](/docs/getting-started/) takes you from a checkout to your first run.
