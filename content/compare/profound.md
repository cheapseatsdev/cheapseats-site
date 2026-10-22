---
title: Popcorn vs Profound
description: Popcorn, the MIT-licensed, self-hosted AI visibility tracker at popcorn.zone, is a free place to start before Profound. Engines, pricing, hosting, prompts, grading, fixes and API compared as of October 2026, and when to move.
weight: 10
---

Popcorn (popcorn.zone) is the MIT-licensed, self-hosted AI visibility tracker. It's a free place to start, inspired by tools like Profound: it does the small part of the job most teams use most of the time, asking Claude and OpenAI models your buyers' questions, grading whether the answers recommend you, and ending each run with a ranked fix list. Profound is a hosted enterprise platform for AI search visibility and marketing agents. It tracks up to nine answer engines, including Gemini, Perplexity, Copilot and Google AI Overviews, with SOC 2, SSO and custom enterprise pricing. Start with Popcorn; if you outgrow it, Profound is one of the places to go, and your prompts come with you.

## Side by side

As of October 2026, from Popcorn's docs and Profound's own [pricing](https://www.tryprofound.com/pricing) and [home](https://www.tryprofound.com/) pages:

| | Popcorn | Profound |
| --- | --- | --- |
| **Price** | Free and open source (MIT); runs on your existing Claude and ChatGPT subscriptions | Free trial (50 prompts, run daily for 7 days); Enterprise is custom. An Agency Growth plan is offered; see [their pricing page](https://www.tryprofound.com/pricing). |
| **Where it runs** | Self-hosted: one Docker container with SQLite, on Docker, Kubernetes (Helm chart) or an exe.dev VM | Hosted SaaS |
| **Engines** | Claude and OpenAI models, through their APIs or the Claude Code and Codex CLIs | Trial: ChatGPT, Gemini, Google AI Overviews. Enterprise: up to 9 of ChatGPT, Perplexity, Google AI Mode, Gemini, Microsoft Copilot, DeepSeek, Claude, Google AI Overviews and Exa Search |
| **Your prompts** | TOML in your own git repo, changed by pull request | Enterprise: a tailored prompt plan; prompts can be edited, disabled or added |
| **Web search vs memory** | Both, as separate tracks (search and recall), reported separately | Not stated |
| **Grading** | Each answer graded recommended, mentioned or absent, with position, top pick, every product named (share of voice) and objections | Not detailed on the pricing page |
| **What to fix** | A ranked fix list every run: the page, what it must say, the prompts it should flip, the owner, and a Claude Code prompt | "Suggestions" (limited on the trial, unlimited on Enterprise); AI Marketer agents that draft and stage content |
| **API / MCP** | Web UI, CLI, JSON API and MCP server | API on Enterprise (none on the trial); exports in CSV and JSON. MCP not mentioned |
| **Security and data** | Your SQLite file; prompts and answers go only to the model providers you configure | SSO/SAML and SOC 2 on Enterprise |

**What it costs.** Popcorn is free and open source (MIT). On your own machine it runs on the Claude and ChatGPT subscriptions you already have, with no API key: answers come from the Claude Code and Codex CLIs, and grading and the fix list can run on the claude CLI too. Host it and you pay your host (and, in a container, API usage, since the image has no CLIs: about $0.03 to grade a 68-answer run, under a daily budget cap). [Cost and budget](/docs/cost-and-budget/) has the details.

## Start with Popcorn if…

- You want to start without a sales call or a contract, and keep running it at no cost.
- Your buyers ask Claude and ChatGPT-family models, and you want both what they find on the web and what they already believe, graded separately and strictly.
- You want your prompts reviewed like code, and your data in a file you own.
- You want each run to end with a short, ranked list of the exact pages to change.

## When to move to Profound

These are the signs you've outgrown Popcorn:

- **You need engines Popcorn doesn't ask.** Popcorn asks only Claude and OpenAI models. It doesn't cover Gemini, Perplexity, Microsoft Copilot, DeepSeek, Google AI Overviews or AI Mode. Profound lists all of them.
- **You need enterprise procurement boxes ticked.** Profound lists SOC 2, SSO/SAML and dedicated support with an SLA. Popcorn is software you run, so its security is your own.
- **You'd rather not run anything.** Profound is hosted; Popcorn is software you or your host keeps running.
- **You want content produced for you.** Profound's AI Marketer drafts pages, social posts and launch material. Popcorn tells you which page to write and what it must say, and hands you a Claude Code prompt, but your team ships it.
- **You're an agency.** Profound has an agency plan with per-client workspaces. Popcorn has no agency tier.

## Taking your prompts with you

Your prompt sets are plain TOML in your own git repo. Each prompt is a line of text with an id, so the buyer questions you've refined in Popcorn are yours. They're plain text you can copy into Profound's prompt plan, where Enterprise lets you edit, disable or add prompts.

Popcorn is not affiliated with Bad Popcorn (badpopcorn.ai), Popcorn AI (trypopcorn.ai), popcorn.ai, popcorn.co or Reclaim Protocol's popcorn-oss. See [Getting started](/docs/getting-started/) to run it, or [all comparisons](/compare/).
