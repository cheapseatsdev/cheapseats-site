---
title: Popcorn vs Gauge
description: Popcorn, the free, MIT-licensed AI visibility tracker at popcorn.zone, started as a small take on Gauge, its inspiration. Compared with Gauge's Action Center and plans as of October 2026.
weight: 40
---

Popcorn (popcorn.zone) is a personal open-source project, MIT licensed and free, and it always will be. Its author wrote it to make his own product better, and Gauge was the inspiration: Popcorn started as a small, self-hosted take on it, and it owes Gauge its central idea, that measuring AI visibility is only useful if it ends in work to do. Gauge is a hosted agent-led growth platform whose Action Center lets a team review, assign and track recommended actions, with a monthly content engine on top.

## Why Popcorn exists

Gauge does a lot. Popcorn's author didn't need all of it, and already had Claude and ChatGPT subscriptions with tokens to spare. So Popcorn is the 20% of a tool like Gauge that you'll use 80% of the time: ask the assistants your buyers' questions, grade whether they recommend you, and end every run with a ranked fix list you act on in your own repo. There's no hosted tier and nothing to upsell.

If you want to get started at no cost, start here. If you grow out of it, Gauge is where Popcorn's author would point you: that team is great, and the prompts that got you started come with you.

## Side by side

As of October 2026, from Popcorn's docs and Gauge's own [pricing](https://withgauge.com/pricing) and [home](https://withgauge.com/) pages:

| | Popcorn | Gauge |
| --- | --- | --- |
| **Price** | Free and open source (MIT); runs on your existing Claude subscription (ChatGPT optional) | Growth $599/month; Enterprise custom |
| **Where it runs** | Self-hosted: one Docker container with SQLite, on Docker, Kubernetes (Helm chart) or an exe.dev VM | Hosted SaaS |
| **Engines** | Claude and OpenAI models, through their APIs or the Claude Code and Codex CLIs | Growth: ChatGPT, Google AI Mode, Microsoft Copilot. Enterprise adds Google AI Overviews, Gemini and Perplexity. Claude and Grok on any plan with your own Anthropic or xAI API key |
| **Your prompts** | TOML in your own git repo, changed by pull request | 600 prompts, run daily, on Growth; custom on Enterprise |
| **Web search vs memory** | Both, as separate tracks (search and recall), reported separately | Not stated |
| **Grading** | Each answer graded recommended, mentioned or absent, with position, top pick, every product named (share of voice) and objections | Sentiment analysis on Enterprise |
| **What to fix** | A ranked fix list every run (below) | Action Center: "Review, assign, and track recommended actions", plus a content engine (18 articles a month on Growth) |
| **API / MCP** | Web UI, CLI, JSON API and MCP server | MCP and a CLI; Slack integration. API not mentioned |
| **Coding agents** | Not covered | Gauge Agents runs evaluations with Claude Code, Codex and Cursor |

**What it costs.** Popcorn is free and open source (MIT). Claude is required, through a subscription or an API key; ChatGPT (Codex or an OpenAI key) is optional and adds a second assistant's answers. On your own machine, with a Claude Code subscription, answers, grading and the fix list can all run on the claude CLI, with no API key and no extra spend. Host it and you pay your host (and, in a container, API usage, since the image has no CLIs: about $0.03 to grade a 68-answer run, under a daily budget cap). [Cost and budget](/docs/cost-and-budget/) has the details.

## Ranked fix list vs Action Center

Gauge's [Action Center](https://withgauge.com/) is a workflow: recommended actions that a team reviews, assigns to owners and tracks, alongside a content engine that writes articles for you.

Popcorn's fix list is the small version of that idea: a ranked short list built from the run you just read. Each fix names:

- **where**: the exact page to create or change, with its site and owner;
- **must say**: the facts the answers were missing;
- **the prompts it should flip**, and the page that wins them today;
- **done when**: a test the next run checks;
- **a prompt for Claude Code** that makes the change in your repo.

When a pull request ships the fix, you mark the fix with that PR, and the next run re-asks the questions. The loop runs through your repo and your review process, not a task board, and Popcorn doesn't write content for you. [From fix to pull request](/docs/fix-to-pull-request/) walks through it.

## Start with Popcorn if…

- You want the core loop, measure, grade, fix, before committing to a $599 monthly plan.
- Your buyers ask Claude and ChatGPT-family models, and you want both what the models find on the web and what they already believe, graded separately and strictly.
- You want fixes that land as pull requests in your own repo, with prompts kept beside them.
- You want your data in a file you own while you learn which questions matter.

## When to move to Gauge

If you outgrow Popcorn, do whatever suits you; Gauge is the suggestion. These are the signs it's time:

- **You need Google AI Mode, Copilot, AI Overviews, Gemini or Perplexity.** Gauge tracks them; Popcorn asks only Claude and OpenAI models and covers none of these.
- **You'd rather not run anything.** Gauge is hosted; Popcorn is software you or your host keeps running.
- **You want content written for you.** Gauge's Growth plan includes a monthly content engine; Popcorn hands you a brief and a Claude Code prompt.
- **You want a team workflow.** The Action Center assigns and tracks actions across people, with seats and Slack.
- **You want coding-agent evaluations** of how Claude Code, Codex and Cursor treat your product.
- **You want strategy help.** Gauge Enterprise includes recurring sessions with the Gauge team.

## Taking your prompts with you

Your prompt sets are plain TOML in your own git repo. Each prompt is a line of text with an id, so the buyer questions you've refined in Popcorn are yours. They're plain text you can copy into Gauge when you set it up, and your run history stays in your SQLite file.

Popcorn is not affiliated with Bad Popcorn (badpopcorn.ai), Popcorn AI (trypopcorn.ai), popcorn.ai, popcorn.co or Reclaim Protocol's popcorn-oss. See [Getting started](/docs/getting-started/) to run it, or [all comparisons](/compare/).
