---
title: Why AI visibility scores differ between tools
date: 2026-10-22
author: Chad Metcalf
description: The same ten AI answers can read 30%, 40% or 50% visible, and 20% to 33% share of voice, depending on the tool. Denominators, matching, sampling and history.
---

Put the same brand into two AI visibility tools and you'll get two different numbers. Neither tool is broken. They're counting different things under the same names, and the differences are big enough to matter: on the ten answers below, "visibility" comes out at 30%, 40% or 50%, and share of voice anywhere from 20% to 33%, depending on whose formula you use.

<!--more-->

There are five reasons, and once you know them you can move a number from one tool to another, or at least know why you can't. Every formula here is from each tool's own documentation as of October 2026, collected in Cheap Seats' [metric definitions](/docs/metrics/#how-these-compare-to-other-tools).

## Ten answers

Say your brand is Acme, you've told your tools about one competitor, Globex, and the answers also name a product you haven't configured, Initech. Ten answers to "what should I use for X?":

| answer | names |
| --- | --- |
| 1 | Acme, as its top pick |
| 2 | Acme and Globex, recommending Acme |
| 3 | Acme and Initech |
| 4 | "I couldn't find reliable information about Acme", then recommends Globex and Initech |
| 5, 6, 8 | Globex and Initech |
| 7 | Globex |
| 9, 10 | no product at all |

So Acme's name appears in 4 answers, Globex in 6, Initech in 5, and 8 answers name some product.

## 1. What goes on the bottom

The first difference is the denominator.

- **Every answer.** Peec AI's and Gauge's visibility, Limelit Open's, and Cheap Seats' named rate all divide by all ten: 4 ÷ 10 = **40%** for a tool that counts answer 4 (the next section comes back to that).
- **Only answers that name some brand.** Profound's visibility leaves out runs that name no brand at all: 4 ÷ 8 = **50%**. Same answers, ten points higher.
- **Prompts, not answers.** Otterly.AI's brand coverage is the share of prompts that mention you, so a prompt asked five times counts once.

None of these is wrong. "Of every answer, how often were we named" and "of the answers that named anyone, how often was it us" are different questions.

## 2. What counts as a mention

Answer 4 names Acme only to say it couldn't find it.

- **A text search counts it.** Limelit Open finds brands by deterministic string match, and its methodology says plainly that "I could not find Acme" counts as a mention, because telling otherwise needs a model to read the sentence. 40%.
- **A model can leave it out.** Elmo finds name matches by text, then has a model (TypeSafe's Jev) decide whether each one really means your company; an answer saying it has no information about your brand isn't counted. 3 ÷ 10 = **30%**.
- **A grade can leave it out, and say why.** Cheap Seats' grader marks answer 4 `absent`: the name is in the question, not in the model's knowledge, and nothing the answer says is about Acme. Its reasoning records that the model didn't know you, which is still something to fix. Named is 3 ÷ 10 = **30%**, the same as Elmo's; **recommended** is 2 ÷ 10 = 20% (answers 1 and 2). Had the answer said anything about Acme itself, even hedged, it would be `mentioned` and named would be 40%.

The string match is reproducible and costs nothing per answer. A model reads meaning a string match can't, but costs a call and can disagree with itself on a close call. Both are reasonable; they give different numbers.

## 3. Share of what

Share of voice is where tools disagree most, because it depends on who else is in the sum.

- **Every product named.** Cheap Seats divides your mentions by the sum over every product the answers named, one per answer, with answer 4 left out: 3 ÷ (3 + 6 + 5) = **21.4%**.
- **Tracked competitors only.** Elmo and Gauge divide by you plus the competitors you configured. Elmo, with answer 4 left out: 3 ÷ (3 + 6) = **33.3%**. Initech isn't in the sum because nobody told the tool about it.
- **Occurrences, not answers.** Limelit Open counts every time a tracked name appears. If answer 1 writes "Acme (acme.com)" and mentions Acme twice more, Acme has 6 occurrences across its four answers; if Globex has 14 across its six, Acme's share is 6 ÷ (6 + 14) = **30%**.

Now add Initech to your competitors. Cheap Seats' 21.4% doesn't move: Initech was already in the sum. Elmo's becomes 3 ÷ (3 + 6 + 5) = **21.4%**. Limelit's, if Initech has 10 occurrences, becomes 6 ÷ 30 = **20%**. Your brand did nothing, and two of three numbers fell by a third.

Position follows the same pattern: Elmo ranks you among the tracked companies an answer names, Limelit by the list item you appear in (prose has no rank), Cheap Seats among every product named. Adding a competitor can push you down a place in one tool and not another.

## 4. How many answers

Ten answers is a small sample. A 95% Wilson interval on 4 of 10 runs from **17% to 69%**; on 3 of 10, from 11% to 60%. The 30% and the 40% above aren't distinguishable on this evidence, and a tool that shows one without an interval is showing a point inside a fifty-point range.

Tools sample differently, too. Elmo asks each prompt five times per platform per run by default (`RUNS_PER_PROMPT`), Limelit Open once per prompt per target per pass, and Cheap Seats as many times per track as you configure. More samples narrow a single reading, but less than you'd hope; [How many runs do you need to trust an AI visibility number?](/blog/how-many-runs-to-trust-ai-visibility/) works through the arithmetic.

## 5. Whether the past stays put

Last month's number can change after the fact.

- **Re-derived from today's config.** Profound applies today's topics, tags and brands to past answers. Limelit Open re-reads every stored answer when you add or rename a brand or its matching rules change. Elmo re-judges past answers for a changed company, 90 days back by default, and leaves older ones as they were judged, so a long chart can step where the window ends.
- **Fixed when graded.** Cheap Seats keeps each run's grades, rates and share of voice as graded. A change in how answers are asked or graded starts a new method on the trend instead of rewriting the old line.

Re-deriving keeps the past comparable with today's setup, so the Initech change above applies backwards and the trend stays smooth. Fixing keeps a number you reported last month from moving under you. Each costs something; know which your tool does before you compare a chart across a config change.

## Moving a number between tools

- To get Profound's visibility from Cheap Seats' export, drop the answers whose `named` list is empty.
- To get Elmo's or Gauge's share of voice, sum only the competitors you track there.
- To get Otterly.AI's brand coverage, count prompts whose named rate is above zero.
- To compare with Limelit's share of voice, you'd need occurrence counts, which Cheap Seats doesn't keep; compare named rates instead.

The full mapping, tool by tool, is in [Metric definitions](/docs/metrics/#migrating-between-cheap-seats-and-these-tools). And whatever tool you use, the prompts are the part worth keeping. In Cheap Seats they're plain TOML in your own repo, so if you move, they come with you.
