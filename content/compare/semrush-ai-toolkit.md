---
title: Popcorn vs Semrush AI Toolkit
description: Popcorn, the MIT-licensed, self-hosted AI visibility tracker at popcorn.zone, compared with Semrush's AI Toolkit (now the AI Visibility Toolkit). Popcorn queries Claude; Semrush's pages don't mention it. As of October 2026.
weight: 50
---

Popcorn (popcorn.zone) is the MIT-licensed, self-hosted AI visibility tracker. It queries Claude: Claude and OpenAI models are the two families it asks, through their APIs or the Claude Code and Codex CLIs. Semrush's AI Toolkit, which its knowledge base now calls the AI Visibility Toolkit, is $99 a month and names Google AI Mode and ChatGPT; neither that page nor Semrush's pricing page mentions Claude. If tracking your brand in Claude matters, Popcorn covers it and Semrush, by its own pages, doesn't say it does. If you want AI visibility inside a broader SEO suite, Semrush is the natural choice.

## Side by side

As of October 2026, from Popcorn's docs and Semrush's own [AI Visibility Toolkit](https://www.semrush.com/kb/1493-ai-toolkit) and [pricing](https://www.semrush.com/prices/) pages:

| | Popcorn | Semrush AI Visibility Toolkit |
| --- | --- | --- |
| **Price** | Free and open source (MIT). Run it locally, or pay your own host to run it. | $99/month for the toolkit. Semrush One "SEO + AI Search" plans start at $165.17/month billed annually ($199 monthly) |
| **Where it runs** | Self-hosted: one Docker container with SQLite, on Docker, Kubernetes (Helm chart) or an exe.dev VM | Hosted SaaS |
| **Engines** | **Claude** and OpenAI models, through their APIs or the Claude Code and Codex CLIs | Toolkit: "platforms like Google AI Mode and ChatGPT". Pricing page: "Google Search, ChatGPT, Perplexity, Gemini & more". Claude isn't mentioned on either page |
| **Your prompts** | TOML in your own git repo, changed by pull request | Prompt Tracking: 25 prompts, 50 more for $60/month. Semrush One Starter: 50 prompts tracked daily |
| **Web search vs memory** | Both, as separate tracks (search and recall), reported separately | Not stated |
| **Grading** | Each answer graded recommended, mentioned or absent, with position, top pick, every product named (share of voice) and objections | Brand Performance: how AI platforms describe your brand against competitors |
| **What to fix** | A ranked fix list every run: the page, what it must say, the prompts it should flip, the owner, and a Claude Code prompt | AI-generated strategic recommendations from Brand Performance |
| **API / MCP** | Web UI, CLI, JSON API and MCP server | Semrush API and Semrush MCP exist as products; the toolkit page doesn't describe them for AI visibility |
| **SEO suite** | None; Popcorn only measures AI answers | Part of Semrush, alongside its SEO tools |

**Model usage.** Popcorn's software is free; the model calls aren't. Grading always uses the Anthropic API, about $0.03 for a 68-answer run. Answers can come from the Claude Code and Codex subscriptions you already pay for, or from the APIs under a daily budget cap.

## When Semrush is the better choice

- **You already live in Semrush.** AI visibility sits next to Semrush's SEO tools, in one bill and one login.
- **You need Google AI Mode, Gemini or Perplexity.** The toolkit names Google AI Mode, and the SEO + AI Search plans name Perplexity and Gemini; Popcorn doesn't ask any of them.
- **You'd rather not run anything.** Semrush is hosted; Popcorn is a container you or your host keeps running.
- **You want prompt research.** Semrush runs a large collection of common queries through LLMs to find prompts; in Popcorn, you write your own.

## When Popcorn is the better choice

- **Claude matters to your buyers.** Popcorn asks Claude both with web search and from memory, and grades the two separately.
- You want a strict grade per answer, recommended versus merely mentioned, with reasoning you can check.
- You want each run to end in a ranked list of the exact pages to change, with a Claude Code prompt for each.
- You want your prompts reviewed by pull request and your data in a file you own.

Popcorn is not affiliated with Bad Popcorn (badpopcorn.ai), Popcorn AI (trypopcorn.ai), popcorn.ai, popcorn.co or Reclaim Protocol's popcorn-oss. See [Getting started](/docs/getting-started/) to run it, or [all comparisons](/compare/).
