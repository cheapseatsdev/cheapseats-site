---
title: Reading results
description: Verdicts, tracks, share of voice, rankings, fix lists and quick wins.
weight: 40
---

## Tracks

Each prompt is answered by every configured assistant on two tracks:

- **search**: it must search the web before answering, so you see what the web says today.
- **recall**: no tools, so you see what the model already believes.

Search and recall are always kept apart.

## Verdicts

A second Claude call grades each answer:

| verdict       | meaning                                                                         |
| ------------- | ------------------------------------------------------------------------------- |
| `recommended` | the answer's top pick, or one of ≤3 primary recommendations it actively endorses |
| `mentioned`   | named, but only as one option among many, in passing, or with reservations      |
| `absent`      | not named at all (aliases included)                                             |

Along with the verdict you get the brand's position in the answer, the answer's top pick, every product named (for share of voice), the grader's reasoning, a **"why not #1"** (what the answer preferred and the reasons it gave), and the specific **objections** raised about the brand.

## The run page

- **Rates**: top-pick, recommended and named rates per answerer and track, with 95% intervals. Info prompts (`intent = "info"`) count toward named only.
- **Share of voice**: every product the answers named, counted across the run.
- **Every answer** with its grade.
- **Pages referenced**: every search, result URL and citation is captured, so this table shows which third-party pages shape the answers, with the brand's own pages flagged by site (marketing, docs, blog...) and the prompts where none surfaced called out.
- **Your sites**: which of the brand's sites the answers drew on, including any they never reached.
- **Fix these first** and **insights** (below).

Export a run as CSV or JSON. Pages update themselves while a run is going; no need to refresh. Each run records the config repo's commit and the Popcorn version, shown on the run page and in its exports.

## Fix these first

When a run finishes it builds a ranked list of actions, each with:

- the exact page or slug to create, and what it must say;
- a verifiable "done when";
- the prompts it would flip, and the page it displaces;
- an effort estimate, and a priority from the share of prompts it could flip and its effort;
- a gap: documentation, positioning, third-party or product;
- the brand's site it belongs on (how-tos on the docs, comparisons on the blog or marketing site), and an owner: that site's owner, else `[owners]` by gap;
- a ready-to-paste prompt that asks Claude Code to make the fix without inventing numbers.

The same call writes a short **insights** report: why the brand lost, the objections raised, where it wins, and which pages shaped the answers.

## Quick wins

Quick wins pulls the fix lists from the latest run of every prompt set into one list, ranked by fastest ranking gain: the prompts a fix could flip per working day. Filter it by site to hand each team its own list.

## Rankings

Rankings turns runs into a day-by-day series per set: the brand's place on the share-of-voice board, who leads, its rates (each prompt counting once) and a 7-day average.

Prompt sets change over time, so the series carries on through added, removed and reworded prompts, changed intents, new competitors and new answerer models: each day lists what changed since the day before, and its comparison with that day only counts the prompts both asked, worded the same, of the same answerers ("on 13 of 15 prompts"). A change in how answers are asked or graded starts the comparison over.

Each set's page shows every prompt's results day by day, so one prompt's history survives being reworded or moved to another set.

## Search probe

Type a query and Popcorn runs it through the same web search tool the answerers use, and shows the result exactly as the model receives it: the links in order, before it writes anything. Optionally restrict it to, or block, a list of domains. Each probe costs a few cents.

## Retrying

A run that hits an error or the daily budget ends `partial` or `budget`; **Retry unfinished** picks up where it left off and reuses any answer that was saved but not yet graded. A run cut off by a restart or deploy resumes by itself when Popcorn starts again, and a fix list cut off is built then too. A run can't be finished after the answer or grading prompts change, so one run never mixes two rubrics.
