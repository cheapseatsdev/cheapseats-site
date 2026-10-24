---
title: AI visibility tools compared
date: 2026-10-22
author: Chad Metcalf
description: Cheap Seats, Peec AI, Profound, Otterly.AI, Scrunch, Ahrefs Brand Radar, Semrush, Elmo and Limelit Open, row by row from their own pages, October 2026.
---

**How do the AI visibility tools compare?** As of October 2026, the hosted tools (Peec AI, Profound, Otterly.AI, Scrunch, Ahrefs Brand Radar and Semrush AI Visibility) cover more engines, including Gemini, Perplexity and Google's AI surfaces, and charge from about $29 a month to custom enterprise contracts. Elmo and Limelit Open are open source and cover those engines too, through vendor APIs and paid scraping services. Cheap Seats is an open-source project I wrote to make my own product better, inspired by those tools; it's free and always will be, and it does the part most teams use most of the time. It asks Claude and OpenAI models your buyers' questions, grades every answer recommended, mentioned or absent, ends every run with a ranked fix list, and runs on the Claude subscription you already have (ChatGPT optional). When you outgrow it, this page is how to choose where to go next.

<!--more-->

Everything below comes from each tool's own pages, read in October 2026. Where a page didn't say something, the table says "not stated" rather than guessing, and where a price wasn't clear, it links the pricing page instead of quoting a number. Cheap Seats is our product, so check its rows against the [docs](/docs/) the same way.

## Engines, price and hosting

