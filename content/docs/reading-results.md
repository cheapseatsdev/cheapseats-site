---
title: Reading results
description: Verdicts, tracks, the run page's rates, share of voice, sources and sentiment, what the assistants searched, rankings, fix lists and quick wins.
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

Along with the verdict you get the brand's position in the answer, the answer's top pick, every product named (for share of voice), the grader's reasoning, a **"why not #1"** (what the answer preferred and the reasons it gave), the specific **objections** raised about the brand, its **tone** about the brand (positive, neutral, mixed or negative) and the **praise** it gives. [How grading works](../how-grading-works/) has the rules in full, with worked examples.

## The run page

Everything on a run page is worked out from the answers and grades already stored. [Metric definitions](../metrics/) has every formula and denominator.

- **Scores**: top-pick, recommended and named rates per answerer and track, with 95% intervals. The track cards lead with the **unbranded** rates, leaving out prompts that name the brand or an alias, since being named when the question names you proves little; the rates with them are underneath, and the prompt list marks each branded prompt. Info prompts (`intent = "info"`) count toward named only.
- **Prompt by prompt**: every prompt against every answerer, with its grades.
- **What the answers say about you**: **net sentiment**, the share of answers naming you that are positive about you minus the share negative, in points; the tone mix; what they praise and object to most; and a few named **themes**, each with the competitor it helps and a quote.
- **Your sites in these answers**: which of the brand's sites the answers drew on, including any they never reached.
- **Share of voice**: every product the answers named, with its **named** rate (answers naming it, of all answers, so the column adds up to more than 100%), its **share of voice** (its mentions of all products' mentions, which adds up to 100%), its **avg place** in the answers that name it, how often it's named **first** and in the **top 3**, a **position-weighted** score, and its top picks.
- **Head to head**: the brand against each product on the board: answers naming both and which of the two led, answers naming only one, and answers naming neither.
- **Objections**: the concerns answers raised about the brand, counted once per answer, with an example prompt.
- **Sources**: every page an answer cited or its searches returned, sorted by kind of site (own, competitor, ugc, review, reference, institutional, editorial), with how often each kind and host was **retrieved**, **cited**, its **share of citations**, and how often it was **cited when retrieved**. Each host that isn't yours is bucketed **missing**, **shared**, **strong** or **unique** by whether the answers citing it name competitors, you, or both.
- **Cited without you**: the third-party hosts the answers cite while naming competitors and never you, ranked by competitors named × answers citing it. That's the outreach list.
- **Found but not cited**: your own pages that searches returned and no answer linked.
- **Pages referenced** and **every answer** with its grade.
- **Fix these first** and **insights** (below).

**Share of voice used to mean named rate.** In earlier versions the board's one column was labelled share of voice and held what is now the **named** rate. True share of voice now sits beside it. The JSON keeps the old `share` field, still holding the named rate, so existing scripts keep working; use `named_rate` or `share_of_voice` in new ones.

Export a run as CSV or JSON. Pages update themselves while a run is going; no need to refresh. Each run records the config repo's commit and the Popcorn version, shown on the run page and in its exports.

## What the assistants searched

Before a search-track answer, the assistant types its own queries into the web search tool. The **searches** page (`/runs/<id>/searches`, linked from the run page and the set page) shows what it typed and what came back. `?pool=1` adds up to six of the set's earlier finished runs asked and graded the same way; `/sets/<id>/searches` opens that pooled view for the set's latest run. It's worked out from stored answers and costs nothing.

- **Answers searched**, **searches** and **distinct queries** (lowercased, quotes stripped, whitespace collapsed, so `"Peec AI"  vs Profound` and `peec ai vs profound` count once).
- **Top queries**, with the prompts that ran each, whether its results reached the brand's sites, which competitors showed up in its results, and how often the answers that ran it named the brand. A `+Name` chip marks a query that names a product its prompt didn't.
- **Names the assistants added**: the brand or a competitor in a search whose prompt didn't name it.
- **How the prompts were rewritten**: **from prompt**, the share of a search's words that were in its prompt (low means it searched in its own words), and **prompt kept**, the share of the prompt's words still in the search (low means it searched for a narrow piece of the question). **Added** and **dropped** list the words searches add across the set ("best", "alternatives", "reddit", years) and the prompt words they leave out.
- **Add as prompt**: queries whose results named competitors and never reached your sites, as a `[[prompts]]` entry to paste into the set's file. Popcorn doesn't write it. Reword it as a buyer would ask before you merge it.
- **Prompt by prompt**: answers that searched, searches per answer, distinct queries, both overlap scores, and each prompt's queries.

The same data is at `/api/runs/<id>/searches` and over MCP as `get_search_queries`.

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

Quick wins pulls the fix lists from the latest run of every prompt set into one list, ranked by **expected gain**: the prompts a fix could flip per working day, each weighted by what it has left to win (1 minus its recommended rate over the last 14 days, or its named rate for an info prompt). A prompt already won in most answers adds little. Filter it by site to hand each team its own list. Each fix has a prompt for Claude Code: see [From fix to pull request](../fix-to-pull-request/) for the whole loop, shown on popcorn.zone.

**Marking a fix.** When you've submitted something for a fix, mark it with the commit or pull request: **proposed** while it's open, **accepted** once it merges, or **withdrawn** if it's closed, which reopens the fix. Filter by **status** to see what's left: *urgent* and *open* is the list nobody has touched.

**A fix that wasn't enough comes back.** Fix lists are written fresh each run, and marking a fix settles only that fix. If the prompts still lose, the next run proposes a fix for the same page again: it's open, marked *retry*, and shows the earlier work and its outcome, how often its prompts were named and recommended before and after, and whether its page turned up in any answer.

**How an outcome is judged.** Popcorn pools the target prompts' answers before the fix (its run and up to 4 same-method runs in the 28 days before) and after it (every same-method run since, within 28 days of the newest), and tests the change in named and recommended against the noise of a few answers a prompt:

| outcome | when |
| --- | --- |
| pending | the set hasn't run since |
| not comparable | it has, but only with a different method |
| too early | less than 7 days since, or fewer than 4 answers a target prompt on average |
| moved | named or recommended rose beyond its margin, and neither fell |
| worse | one fell beyond its margin, and neither rose |
| mixed | one rose and the other fell |
| no detectable change (±X pts) | neither moved beyond its margin; a smaller effect could still be there |

The fix's page turning up in searches or citations after the fix, when it didn't before, is shown as *newly surfaced*. See [How big a change Popcorn can detect](../noise-and-confidence/#what-no-detectable-change-means-for-a-fix). The analyst writing the list is told what was tried, so a retry says what to do differently. Work recorded after a fix list was built covers that list's fix for the same page too, since the list didn't know about it.

## Rankings

Rankings turns runs into a day-by-day series per set: the brand's place on the share-of-voice board, who leads, its rates (each prompt counting once) and a rolling average over 7, 14 or 28 days (`?window=`), with a 95% band. Pick the rate the chart draws with `?metric=named|recommended|top_pick`.

Prompt sets change over time, so the series carries on through added, removed and reworded prompts, changed intents, new competitors and new answerer models: each day lists what changed since the day before, and its comparison with that day only counts the prompts both asked, worded the same, of the same answerers ("on 13 of 15 prompts"). A change in how answers are asked or graded starts the comparison over.

**Changes are tested against noise.** "Vs day before" pairs the two days prompt by prompt and shows each change with its 95% margin; a change whose interval covers zero is greyed out as **within noise**. A rank move is shown only if a product that crossed the brand moved beyond the noise; otherwise the table says *within noise* and draws no arrow. Hover a day for its own rate with the interval for this set's prompts that day. Triangles under the chart mark the days a fix was proposed (gold) or accepted (green), linked to its commit or pull request. [How big a change Popcorn can detect](../noise-and-confidence/) explains the band, the intervals and the test.

Each set's page shows every prompt's results day by day, with named and recommended pooled over the same 7, 14 or 28 days and a 95% interval, so one prompt's history survives being reworded or moved to another set. When some answerer takes more than one sample, it also says whether the extra samples are buying precision.

## Search probe

Type a query and Popcorn runs it through the same web search tool the answerers use, and shows the result exactly as the model receives it: the links in order, before it writes anything. Optionally restrict it to, or block, a list of domains. Each probe costs a few cents.

## Retrying

A run that hits an error or the daily budget ends `partial` or `budget`; **Retry unfinished** picks up where it left off and reuses any answer that was saved but not yet graded. A run cut off by a restart or deploy resumes by itself when Popcorn starts again, and a fix list cut off is built then too. A run can't be finished after the answer or grading prompts change, so one run never mixes two rubrics.
