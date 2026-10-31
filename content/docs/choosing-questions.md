---
title: Choosing useful buyer questions
description: Build a question set from real buyer decisions, choose intent, and keep a stable measurement instead of chasing favorable answers.
weight: 125
group: Start here
---

A good tracked question represents a buyer need whose answer could change a product, positioning or content decision. It can be useful even when your product should lose.

## Start with the decision

Use sales and support questions, onboarding friction, customer research, community discussions or your own explicit market hypotheses. A model-generated question or frequent model search is a hypothesis, not evidence of buyer demand.

Before adding a question, write down its buyer, relevant constraints, the decision it could change, and when you would review or retire it. Keep that rationale in your config PR; these are review notes, not new TOML fields.

| Draft | Better question | Why |
| --- | --- | --- |
| “What is the best software?” | “Which AI visibility tracker suits a small team with a technical owner?” | Defines the category and buying situation |
| “Which tracker is open source, self-hosted, cheap and inspectable?” | “What are the tradeoffs between a hosted tracker and self-hosting for a small team?” | Tests a real tradeoff; use narrow requirements only when buyers actually have them |
| “Tell me why our tool is best” | “What are the limitations of Cheap Seats for an agency?” in `head-to-heads` | A known-brand evaluation can reveal an unfavorable fit |
| “Product A or Product B?” when neither is yours | Keep as separate competitor research, or create a genuinely new open-discovery question | A complete closed comparison need not consider your brand |

## Choose intent by the answer the buyer needs

{{< figure name="question-intent-path" >}}

Selection is the default in TOML. Set `intent = "info"` when an explanation, method, checklist or calculation fully answers the question without a product choice. Starting with “how” does not decide intent. Named counts include both intents; recommended and top-pick rates use selection answers only.

## Keep discovery and known-brand evaluation distinct

{{< figure name="question-situations" >}}

Only `head-to-heads` may name your brand under the current config rules. Unbranded rates exclude questions that supply your brand; they do not automatically exclude closed comparisons between other products. Moving such comparisons to another tracked set would still grade your brand and generate advice about it. Keep them outside `prompt-sets/`.

## Run the workflow

1. Draft a coherent set of distinct needs and constraints. Roughly 15–20 questions is a planning example, not a quota or precision threshold; a useful smaller set need not be padded.
2. Check overlap: would the same good answer serve two questions under the same constraints? Merge or distinguish them when appropriate.
3. Add stable IDs and intent in `prompt-sets/*.toml`. [Prompt sets](../prompt-sets/) owns the file format and exact change rules.
4. Run `cheapseats check` against your config. Review advisory suggestions rather than accepting them as buyer research. Preview trend effects with `cheapseats plan <before> <after>`.
5. Review and merge the config PR, restart the app to load it, then collect an initial run. Keep the chosen core stable while you learn.

## When to revisit the questions

Review after your first complete read-through, when customer evidence reveals a new need, when positioning changes, or during a monthly review of an active library. The monthly interval is a starting recommendation. The app's statistical prompt flags need at least three runs and six graded answers; branded detection can appear earlier.

| Review outcome | Next step |
| --- | --- |
| Useful and distinct | Keep it, including legitimate unfavorable questions |
| Same buyer need, confusing wording | Clarify it under the same ID; inspect the marked wording boundary |
| Different buyer need | Add a new ID and retire the old one only when appropriate |
| No longer relevant or covered by another question | Retire with a reason; keep historical results |
| Insufficient evidence | Collect more comparable observations or investigate the buyer need |

**Success:** a defensible set of buyer situations, rather than a list engineered to make your brand appear. Distinct questions broaden coverage; repeated answers measure variation. They solve different problems.

**Next:** [Run and interpret the set](../first-run/). Later, use [prompt review](../prompt-review/) for flags, gaps and proposed edits.
