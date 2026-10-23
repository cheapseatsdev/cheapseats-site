---
title: Reviewing your prompts
description: "A free monthly review of the prompts themselves: which tell you nothing, move for no reason, get answered about something else or repeat, and what's missing."
weight: 260
group: Reading what it finds
---

Runs grade the brand. The **prompt review** grades the prompts: which ones tell you nothing, which move for no reason, which are answered about something else, which ask the same thing twice, which the assistants search for in other words, and what no prompt asks about.

It's worked out from what Cheap Seats already stores (results, grades, searches, citations). It calls no model and costs nothing, so it's computed when you open it. Nothing runs on a schedule.

**Review monthly.** A month of weekly runs gives each prompt about four data points, which is what the flags need to tell steady from noisy.

## Where to find it

- **Page**: `/sets/<id>/review`, linked from the set page. `?days=30` (the default), `60` or `90`.
- **CLI**: `cheapseats review <set-id> [-days 30] [-json] [-suggest] [-jev]`.
- **MCP**: `review_prompts`, taking `set`, optional `days` and `suggest`. It returns the counts and the top five of each flag, numbers rounded. `get_started` suggests it once a set has four weeks of runs and hasn't been reviewed in 30 days.
- **JSON**: `GET /api/sets/<id>/review?days=30`, every prompt's numbers.

Opening the page, the CLI and the MCP tool count as a review; the JSON API doesn't.

## What it reads

The review reads the set's finished runs in the window. Each prompt is read under the wording it was last asked in: walking back from the newest run, it stops at the first run that asked it in other words, since a different question is a different measurement.

- A change of intent or of method (how answers are asked and graded) inside the window doesn't stop it. The prompt's row says so, since its rates pool both sides.
- A prompt reworded in the config since its last run is read under the old wording, and says that too.
- A prompt needs **3 runs and 6 graded answers** in the window. With fewer it's listed under "not enough data yet" with no flags, except a branded prompt, which is worth knowing about from the first run.

## Flags

Each flag comes with the numbers behind it and a one-line suggestion. A prompt with enough data and no flag is listed as healthy.

