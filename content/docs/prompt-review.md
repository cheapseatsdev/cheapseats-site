---
title: Reviewing your prompts
description: Review monthly to retire uninformative prompts, clarify noisy questions and find gaps in the set.
weight: 260
group: Reading what it finds
---

**Review prompts monthly.** After about four weekly runs, check which questions are uninformative, noisy, off target or duplicates, then edit the set through your config repo. The review uses stored answers, grades, searches and citations; opening it calls no model and costs nothing. Optional judgments and proposed edits are described below.

## Where to find it

- **Page:** `/sets/<id>/review`, linked from the set. Choose `?days=30` (default), `60` or `90`.
- **CLI:** `cheapseats review <set-id> [-days 30] [-json] [-suggest] [-jev]`.
- **MCP:** `review_prompts` takes `set`, optional `days` and `suggest`; returns counts and the top five per flag, rounded. `get_started` suggests a review after four weeks of runs if none was recorded in 30 days.
- **JSON:** `GET /api/sets/<id>/review?days=30` returns every prompt's numbers.

Use **Mark reviewed** on the page; CLI and MCP record a review automatically. The JSON API doesn't. No review runs on a schedule.

## Flags

Each flag includes its numbers and an action. A prompt with enough data and no flag is **healthy**.

| flag | action | rule |
| --- | --- | --- |
| **Flat: always absent** | Keep it as an important gap, reword it toward what the brand does, or retire an unwinnable question. | No answer named the brand, and no fix in the window improved this prompt's own named or recommended rate beyond its 95% margin. Another target prompt improving doesn't count. |
| **Flat: always recommended** | Make it harder, or retire it to save answers. It currently detects regressions only. | Every answer recommended the brand; for info prompts, every answer named it. |
| **Noisy: drift** | Add buyer and task context. More same-run samples don't remove drift. | Per-answerer-and-track χ² homogeneity tests, summed over cells, give p < 0.01, with at least 15 points of run-to-run spread. |
| **Noisy: disagreement** | Clarify the question or add samples. | Within-run answers split about 30/70 or closer, with per-run sampling error at least 15 points. |
| **Off target** | Add category or buyer context; configure unexpected products if they are competitors. | With ≥3 competitors and ≥5 product mentions, under 30% are the brand or competitors; **or** an unexpected product appears in at least half the answers, more than each configured product; **or** at least 25% use the brand's name for another product. |
| **Duplicate** | Keep one and retire the other. | Same intent, weighted Jaccard product overlap ≥0.75, and verdict shares within 15 points. |
| **Rewritten by the assistant** | Consider the words assistants search with. | At least 5 searches with under 25% word overlap with the prompt, both ways. Added words are listed. |
| **Branded leak** | Reword for a buyer who hasn't heard of you. If only searches add the name, check for brand-specific language; assistants may have found it independently. | Outside `head-to-heads`, the prompt names the brand, or at least 2 searches and 20% of searches add it. |

Noise flags use planned samples, excluding adaptive extras and runs where all answers to the prompt errored. With one sample per answerer and track, drift and disagreement cannot be separated, so neither is flagged. A product's name and alias count once per answer. See [sampling and drift](../noise-and-confidence/#when-more-samples-help).

## What it reads

The review reads finished runs in the selected window, walking backward under each prompt's latest asked wording and stopping when that wording changes.

- Intent and method changes do **not** stop pooling; the row warns that its rates span both sides.
- If config wording changed after the last run, the review uses the old wording and says so.
- Flags need **3 runs and 6 graded answers**. With less, the prompt is under **not enough data yet**, except branded prompts are identified immediately.

## Jev's judgments

With `[typesafe]`, Jev can flag wording problems before a set has run. Each question is a separate request:

| judgment | question |
| --- | --- |
| **Duplicate** | Would one good answer serve two same-intent prompts sharing a meaningful word? |
| **Off target** | Is the prompt outside `brand.category`? Skipped without a category. |
| **Intent** | Should a useful answer name a category product (`selection`) or none (`info`)? A how-to about a job those products do is selection. |
| **Branded** | Outside `head-to-heads`, does it name the brand, a product of its maker or its domain in any spelling? |

Judgments are cached by their exact inputs: unchanged checks make no requests. A 20-prompt set takes about 70 requests initially, a fraction of a cent.

`cheapseats check` prints `suggestion:` lines at `min_confidence`; suggestions never fail the check, and `-no-jev` skips them. The pass also runs after a run, or manually with `cheapseats judge <run-id>` or `cheapseats review -jev`. Review pages, JSON (`jev`), MCP and ordinary CLI reviews read cached judgments without asking again. See [Optional providers](../optional-providers/).

## Gaps

The review proposes at most five of each:

| gap | rule |
| --- | --- |
| **Competitor** | Configured competitor appears in ≥20% of answers or is added to ≥3 searches, but no prompt names it. |
| **Product** | Unconfigured product appears in ≥20% of answers across ≥2 prompts. Includes a `[[competitors]]` entry. |
| **Topic** | A word absent from prompts is added in ≥5 searches across ≥2 prompts. Includes its most-run search. |

Each includes a buyer-worded `[[prompts]]` entry with an unused id. Reword before committing; ids are permanent.

## Proposed edits (optional)

The page button, `cheapseats review -suggest`, or MCP `suggest: true` sends flags and counts to the analyst for one call, on your Claude subscription or API daily budget. Web-derived names and words are quoted as data.

The proposed diff contains rewrites that retain ids, retirements as comments to remove manually, and additions with unused ids. It never writes your config; apply changes through a pull request ([Prompt sets](../prompt-sets/)).

Invalid edits are dropped with reasons: unknown prompts, unchanged rewrites, duplicate text, search operators, quotes, links, text over 300 characters, brand names outside `head-to-heads` or missing inside it, and anything `cheapseats check` rejects.
