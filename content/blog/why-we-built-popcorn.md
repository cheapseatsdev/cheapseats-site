---
title: Why we built Popcorn
date: 2026-10-21
author: Chad Metcalf
description: Buyers ask AI assistants what to use. Popcorn measures whether the answer recommends you, and tells you what to fix.
---

Buyers ask AI assistants what to use. "What should I use for X?" gets one answer, written in full sentences, often with a top pick. If you sell in that category, you want to know what that answer says about you.

Popcorn is how we find out. It's a small, self-hosted take on [Gauge](https://withgauge.com), open source under the MIT license.

<!--more-->

## Named isn't the same as recommended

"Does ChatGPT know about us?" is the wrong question. An answer can name you as one option among eight, in passing, or with a reservation attached, and still send the buyer somewhere else. So Popcorn grades every answer three ways:

- **recommended**: you're the top pick, or one of at most three primary recommendations the answer actively endorses;
- **mentioned**: you're named, but only as one option among many, in passing, or with reservations;
- **absent**: you're not named at all.

The grade comes with the reasons: your position in the answer, what it picked instead, a "why not #1", and the specific objections it raised about you. Every product it named feeds share of voice, so you see who's winning the questions you're losing.

## What the web says, and what the model believes

Each question is asked twice per assistant. On the **search** track the assistant has to search the web before answering, which tells you what the web says today. On the **recall** track it has no tools, which tells you what the model already believes. The two move differently: search with the web over days to weeks, recall only when models change. Popcorn keeps them apart, so you can see which one you're losing on.

Every search, result URL and citation is kept, so you can see which third-party pages shape the answers, which of your own pages show up, and which of your sites the answers never reach.

## Make the fix specific

A dashboard that says you're losing doesn't help on its own. When a run finishes, Popcorn builds **Fix these first**: a ranked list where each fix names the exact page to create or change, what it must say, how you'll know it's done, the prompts it would flip and the page it would displace. Each one is placed on whichever of your sites suits it, how-tos on the docs and comparisons on the blog or marketing site, and assigned to that site's owner. It comes with a prompt you can paste into Claude Code to make the change without inventing numbers.

**Quick wins** pulls those lists together across every prompt set, ranked by the prompts a fix could flip per working day, and filters by site so each team gets its own list.

## Yours to run

Your buyer questions, brand facts and competitors live in a config repo you own, as TOML, and change by pull request. `popcorn plan` tells the reviewer what a change does to the trends before it merges. Popcorn runs as one container with a SQLite database, on a Docker host, Kubernetes or an exe.dev VM, with a daily budget on what it spends. Prompts and answers go to the model providers you configure, and nowhere else.

If you want to know whether the assistants recommend you, [start here](/docs/getting-started/). The code is on [GitHub](https://github.com/metcalfc/popcorn).
