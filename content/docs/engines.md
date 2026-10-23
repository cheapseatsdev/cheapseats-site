---
title: Which AI engines Cheap Seats asks, and why
description: Cheap Seats asks Claude and OpenAI models through their APIs and CLIs, not scraped consumer apps. Why, what that misses, and how other tools reach Google AI Overviews, Perplexity and more.
weight: 250
group: Reading what it finds
---

**Which AI engines does Cheap Seats ask?** Claude and OpenAI models, and only those: through the Anthropic and OpenAI APIs, or through the `claude` and `codex` command-line tools on a Claude or ChatGPT subscription. It doesn't ask Google AI Overviews, Google AI Mode, Gemini, Perplexity or Microsoft Copilot, and it asks the models directly, not the ChatGPT or Claude apps a buyer types into. That's a deliberate trade: it keeps Cheap Seats free to run on a subscription you already have. This page says what the trade costs, and how other tools cover the rest.

## How Cheap Seats asks

| provider      | asks                                    | billed                    |
| ------------- | --------------------------------------- | ------------------------- |
| `claude-code` | Claude models, through the `claude` CLI | your Claude subscription  |
| `codex`       | OpenAI models, through the `codex` CLI  | your ChatGPT subscription |
| `anthropic`   | Claude models, through the API          | per token                 |
| `openai`      | OpenAI models, through the API          | per token                 |

Claude is required, through a subscription or an API key; OpenAI is optional and adds a second assistant's answers. The CLIs only run where they're installed, on your own machine or a VM; the Docker image uses the APIs. Each CLI call runs in an empty directory with your own CLAUDE.md, hooks, skills, MCP servers and Codex config switched off, so what you've set up for coding doesn't colour the answers. See [Configuration](../configuration/#answerers) and [Cost and budget](../cost-and-budget/).

## Search and recall

Every prompt is asked of every answerer on two tracks:

- **search**: the model must search the web before answering, with a web search tool. This is the closest Cheap Seats gets to what an assistant with browsing says today, and it moves as pages are published and crawled. Every search it ran, every result and every citation is stored.
- **recall**: no tools. This is what the model already believes, and it moves only when a new model ships. (The `codex` CLI always has its shell; on recall the brief tells it not to use it, and Cheap Seats confines what it could reach: see [CLI answerers](../reference/#cli-answerers).)

The two are graded and reported separately, never blended. A consumer app decides for itself whether to search, so its answers are some mix of the two; Cheap Seats keeps them apart so you can tell which one you're losing on. See [How grading works](../how-grading-works/#two-tracks).

## Why not scrape the consumer apps

ChatGPT's app, Google AI Overviews and AI Mode, and Copilot have no public API for "answer this as you would for a person". The tools that track them pay a scraping service to drive the real surface and hand back what it rendered. Cheap Seats doesn't, for four reasons:

- **Cost.** Scraping is billed per request, on top of anything else. Elmo's providers page estimates about $0.15 to $2.25 per prompt a month for a scraper, at its default cadence of about 300 evaluations a prompt a month ([Elmo providers](https://www.elmohq.com/docs/user-guide/providers), October 2026). Small per prompt, but it's a bill, and Cheap Seats' point is that you can start with none.
- **It needs a paid account.** Every route to those surfaces goes through a third-party service with its own plan, key and minimum top-up. That breaks "start at no cost on the subscription you already have".
- **Terms.** A scraper automates a product built for people to use by hand. The APIs and CLIs Cheap Seats calls are the ones the providers offer for programs to use, under terms you've already accepted.
- **Fragility.** A scraped surface changes when the product does. Elmo's own provider table records two scrapers that stopped returning ChatGPT's searches in late September 2026, and notes that a Google AI Overview token from one service expires within a minute. Tools that scrape spend real effort keeping up; Elmo publishes a status page for exactly that.

## What that misses

Be clear about what a Cheap Seats number is and isn't:

- **The ChatGPT and Claude apps.** The apps add memory, personalisation, their own system prompts and their own choice of when to search. Cheap Seats' answers come from the same model families, asked cleanly. They're a good read on what the model and the web say; they aren't a screenshot of one buyer's chat.
- **Google AI Overviews and AI Mode.** Not covered at all. For many categories, Google's AI surfaces are where most people meet an AI answer.
- **Perplexity, Gemini and Copilot.** Not covered. Gemini and Perplexity have APIs, and other tools call them; Cheap Seats doesn't.
- **Model versions.** An API model and the model behind the consumer app aren't always the same build. Limelit's methodology makes the same point, and tracks the two as separate targets rather than averaging them ([Limelit methodology](https://github.com/limelit-co/open/blob/982668c4b3974558d900565f4a10bf9bf4e2dc88/docs/methodology.md#two-ways-to-reach-one-engine-are-two-targets)).

Two things help at no cost. The [AI crawler counts](../site-audit/#ai-crawlers) from your access logs include visits referred from perplexity.ai, copilot.microsoft.com and gemini.google.com, and PerplexityBot's crawling, so you can see whether those engines send people to your pages even though Cheap Seats doesn't ask them. And the [site audit](../site-audit/) checks whether robots.txt blocks their crawlers.

## How other tools reach them

As of October 2026:

- **Elmo** (open source, MIT) supports six scraping services, Cloro, BrightData, Oxylabs, SearchApi, Olostep and DataForSEO, for ChatGPT, Google AI Mode and AI Overviews, Gemini, Perplexity and Copilot, plus direct APIs for Claude, OpenAI, Mistral and OpenRouter models ([providers](https://www.elmohq.com/docs/user-guide/providers)).
- **Limelit Open** (open source, Apache-2.0) asks ChatGPT, Claude, Perplexity and Gemini through their APIs, and Google AI Overviews, AI Mode and Bing Copilot through scrapers such as DataForSEO and SearchApi, "because those three have no API at all" ([README](https://github.com/limelit-co/open/blob/982668c4b3974558d900565f4a10bf9bf4e2dc88/README.md#engines-and-providers)).
- **The hosted tools**, Gauge, Profound, Peec AI, Otterly.AI and others, include Google's AI surfaces, Perplexity, Gemini and Copilot on some or all plans, and pay for the scraping themselves. [Compare](/compare/) lists which engines each one names.

## When to move to a tool that covers them

If your buyers live in Google search, or your category is one where Perplexity or Copilot comes up, Cheap Seats' Claude and OpenAI numbers are only part of the picture. That's the most common reason to outgrow it. Start with Cheap Seats to learn which buyer questions matter and what the answers say; when you need the other engines, move to a tool that asks them, and take your prompts with you: they're plain TOML in your own repo. [Compare](/compare/) takes the tools one at a time.
