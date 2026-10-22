---
title: Popcorn vs Gauge
description: Popcorn, the MIT-licensed, self-hosted AI visibility tracker at popcorn.zone, compared with Gauge, including Popcorn's ranked fix list against Gauge's Action Center, as of October 2026.
weight: 40
---

Popcorn (popcorn.zone) is the MIT-licensed, self-hosted AI visibility tracker. It started as a small, self-hosted take on Gauge, so the two share an idea: measuring AI visibility is only useful if it ends in work to do. Gauge is a hosted agent-led growth platform whose Action Center lets a team review, assign and track recommended actions, with a monthly content engine on top. Popcorn ends every run with a ranked fix list you act on in your own repo, and is free and open source.

## Side by side

As of October 2026, from Popcorn's docs and Gauge's own [pricing](https://withgauge.com/pricing) and [home](https://withgauge.com/) pages:

| | Popcorn | Gauge |
| --- | --- | --- |
| **Price** | Free and open source (MIT). Run it locally, or pay your own host to run it. | Growth $599/month; Enterprise custom |
| **Where it runs** | Self-hosted: one Docker container with SQLite, on Docker, Kubernetes (Helm chart) or an exe.dev VM | Hosted SaaS |
| **Engines** | Claude and OpenAI models, through their APIs or the Claude Code and Codex CLIs | Growth: ChatGPT, Google AI Mode, Microsoft Copilot. Enterprise adds Google AI Overviews, Gemini and Perplexity. Claude and Grok on any plan with your own Anthropic or xAI API key |
| **Your prompts** | TOML in your own git repo, changed by pull request | 600 prompts, run daily, on Growth; custom on Enterprise |
| **Web search vs memory** | Both, as separate tracks (search and recall), reported separately | Not stated |
| **Grading** | Each answer graded recommended, mentioned or absent, with position, top pick, every product named (share of voice) and objections | Sentiment analysis on Enterprise |
| **What to fix** | A ranked fix list every run (below) | Action Center: "Review, assign, and track recommended actions", plus a content engine (18 articles a month on Growth) |
| **API / MCP** | Web UI, CLI, JSON API and MCP server | MCP and a CLI; Slack integration. API not mentioned |
| **Coding agents** | Not covered | Gauge Agents runs evaluations with Claude Code, Codex and Cursor |

**Model usage.** Popcorn's software is free; the model calls aren't. Grading always uses the Anthropic API, about $0.03 for a 68-answer run. Answers can come from the Claude Code and Codex subscriptions you already pay for, or from the APIs under a daily budget cap.

## Ranked fix list vs Action Center

Gauge's [Action Center](https://withgauge.com/) is a workflow: recommended actions that a team reviews, assigns to owners and tracks, alongside a content engine that writes articles for you.

Popcorn's fix list is a ranked short list built from the run you just read. Each fix names:

- **where**: the exact page to create or change, with its site and owner;
- **must say**: the facts the answers were missing;
- **the prompts it should flip**, and the page that wins them today;
- **done when**: a test the next run checks;
- **a prompt for Claude Code** that makes the change in your repo.

When a pull request ships the fix, you mark the fix with that PR, and the next run re-asks the questions. The loop runs through your repo and your review process, not a task board, and Popcorn doesn't write content for you. [From fix to pull request](/docs/fix-to-pull-request/) walks through it.

## When Gauge is the better choice

- **You need Google AI Mode, Copilot, AI Overviews, Gemini or Perplexity.** Gauge tracks them; Popcorn asks Claude and OpenAI models directly and covers none of these.
- **You want content written for you.** Gauge's Growth plan includes a monthly content engine; Popcorn hands you a brief and a Claude Code prompt.
- **You want a team workflow.** The Action Center assigns and tracks actions across people, with seats and Slack.
- **You want coding-agent evaluations** of how Claude Code, Codex and Cursor treat your product.
- **You want strategy help.** Gauge Enterprise includes recurring sessions with the Gauge team.

## When Popcorn is the better choice

- You want the core loop, measure, grade, fix, without a $599 monthly plan.
- You want both what the models find on the web and what they already believe, graded separately and strictly.
- You want fixes that land as pull requests in your own repo, with prompts kept beside them.
- You want your data in a file you own.

Popcorn is not affiliated with Bad Popcorn (badpopcorn.ai), Popcorn AI (trypopcorn.ai), popcorn.ai, popcorn.co or Reclaim Protocol's popcorn-oss. See [Getting started](/docs/getting-started/) to run it, or [all comparisons](/compare/).
