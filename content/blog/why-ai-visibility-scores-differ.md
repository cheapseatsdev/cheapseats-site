---
title: Why AI visibility scores differ between tools
date: 2026-10-22
author: Chad Metcalf
description: The same ten AI answers can read 30%, 40% or 50% visible, and 20% to 33% share of voice, depending on the tool. Denominators, matching, sampling and history.
---

On the same ten AI answers, "visibility" can be 30%, 40% or 50%, and share of voice 20% to 33%. Tools use different matching rules, denominators, sampling and history.

<!--more-->

Every vendor formula below comes from its own documentation as of October 2026, collected in Cheap Seats' [metric definitions](/docs/comparing-metrics/).

## Ten answers

Your brand is Acme. You track Globex as a competitor; Initech appears in the answers but isn't configured. These ten illustrative answers all respond to "what should I use for X?"

{{< figure name="score-counting" >}}

## 1. What goes on the bottom

- **Every answer.** Peec AI's and Gauge's visibility, Limelit Open's, and Cheap Seats' named rate all divide by ten. Whether the result is 30% or 40% depends on how answer 4 counts.
- **Only answers that name some brand.** Profound's visibility leaves out the two answers that name no brand. Counting answer 4 gives **50%**.
- **Prompts, not answers.** Otterly.AI's brand coverage is the share of prompts that mention you, so a prompt asked five times counts once.

Match the denominator before comparing: these metrics answer different questions.

## 2. What counts as a mention

Answer 4 names Acme only to say it couldn't find it.

- **A text search counts it.** Limelit Open uses deterministic string matching. Its methodology explicitly counts "I could not find Acme" as a mention: **40%**.
- **A model can leave it out.** Elmo finds name matches by text, then asks a model (TypeSafe's Jev) whether each means your company. An answer saying it has no information about your brand doesn't count: **30%**.
- **A grade can leave it out, and say why.** Cheap Seats marks answer 4 `absent`: it only echoes the name, without information about Acme. The reasoning records that gap. Named is **30%**; **recommended** is 2/10 = 20% (answers 1 and 2). Had answer 4 said anything about Acme itself, even hedged, it would be `mentioned` and named would be 40%.

The string match is reproducible and costs nothing per answer. A model reads meaning a string match can't, but costs a call and can disagree with itself on a close call. Both are reasonable; they give different numbers.

## 3. Share of what

Share of voice depends on who else is in the sum. Cheap Seats counts every product named, at most once per answer. Elmo and Gauge count you plus your configured competitors. With Acme's echo-only mention excluded:

{{< figure name="share-denominators" >}}

Add Initech to Elmo's tracked competitors and its share becomes **21.4%**. Cheap Seats already counted Initech.

**Occurrences, not answers.** Limelit Open counts every time a tracked name appears. If answer 1 writes "Acme (acme.com)" and mentions Acme twice more, Acme has 6 occurrences across its four answers; if Globex has 14 across its six, Acme's share is 6 ÷ (6 + 14) = **30%**.

If Initech has 10 occurrences, tracking it changes Limelit's share to 6/30 = **20%**, also without a change in Acme's answers.

Position follows the same pattern: Elmo ranks you among the tracked companies an answer names, Limelit by the list item you appear in (prose has no rank), Cheap Seats among every product named. Adding a competitor can push you down a place in one tool and not another.

## 4. How many answers

Ten answers is a small sample. A 95% Wilson interval on 4 of 10 runs from **17% to 69%**; on 3 of 10, from 11% to 60%. These intervals describe sampling uncertainty under each counting rule. The rule itself changes the count on these fixed answers; more samples don't reconcile different definitions.

Tools sample differently, too. Elmo asks each prompt five times per platform per run by default (`RUNS_PER_PROMPT`), Limelit Open once per prompt per target per pass, and Cheap Seats as many times per track as you configure. More samples narrow a single reading, but less than you'd hope; [How many runs do you need to trust an AI visibility number?](/blog/how-many-runs-to-trust-ai-visibility/) works through the arithmetic.

## 5. Whether the past stays put

Last month's number can change after the fact.

- **Re-derived from today's config.** Profound applies today's topics, tags and brands to past answers. Limelit Open re-reads every stored answer when you add or rename a brand or its matching rules change. Elmo re-judges past answers for a changed company, 90 days back by default, and leaves older ones as they were judged, so a long chart can step where the window ends.
- **Fixed when graded.** Cheap Seats keeps each run's grades, rates and share of voice as graded. A change in how answers are asked or graded starts a new method. Explicit re-grading can replace stored grades while preserving their history; it isn't automatic when config changes.

Re-deriving keeps the past comparable with today's setup, so the Initech change above applies backwards and the trend stays smooth. Fixing keeps a number you reported last month from moving under you. Each costs something; know which your tool does before you compare a chart across a config change.

## Moving a number between tools

- To get Profound's visibility from Cheap Seats' export, drop the answers whose `named` list is empty.
- To get Elmo's or Gauge's share of voice, sum only the competitors you track there.
- To get Otterly.AI's brand coverage, count prompts whose named rate is above zero.
- To compare with Limelit's share of voice, you'd need occurrence counts, which Cheap Seats doesn't keep; compare named rates instead.

The full mapping, tool by tool, is in [Metric definitions](/docs/comparing-metrics/#migrating-between-cheap-seats-and-these-tools). Keep the buyer questions and their sampling conditions when moving between tools; a similar metric label doesn't ensure a comparable number.
