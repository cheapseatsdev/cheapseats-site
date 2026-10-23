---
title: Prove your content changed AI answers
description: How often to re-check whether AI assistants recommend you, how to track the change over time against noise, and how to prove to leadership that a page you shipped changed what the assistants say, with the stored answers as evidence. With a real fix outcome and a one-page report built from it.
weight: 60
---

**The short answer.** Re-check on a schedule, weekly for most teams, daily if you want a smoother line and can afford seven times the answers, and never from a single run. Track three things over time: your share-of-voice rank and your named and recommended rates per prompt set, each shown with the noise of a few answers a prompt, so a swing reads as real or as chance. To prove a piece of content worked, tie it to the prompts it was meant to flip when you ship it, and compare exactly those prompts before and after, with a margin, keeping the answers and citations behind both sides. Cheap Seats does each step: a built-in schedule under a daily budget, a day-by-day ranking with rolling averages and a within-noise test, and a record on every fix of the pull request, the prompts it should flip, and the before-and-after outcome. The one-page report at the end of this guide is built from those fields and nothing else.

## How often to re-check

Answers vary from run to run, so the question isn't only how often the web changes but how many answers you need before a change means anything. Two facts set the cadence:

- **Recall answers move only when the model changes.** With no tools, the model answers from training, and that doesn't shift between Tuesday and Wednesday. Weekly is plenty.
- **Search answers move as the web does**, over days to weeks, and each run is a sample of what the search tool returned that day. Daily runs mostly buy a smoother trend line, at seven times the answers and their grading cost.

Cheap Seats' schedule is in `cheapseats.toml`, and the run's cost is capped by the same file:

```toml
[schedule]
daily_hour_utc = 13

[tiers.core]
every_days = 7        # 1 for daily

[tiers.plg]
every_days = 7
max_samples = 1

[budget]
daily_usd = 10.0
```

From that hour, each core set runs every `every_days` days and each plg set likewise, one after another; every API call is checked against today's spend first, and a run that would go over stops and keeps what it finished. cheapseats.dev runs its five sets weekly. On subscriptions the answering is free and grading an 11-prompt set costs three to four cents a run; [Cost, API keys and the daily budget](/docs/cost-and-budget/#an-11-prompt-set-graded-twice) has the measured figures, and daily is the same arithmetic times seven. You can also run a set by hand any time, from its page, the CLI or the API, and it joins the same trend.

Hosted tools fix the cadence for you: Otterly.AI's help centre says it checks every engine [daily](https://help.otterly.ai/monitoring-interval), with no manual trigger and no way to change the frequency, as of October 2026. With Cheap Seats the cadence is a line in your config, and a run can be started whenever a page ships.

## Tracking the change over time

