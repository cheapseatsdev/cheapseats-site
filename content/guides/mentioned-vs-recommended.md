---
title: "Mentioned vs. recommended: measuring brands in AI answers"
description: What counts as a brand mention or recommendation, how to calculate each rate, and how share of voice differs.
---

A **mention** says something about your product. A **recommendation** actively endorses it for the buyer. Measure both: an assistant can name you often without telling anyone to choose you.

## Mentioned, recommended and absent

Cheap Seats has a second model grade each answer:

| grade | what it means |
| --- | --- |
| `recommended` | the top pick, or one of at most three primary recommendations actively endorsed for the buyer's situation |
| `mentioned` | named as one option among many, in passing, as a comparison point, or with reservations |
| `absent` | not named, aliases included, or named only to say the assistant can't find, verify or doesn't know it |

{{< figure name="grade-examples" >}}

An answer's single top pick is always recommended. Informational prompts use different rate denominators, as explained below.

Each grade also records your **position** in the order products first appear, the answer's **top pick**, every product **named**, **why not #1**, **objections**, **tone** and **praise**. Position is empty when you're absent; top pick is empty when the answer doesn't choose one.

## Why the difference matters

Mentions measure presence; recommendations measure endorsement. Read objections alongside both. Repeated concerns such as “pricing unclear” identify what a page may need to explain, even when the answer recommends you.

## How to compute each metric

Named, recommended and top-pick rates count graded answers. Each carries a 95% Wilson interval, so 0 out of 10 doesn't read like 0 out of 1,000.

### Recommendation rate

Answers graded *recommended* ÷ answers to **choice** questions.

Mark explanatory questions `intent = "info"` in a [prompt set](/docs/prompt-sets/). They count toward named, but not recommended or top pick: a good explanation may recommend nothing.

### Top-pick rate

Answers whose single top pick is you ÷ answers to choice questions. An answer has at most one winner.

### Mention rate (named rate)

Answers graded *recommended* or *mentioned* ÷ **all** graded answers. Cheap Seats calls this the **named** rate.

The named count includes recommendations, but the displayed named and recommended rates can use different denominators. Named is at least recommended only when both use the same answer cohort. To calculate “mentioned but not recommended,” subtract the counts and divide by that cohort's answer count; don't subtract the displayed rates when informational questions are included.

### Position

**Avg place** is your mean position over answers that named you at a known place. Read it beside named rate: first place in 2 of 90 answers is limited visibility. The run also reports **first**, **top 3** and a position-weighted score; [Metric definitions](/docs/metrics/#share-of-voice-and-position) has their denominators and formulas.

### Share of voice

Count each product once per answer, however often its name repeats:

> named rate = answers naming the product ÷ all graded answers
>
> share of voice = answers naming the product ÷ the sum of that count over every product named

One answer can name several products, so named rates can total more than 100%; shares of voice total 100% when any products are named. Your brand's count follows its grade, so your board row matches your named rate. The board includes unconfigured products, not just competitors you expected.

These measure sampled answers, not traffic, impressions or search volume. Run rates pool answers; rankings give each prompt equal weight. Earlier Cheap Seats versions labelled named rate “share of voice”; the current board shows both.

### Objections

Count the concerns in answers that named you. The insights report groups them, and the fix list proposes pages to address the missing information.

### Which pages shaped the answers

The search track keeps queries, returned results and citations. Per page, **surfaced** counts answers whose searches returned it; **cited** counts answers that linked it. A returned but uncited page isn't proof the model read or rejected it. Your own pages are flagged by site, including zeros for sites never reached.

## How to benchmark against competitors

Use the same buyer questions, answerers, track and grading for every brand, and repeat over time. Keep search and recall separate: one samples web-backed answers, the other answers without tools. Compare top picks as well as mentions. [Benchmark against competitors](/guides/benchmark-against-competitors/) shows the setup and a worked board.

## Worked example: Cheap Seats measuring itself

On 21 October 2026, our *Finding out whether AI assistants recommend us* set asked 15 prompts of Claude Opus via Claude Code and GPT via Codex, with two search samples and one recall sample each: **90 graded answers**.

### Rates

Cheap Seats was absent from all 90. That leaves a 95% upper bound of about 4%, rather than proving the true rate is zero. No position or brand objections were recorded. Profound was named in 65 answers (72%) and Peec AI in 58 (64%); those are named rates, not shares of voice.

### Pages that shaped the answers

The search answers ran 102 searches. None returned or cited a cheapseats.dev page.

### What it tells us

That points first to a retrieval gap; the stored answers show what assistants chose instead. It doesn't establish that every page was unindexed or that a new page alone will change recommendations.

## Export these metrics yourself

```bash
cheapseats report <run-id>          # rates, competitor board and sources
cheapseats report -json <run-id>    # the same report as JSON
```

For answer-level analysis, download the run's CSV from its page. The JSON API and MCP also expose full answers and grades. Field names, routes and tools are in [CLI, API and MCP](/docs/reference/); [Reading results](/docs/reading-results/) explains the run page.
