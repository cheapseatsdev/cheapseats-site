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
- **absent**: you're not named at all.

The grade comes with the reasons: your position in the answer, what it picked instead, a "why not #1", and the specific objections it raised about you. Every product it named feeds share of voice, so you see who's winning the questions you're losing.

## What the web says, and what the model believes

Each question is asked twice per assistant. On the **search** track the assistant has to search the web before answering, which tells you what the web says today. On the **recall** track it has no tools, which tells you what the model already believes. The two move differently: search with the web over days to weeks, recall only when models change. Cheap Seats keeps them apart, so you can see which one you're losing on.

Every search, result URL and citation is kept, so you can see which third-party pages shape the answers, which of your own pages show up, and which of your sites the answers never reach.

## Make the fix specific

A dashboard that says you're losing doesn't help on its own. When a run finishes, Cheap Seats builds **Fix these first**: a ranked list where each fix names the exact page to create or change, what it must say, how you'll know it's done, the prompts it would flip and the page it would displace. Each one is placed on whichever of your sites suits it, how-tos on the docs and comparisons on the blog or marketing site, and assigned to that site's owner. It comes with a prompt you can paste into Claude Code to make the change without inventing numbers.

**Quick wins** pulls those lists together across every prompt set, ranked by the prompts a fix could flip per working day, and filters by site so each team gets its own list.

## Yours to run

Your buyer questions, brand facts and competitors live in a config repo you own, as TOML, and change by pull request. `cheapseats plan` tells the reviewer what a change does to the trends before it merges. On your own machine Cheap Seats runs on your Claude subscription, and ChatGPT's if you have it, with no API key. Hosted, it's one container with a SQLite database, on a Docker host, Kubernetes or an exe.dev VM, with a daily budget on what it spends through the APIs. Prompts and answers go to the model providers you configure, and nowhere else.

## When you outgrow it

Cheap Seats asks Claude and OpenAI models, not Gemini, Perplexity, Copilot or Google AI Overviews, and it's a tool you run, not a service. When you need those engines, a hosted dashboard, or reports for many clients, do whatever suits you; I'd point you at Gauge first, and [Compare](/compare/) has the honest differences. The buyer questions you've written and refined are plain text in your repo, so they come with you.

If you want to know whether the assistants recommend you, [start here](/docs/getting-started/). The code is on [GitHub](https://github.com/cheapseatsdev/cheapseats).
