---
title: How many runs do you need to trust an AI visibility number?
date: 2026-10-22
author: Chad Metcalf
description: AI answers vary. What the research says about that variance, how one run compares with seven daily runs, and what to do about it.
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

Start with the simplest case: a rate near 50%, from \(n\) independent answers. The approximate 95% margin is

$$
1.96\sqrt{\frac{0.25}{n}}
$$

| answers | margin |
| ---: | ---: |
| 10 | ±31 pts |
| 30 | ±18 pts |
| 100 | ±10 pts |
| 400 | ±5 pts |

To tell two such readings apart, the margin on the difference is \(\sqrt{2}\) times wider. For a 10-point margin on a difference near 50%, the answer count on each side is

$$
n = 2 \times 0.25\left(\frac{1.96}{0.10}\right)^2 \approx 192
$$

A 5-point margin needs about **768 answers on each side**. These are margin calculations, not a statistical-power target, and assume independent answers with no drift.

## Prompts are the units

Answers to the same prompt aren't independent draws about your whole category. They're repeated draws on one question, so Cheap Seats treats each prompt as the unit: a trend's rate is the mean of each prompt's own rate. For \(h\) hits in \(n\) answers, the smoothed rate is

$$
\tilde p = \frac{h + 0.5}{n + 1}
$$

and the prompt's sampling variance is

$$
v = \frac{\tilde p(1 - \tilde p)}{n}
$$

Over \(K\) prompts, the day's approximate 95% margin is

$$
\frac{1.96}{K}\sqrt{\sum_{i=1}^{K} v_i}
$$

where \(v_i\) is prompt \(i\)'s variance.

On 21 October 2026, Cheap Seats' own *Choosing an AI visibility tool* set had 17 prompts and two answerers, each answering once on each track. For named rate on one track, each prompt gets \(n = 2\) answers a run:

{{< figure name="precision" >}}

A 10-point swing is within the margin between two single runs. Pooling seven daily runs narrows the sampling margin; day-to-day drift can add uncertainty. Seven daily runs are an illustrative schedule; the configured cadence determines how many observations actually fit in a week. Here's the calculation at a rate near 50%:

$$
\tilde p = \frac{1 + 0.5}{3} = 0.5
$$

$$
v = \frac{0.25}{2} = 0.125
$$

Across the 17 prompts, the variances sum to \(17 \times 0.125 = 2.125\), whose square root is about 1.458. In percentage points, the margin on **one run** is

$$
\pm 100\frac{1.96 \times 1.458}{17} \approx \pm 16.8\text{ points}
$$

For **one run against the next**, it is

$$
\pm 100\frac{1.96\sqrt{2 \times 2.125}}{17} \approx \pm 23.8\text{ points}
$$

A week of daily runs pooled gives each prompt \(n = 14\):

$$
v = \frac{0.25}{14} \approx 0.0179
$$

The variances sum to about 0.304, whose square root is about 0.551. The margin on **one week** is

$$
\pm 100\frac{1.96 \times 0.551}{17} \approx \pm 6.4\text{ points}
$$

For **one week against another**, it is **±9.0 points**.

That result requires seven daily runs on each side, with the same 17 prompts and comparable answers. A seven-day window containing one weekly run still has one run. For recommendation rates, count only selection questions: informational questions increase named-rate coverage without increasing the recommendation denominator. None of these sampling margins validates which buyer questions you chose.

## What to do about it

- **Read one run for gaps and uncertainty.** It shows which sampled questions named you and which products appeared instead. More comparable runs can help distinguish a change; elapsed time alone cannot.
- **Pool before you compare.** Compare windows with enough comparable observations for the precision you need. Check how many runs a 7- or 28-day window actually contains.
- **Spread answers over days rather than piling them into one.** Extra samples in a run narrow that run's interval, but much of the noise is day-to-day drift, which only more days average out. Profound's 10-a-day result is the warning.
- **Check whether your samples pay off.** When a prompt takes more than one sample, Cheap Seats splits its run-to-run variance into within-run noise and between-run drift (Profound's decomposition), and tells you when extra samples are buying little. If drift dominates, cut samples and save the answers.
- **Wait before judging a fix.** Cheap Seats waits 7 days and at least 4 answers a prompt before calling a fix's outcome. With five pre-fix runs pooled, a fix aimed at three prompts with four answers per prompt per run has a margin of about ±31 points after one weekly run and ±19 after four. “No detectable change” means the interval includes zero; it doesn't prove no effect or bound the effect to the stated margin alone.
- **Distrust a number without an interval.** If a tool shows 40% and not the range around it, work out the range yourself from the answer count. If it doesn't show the answer count either, ask for it.

A change beyond the margin still isn't proof that your work caused it: a model update or the web changing can move a rate too. An interval that includes zero leaves the direction uncertain. Report that uncertainty rather than declaring a win or loss.

[How big a change Cheap Seats can detect](/docs/noise-and-confidence/) has the full method: the two kinds of interval on the rankings, the paired test for a change, rank moves, fix outcomes and adaptive sampling. For why the same answers can give different numbers in different tools, see [Why AI visibility scores differ between tools](/blog/why-ai-visibility-scores-differ/).