| Flag | When | What to do |
|---|---|---|
| **Flat**, always absent | Not one answer in the window named the brand, and no fix made in the window moved this prompt (its own named or recommended rate up beyond its 95% margin; another prompt in the same fix moving doesn't count). | Either the brand can't win this question (reword it toward what the brand does, or retire it), or it's the most important gap in the set (keep it and work its fixes). You know which. |
| **Flat**, always recommended | Every answer recommended the brand (for an info prompt, named it). | At the ceiling it only tells you when something breaks: reword it harder, or retire it to save answers. |
| **Noisy**, drift | The run-to-run rates differ more than sampling explains: a χ² test of homogeneity per answerer and track, summed over them, at p < 0.01, and a run-to-run spread of at least 15 points. Pure sampling noise trips it under 1% of the time. | Reword it to be more specific (who is asking, for what). More samples don't steady drift. |
| **Noisy**, disagreement | Answers within one run split about 30/70 or closer, and the per-run sampling error is still at least 15 points. | Reword it to be more specific, or add samples. |
| **Off target** | Any of: with 3 or more competitors configured and at least 5 product mentions, under 30% of them are the brand or a competitor; one product that's neither is named in at least half the answers, more than the brand and every competitor; at least 25% of answers use the brand's name for another product. The top unexpected products are listed. | Add context to the prompt (the category, who is asking), or add the product to the competitors if it is one. |
| **Duplicate** | Two prompts of the same intent whose answers name nearly the same products (weighted Jaccard of at least 0.75) with verdict shares within 15 points of each other. | Merge them to save answers: keep one, retire the other. |
| **Rewritten by the assistant** | Over at least 5 searches, the searches share under 25% of their words with the prompt, both ways. The words they add are listed. | The assistants search in other words; consider phrasing the prompt that way. |
| **Branded leak** | Outside `head-to-heads`: the prompt names the brand, or at least 2 of its searches and 20% of them add the brand's name. | Reword it as a buyer who hasn't heard of the brand would ask. If only the searches add it, check the prompt doesn't use a term only the brand uses; if not, the assistants found it on their own. |

**Noise** is split the way the set page's sample advice splits it ([How big a change Cheap Seats can detect](../noise-and-confidence/)). Only planned samples count, not adaptive sampling's extras, and a run where every answer to the prompt errored isn't counted. With one sample per answerer and track, noise can't be split, so it isn't flagged. A product named twice in one answer, by its name and an alias, counts once.

## Jev's judgments

The flags above come from a month of answers, so a new set has none. With `[typesafe]` configured ([Optional providers](../optional-providers/)), the prompts' wording itself is put to Jev, one question per request:

| Judgment | The question |
|---|---|
| **Duplicate** | Would two prompts of the same intent that share a meaningful word be served by one good answer? |
| **Off target** | Does the prompt ask about something other than `brand.category`? Not asked without a category, since against the product description it would flag every prompt that isn't about this one product. |
| **Intent** | Does the answer that serves the buyer name a product in the category (`selection`) or none (`info`)? A how-do-I question about a job those products do is a selection. |
| **Branded** | Outside `head-to-heads`, does the prompt name the brand, a product of its maker or its domain, in any spelling? |

Each answer is stored under a hash of exactly what the question saw, so rewording one prompt re-asks only its own questions and a `cheapseats check` that changes nothing asks nothing. A 20-prompt set is about 70 requests the first time, a fraction of a cent, and nothing after.

Where it shows: `cheapseats check` prints one `suggestion:` line per flag at `min_confidence` (`suggestion: set s: p3 and p7 may ask the same thing (0.86)`) after its other checks; a suggestion never fails `check`, and `-no-jev` skips it, so CI stays green and fast. The review page, its JSON (`jev`), MCP `review_prompts` and `cheapseats review` list the same flags from what's stored, and opening them never asks. The pass also runs after every run on the run's set, so a new prompt is judged at its first run; `cheapseats judge <run-id>` runs it by hand, and `cheapseats review -jev` asks before reviewing.

## Gaps

What the set's answers and searches keep coming back to that no prompt names, at most five of each:

- **Competitor**: a configured competitor named in at least 20% of the set's answers, or added by the assistants to at least 3 searches, that no prompt names.
- **Product**: a product named in at least 20% of answers across two or more prompts that is neither the brand nor a configured competitor. It comes with a `[[competitors]]` entry as well.
- **Topic**: a word the searches add in at least 5 searches across 2 or more prompts that no prompt uses, with the most-run search that has it.

Each gap comes with a `[[prompts]]` entry to paste, in a buyer's words, with an id no set uses. Reword it before you commit it: ids are permanent.

## Proposed edits (optional)

The page's button, `cheapseats review -suggest`, or `review_prompts` with `suggest: true` send the flags and their numbers to the analyst. That's one call, on your Claude subscription with the `claude-code` provider or within the daily budget on the API. Product names and search words come from the web, so they go to the analyst quoted and marked as data.

It returns a diff against the set's file:

- **Rewrites** replace a prompt's text and keep its id, so its history reads on as a reword.
- **Retirements** are comments: delete the entry by hand to stop asking it. The id stays retired.
- **Additions** are new `[[prompts]]` entries with ids no set uses.

Edits that wouldn't pass are dropped, each with its reason: ones for prompts the set doesn't have, rewrites that change nothing, text that repeats another prompt or has search operators, quotes or a link, text over 300 characters, the brand named outside `head-to-heads` (or missing inside it), and anything `cheapseats check` would refuse. Nothing is written: the set changes only by pull request in your config repo, like every other change ([Prompt sets](../prompt-sets/)).
