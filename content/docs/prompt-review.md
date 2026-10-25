---
title: Reviewing your prompts
description: Review monthly to check buyer coverage, investigate flagged questions and preserve a useful benchmark.
weight: 260
group: Reading what it finds
---

**Review prompts monthly.** After about four weekly runs, investigate flat rates, noise, category mismatches and possible overlap, then decide whether edits are justified. Keep a stable core for comparison and try new questions separately. The review uses stored answers, grades, searches and citations; opening it calls no model and costs nothing. Optional judgments and proposed edits are described below.

## Where to find it

- **Page:** `/sets/<id>/review`, linked from the set. Choose `?days=30` (default), `60` or `90`.
- **CLI:** `cheapseats review <set-id> [-days 30] [-json] [-suggest] [-jev]`.
- **MCP:** `review_prompts` takes `set`, optional `days` and `suggest`; returns counts and the top five per flag, rounded. `get_started` suggests a review after four weeks of runs if none was recorded in 30 days.
- **JSON:** `GET /api/sets/<id>/review?days=30` returns every prompt's numbers.

Use **Mark reviewed** on the page; CLI and MCP record a review automatically. The JSON API doesn't. No review runs on a schedule.

## Flags

Each flag includes its numbers and an automated suggestion. Treat these as candidates for investigation. The table separates the implemented rules from guidance for your decision; the app's one-line suggestions can be more aggressive about rewriting or retiring questions.

| flag | how to review it | implemented rule |
| --- | --- | --- |
| **Flat: always absent** | Keep a legitimate buyer need as a gap check, including requirements the product cannot meet. Clarify ambiguity; don't steer it toward a win. Retire only if irrelevant or redundant. | No answer named the brand, and no fix in the window improved this prompt's own named or recommended rate beyond its 95% margin. Another target prompt improving doesn't count. |
| **Flat: always recommended** | Keep a useful regression check. Explore harder questions separately; don't replace it merely because it succeeds. | Every answer recommended the brand; for info prompts, every answer named it. |
| **Noisy: drift** | Check model and web changes as well as ambiguity. Add buyer or task context only if needed; more same-run samples don't remove drift. | Per-answerer-and-track χ² homogeneity tests, summed over cells, give p < 0.01, with at least 15 points of run-to-run spread. |
| **Noisy: disagreement** | Read the conflicting answers. Clarify ambiguity, or add samples to measure genuine disagreement more precisely. | Within-run answers split about 30/70 or closer, with per-run sampling error at least 15 points. |
| **Off target** | Check the full answers. Unexpected products may be valid alternatives; clarify only if the buyer need is being misunderstood, or configure genuine competitors. | With ≥3 competitors and ≥5 product mentions, under 30% are the brand or competitors; **or** an unexpected product appears in at least half the answers, more than each configured product; **or** at least 25% use the brand's name for another product. |
| **Duplicate** | Compare buyer needs and constraints before keeping one. Similar product lists and verdicts don't prove two questions ask the same thing. | Same intent, weighted Jaccard product overlap ≥0.75, and verdict shares within 15 points. |
| **Rewritten by the assistant** | Inspect the searches for misunderstanding. Search wording isn't evidence of what buyers ask. | At least 5 searches with under 25% word overlap with the prompt, both ways. Added words are listed. |
| **Branded leak** | Reword for a buyer who hasn't heard of you. If only searches add the name, check for brand-specific language; assistants may have found it independently. | Outside `head-to-heads`, the prompt names the brand, or at least 2 searches and 20% of searches add it. |

Noise flags use planned samples, excluding adaptive extras and runs where all answers to the prompt errored. With one sample per answerer and track, drift and disagreement cannot be separated, so neither is flagged. A product's name and alias count once per answer. See [sampling and drift](../noise-and-confidence/#when-more-samples-help).

A prompt with enough data and no flag is labelled **healthy**. That means no implemented rule fired; it doesn't validate intent, buyer demand, market coverage or independence from other questions. Likewise, a flag doesn't establish its cause.

Before editing, check [intent and buying situation](../prompt-sets/#ask-the-way-a-buyer-would), the source of the buyer need, and the denominator you care about. Distinguish open discovery and requests for alternatives from known-brand evaluation. Remove closed comparisons that only ask the buyer to choose between other products from the tracked library: a complete answer can omit your brand. A separate set still grades your brand and produces fixes for it. Informational answers can show useful source visibility without supporting a recommendation rate.

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

Jev's current intent criterion is broader than the human-review rule: it treats a how-to about a category job as selection even when a complete method or checklist could satisfy the buyer without choosing a product. Its suggestion is advisory. Use [what a complete, useful answer requires](../prompt-sets/#say-what-a-good-answer-looks-like) when reviewing intent; product details or an incidental product example don't themselves make a question selection. The documentation guidance does not change Jev's implemented criterion.

`cheapseats check` prints `suggestion:` lines at `min_confidence`; suggestions never fail the check, and `-no-jev` skips them. The pass also runs after a run, or manually with `cheapseats judge <run-id>` or `cheapseats review <set-id> -jev`. Review pages, JSON (`jev`), MCP and ordinary CLI reviews read cached judgments without asking again. See [Optional providers](../optional-providers/).

## Gaps

The review proposes at most five of each:

| gap | rule |
| --- | --- |
| **Competitor** | Configured competitor appears in ≥20% of answers or is added to ≥3 searches, but no prompt names it. |
| **Product** | Unconfigured product appears in ≥20% of answers across ≥2 prompts. Includes a `[[competitors]]` entry. |
| **Topic** | A word absent from prompts is added in ≥5 searches across ≥2 prompts. Includes its most-run search. |

Each includes a buyer-worded `[[prompts]]` entry with an unused id. These are hypotheses from model behavior, not observed buyer demand. Validate the need, context and overlap with the existing set before adding it. The same review applies to **Add as prompt** entries from recorded search queries: frequent searches comparing two other products do not establish a discovery question for your brand. Keep those closed comparisons outside `prompt-sets/`. Reword before committing; ids are permanent.

## Proposed edits (optional)

The page button, `cheapseats review <set-id> -suggest`, or MCP `suggest: true` sends flags and counts to the analyst for one call, on your Claude subscription or API daily budget. Web-derived names and words are quoted as data.

The proposed diff contains rewrites that retain ids, retirements as comments to remove manually, and additions with unused ids. It never writes your config; apply changes through a pull request ([Prompt sets](../prompt-sets/)).

Review the meaning as well as the syntax. A rewrite that changes the buyer need needs a new id, even if a proposed diff retains the old one. Keep unfavorable fit questions and useful regression checks; don't accept a retirement or favorable rewording just to raise a rate. Check breadth and selection-question counts before expanding the set.

Invalid edits are dropped with reasons: unknown prompts, unchanged rewrites, duplicate text, search operators, quotes, links, text over 300 characters, brand names outside `head-to-heads` or missing inside it, and anything `cheapseats check` rejects.