| Tool | Engines covered | Pricing model, entry price | Self-hosted or SaaS |
| --- | --- | --- | --- |
| **Cheap Seats** | Claude and OpenAI models, through their APIs or the Claude Code and Codex CLIs | Free and open source (MIT); runs on your existing Claude subscription (ChatGPT optional) | Self-hosted: one Docker container with SQLite |
| **[Peec AI](/compare/peec-ai/)** | Monthly plans choose 3 of ChatGPT, Google AI Mode, AI Overviews, Copilot, Gemini and Naver AI; Enterprise up to 13, adding Claude, Perplexity, Grok, DeepSeek and more | Monthly plans (Starter 50, Pro 150, Advanced 350 prompts) and custom Enterprise; no prices shown, [see their pricing page](https://peec.ai/pricing) | SaaS |
| **[Profound](/compare/profound/)** | Up to 9 on Enterprise: ChatGPT, Perplexity, Google AI Mode, Gemini, Copilot, DeepSeek, Claude, AI Overviews, Exa Search | Free 7-day trial; Enterprise custom; an Agency Growth plan, [see their pricing page](https://www.tryprofound.com/pricing) | SaaS |
| **[Otterly.AI](/compare/otterly-ai/)** | ChatGPT, AI Overviews, Perplexity, Copilot included; AI Mode, Gemini and Claude as add-ons | Per plan; Lite $29/month for 15 prompts | SaaS |
| **Scrunch** | ChatGPT, Perplexity, Google AI Overviews and Copilot on Core; Enterprise adds Claude, Gemini, Google AI Mode, Meta AI and Grok | Per plan; Core $250/month (125 prompts, 5,000 responses a month), Enterprise custom; [see their pricing page](https://scrunch.com/pricing/) | SaaS |
| **Ahrefs Brand Radar** | AI Overviews, AI Mode, ChatGPT, Perplexity, Gemini, Copilot; Claude on Custom Prompts only, at 8 checks per update | Custom Prompts from $50/month, with a daily quota included on paid Ahrefs plans; the AI Visibility Index from $199/month; [see their page](https://ahrefs.com/brand-radar) | SaaS |
| **[Semrush AI Visibility](/compare/semrush-ai-toolkit/)** | ChatGPT, Google AI Mode and Gemini in Prompt Tracking; Claude only in the Enterprise AIO plan, per Semrush's blog | $99/month for the AI Visibility Toolkit | SaaS |
| **[Elmo](/compare/elmo/)** | ChatGPT, Google AI Mode, AI Overviews, Gemini, Perplexity and Copilot through paid scrapers; Claude, Grok, Mistral and others through direct APIs | Free and open source (MIT); you pay the scrapers, model APIs and a TypeSafe key. Elmo Cloud from $29/month | Self-hosted (Docker Compose, PostgreSQL) or SaaS |
| **[Limelit Open](/compare/limelit/)** | ChatGPT, Claude, Perplexity, Gemini through APIs; AI Overviews, AI Mode, Bing Copilot through scrapers | Free and open source (Apache-2.0); you pay your providers. Limelit Cloud credit packs from $19.99 | Self-hosted (one binary, SQLite); Cloud is SaaS |

**What Cheap Seats costs.** Nothing for the software; what the model calls cost, and how a Claude Code subscription makes that nothing too, is in [Cost and budget](/docs/cost-and-budget/).

## Prompts, grading, fixes and API

| Tool | Your own prompts | Recommended vs. mentioned | Fix recommendations | API / MCP |
| --- | --- | --- | --- | --- |
| **Cheap Seats** | Yes, as TOML in your git repo, changed by pull request | Yes: each answer graded recommended, mentioned or absent, with position, top pick, share of voice and objections; with your facts listed, what each answer got wrong about you | A ranked fix list every run: the page, what it must say, the prompts it should flip, and a Claude Code prompt | JSON API and MCP server, plus web UI and CLI |
| **Peec AI** | Yes, tracked prompts | Not graded; an answer counts when it contains your tracked name, an alias or your regex | Actions in four groups, from site fixes to mentions elsewhere, on a five-level impact rating | MCP on every paid plan; API on Enterprise |
| **Profound** | Yes; on Enterprise, edit, disable or add prompts | Not graded; a model lists the brands each answer names | "Suggestions"; AI Marketer agents draft content | API and hosted MCP on Enterprise |
| **Otterly.AI** | Yes, 15 to 400 by plan | Not graded; an exact text match of the names you list | Recommendations, GEO URL audits, content briefs | API and MCP from Standard |
| **Scrunch** | Yes, 125 unique prompts on Core | Not stated | "Insights & Recommendations", page optimizations and content generation | Query API access and MCP access on Enterprise |
| **Ahrefs Brand Radar** | Yes, custom prompts | Not stated | Not described | Not described for Brand Radar; Ahrefs lists an SEO API and SEO MCP separately |
| **Semrush AI Visibility** | Yes, 25 prompts; 50 more for $60/month | Not graded; its extraction system finds the brand, and Mentions counts prompts | AI-generated strategic recommendations | Toolkit data isn't in the Semrush API or MCP yet; CSV and Google Sheets export |
| **Elmo** | Yes, by hand or from an onboarding wizard | Mentions confirmed by a model, with sentiment; recommendation not graded | Opportunities: one LLM call over your data, refreshed about weekly | REST API, TypeScript and Python SDKs, MCP |
| **Limelit Open** | Yes, a starter pack plus your own | Not graded; a text search finds mentions, with list rank | Not in the open core (Cloud) | JSON API and MCP |

Table dated October 2026. Prices and engine lists change often; follow the links to check.

## Start with Cheap Seats

If you're just finding out whether AI assistants recommend you, start free. Cheap Seats asks Claude and OpenAI models your questions with web search and from memory, grades each answer strictly, and stores everything in a SQLite file you keep. Its prompts change by pull request, and its fixes land as pull requests. You'll learn which buyer questions matter, and those questions carry over to any tool you pick later.

## Free, open-source trackers

Three trackers here are open source and free to self-host. They differ more in approach than in price.

- **Cheap Seats** (MIT) asks Claude and OpenAI models directly, through their APIs or the `claude` and `codex` CLIs, so it runs on a subscription you already have. A Claude call grades every answer recommended, mentioned or absent; every rate carries an interval; each run ends in a fix list. No hosted tier. It doesn't reach Google's AI surfaces, Perplexity, Gemini or Copilot; [Which AI engines Cheap Seats asks](/docs/engines/) says why.
- **[Elmo](/compare/elmo/)** (MIT, Blue Whale Software) reaches the consumer surfaces through paid scrapers and adds direct model APIs. A TypeSafe model confirms each name match and reads sentiment. PostgreSQL, multi-brand, shareable reports, SDKs. Elmo Cloud is the hosted version.
- **[Limelit Open](/compare/limelit/)** (Apache-2.0) is one Go binary with SQLite and an MCP server, asking seven engines through APIs and scrapers, and finding your brand by deterministic text search. It's the open core of Limelit Cloud.

Others exist on GitHub, described here in their own words. They aren't reviewed on this site:

- [Canonry](https://github.com/Canonry/canonry) (MIT): "Agent-first AI SEO (AEO/GEO) operating platform".
- [Lettertrace](https://github.com/letterstory/lettertrace) (MIT): "Open source BYOK AEO telemetry".
- [OpenSight](https://github.com/shuvamk/opensight) (MIT): "See how AI talks about your brand".
- [Gego](https://github.com/AI2HU/gego) (GPL-3.0): "Generative Engine Optimization for your brand, track your GEO across all LLMs".
- [OneGlanse](https://github.com/oneglanse/oneglanse) (MIT): "Open-source AI visibility, AEO & GEO tracker", monitoring answers "through real product UIs".
- [GetCito](https://github.com/ai-search-guru/getcito-worlds-first-open-source-aio-aeo-or-geo-tool) (MIT): "Open source AI visibility tracking and optimization", self-hosted; its README says it is a fork of Elmo.
- [GEO/AEO Tracker](https://github.com/danishashko/geo-aeo-tracker) (MIT): "Open-source, self-hosted AI visibility tracker for GEO and AEO", with answers collected through Bright Data.

## How to choose where to go next

If you outgrow Cheap Seats, do whatever suits you. I'd suggest [Gauge](/compare/gauge/); that team is great. These are the usual signs, and where each points:

- **You need Gemini, Perplexity, Copilot, Google AI Overviews or AI Mode.** Cheap Seats asks only Claude and OpenAI models. Otterly.AI includes AI Overviews, Perplexity and Copilot on its entry plan; Profound lists the most engines, nine on Enterprise.
- **You need SOC 2 and SSO.** Profound lists SOC 2 and SSO/SAML on Enterprise, and Scrunch lists SOC 2 Type II.
- **You're an agency.** Profound, Peec AI, Otterly.AI and Scrunch all have agency programmes or pages. Cheap Seats has no agency tier.
- **You already pay for Ahrefs or Semrush.** Their AI visibility tools sit beside the SEO work you already do there.
- **You want open source, with more engines.** Elmo and Limelit Open reach Google's AI surfaces, Perplexity, Gemini and Copilot, through vendor APIs and paid scraping services.
- **You'd rather not run anything.** The hosted tools, and Elmo Cloud and Limelit Cloud, run it for you.

## Taking your prompts with you

Cheap Seats' prompt sets are plain TOML in your own git repo, each prompt a line of text with an id. The buyer questions you refined are yours: plain text you can copy into whichever tool you choose. You can also keep Cheap Seats running alongside, for the strict grading and the fix list. For one tool at a time, see [Compare](/compare/).

The code is on [GitHub](https://github.com/cheapseatsdev/cheapseats), and [Getting started](/docs/getting-started/) takes you from a checkout to your first run.
