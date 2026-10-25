---
title: Cheap Seats vs Profound
description: "Cheap Seats, the free, self-hosted AI visibility tracker, beside Profound: engines, how each asks and grades, history, fixes and price, October 2026."
weight: 10
---
Profound is a hosted enterprise platform for AI search visibility and marketing agents. It captures answers from the consumer front ends of up to nine answer engines, including Google AI Overviews and AI Mode, Gemini, Perplexity and Copilot, with SOC 2 Type II, SSO and custom enterprise pricing. [Cheap Seats](/compare/) asks only Claude and OpenAI models, directly, and grades each answer; this page says where that is enough and where Profound's reach is the point.

## Side by side

As of October 2026, from Cheap Seats' docs and Profound's own pages, linked in each row:

| | Cheap Seats | Profound |
| --- | --- | --- |
| **Price** | Free MIT software; API calls or installed subscription CLIs ([cost and budget](/docs/cost-and-budget/)) | Free trial (50 prompts, run daily for 7 days). Agency Growth: 400 credits a month per client workspace, with no price on the pricing page; Profound's [agency launch post](https://www.tryprofound.com/blog/agencies-launch-your-aeo-practice-with-profound) of November 2025 put it at $399 a month per client workspace. Enterprise is custom ([pricing](https://www.tryprofound.com/pricing)) |
| **Where it runs** | Self-hosted SQLite; Docker, Helm or exe.dev ([self-hosting](/docs/self-hosting/)) | Hosted SaaS |
| **Engines** | Claude and OpenAI models, through their APIs or the Claude Code and Codex CLIs | Trial: ChatGPT, Gemini, Google AI Overviews. Enterprise: "up to 9" of ChatGPT, Perplexity, Google AI Mode, AI Overviews, Gemini, Copilot, DeepSeek, Claude and Exa ([pricing](https://www.tryprofound.com/pricing)); the product page lists Grok in place of Exa ([Answer Engine Insights](https://www.tryprofound.com/features/answer-engine-insights)) |
| **Web search vs memory** | Search and recall, as separate tracks ([two tracks](/docs/how-grading-works/#two-tracks)) | "We capture directly from the browser" ([Answer Engine Insights](https://www.tryprofound.com/features/answer-engine-insights)): one answer, searching when the app decides; not split |
| **Your prompts** | TOML in your own git repo, changed by pull request; `samples` per answerer and track | Trial: a recommended set you can't edit. Enterprise: a tailored prompt plan, edited in [Prompt Designer](https://docs.tryprofound.com/answer-engine-insights/prompt-designer); one run per prompt, model, region, persona and day ([why past numbers change](https://docs.tryprofound.com/cookbook/metrics/why-past-numbers-change)) |
| **Markets** | No region, language or persona settings | Region and language per prompt, from 150+ regions and 30+ languages ([Answer Engine Insights](https://www.tryprofound.com/features/answer-engine-insights)); up to three personas per category, each run as an extra prompt ([Personas](https://docs.tryprofound.com/answer-engine-insights/personas)) |
| **Grading** | Recommended, mentioned or absent; position, top pick, objections and optional fact checking ([how grading works](/docs/how-grading-works/)) | A model, the Entity Parser, lists the brands each answer names, and Name Matching joins variant names; which model is not stated ([settings](https://docs.tryprofound.com/answer-engine-insights/settings)). FactCheck scores claims against your Knowledge Base ([FactCheck](https://docs.tryprofound.com/answer-engine-insights/factcheck/about)) |
| **Noise** | 95% intervals on named, recommended and top pick; changes tested against noise ([how big a change](/docs/noise-and-confidence/)) | A published study of daily noise ([Is once a day enough?](https://www.tryprofound.com/blog/is-once-a-day-enough)); no intervals stated on the numbers |
| **History** | Grades fixed when graded; re-grade when you choose, keeping the old grades | Stored answers are never re-analysed; today's topics, tags and brands are applied to them ([why past numbers change](https://docs.tryprofound.com/cookbook/metrics/why-past-numbers-change)) |
| **What to fix** | Ranked fix briefs; before/after attempt checks ([from fix to pull request](/docs/fix-to-pull-request/)) | Suggestions (limited on the trial, unlimited on Enterprise); an AI Marketer and Agents that draft and refresh content ([AI Marketer](https://docs.tryprofound.com/aim/about)) |
| **Alerts** | None; trends and fix outcomes on the set's pages | Agents can run on a trigger, such as visibility moving 5%, and post to Slack or Teams ([October release](https://product.tryprofound.com/changelog/meet-the-new-agents-work-with-your-ai-marketer-in)) |
| **API / MCP** | Web UI, CLI, JSON API and MCP server | REST API and MCP server on Enterprise ([REST API](https://docs.tryprofound.com/rest-api/introduction), [MCP](https://docs.tryprofound.com/mcp/overview)); an official Claude connector ([connector](https://www.tryprofound.com/blog/the-profound-connector-is-live-in-claude-part-2)); CSV and JSON exports |
| **Security and data** | Your SQLite file; calls go to configured providers | SOC 2 Type II; SSO via SAML or OIDC ([enterprise](https://www.tryprofound.com/enterprise)); hosted by Profound |

## What's the same

Both check claims against supplied facts, expose search queries, import crawler logs and provide MCP access. Profound documents these as [FactCheck](https://docs.tryprofound.com/answer-engine-insights/factcheck/about), [Query Fanouts](https://www.tryprofound.com/blog/introducing-query-fanouts) and [Agent Analytics](https://www.tryprofound.com/features/agent-analytics).

Profound's [noise study](https://www.tryprofound.com/blog/is-once-a-day-enough) separates same-day sampling noise from day-to-day drift. Cheap Seats uses that split to assess whether extra samples help ([method](/docs/noise-and-confidence/#when-more-samples-help)).

## What's different

- **Grading:** Profound extracts brand names; Cheap Seats distinguishes recommendation from mention and retains a checked evidence quote ([rubric](/docs/how-grading-works/)).
- **Denominator:** Profound's visibility uses answers naming [any brand](https://docs.tryprofound.com/cookbook/metrics/how-metrics-are-calculated); Cheap Seats' named rate uses all graded answers. Profound then weights models equally; a Cheap Seats run pools answers and shows each answerer separately. See [metric mappings](/docs/comparing-metrics/).
- **Content workflow:** Profound's [AI Marketer](https://docs.tryprofound.com/aim/about) plans and drafts work through Agents. Cheap Seats supplies briefs and Claude Code prompts; your team ships the page.
- **Additional data:** Profound's [Prompt Volumes](https://docs.tryprofound.com/prompt-volumes/faq) estimates real-user question volume from licensed panels, and [Shopping](https://docs.tryprofound.com/shopping/about) tracks ChatGPT shopping placements. Cheap Seats has neither.

## Start with Cheap Seats if…

You want a self-hosted tracker for Claude and OpenAI models. Software is free; model usage and hosting depend on your setup. See [cost and budget](/docs/cost-and-budget/).

## When to move to Profound

- **You need engines Cheap Seats doesn't ask, or the app's own answer.** Cheap Seats asks only Claude and OpenAI models, directly. It doesn't cover Gemini, Perplexity, Microsoft Copilot, Grok, DeepSeek, Google AI Overviews or AI Mode, and it doesn't see what a consumer app adds. Profound lists all of them and captures the app.
- **You sell in several markets.** Profound sets a region and language for each prompt, and runs personas beside the bare question. Cheap Seats has no such settings.
- **You want to know which questions people actually ask.** Profound's Prompt Volumes comes from licensed panel data. Cheap Seats' prompts are the ones you write.
- **You need enterprise procurement boxes ticked.** Profound lists SOC 2, SSO/SAML and support up to a dedicated specialist with a 24-hour SLA ([pricing](https://www.tryprofound.com/pricing)). Cheap Seats is software you run, so its security is your own.
- **You want content produced for you.** Profound's AI Marketer drafts pages, social posts and launch material ([Profound](https://www.tryprofound.com/)). Cheap Seats tells you which page to write and what it must say, and hands you a Claude Code prompt, but your team ships it.
- **You sell products through ChatGPT.** Profound's Shopping tracks your products in its shopping results, on Enterprise.
- **You're an agency.** Profound has an agency plan with per-client workspaces and short-lived pitch workspaces ([Agency Mode](https://docs.tryprofound.com/agencies/agency-mode-overview)). Cheap Seats has no agency tier.

## Taking your prompts with you

Copy your prompt text from TOML: copy them into Profound's prompt plan, or upload them as a CSV in [Prompt Designer](https://docs.tryprofound.com/answer-engine-insights/prompt-designer).

[All comparisons](/compare/).
