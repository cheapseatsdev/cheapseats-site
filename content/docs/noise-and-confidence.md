---
title: How big a change Cheap Seats can detect
description: Reading uncertainty, detecting changes, interpreting fix outcomes, and deciding whether more samples help.
weight: 240
group: Reading what it finds
---

Use this page to judge whether a measured difference is distinguishable from sampling noise and whether more observations would help. Start with [Measuring success](../measuring-success/) for the workflow and plain-language outcome decisions; the calculations and worked examples live here.

For named rate on 17 fixed prompts with two answerers and one sample per track, one run has a worst-case sampling margin of about **±17 points for a reading** and **±24 points for a change between two runs**. Pool seven daily runs on each side and those margins shrink to about **±6** and **±9**. Reading uncertainty and change detection are different calculations.

Cheap Seats calculates both from stored answers, without extra model calls. A change beyond its margin is evidence against sampling noise; it does not establish that your work caused the change.

## Worked example

For 17 fixed prompts, on one track, with rates near 50% and equal answer counts on both sides:

{{< figure name="precision" >}}

These are approximate 95% sampling margins, not the chart's across-prompts band. Rates far from 50% are less noisy. A 10-point swing between two single runs is within noise in this example. [The calculation](#calculating-the-example) is below.

Seven daily runs are seven observations over time, not one weekly run or a promise about a seven-day window. Recommendation rates use only selection questions, so a mixed-intent set has fewer eligible prompts than the named-rate example. Use the actual comparable prompts and answers for the metric being compared. These margins cover sampling answers to the chosen questions; they don't establish that those questions represent buyer demand.

## What "no detectable change" means for a fix

When you record work against a fix, Cheap Seats compares named and recommended rates on its target prompts:

- **Before:** the fix's run and up to four same-method runs in the 28 days before it.
- **After:** every same-method run since the work was marked, within 28 days of the newest.

| status | when |
| --- | --- |
| pending | the set hasn't run since |
| needs regrade | it has, but only under another grading method; [re-grade](../regrading/) the named runs |
| not comparable | it has, but only with answers asked differently; re-grading cannot fix this |
| too early | the newest run is less than 7 days after, or the target prompts average fewer than 4 answers since |
| moved | named or recommended rose beyond its margin, and neither fell beyond its margin |
| worse | one fell beyond its margin, and neither rose beyond its margin |
| mixed | one rose and the other fell beyond their margins |
| no detectable change (±X pts) | neither measured change excludes zero; X is named's margin |

**No detectable change does not mean the fix failed.** The available answers cannot distinguish the observed change from zero. The margin is uncertainty around that observed change, not a bound on the size of a possible effect. A benefit or harm may remain undetected.

For example, take three target prompts, two answerers, both tracks and one sample each: four answers per prompt per run. With **five runs pooled before the fix** (20 answers per prompt), the worst-case margins are:

| after the fix | answers per prompt after | margin at a 50% rate |
| --- | ---: | ---: |
| one weekly run | 4 | about ±31 pts |
| four weekly runs | 16 | about ±19 pts |

