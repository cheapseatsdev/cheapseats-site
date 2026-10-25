---
title: How many runs do you need to trust an AI visibility number?
date: 2026-10-22
author: Chad Metcalf
description: AI answers change every time you ask. What the research says about that variance, how far one run and a week of runs can be trusted, and what to do about it.
---

Ask an assistant the same question twice and you'll get two different answers. So when an AI visibility tool says you're named in 40% of answers this week and 30% last week, the first question isn't "what did we break?" It's "is that a change at all?" With small samples, it may be noise.

<!--more-->

## The research

Four findings worth knowing:

- **Lists rarely match.** SparkToro and Gumshoe found less than a 1 in 100 chance that two responses list the same brands, and less than 1 in 1,000 that they list them in the same order. A brand's visibility across many responses, though, was fairly stable ([SparkToro](https://sparktoro.com/blog/new-research-ais-are-highly-inconsistent-when-recommending-brands-or-products-marketers-should-take-care-when-tracking-ai-visibility/)). Repeated answers make a rate more informative than one list.
- **One run is a noisy reading.** "Don't Measure Once" measured a standard error of 0.37 for detecting a brand from one run, and 0.081 from seven, and recommends pooling over two to four weeks ([arXiv 2604.07585](https://arxiv.org/abs/2604.07585)).
- **Small moves aren't evidence.** Sielinski's bootstrap intervals on citation share were typically 3 to 6 points wide: "a 3-point improvement (8% to 11%) cannot be attributed to an intervention" ([arXiv 2603.08924](https://arxiv.org/abs/2603.08924)).
- **More answers a day buy less than you'd think.** Profound found that 10 runs a day instead of 1 cut daily movement in visibility by only about 11% ([Profound](https://www.tryprofound.com/blog/is-once-a-day-enough)). Much of the movement is the model and the web changing between days, which more answers on the same day can't remove.

## The arithmetic for one rate

Start with the simplest case: a rate near 50%, from `n` independent answers. The 95% margin is about 1.96 × √(0.25 / n):

| answers | margin |
| ---: | ---: |
| 10 | ±31 pts |
| 30 | ±18 pts |
| 100 | ±10 pts |
| 400 | ±5 pts |

To tell two such readings apart, the margin on the difference is √2 times wider. For the margin on a difference near 50% to be 10 points, you need about 2 × 0.25 × (1.96 / 0.10)² ≈ **192 answers on each side**; a 5-point margin, about **768**. These are margin calculations, not a statistical-power target, and assume independent answers with no drift.

## Prompts are the units

Answers to the same prompt aren't independent draws about your whole category. They're repeated draws on one question, so Cheap Seats treats each prompt as the unit: a trend's rate is the mean of each prompt's own rate, and each prompt's sampling variance is

> var = p̃ (1 − p̃) / n, with p̃ = (h + 0.5) / (n + 1)

for `h` hits in `n` answers. Over `K` prompts, a day's margin is 1.96 · √(Σ var) / K.

Cheap Seats' own *Choosing an AI visibility tool* set has 17 prompts and two answerers, each answering once on each track. On one track, each prompt gets **n = 2** answers a run. At a rate near 50%:

> p̃ = (1 + 0.5) / 3 = 0.5, var = 0.25 / 2 = 0.125 per prompt
>
> Σ var = 17 × 0.125 = 2.125, √2.125 = 1.458
>
> one run: ± 1.96 × 1.458 / 17 = **±16.8 points**
>
> one run against the next: ± 1.96 × √(2 × 2.125) / 17 = **±23.8 points**

A week of daily runs pooled gives each prompt **n = 14**:

> var = 0.25 / 14 = 0.0179 per prompt, Σ var = 0.304, √0.304 = 0.551
>
> one week: ± 1.96 × 0.551 / 17 = **±6.4 points**
>
> one week against another: **±9.0 points**

The same arithmetic for other set-ups:

{{< figure name="precision" >}}

Under those assumptions, a 10-point swing is within the margin between two single runs. Pooled weeks have a narrower sampling margin; day-to-day drift can add uncertainty.

## What to do about it

- **Read one run for where you stand, not for whether you moved.** A single run tells you roughly how often you're named and who's beating you. A week or a month tells you whether that changed.
- **Pool before you compare.** Compare a 7- or 28-day window against the one before, not yesterday against today.
- **Spread answers over days rather than piling them into one.** Extra samples in a run narrow that run's interval, but much of the noise is day-to-day drift, which only more days average out. Profound's 10-a-day result is the warning.
- **Check whether your samples pay off.** When a prompt takes more than one sample, Cheap Seats splits its run-to-run variance into within-run noise and between-run drift (Profound's decomposition), and tells you when extra samples are buying little. If drift dominates, cut samples and save the answers.
- **Wait before judging a fix.** Cheap Seats waits 7 days and at least 4 answers a prompt before calling a fix's outcome. With five pre-fix runs pooled, a fix aimed at three prompts with four answers per prompt per run has a margin of about ±31 points after one weekly run and ±19 after four. “No detectable change” means the interval includes zero; it doesn't prove no effect or bound the effect to the stated margin alone.
- **Distrust a number without an interval.** If a tool shows 40% and not the range around it, work out the range yourself from the answer count. If it doesn't show the answer count either, ask for it.

A change beyond the margin still isn't proof that your work caused it: a model update or the web changing can move a rate too. An interval that includes zero leaves the direction uncertain. Report that uncertainty rather than declaring a win or loss.

[How big a change Cheap Seats can detect](/docs/noise-and-confidence/) has the full method: the two kinds of interval on the rankings, the paired test for a change, rank moves, fix outcomes and adaptive sampling. For why the same answers can give different numbers in different tools, see [Why AI visibility scores differ between tools](/blog/why-ai-visibility-scores-differ/).
