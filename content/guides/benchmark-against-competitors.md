---
title: Benchmark your brand against competitors in AI answers
description: Benchmark your brand against competitors in ChatGPT and Claude answers, measure share of voice, and pick the metrics to track, with a real table and trend.
weight: 30
---

Ask the same buyer questions of the same assistants, grade every brand consistently, and repeat. Compare top picks alongside named rate and share of voice: being listed isn't the same as winning. Keep search and recall separate, and show uncertainty.

Cheap Seats asks Claude and OpenAI models directly; it doesn't ask Gemini, Perplexity, Copilot or Google AI Overviews.

## How to set up the benchmark

1. Write a [prompt set](/docs/prompt-sets/) in your buyers' words. Include open category questions; questions naming you inflate presence.
2. List competitors and aliases in [configuration](/docs/configuration/), so variants count as the same product.
3. Use multiple answerers and samples, keeping search and recall separate.
4. Run on a schedule. Compare the board, top picks and [rankings trend](/docs/reading-results/).
5. Open the answers behind surprising results to see what won and why.

## Is there a way to measure share of voice in AI chatbot answers?

Yes. A grader lists every product each answer names. Count each product once per answer, even if its name repeats:

> named rate = answers naming the product ÷ all graded answers
>
> share of voice = answers naming the product ÷ the sum of that count over every product named

