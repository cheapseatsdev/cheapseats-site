---
title: Which AI engines Cheap Seats asks, and why
description: Claude and OpenAI coverage, the limits of API and CLI answers, and when you need other AI surfaces.
weight: 250
group: Reading what it finds
---

Cheap Seats asks **Claude and OpenAI models** through APIs or subscription CLIs and supports two configurable tracks. **Search** requires web retrieval before answering and records searches, returned URLs and citations. **Recall** uses no tools, so you see what the model already believes.

It doesn't ask the consumer ChatGPT or Claude apps, Google AI Overviews, AI Mode, Gemini, Perplexity or Microsoft Copilot. Cheap Seats avoids consumer-app scraping dependencies [by design](#why-not-scrape-the-consumer-apps). If those surfaces matter to your buyers, you need additional coverage.

## How Cheap Seats asks

| provider | asks | billed |
| --- | --- | --- |
| `claude-code` | Claude models through the `claude` CLI | your Claude subscription |
| `codex` | OpenAI models through the `codex` CLI | your ChatGPT subscription |
| `anthropic` | Claude models through the API | per token |
| `openai` | OpenAI models through the API | per token |

Claude is required; OpenAI adds an optional second assistant. CLIs run where installed, on your machine or a VM; Docker uses the APIs. CLI calls run in an empty directory with your coding instructions, hooks, skills, MCP servers and Codex config switched off. See [Configuration](../configuration/#answerers), [CLI answerers](../reference/#cli-answerers) and [Cost and budget](../cost-and-budget/).

## Search and recall

Cheap Seats reports the two tracks separately, unlike a consumer app that chooses when to browse. Both can vary between answers. [How grading works](../how-grading-works/#two-tracks) explains the tracks and samples.

## Why not scrape the consumer apps

Tracking a consumer surface requires obtaining the answer that surface rendered, rather than substituting an API model response. Other trackers use paid scraping services. Cheap Seats avoids that dependency so you can start on a subscription you already have.

Scraping adds:

- **Cost and setup:** another account, key and bill. Elmo estimates $0.15–$2.25 per prompt per month at its default cadence of about 300 evaluations per prompt ([providers](https://www.elmohq.com/docs/user-guide/providers), October 2026).
- **Maintenance:** scrapers must follow changes to the products they drive. Elmo's provider table records two services losing ChatGPT search results in late September 2026 and a Google AI Overview token expiring within a minute.

## What that misses

| limitation | implication |
| --- | --- |
| **Consumer apps** | Memory, personalization, system prompts and browsing decisions can differ. These model responses don't reproduce a particular buyer's chat. |
| **Google AI Overviews and AI Mode** | No coverage. If Google search is central to your category, this is a substantial gap. |
| **Perplexity, Gemini and Copilot** | No coverage, even where APIs exist. |
| **Model versions** | An API model and consumer app may use different builds. Limelit treats routes to one engine as separate targets ([methodology](https://github.com/limelit-co/open/blob/982668c4b3974558d900565f4a10bf9bf4e2dc88/docs/methodology.md#two-ways-to-reach-one-engine-are-two-targets)). |

The [site audit](../site-audit/) checks crawler access. [AI crawler counts](../site-audit/#ai-crawlers) include PerplexityBot and referrals from Perplexity, Copilot and Gemini. Those show access and traffic, not what their answers said.

## How other tools reach them

As of October 2026:

- **Elmo** (MIT) supports six scraping services for ChatGPT, Google's AI surfaces, Gemini, Perplexity and Copilot, plus direct APIs for Claude, OpenAI, Mistral and OpenRouter models ([providers](https://www.elmohq.com/docs/user-guide/providers)).
- **Limelit Open** (Apache-2.0) uses APIs for ChatGPT, Claude, Perplexity and Gemini, and scrapers for Google AI Overviews, AI Mode and Bing Copilot ([README](https://github.com/limelit-co/open/blob/982668c4b3974558d900565f4a10bf9bf4e2dc88/README.md#engines-and-providers)).
- **Hosted tools** offer broader surface coverage on some or all plans. [Compare](/compare/) lists the engines each names.

## When to move to a tool that covers them

Use a broader tracker when the surfaces your buyers use exceed this coverage. Your prompts move with you: they're plain TOML in your config repo. [Compare](/compare/) covers the alternatives.
