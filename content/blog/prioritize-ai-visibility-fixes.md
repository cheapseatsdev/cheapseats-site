---
title: Which fix first, and who owns AI visibility
date: 2026-10-23
author: Chad Metcalf
description: Rank fixes by the prompts each could flip per day of work, weighted by what's left to win and how directly it answers why you lost. Then an owner for each.
---

**How should we prioritize fixes to improve how AI assistants describe our product?** By how many buyer questions a fix could flip per day of work, discounted for questions you're already winning, and by how directly it answers the reason the assistant gave for not picking you. **What are the quickest wins?** The small fixes that touch many questions: a roundup that shaped several answers and leaves you out, a page the answers needed that you don't have, and, before either, getting your pages retrieved at all. **Who should own it?** Whoever owns the page the fix lands on. When no page does, the kind of gap decides: documentation to the docs team, positioning to product marketing, third-party listings to SEO or comms, and product gaps to product. Cheap Seats scores and assigns every fix this way, and this post shows the method on our own fix list.

<!--more-->

## Start from why you lost

A fix is only worth ranking if it answers something the assistant actually said. Every Cheap Seats run ends with the reasons the brand lost, counted by prompt, and the objections the answers raised. From our *head to heads* run on 22 October 2026, 11 prompts that name Cheap Seats against a competitor:

- **No verifiable information about the product**: 8 of 11 prompts. "I can't give you an accurate feature-by-feature comparison, and I'd rather not invent one."
- **Name collision**: search answers in 7 prompts landed on other products with our old name.
- **Incumbents framed as the safe default**: 6 prompts. Profound is "one of the best-funded and most established."
- **Self-hosting burden**: 1 prompt.

The first reason is a documentation gap and it's most of the loss, so most of the fixes should be pages that state verifiable facts. The second was a retrieval problem: our pages were not being read at all, which no amount of writing fixes until the site is indexed. The third is positioning and takes longest to move. That ordering is the prioritisation, before any arithmetic. The arithmetic is for ordering the fixes within it.

## The score: prompts it could flip, per day

Each fix names the prompts it could flip. Cheap Seats divides that count by the working days behind its effort size, S, M or L as one, five and fifteen days, to get a **speed**: prompts per day. It then weights each prompt by what it has left to win, 1 minus its recommended rate over the last 14 days (named rate, for an information prompt), so a question you already win in most answers adds little and a question you've never been named on counts in full. That is the **gain**, and quick wins are sorted by it, core sets first.

Priority is reach against effort: a fix that could flip 40% of a set's prompts is urgent, 20% high, 10% medium, else low; a one-day fix moves up a step because it's cheap to just do, and a big job is never more than high.

Here is how that ordered our own fixes from the runs of 22 October, across four prompt sets of 15 to 20 prompts:

| fix | type | prompts | effort | speed | priority |
| --- | --- | ---: | --- | ---: | --- |
| Get listed in a roundup that shaped the search answers | outreach | 5 | S | 5.0 | urgent |
| Publish a guide to benchmarking against competitors | new page | 3 | S | 3.0 | urgent |
| Publish a how-to on seeing the search results the model read | new page | 2 | S | 2.0 | high |
| Publish a dated tools-compared post | new page | 6 | M | 1.2 | urgent |
| Get into a second roundup | outreach | 6 | M | 1.2 | high |
| Publish a comparison against one competitor | new page | 3 | M | 0.6 | medium |
| Add a Gemini provider | product | 1 | L | 0.07 | low |

Two things the table shows. A small fix on five prompts beats a week's work on six, because the week could be five small fixes. And the product item is last not because it's wrong but because one prompt for fifteen days of engineering is the worst exchange rate on the list; a content fix can't paper over it either, which is why it's marked as a product gap rather than a page to write.

## How directly it answers the reason

Two fixes with the same score are not equal. Each fix in Cheap Seats carries its **evidence**, a quote from the answers with the prompt number, and the page it **displaces**, the one that shaped the answer today. Prefer the fix whose evidence is the reason you lost most often, and whose target is the page the assistant actually read.

For us that meant: the competitor-pricing pages and vendor help articles that shaped the answers were the pages to displace, with our own pages that state the same facts. A fix that displaces a page the assistant cited on five prompts is worth more than one that displaces nothing, at the same speed. And a fix that only restates what the answers already know about you addresses no reason at all, however many prompts it lists.

The kinds of gap, as Cheap Seats labels them, sort the reasons:

- **documentation**: the answer needed a page you don't have, or yours says the wrong thing.
- **positioning**: you have it, but don't say it the way the model looks for it.
- **third-party**: the roundups and comparisons the model reads leave you out.
- **product**: a real capability gap that content can't paper over.

## The quickest wins

From our list and the method above, the fastest gains were, in order:

1. **Get retrieved.** No first-party page surfaced in any of 44 search answers in the head-to-heads run. Submitting the sitemap, adding `llms.txt` and structured data, and IndexNow took an afternoon and touches all 11 prompts; nothing else on the list works until it's done. This is the one SEO item, and it's first.
2. **The roundup you're missing from.** One article shaped six of fifteen prompts in a set. A paragraph to its editor is a small fix on six prompts.
3. **The page the answers needed.** A how-to or a comparison with a direct answer at the top, the facts the answers lacked, and a date. Small when the facts are in your repo already.
4. **Positioning, consistently.** The same sentence on the README and the homepage. Cheap to do and slow to show: recall answers only move when models change, so it's a fix you ship once and measure over releases.

Free checks come before paid runs: `cheapseats audit` tells you what AI crawlers can and can't read on your sites without a single model call.

## Who owns it

The turf question has an answer once a fix names a page: the page's owner owns the fix. Deepak Gupta's [org-chart piece](https://guptadeepak.com/the-geo-org-chart-who-actually-owns-ai-visibility-in-2026/) reaches a similar place from the top down, four layers with four natural owners and product marketing coordinating; the fix list reaches it from the bottom up, one fix at a time. By kind of fix:

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

Each fix's **done when** is a test the next run can re-run: this prompt cites that page, or names you in at least one answer. Mark a fix with its pull request when you open it and accepted when it merges, and the next run of the set reports what changed on exactly its prompts, before and after, with the noise margin. A fix that worked drops off the list; one that didn't comes back marked *retry*, with your pull request and a sharper reason. Prioritising is cheap when the list re-ranks itself from evidence every week.