A page is **newly surfaced** if searches or citations reached it after the work but not before. That shows retrieval or citation, not necessarily a recommendation change. Host citation changes are reported separately. See [From fix to pull request](../fix-to-pull-request/#4-merge-then-let-the-next-run-check-it).

## When more samples help

Start with one sample per track and weekly runs to find gaps. This is an economical starting cadence, not a precision guarantee. The 28-day window and fix outcomes pool the comparable runs available. Extra samples improve a single run's precision; runs over time also capture day-to-day variation. Adding distinct buyer questions expands coverage, while repeating one question measures variability for that question.

When an answerer takes multiple samples, the set page estimates whether they help. It splits run-to-run named-rate variance as:

$$
V = \frac{S}{n} + D
$$

\(S\) is within-run variance, \(n\) the samples and \(D\) between-run drift. This is calculated per prompt, answerer and track over 28 days of same-method runs, with at least 4 runs and 6 cells.

Going down to one sample would widen the interval by:

$$
w = \sqrt{\frac{S + D}{S/n + D}}
$$

- **\(w < 1.25\):** extra samples buy little precision because drift dominates; consider reducing samples.
- **Otherwise:** the page says samples are paying off and gives the estimated widening at one sample.

**Adaptive sampling** (`[sampling] adaptive = true`, `max_extra = N`) assigns up to N extra answers before a run, using uncertainty in the last 28 days of same-method named rates. Each extra goes where it most reduces total variance. A cell gets at most its planned sample count in extras; API extras must fit the daily budget. A prompt named in 0 of 40 answers gets none. Adaptive sampling is off by default, does not restart trends, and its extras count in run rates. See [Configuration](../configuration/#sampling) and [Cost and budget](../cost-and-budget/#keeping-the-spend-down).

## Why answers vary

Repeated answers differ in brand lists and ordering. [SparkToro and Gumshoe](https://sparktoro.com/blog/new-research-ais-are-highly-inconsistent-when-recommending-brands-or-products-marketers-should-take-care-when-tracking-ai-visibility/) found lists highly inconsistent while visibility across many answers was steadier. [Don't Measure Once](https://arxiv.org/abs/2604.07585) recommends pooling two to four weeks; [Sielinski's citation-share analysis](https://arxiv.org/abs/2603.08924) shows how small apparent gains can remain within uncertainty.

More same-day answers cannot remove all variation: [Profound](https://www.tryprofound.com/blog/is-once-a-day-enough) found ten daily runs reduced daily visibility movement by only about 11% compared with one. Model and web changes also affect answers.

## Prompts are the units

Repeated answers to one question aren't independent questions about your category. Trends therefore average each prompt's own rate, so prompts with more samples don't carry more weight.

For a cell of **\(h\) hits out of \(n\) answers**, sampling variance is:

$$
\operatorname{var} = \frac{\tilde p(1 - \tilde p)}{n},
\qquad \tilde p = \frac{h + 0.5}{n + 1}
$$

Smoothing prevents 0/6 or 6/6 from claiming zero noise.

## The intervals

| where | calculation and meaning |
| --- | --- |
| **Run page** | 95% Wilson intervals over answers; see [Your rates](../metrics/#your-rates) |
| **Rankings: band, across prompts** | rolling mean \(\pm 1.96\frac{s}{\sqrt{m}}\), where \(s\) is the standard deviation of \(m\) prompt-day rates. Describes variation across questions like these. |
| **Rankings: this set, today** | day's mean \(\pm 1.96\frac{\sqrt{\sum_k \operatorname{var}_k}}{K}\) over \(K\) fixed prompts. Covers sampling answers to this set, not variation in the choice of questions. |
| **Set page: each prompt** | answers pooled over the selected window, with Wilson intervals on named and recommended |

Windows are 7 days by default, or 14 or 28 (`?window=`, `/api/rankings`' `window`, or MCP `get_rankings`). Rankings windows stop at method changes. Per-prompt pooling starts from the newest day asking it and also stops at wording or intent changes.

## The test for a change

Day-over-day and fix comparisons pair the prompts both sides asked:

$$
D = \frac{1}{K}\sum_k \left(p_{\text{after},k} - p_{\text{before},k}\right)
$$

$$
\operatorname{Var}(D) = \frac{\sum_k \left(\operatorname{var}_{\text{after},k} + \operatorname{var}_{\text{before},k}\right)}{K^2}
$$

$$
\text{margin} = 1.96\sqrt{\operatorname{Var}(D)}
$$

A change is **within noise** when \(D \pm \text{margin}\) covers zero. Rankings greys it out and shows `±X pts`.

Rank changes use the paired change in the gap between your brand's and each crossing product's answer shares. If no crossing is significant in the rank move's direction, the table shows **within noise** without an arrow.

These tests cover sampling variation under this calculation. They do not rule out model updates, web changes or other causes of a detected change.

### Calculating the example

The 17-prompt example has two answers per prompt on one track. At 50%:

$$
\tilde p = \frac{1 + 0.5}{2 + 1} = 0.5
$$

$$
\operatorname{var} = \frac{0.25}{2} = 0.125
$$

$$
\sum_k \operatorname{var}_k = 17 \times 0.125 = 2.125
$$

Multiplying by 100 converts the margins to percentage points. For one reading:

$$
\pm 100 \times 1.96\frac{\sqrt{2.125}}{17} \approx \pm 16.8
$$

For a change between two runs:

$$
\pm 100 \times 1.96\frac{\sqrt{2 \times 2.125}}{17} \approx \pm 23.8
$$

Seven daily runs give each prompt 14 answers on the track:

$$
\tilde p = \frac{7 + 0.5}{15} = 0.5
$$

$$
\operatorname{var} = \frac{0.25}{14} \approx 0.0179
$$

$$
\sum_k \operatorname{var}_k \approx 17 \times 0.0179 \approx 0.304
$$

For one pool, in percentage points:

$$
\pm 100 \times 1.96\frac{\sqrt{0.304}}{17} \approx \pm 6.4
$$

For a change between two such pools:

$$
\pm 100 \times 1.96\frac{\sqrt{2 \times 0.304}}{17} \approx \pm 9.0
$$
