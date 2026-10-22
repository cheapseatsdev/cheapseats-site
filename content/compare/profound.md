---
title: Popcorn vs Profound
description: Popcorn, the MIT-licensed, self-hosted AI visibility tracker at popcorn.zone, compared with Profound on engines, pricing, hosting, prompts, grading, fixes and API, as of October 2026.
weight: 10
---

Popcorn (popcorn.zone) is the MIT-licensed, self-hosted AI visibility tracker. Profound is a hosted enterprise platform for AI search visibility and marketing agents. Popcorn is free and open source, runs on your laptop or a host you choose, and asks Claude and OpenAI models; Profound tracks up to nine answer engines, including Gemini, Perplexity, Copilot and Google AI Overviews, with SOC 2, SSO and custom enterprise pricing.

## Side by side

As of October 2026, from Popcorn's docs and Profound's own [pricing](https://www.tryprofound.com/pricing) and [home](https://www.tryprofound.com/) pages:

| | Popcorn | Profound |
| --- | --- | --- |
| **Price** | Free and open source (MIT). Run it locally, or pay your own host to run it. | Free trial (50 prompts, run daily for 7 days); Enterprise is custom. An Agency Growth plan is offered; see [their pricing page](https://www.tryprofound.com/pricing). |
| **Where it runs** | Self-hosted: one Docker container with SQLite, on Docker, Kubernetes (Helm chart) or an exe.dev VM | Hosted SaaS |
| **Engines** | Claude and OpenAI models, through their APIs or the Claude Code and Codex CLIs | Trial: ChatGPT, Gemini, Google AI Overviews. Enterprise: up to 9 of ChatGPT, Perplexity, Google AI Mode, Gemini, Microsoft Copilot, DeepSeek, Claude, Google AI Overviews and Exa Search |
| **Your prompts** | TOML in your own git repo, changed by pull request | Enterprise: a tailored prompt plan; prompts can be edited, disabled or added |
| **Web search vs memory** | Both, as separate tracks (search and recall), reported separately | Not stated |
| **Grading** | Each answer graded recommended, mentioned or absent, with position, top pick, every product named (share of voice) and objections | Not detailed on the pricing page |
| **What to fix** | A ranked fix list every run: the page, what it must say, the prompts it should flip, the owner, and a Claude Code prompt | "Suggestions" (limited on the trial, unlimited on Enterprise); AI Marketer agents that draft and stage content |
| **API / MCP** | Web UI, CLI, JSON API and MCP server | API on Enterprise (none on the trial); exports in CSV and JSON. MCP not mentioned |
| **Security and data** | Your SQLite file; prompts and answers go only to the model providers you configure | SSO/SAML and SOC 2 on Enterprise |

**Model usage.** Popcorn's software is free; the model calls aren't. Grading always uses the Anthropic API, about $0.03 for a 68-answer run. Answers can come from the Claude Code and Codex subscriptions you already pay for, or from the APIs under a daily budget cap.

## When Profound is the better choice

- **You need engines Popcorn doesn't ask.** Popcorn doesn't cover Gemini, Perplexity, Microsoft Copilot, DeepSeek, Google AI Overviews or AI Mode. Profound lists all of them.
- **You need enterprise procurement boxes ticked.** Profound lists SOC 2, SSO/SAML and dedicated support with an SLA. Popcorn is software you run, so its security is your own.
- **You want content produced for you.** Profound's AI Marketer drafts pages, social posts and launch material. Popcorn tells you which page to write and what it must say, and hands you a Claude Code prompt, but your team ships it.
- **You're an agency.** Profound has an agency plan with per-client workspaces. Popcorn has no agency tier.

## When Popcorn is the better choice

- You want to start without a sales call or a contract, and keep running it.
- Your buyers ask Claude and ChatGPT-family models, and you want both what they find on the web and what they already believe, graded separately and strictly.
- You want your prompts reviewed like code, and your data in a file you own.
- You want each run to end with a short, ranked list of the exact pages to change.

Popcorn is not affiliated with Bad Popcorn (badpopcorn.ai), Popcorn AI (trypopcorn.ai), popcorn.ai, popcorn.co or Reclaim Protocol's popcorn-oss. See [Getting started](/docs/getting-started/) to run it, or [all comparisons](/compare/).
