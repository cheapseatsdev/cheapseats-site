---
title: Cheap Seats vs Semrush AI Toolkit
description: Cheap Seats, the MIT-licensed, self-hosted AI visibility tracker at cheapseats.dev, is a free place to start before Semrush's AI Toolkit (now the AI Visibility Toolkit). Cheap Seats queries Claude; Semrush's pages don't mention it. As of October 2026.
weight: 50
---

Cheap Seats (cheapseats.dev) is the MIT-licensed, self-hosted AI visibility tracker. It's a free place to start, inspired by tools like Semrush's AI Toolkit, which its knowledge base now calls the AI Visibility Toolkit: Cheap Seats asks Claude and OpenAI models your buyers' questions, through their APIs or the Claude Code and Codex CLIs, grades whether the answers recommend you, and ends each run with a ranked fix list. Semrush's toolkit is $99 a month and names Google AI Mode and ChatGPT; neither that page nor Semrush's pricing page mentions Claude. If tracking your brand in Claude matters, Cheap Seats covers it. If you want AI visibility inside a broader SEO suite, Semrush is the natural place to go when you outgrow Cheap Seats, and your prompts come with you.

## Side by side

As of October 2026, from Cheap Seats' docs and Semrush's own [AI Visibility Toolkit](https://www.semrush.com/kb/1493-ai-toolkit) and [pricing](https://www.semrush.com/prices/) pages:

| | Cheap Seats | Semrush AI Visibility Toolkit |
| --- | --- | --- |
| **Price** | Free and open source (MIT); runs on your existing Claude subscription (ChatGPT optional) | $99/month for the toolkit. Semrush One "SEO + AI Search" plans start at $165.17/month billed annually ($199 monthly) |
| **Where it runs** | Self-hosted: one Docker container with SQLite, on Docker, Kubernetes (Helm chart) or an exe.dev VM | Hosted SaaS |
| **Engines** | **Claude** and OpenAI models, through their APIs or the Claude Code and Codex CLIs | Toolkit: "platforms like Google AI Mode and ChatGPT". Pricing page: "Google Search, ChatGPT, Perplexity, Gemini & more". Claude isn't mentioned on either page |
| **Your prompts** | TOML in your own git repo, changed by pull request | Prompt Tracking: 25 prompts, 50 more for $60/month. Semrush One Starter: 50 prompts tracked daily |
| **Web search vs memory** | Both, as separate tracks (search and recall), reported separately | Not stated |
| **Grading** | Each answer graded recommended, mentioned or absent, with position, top pick, every product named (share of voice) and objections | Brand Performance: how AI platforms describe your brand against competitors |
| **What to fix** | A ranked fix list every run: the page, what it must say, the prompts it should flip, the owner, and a Claude Code prompt | AI-generated strategic recommendations from Brand Performance |
| **API / MCP** | Web UI, CLI, JSON API and MCP server | Semrush API and Semrush MCP exist as products; the toolkit page doesn't describe them for AI visibility |
| **SEO suite** | None; Cheap Seats only measures AI answers | Part of Semrush, alongside its SEO tools |

**What it costs.** Cheap Seats is free and open source (MIT). Claude is required, through a subscription or an API key; ChatGPT (Codex or an OpenAI key) is optional and adds a second assistant's answers. On your own machine, with a Claude Code subscription, answers, grading and the fix list can all run on the claude CLI, with no API key and no extra spend. Host it and you pay your host (and, in a container, API usage, since the image has no CLIs: about $0.03 to grade a 68-answer run, under a daily budget cap). [Cost and budget](/docs/cost-and-budget/) has the details.

## Start with Cheap Seats if…

- **Claude matters to your buyers.** Cheap Seats asks Claude both with web search and from memory, and grades the two separately.
- You want a strict grade per answer, recommended versus merely mentioned, with reasoning you can check.
- You want each run to end in a ranked list of the exact pages to change, with a Claude Code prompt for each.
- You want your prompts reviewed by pull request and your data in a file you own.

## When to move to Semrush

If you outgrow Cheap Seats, do whatever suits you. Its author would suggest [Gauge](/compare/gauge/); that team is great. If what you need is on this list, Semrush is a good fit:

- **You already live in Semrush.** AI visibility sits next to Semrush's SEO tools, in one bill and one login.
- **You need Google AI Mode, Gemini or Perplexity.** The toolkit names Google AI Mode, and the SEO + AI Search plans name Perplexity and Gemini; Cheap Seats asks only Claude and OpenAI models and doesn't cover any of them.
- **You'd rather not run anything.** Semrush is hosted; Cheap Seats is a container you or your host keeps running.
- **You want prompt research.** Semrush runs a large collection of common queries through LLMs to find prompts; in Cheap Seats, you write your own.

## Taking your prompts with you

Your prompt sets are plain TOML in your own git repo. Each prompt is a line of text with an id, so the buyer questions you've refined in Cheap Seats are yours. They're plain text you can copy into Semrush's Prompt Tracking when you set it up. The toolkit starts at 25 prompts, so bring the ones that mattered most.

See [Getting started](/docs/getting-started/) to run it, or [all comparisons](/compare/).