**Rankings** (`/rankings`, and each set's page) turns runs into a day-by-day series per set and track: your place on the share-of-voice board, who leads, your named, recommended and top-pick rates with each prompt counting once, and a rolling average over 7, 14 or 28 days with a 95% band. The series survives changes to the set: a day compares with the day before only on the prompts both asked, worded the same, of the same answerers, and says so ("on 13 of 15 prompts"). A change in how answers are asked or graded starts the comparison over; [re-grading](/docs/regrading/) carries the old answers across.

**Every change is tested against noise.** "Vs day before" pairs the two days prompt by prompt and shows the change with its 95% margin; one whose interval covers zero is greyed out as **within noise**. A rank move is shown only if a product that crossed you moved beyond the noise. Here is our own *head to heads* set on the search track on 22 October 2026, straight from `GET /api/rankings`:

| field | value |
| --- | --- |
| rank | #10 (was #13 the day before; the move is marked **within noise**) |
| named today | 18% of 22 answers, interval 0 to 36% |
| 7-day rolling named | 16%, band 6 to 26% |
| vs day before | +4.5 points, margin ±25 points: **within noise** |
| recommended | 0%, vs day before 0 ±22 points |

Two days in, nothing here is evidence of anything, and the page says so instead of drawing an arrow. [How big a change Cheap Seats can detect](/docs/noise-and-confidence/) has the arithmetic: with two answerers and one sample each, one run resolves a set's rate to about ±17 points at worst, a week of daily runs to about ±6, and a change between two single runs needs about 24 points to show.

Triangles under the chart mark the days a fix was proposed (gold) or accepted (green), linked to its pull request, so a move sits next to what you shipped. Each set's page also shows **citation stability**, how much the hosts the answers cite change from run to run, once it has three transitions of the same method; ours has one so far, with a similarity of 55 and an overlap of 34 between the two runs, which is the page's way of saying each run's sources are still a sample.

The same series is `GET /api/rankings` (`lastDays`, `set`, `window`) and the MCP tool `get_rankings`, with `rolling`, `bands`, `today`, `delta_rank`, `rank_within_noise` and a `compare` object carrying the day-over-day change and margin for named and recommended.

## Tie each fix to the prompts it should flip

Every fix on the list names the **prompts** it could flip, by number and by id, so the test is fixed before the work starts. When you ship it, mark it: with the commit or pull request URL, **proposed** while the PR is open, **accepted** when it merges, **withdrawn** if it closes. In the UI that's the form on the fix's card; over MCP it's `mark_fix` and `set_attempt_state`; over the API it's `POST /api/runs/{id}/fixes/{rank}/attempts` and `POST /api/attempts/{id}`. From then on, every run of the set measures the fix:

- **Before** pools the fix's run and the same-method runs up to 28 days before it, at most five.
- **After** pools every same-method run since you marked it, within 28 days of the newest.
- On exactly the fix's prompts, named and recommended are compared with the paired test above, each with its margin.
- Whether the fix's **target page** turned up in any answer's searches or citations, before and after, and whether its **host** was cited at all on each side.

| outcome | when |
| --- | --- |
| pending | the set hasn't run since |
| not comparable | it has, but only asked or graded differently |
| too early | less than 7 days since, or fewer than 4 answers a target prompt on average |
| moved | named or recommended rose beyond its margin, and neither fell |
| worse | one fell beyond its margin, and neither rose |
| mixed | one rose and the other fell |
| no detectable change (±X pts) | neither moved beyond its margin; a smaller effect could still be there |

A fix whose prompts still lose comes back on the next run's list marked *retry*, with this outcome attached, so the next attempt knows what the last one did. `list_attempts` over MCP, or `GET /api/attempts`, returns every attempt with its outcome; the run page and quick wins show them on the fix.

## A real outcome

On 22 October 2026 we shipped a docs page, *How grading works*, for a fix on our *head to heads* set that named five prompts, and marked it accepted. The set ran again the same day. Its outcome record, verbatim in its fields:

| field | value |
| --- | --- |
| status | **too early**: 0 days since, one run on each side |
| prompts | 5, with 4 answers each per run: 20 answers before, 20 after |
| named | +0 points, margin ±29 |
| recommended | +5 points, margin ±20 |
| target seen | not before, not after |
| host cited | our domain (popcorn.zone at the time) not cited before, not after |

And per prompt, named and recommended, before → after:

| prompt | named | recommended |
| --- | --- | --- |
| Cheap Seats vs Gauge | 2/4 → 2/4 | 0/4 → 0/4 |
| Cheap Seats or Semrush AI Toolkit | 3/4 → 3/4 | 0/4 → 1/4 |
| Good open-source alternative to paid tools? | 3/4 → 3/4 | 0/4 → 0/4 |
| How does it decide an assistant recommended a brand? | 2/4 → 3/4 | 0/4 → 0/4 |
| Fit for a developer-tools company? | 3/4 → 2/4 | 0/4 → 0/4 |

The honest reading: nothing can be claimed yet. One answer went from mentioned to recommended, one prompt gained a mention and one lost one, and the page itself was in no answer's searches or citations. That last fact is the one to act on: it says the page hadn't been retrieved, which is an indexing question before it's a content one. The record will be re-judged on every run until it is a week old with at least four answers a prompt, and the margins shrink as the pools grow: at a 50% rate, three prompts with four answers each a run have a before-and-after margin of about ±31 points after one weekly run and about ±19 after four.

## The one-page report

Everything leadership needs is already on the attempt and the run. Build the page from these fields only, so every line can be traced to stored answers:

> **Did the grading page change what AI assistants say about us?** Status: too early (judged 22 October 2026, 0 days after shipping; re-judged every run).
>
> **What we shipped.** *How grading works* (cheapseats.dev/docs/how-grading-works), pull request #8, merged 22 October.
>
> **What it was meant to change.** Five buyer questions on the *head to heads* set, listed above, on both tracks, two assistants.
>
> **Before → after.** Named: 65% → 65% of 20 answers (+0 ±29). Recommended: 0% → 5% (+5 ±20). Neither change is beyond its margin.
>
> **Is the page being read?** Not yet: in no answer's searches or citations, before or after. Next step: confirm it's indexed (sitemap submitted, IndexNow), re-check next run.
>
> **Evidence.** Every answer behind these numbers, with its grade and sources, is on the run pages; a read-only link to the newest run is attached.

The percentages are the per-prompt counts above summed (13 of 20 named on each side; 0 then 1 of 20 recommended). The link is a [share link](/docs/sharing/): a read-only, expiring, revocable page for one run showing the headline rates with their intervals, the share-of-voice board, the strongest and weakest prompts, the themes and the top fixes, and the answers' text only if you choose to include it, with nothing from the config or behind the sign-in. For a report that covers several fixes, the attempts list has the same fields for each; for the trend, the rankings page with its fix markers.

What makes this provable rather than persuasive is that the test was fixed before the work: the prompts were named on the fix, the before pool was already stored, and the after pool is whatever the schedule produces. A report that picks its prompts after seeing the answers is a different thing, and the margins are there to stop a good week from being mistaken for a result.