Named rates can total more than 100%; shares total 100% when any products are named. The denominator includes unconfigured products, so adding a tracked competitor doesn't by itself change the share. Your brand's count follows its recommended/mentioned grade. Earlier versions labelled named rate “share of voice”; [Metric definitions](/docs/metrics/#share-of-voice-and-position) explains the distinction.

## How rank is computed

Your **share-of-voice rank** is your place on that board:

- rank = 1 + the number of products named in **more** answers than you;
- products named in the same number of answers share a rank;
- a brand no answer named has no rank (shown as 0 in the API).

A newly appearing product can push you down even if you never configured it.

## What metrics a marketing team should use

Track these per prompt set and per track, each from the same graded answers:

| metric | what it is | why it matters |
| --- | --- | --- |
| top-pick rate | answers whose single top pick is you ÷ answers to questions that ask for a choice | at most one winner per answer |
| recommended rate | answers graded *recommended* ÷ choice answers | you were among at most three products the answer endorsed |
| named rate | answers graded *recommended* or *mentioned* ÷ all answers | the assistant knows you exist |
| share of voice | answers naming you ÷ answers naming each product, summed over every product | your slice of the conversation, out of 100% |
| avg place | your mean position in the answers that name you | whether you come up first or last |
| share-of-voice rank | your place on the board of every product named | where you stand against the whole field |
| top-pick counts per competitor | how many answers each product won | who is actually winning the questions |
| objections | the concerns answers raised about you | what to fix |
| pages cited and surfaced | which pages searches returned and answers linked | where the answers came from |

Answer-based rates carry 95% Wilson intervals. Position, rank and share of voice need different interpretation; [Metric definitions](/docs/metrics/) has the formulas. [How grading works](/docs/how-grading-works/) explains the verdicts.

## Why top picks on the same prompt set is the fair benchmark

Question choice changes the result. On our *head to heads* set on 22 October 2026, recall answers named Cheap Seats in 19 of 22 answers: rank 1. The questions named us. On *Choosing an AI visibility tool*, which uses open buyer questions, none of 68 answers named us. These are different measurements.

Mentions also aren't wins. In the head-to-head run, Cheap Seats had 19 mentions but only 1 top pick; Peec AI had 9 mentions and 3 top picks. Compare within one set and track using matching answerers and grading. A top pick is at most one winner per answer, but an answer can decline to choose anyone.

## Worked example: Cheap Seats against its competitors

This is real data from Cheap Seats tracking itself on the *Choosing an AI visibility tool* prompt set: 17 buyer questions such as *"What are good alternatives to Profound for tracking AI search visibility?"* and *"Is there a free AI visibility tracker that's actually useful?"*

### The competitor table

Run `r-20261022-043101-41215d`, 22 October 2026. Claude Opus (via Claude Code) and an OpenAI model (via Codex), on search and recall: **68 recorded graded answers**. The table reports those stored answers; it does not infer a sample count per track.

| product | answers naming it (of 68) | named rate | top picks |
| --- | --- | --- | --- |
| Profound | 56 | 82% | 8 |
| Peec AI | 53 | 78% | 11 |
| Otterly.AI | 43 | 63% | 7 |
| Ahrefs Brand Radar | 33 | 49% | 0 |
| Semrush AI Toolkit | 31 | 46% | 2 |
| Scrunch AI | 25 | 37% | 1 |
| AthenaHQ | 22 | 32% | 0 |
| Scrunch | 19 | 28% | 1 |
| ChatGPT | 16 | 24% | 0 |
| Perplexity | 15 | 22% | 0 |
| **Cheap Seats** | **0** | **0%** | **0** |

What it says:

- **Cheap Seats has no rank.** No answer, on either track, named it. Zero of 60 choice answers still leaves a 95% upper bound near 6% for top-pick rate.
- **Profound leads on mentions; Peec AI leads top picks.** Profound was named in 3 more answers, but Peec AI was the top pick in 11 against Profound's 8. If you only tracked mentions, you'd call the wrong leader.
- **Ahrefs Brand Radar is named often and never chosen**: 33 answers, 0 top picks. It was a comparison point in this sample.
- **Check the board for split names.** "Scrunch AI" and "Scrunch" are one company counted twice, because Scrunch isn't in this set's competitor list. The grader folds names onto the canonical ones you configure, so add it under `[[competitors]]` with its aliases. Don't add the two rows together yourself: an answer naming both would be counted twice.

### The rank trend

The rankings page turns runs into one series per set and per track, from the newest finished run of each UTC day. Here are the two days so far:

| day | track | run | Cheap Seats' rank | leader | named | recommended |
| --- | --- | --- | --- | --- | --- | --- |
| 21 Oct 2026 | search | `r-20261021-200546-84c081` | 23 | Peec AI | 2 / 34 | 1 / 34 |
| 21 Oct 2026 | recall | `r-20261021-200546-84c081` | 32 | Peec AI | 1 / 34 | 1 / 34 |
| 22 Oct 2026 | search | `r-20261022-043101-41215d` | none (new method) | Profound | 0 / 34 | 0 / 30 |
| 22 Oct 2026 | recall | `r-20261022-043101-41215d` | none (new method) | Profound | 0 / 34 | 0 / 30 |

The apparent drop isn't comparable. The 21 October grader incorrectly credited answers about Gauge to Cheap Seats. On 22 October, revised grading and a text check stopped that error. This changed the **method**, so the trend starts a new comparison and rolling average. The corrected reading of 21 October would also be unranked.

Two prompts also became informational (`intent = "info"`), explaining why recommended uses 30 answers per track while named uses 34.

### What it tells us

Cheap Seats was absent, and none of its pages surfaced for the 17 questions. Investigate the roundups, pricing and docs pages the answers cited, then decide whether to improve our pages or seek inclusion elsewhere. This page addresses one of the gaps.

## How the day-by-day ranking stays honest

The series uses the newest finished run per set on each UTC day, split by track. It records changed prompts, intent, competitors, answerers, model versions and sample counts.

Rate comparisons use matching prompts, wording and answerers. Rank movement requires matching prompts and answerers and a rank on both days. Daily rates weight prompts equally; rolling bands account for repeated answers within prompts. Changes to answer/search instructions, grading, grader model or brand identity start a new method; adding a competitor is noted without restarting it. See [Noise and confidence](/docs/noise-and-confidence/) and [Re-grading](/docs/regrading/).

For analysis outside the UI:

```
cheapseats report -json <run-id>     # summary.voice: name, answers, named_rate, share_of_voice, avg_position, top_pick per product
```

```bash
curl -H "Authorization: Bearer <token>" "https://<host>/api/rankings?lastDays=30&set=<set-id>"
```

MCP tools `get_run` and `get_rankings` expose the same board and trend. See [CLI, API and MCP](/docs/reference/).
