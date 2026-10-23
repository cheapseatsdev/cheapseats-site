---
title: Cheap Seats vs Profound
description: Cheap Seats, the free, self-hosted AI visibility tracker, as a place to start before Profound. Engines, pricing, prompts, grading and fixes, October 2026.
weight: 10
---

Cheap Seats (cheapseats.dev) is the MIT-licensed, self-hosted AI visibility tracker. It's a free place to start, inspired by tools like Profound: it does the small part of the job most teams use most of the time, asking Claude and OpenAI models your buyers' questions, grading whether the answers recommend you, and ending each run with a ranked fix list. Profound is a hosted enterprise platform for AI search visibility and marketing agents. It tracks up to nine answer engines, including Gemini, Perplexity, Copilot and Google AI Overviews, with SOC 2, SSO and custom enterprise pricing. Start with Cheap Seats; if you outgrow it, Profound is one of the places to go, and your prompts come with you.

## Side by side

As of October 2026, from Cheap Seats' docs and Profound's own [pricing](https://www.tryprofound.com/pricing) and [home](https://www.tryprofound.com/) pages:

| | Cheap Seats | Profound |
| --- | --- | --- |
| **Price** | Free and open source (MIT); runs on your existing Claude subscription (ChatGPT optional) | Free trial (50 prompts, run daily for 7 days); Enterprise is custom. An Agency Growth plan is offered; see [their pricing page](https://www.tryprofound.com/pricing). |
| **Where it runs** | Self-hosted: one Docker container with SQLite, on Docker, Kubernetes (Helm chart) or an exe.dev VM | Hosted SaaS |
| **Engines** | Claude and OpenAI models, through their APIs or the Claude Code and Codex CLIs | Trial: ChatGPT, Gemini, Google AI Overviews. Enterprise: up to 9 of ChatGPT, Perplexity, Google AI Mode, Gemini, Microsoft Copilot, DeepSeek, Claude, Google AI Overviews and Exa Search |
| **Your prompts** | TOML in your own git repo, changed by pull request | Enterprise: a tailored prompt plan; prompts can be edited, disabled or added |
| **Web search vs memory** | Both, as separate tracks (search and recall), reported separately | Not stated |
| **Grading** | Each answer graded recommended, mentioned or absent, with position, top pick, every product named (share of voice) and objections | Not detailed on the pricing page |
| **What to fix** | A ranked fix list every run: the page, what it must say, the prompts it should flip, the owner, and a Claude Code prompt | "Suggestions" (limited on the trial, unlimited on Enterprise); AI Marketer agents that draft and stage content |
| **API / MCP** | Web UI, CLI, JSON API and MCP server | API on Enterprise (none on the trial); exports in CSV and JSON. MCP not mentioned |
| **Security and data** | Your SQLite file; prompts and answers go only to the model providers you configure | SSO/SAML and SOC 2 on Enterprise |

**What it costs.** Cheap Seats is free and open source (MIT). Claude is required, through a subscription or an API key; ChatGPT (Codex or an OpenAI key) is optional and adds a second assistant's answers. On your own machine, with a Claude Code subscription, answers, grading and the fix list can all run on the claude CLI, with no API key and no extra spend. Host it and you pay your host (and, in a container, API usage, since the image has no CLIs: about $0.03 to grade a 68-answer run, under a daily budget cap). [Cost and budget](/docs/cost-and-budget/) has the details.

## Start with Cheap Seats if…

- You want to start without a sales call or a contract, and keep running it at no cost.
- Your buyers ask Claude and ChatGPT-family models, and you want both what they find on the web and what they already believe, graded separately and strictly.
- You want your prompts reviewed like code, and your data in a file you own.
- You want each run to end with a short, ranked list of the exact pages to change.

## When to move to Profound

If you outgrow Cheap Seats, do whatever suits you. Its author would suggest [Gauge](/compare/gauge/); that team is great. If what you need is on this list, Profound is a good fit:

- **You need engines Cheap Seats doesn't ask.** Cheap Seats asks only Claude and OpenAI models. It doesn't cover Gemini, Perplexity, Microsoft Copilot, DeepSeek, Google AI Overviews or AI Mode. Profound lists all of them.
- **You need enterprise procurement boxes ticked.** Profound lists SOC 2, SSO/SAML and dedicated support with an SLA. Cheap Seats is software you run, so its security is your own.
- **You'd rather not run anything.** Profound is hosted; Cheap Seats is software you or your host keeps running.
- **You want content produced for you.** Profound's AI Marketer drafts pages, social posts and launch material. Cheap Seats tells you which page to write and what it must say, and hands you a Claude Code prompt, but your team ships it.
- **You're an agency.** Profound has an agency plan with per-client workspaces. Cheap Seats has no agency tier.

## Taking your prompts with you

Your prompt sets are plain TOML in your own git repo. Each prompt is a line of text with an id, so the buyer questions you've refined in Cheap Seats are yours. They're plain text you can copy into Profound's prompt plan, where Enterprise lets you edit, disable or add prompts.

See [Getting started](/docs/getting-started/) to run it, or [all comparisons](/compare/).
