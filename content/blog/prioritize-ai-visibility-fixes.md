---
title: Which fix first, and who owns AI visibility
date: 2026-10-23
author: Chad Metcalf
description: Rank fixes by the prompts each could flip per day of work, weighted by what's left to win and how directly it answers why you lost. Then an owner for each.
---

Prioritize fixes by the buyer questions they could affect, the work required, and the evidence for why you lost. Discount questions you're already winning. Assign each fix to the owner of its target page; use the gap type when no page exists. Here's the method on our own fix list.

<!--more-->

## Start from why you lost

A fix is only worth ranking if it answers something the assistant actually said. Every Cheap Seats run ends with the reasons the brand lost, counted by prompt, and the objections the answers raised. From our *head to heads* run on 22 October 2026, 11 prompts that name Cheap Seats against a competitor:

- **No verifiable information about the product**: 8 of 11 prompts. "I can't give you an accurate feature-by-feature comparison, and I'd rather not invent one."
- **Name collision**: search answers in 7 prompts landed on other products with a similar name.
- **Incumbents framed as the safe default**: 6 prompts. Profound is "one of the best-funded and most established."
- **Self-hosting burden**: 1 prompt.

The strongest evidence points to missing verifiable information and retrieval problems. Check crawl access, indexing and query relevance before assuming new wording will help. Use the arithmetic below to order fixes within those priorities.

## The score: prompts it could flip, per day

Each fix names the prompts it could flip. Cheap Seats divides that count by the working days behind its effort size, S, M or L as one, five and fifteen days, to get a **speed**: prompts per day. It then weights each prompt by what it has left to win, 1 minus its recommended rate over the last 14 days (named rate, for an information prompt), so a question you already win in most answers adds little and a question you've never been named on counts in full. That is the **gain**, and quick wins are sorted by it, core sets first.

Priority is reach against effort: a fix that could flip 40% of a set's prompts is urgent, 20% high, 10% medium, else low; a one-day fix moves up a step because it's cheap to just do, and a big job is never more than high.

Here is how that ordered our own fixes from the runs of 22 October, across four prompt sets of 15 to 20 prompts:

| fix | type | prompts | effort | speed | priority |
| --- | --- | ---: | --- | ---: | --- |
| Get listed in a roundup that shaped the search answers | outreach | 5 | S | 5.0 | urgent |
| Publish a guide to benchmarking against competitors | new page | 3 | S | 3.0 | urgent |
| Publish a how-to on seeing the results its searches returned | new page | 2 | S | 2.0 | high |
| Publish a dated tools-compared post | new page | 6 | M | 1.2 | urgent |
| Get into a second roundup | outreach | 6 | M | 1.2 | high |
| Publish a comparison against one competitor | new page | 3 | M | 0.6 | medium |
| Add a Gemini provider | product | 1 | L | 0.07 | low |

This table shows **speed**, before the remaining-headroom weighting used for gain. A one-day fix across five prompts outruns a week-long fix across six. The product gap has low speed, but content can't substitute for the missing capability.

## How directly it answers the reason

Two fixes with the same score are not equal. Each fix in Cheap Seats carries its **evidence**, a quote from the answers with the prompt number, and the page it **displaces**, the one that shaped the answer today. Prefer the fix whose evidence is the reason you lost most often, and whose target is supported by the cited sources.

For us, repeated citations of competitor pricing and vendor help pages provided stronger targets than a generic new article. At equal speed, prefer a fix tied to a recurring objection and a cited source.

The kinds of gap, as Cheap Seats labels them, sort the reasons:

- **documentation**: the answer needed a page you don't have, or yours says the wrong thing.
- **positioning**: you have it, but don't say it the way the model looks for it.
- **third-party**: the roundups and comparisons the model reads leave you out.
- **product**: a real capability gap that content can't paper over.

## The quickest wins

From our list and the method above, the fastest gains were, in order:

1. **Get retrieved.** No first-party page surfaced in the run's search answers. We checked crawl access and submitted the sitemap and IndexNow updates. These are retrieval checks, not evidence that any one action improves recommendations. `llms.txt` and structured data also aren't guarantees of retrieval.
2. **The roundup you're missing from.** One article shaped six of fifteen prompts in a set. A paragraph to its editor is a small fix on six prompts.
3. **The page the answers needed.** A how-to or a comparison with a direct answer at the top, the facts the answers lacked, and a date. Small when the facts are in your repo already.
4. **Positioning, consistently.** The same sentence on the README and the homepage. Cheap to do and slow to show: recall has no live retrieval, so a new page cannot directly enter those answers. Measure it over time without expecting an immediate response.

Free checks come before paid runs: `cheapseats audit` tells you what AI crawlers can and can't read on your sites without a single model call.

## Who owns it

The target page's owner owns the fix. When there's no page yet, use the gap type. Deepak Gupta's [org-chart piece](https://guptadeepak.com/the-geo-org-chart-who-actually-owns-ai-visibility-in-2026/) proposes similar owners with product marketing coordinating:

| gap | the work | usually owned by | lands on |
| --- | --- | --- | --- |
| documentation | a new or corrected page that states facts the answers lacked | the docs team, or whoever writes the product's docs | the docs site, or the blog for comparisons and how-tos |
| positioning | the same claim, consistently, on the pages that already exist | product marketing | the homepage, the README, the pricing page |
| third-party | a listing or a paragraph in a page the assistant reads | SEO or comms, whoever already talks to editors | elsewhere |
| product | a capability the answers correctly say you lack | product and engineering | the product; then docs, once it ships |

Cheap Seats puts these fields on every fix: **site** (which of your sites the target is on), **owner**, **gap**, **priority**, **effort**, the **prompts** it could flip, **evidence**, what it **displaces** and a **done when** test. The owner comes from your config: the owner of the site the fix lands on, else the owner for its kind of gap, else a default.

```toml
[[brand.sites]]
url = "cheapseats.dev/docs"
kind = "docs"
owner = "docs"

[[brand.sites]]
url = "cheapseats.dev"
kind = "marketing"
owner = "product marketing"

[owners]
default = "marketing"
by_gap = { "third-party" = "comms", product = "product" }
```

Quick wins then filter by site, so each team sees its own list, and each fix comes with a prompt for Claude Code that writes the first draft of the page, with the facts and the done-when test in it; [From fix to pull request](/docs/fix-to-pull-request/) walks through one.

## Then check it worked

Mark each fix with its PR, then accepted when merged. Subsequent runs compare its target prompts before and after, with a margin of uncertainty. A still-losing fix can return as **retry** with the earlier attempt attached. [Measure content impact](/guides/prove-content-impact/) explains why an observed change doesn't by itself establish causation.
