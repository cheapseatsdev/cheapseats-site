---
title: Why I built Cheap Seats
date: 2026-10-21
author: Chad Metcalf
description: An open-source project I wrote to make my own product better, inspired by Gauge and others. Free, always, on the Claude subscription you already have.
---

Cheap Seats is an open-source project I wrote to make my own product better. It draws on lots of inspiration, [Gauge](https://withgauge.com) first among them, along with Profound and Peec AI. It's free, and it always will be: MIT licensed, no hosted tier, nothing to upsell. I hope you find it useful.

Here's the problem it solves for me. Buyers ask AI assistants what to use. "What should I use for X?" gets one answer, written in full sentences, often with a top pick. If you sell in that category, you want to know what that answer says about you.

The tools that inspired Cheap Seats do this and a lot more, most of which I didn't need. What I did have was Claude and ChatGPT subscriptions with tokens to spare. So I built the 20% of those tools that I'd use 80% of the time, to run on those subscriptions: a small, self-hosted take on Gauge.

If you want to start measuring without buying anything, start here. If you grow out of it, do whatever suits you. I'd suggest Gauge; that team is great. Your prompts come with you.

<!--more-->

## Named isn't the same as recommended

"Does ChatGPT know about us?" is the wrong question. An answer can name you as one option among eight, in passing, or with a reservation attached, and still send the buyer somewhere else. So Cheap Seats grades every answer three ways:

- **recommended**: you're the top pick, or one of at most three primary recommendations the answer actively endorses;
- **mentioned**: you're named, but only as one option among many, in passing, or with reservations;
- **absent**: you're not named, or the answer only repeats your name to say it can't verify you.

The grade comes with the reasons: your position in the answer, what it picked instead, a "why not #1", and the specific objections it raised about you. Every product it named feeds share of voice, so you see who's winning the questions you're losing.

## What the web says, and what the model believes

Each question is asked on two tracks, with configurable samples per assistant. On the **search** track the assistant has to search the web before answering, which tells you what the web says today. On the **recall** track it has no tools, which tells you what the model already believes. A new page can enter search-backed answers; recall has no live retrieval and can still vary between runs. Cheap Seats keeps them apart, so you can see which one you're losing on.

Every search, result URL and citation is kept, so you can see which third-party pages shape the answers, which of your own pages show up, and which of your sites the answers never reach.

## Make the fix specific

**Fix these first** assigns page fixes to site owners, with evidence, target prompts and a Claude Code prompt. This example became [our free-tracker article](/blog/free-open-source-ai-visibility-tracker/):

{{< figure name="tracker-fix" >}}

**Quick wins** combines sets' lists, core sets first, then prompts a fix could flip per working day weighted by remaining headroom. Filter by site to give each team its list.

## Yours to run

Your buyer questions, brand facts and competitors live in a config repo you own, as TOML, and change by pull request. `cheapseats plan` tells the reviewer what a change does to the trends before it merges. On your own machine Cheap Seats runs on your Claude subscription, and ChatGPT's if you have it, with no API key. Hosted, it's one container with a SQLite database, on a Docker host, Kubernetes or an exe.dev VM, with a daily admission budget for API calls. Model calls go to the providers you configure; optional providers receive the inputs their passes need.

## When you outgrow it

Cheap Seats asks Claude and OpenAI models, not Gemini, Perplexity, Copilot or Google AI Overviews, and it's a tool you run, not a service. When you need those engines, a hosted dashboard, or reports for many clients, do whatever suits you; I'd point you at Gauge first, and [Compare](/compare/) has the honest differences. The buyer questions you've written and refined are plain text in your repo, so they come with you.

If you want to know whether the assistants recommend you, [start here](/docs/getting-started/). The code is on [GitHub](https://github.com/cheapseatsdev/cheapseats).
