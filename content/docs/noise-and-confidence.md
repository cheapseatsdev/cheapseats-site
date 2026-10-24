---
title: How big a change Cheap Seats can detect
description: Why AI answers vary run to run, the intervals and tests that keep a fluke from reading as a trend, what a run and a week can resolve, and when samples help.
weight: 240
group: Reading what it finds
---

**How big a change can Cheap Seats detect?** On a 17-prompt set with two answerers and one answer each per track, a single run pins your named rate on one track to about ±17 points, and a week of daily runs pooled together to about ±6. A change smaller than that is reported as within noise, not as a win or a loss. Cheap Seats works it all out from the answers already stored, with no extra model calls. The rest of this page says why answers vary, what Cheap Seats tests, and how to get more precision when you need it.

## Why answers vary

Ask an assistant the same question twice and you get two different answers. That's how these models work, not a fault in the measurement:

- **The list changes every time.** SparkToro and Gumshoe found less than a 1 in 100 chance that two responses list the same brands, and less than 1 in 1,000 that they list them in the same order, while a brand's visibility across many responses was fairly stable ([SparkToro](https://sparktoro.com/blog/new-research-ais-are-highly-inconsistent-when-recommending-brands-or-products-marketers-should-take-care-when-tracking-ai-visibility/)).
- **One run is a noisy reading.** "Don't Measure Once" measured a standard error of 0.37 for detecting a brand from one run, and 0.081 from seven, and recommends pooling over two to four weeks ([arXiv 2604.07585](https://arxiv.org/abs/2604.07585)).
- **Small moves aren't evidence.** Sielinski's bootstrap intervals on citation share were typically 3 to 6 points wide: "a 3-point improvement (8% to 11%) cannot be attributed to an intervention" ([arXiv 2603.08924](https://arxiv.org/abs/2603.08924)).
- **More answers a day buy less than you'd think.** Profound found that 10 runs a day instead of 1 cut daily movement in visibility by only about 11% ([Profound](https://www.tryprofound.com/blog/is-once-a-day-enough)). Much of the movement is the model and the web changing between days, which more answers on the same day can't remove.

So Cheap Seats reports every rate with an interval, and tests every comparison against the noise before calling it a change.

## Prompts are the units

A prompt gets only a handful of answers a run: answerers × tracks × samples. Its answers aren't independent draws about your whole category; they're repeated draws on one question. So Cheap Seats treats each prompt as a unit:

- A trend's rate is the **mean over prompts** of each prompt's own rate, so a prompt with more answers doesn't count for more.
- A **cell** is one prompt's `h` hits out of `n` answers. Its sampling variance is

  > var = p̃ (1 − p̃) / n, with p̃ = (h + 0.5) / (n + 1)

  The smoothing keeps a cell of 0/6 or 6/6 from claiming it has no noise at all.

## The intervals

**On a run.** Each rate on the run page carries a 95% Wilson interval over its answers. See [Metric definitions](../metrics/#your-rates).

**On the rankings**, for named, recommended and top pick, there are two, and they answer different questions:

- **Band, across prompts** (the shaded band on the chart): the rolling mean ± 1.96 · s / √m, where s is the standard deviation of the m prompt-day rates in the window. It answers "questions like these": a different sample of buyer questions would likely land in this range.
- **This set, today** (on hover, and as a tooltip in the table): the day's mean ± 1.96 · √(Σ var_k) / K over its K prompts. It takes your prompts as fixed and covers only the noise of sampling answers, so it's narrower.

**The window** is 7 days by default, or 14 or 28 (`?window=` on the page, `window` on `/api/rankings` and MCP `get_rankings`). It stops at a change of method.

**On a set's page**, each prompt's answers are pooled over the same 7, 14 or 28 days, back from the newest day that asked it, with a Wilson interval on named and recommended. Pooling stops at a change of method, wording or intent.

## The test for a change

Every comparison, day over day or before and after a fix, pairs the two sides prompt by prompt, over the prompts both asked:

> D = mean over prompts k of (p_after,k − p_before,k)
>
> Var(D) = Σ_k (var_after,k + var_before,k) / K²
>
> margin = 1.96 · √Var(D)

A change is **within noise** when D ± margin covers 0. Rankings greys it out and shows `±X pts` beside it.

**Rank moves** are tested the same way. Your rank changes when another product crosses you, so for each product that crossed, Cheap Seats tests the paired change in the gap between your share of a prompt's answers and that product's. If no crossing is significant in the direction the rank moved, the table says **within noise** and draws no arrow.

The margin covers the noise of sampling answers. A change beyond it is real in the sense that it isn't a coin flip, but it can still come from a model update or the web changing rather than from your work.

## Worked example

Cheap Seats' own *Choosing an AI visibility tool* set: 17 prompts, two answerers (Claude and an OpenAI model), one search and one recall answer each. On one track, each prompt gets **n = 2** answers a run. Take the worst case for noise, a rate near 50% (one of the two answers names you):

> p̃ = (1 + 0.5) / (2 + 1) = 0.5, var = 0.5 × 0.5 / 2 = 0.125 per prompt
>
> Σ var over 17 prompts = 17 × 0.125 = 2.125, √2.125 = 1.458
>
> this set, today: ± 1.96 × 1.458 / 17 = **±16.8 points**
>
> day over day, two such runs: ± 1.96 × √(2 × 2.125) / 17 = **±23.8 points**

Pool a week of daily runs and each prompt has **n = 14** answers on the track:

> p̃ = (7 + 0.5) / 15 = 0.5, var = 0.25 / 14 = 0.0179 per prompt
>
> Σ var = 17 × 0.0179 = 0.304, √0.304 = 0.551
>
> one 7-day pool: ± 1.96 × 0.551 / 17 = **±6.4 points**
>
> one 7-day pool against another: **±9.0 points**

The same arithmetic for other set-ups, at a 50% rate (lower rates are a little less noisy; a rate near 0% much less):

| answers per prompt on the track | how you get there | one reading | a change between two |
| ---: | --- | ---: | ---: |
| 2 | one run, 2 answerers × 1 sample | ±17 pts | ±24 pts |
| 4 | one run with `search = 2`, or two runs | ±12 pts | ±17 pts |
| 8 | four weekly runs (a 28-day window) | ±8 pts | ±12 pts |
| 14 | seven daily runs (a 7-day window) | ±6 pts | ±9 pts |

So one run tells you where you stand roughly; a week or a month tells you whether you moved. A swing of 10 points between two single runs is well inside the noise.

## What "no detectable change" means for a fix

When you mark a fix with its pull request, Cheap Seats judges it on the prompts the fix meant to flip, named and recommended, with the test above:

- **Before** pools the fix's run and the same-method runs up to 28 days before it, at most 5 runs.
- **After** pools every same-method run since you marked it, within 28 days of the newest.

| status | when |
| --- | --- |
| pending | the set hasn't run since |
| needs regrade | it has, but only under another grading method; [re-grade](../regrading/) the runs it names to measure it |
| not comparable | it has, but only with answers asked differently, which no re-grade can change |
| too early | the newest run is less than 7 days after, or the target prompts average fewer than 4 answers since |
| moved | named or recommended rose beyond its margin, and neither fell |
| worse | one fell beyond its margin, and neither rose |
| mixed | one rose and the other fell |
| no detectable change (±X pts) | both intervals cover 0. X is named's margin |

**No detectable change is not "it didn't work".** It means any effect is smaller than ±X points, given the answers so far. A fix aimed at three prompts, graded on both tracks with two answerers (4 answers a prompt a run), has before-and-after margins of about:

| after the fix | answers a prompt after | margin at a 50% rate |
| --- | ---: | ---: |
| one weekly run | 4 | about ±31 pts |
| four weekly runs | 16 | about ±19 pts |

Cheap Seats waits 7 days and at least 4 answers a prompt before judging (Gauge [evaluates content actions](https://docs.withgauge.com/navigating/action-center) no earlier than 14 days after completion). If the fix's page turns up in searches or citations after you marked it, when it didn't before, the outcome says **newly surfaced**: evidence the page is being read, though not by itself a move. See [From fix to pull request](../fix-to-pull-request/#4-merge-then-let-the-next-run-check-it).

## When more samples help

**You don't need many samples to start.** One sample per track, run weekly, is enough to see where you stand, and the 28-day window and fix outcomes pool runs for you. Extra samples narrow a single run; more runs over time also average out the day-to-day drift that extra samples can't touch.

**Cheap Seats tells you whether your samples pay off.** When some answerer takes more than one sample per prompt, the set's page splits the run-to-run variance of each prompt's named rate as V = S/n + D (Profound's decomposition): S is the variance of one answer within a run, n the samples, and D the drift between runs. It's worked out per prompt, answerer and track over the same-method runs of the last 28 days, and needs at least 4 runs and 6 such cells. Going down to one sample would widen a run's interval by w = √((S + D) / (S/n + D)):

- **w under 1.25**: "Extra samples are buying little precision: between-run drift dominates; samples=1 would give about the same band." Cut samples and save the answers.
- **otherwise**: "The samples are paying off", with how much wider one sample would make the band.

**Adaptive sampling** spends extra answers only where they help. With `[sampling] adaptive = true` and `max_extra = N`, Cheap Seats gives each core run up to N extra answers, decided before the run starts, for the prompts whose named rate has been least certain over the last 28 days of same-method runs. Each extra goes where it most shrinks the run's total variance, a cell gets at most as many extras as it has planned samples, and on API answerers the extras must fit in today's budget. A prompt named in 0 of 40 answers gets none. It's off by default and never starts a trend over; extras count in the run's rates like any other answer. See [Configuration](../configuration/#sampling) and [Cost and budget](../cost-and-budget/#keeping-the-spend-down).
