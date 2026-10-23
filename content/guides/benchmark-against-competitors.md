---
title: Benchmark your brand against competitors in AI answers
description: Benchmark your brand against competitors in ChatGPT and Claude answers, measure share of voice, and pick the metrics to track, with a real table and trend.
weight: 30
---

**The short answer.** To benchmark your brand against competitors in AI answers, ask the assistants your buyers' questions, several times each, and record every product each answer names, not only yours. Then, for one fixed set of questions, count how many answers named each product (its named rate and share of voice) and how many made it the top pick, rank everyone on that list, and repeat daily so you see the trend. [Cheap Seats](/docs/getting-started/) does exactly this: it records every product named in each answer, computes each prompt set's share-of-voice rank and recommended and mentioned rates day by day, and keeps the answers, searches and citations behind every number so you can check them.

The fair comparison is **top picks on the same prompt set**: the same questions, asked of the same assistants, graded the same way, for every brand. Being named is easy to inflate by choosing the questions; being the one product an answer tells the buyer to use is not.

Cheap Seats asks Claude and OpenAI models, on two tracks (search, where the assistant must search the web first, and recall, from what the model already believes). It does not ask Gemini, Perplexity, Microsoft Copilot or Google AI Overviews.

## Is there a way to measure share of voice in AI chatbot answers?

Yes. A second model, the grader, reads each answer and lists every product, company or platform it names, in order; Cheap Seats counts those lists, once per product per answer however many times it repeats the name. Each product on the board gets two rates:

> named rate = answers that named it ÷ all graded answers in the run
>
> share of voice = answers that named it ÷ the sum of that count over every product named

Your own brand is counted as named exactly when its grade is *recommended* or *mentioned*, so your row always matches your named rate. Because most answers name several products, named rates add up to well over 100%; shares of voice add up to 100%.

Many tools define share of voice as *your mentions ÷ mentions of the tracked brands*. That ratio changes when you add or drop a tracked competitor, even if no answer changed. Cheap Seats' denominator is every product the answers named, including ones you never configured, so a product's number depends only on the answers. Earlier versions of Cheap Seats showed only the named rate and called it share of voice; [Metric definitions](/docs/metrics/#how-these-compare-to-other-tools) maps both onto other tools' definitions.

Next to each product's share, Cheap Seats counts its **top picks**: answers whose single strongest recommendation was that product.

## How rank is computed

Your **share-of-voice rank** is your place on that board, from the code in `report.BrandRank`:

- rank = 1 + the number of products named in **more** answers than you;
- products named in the same number of answers share a rank;
- a brand no answer named has no rank (shown as 0 in the API).

The board is everything the answers named, not just the competitors you listed, so a new entrant that starts appearing in answers pushes you down even if you never heard of it.

## What metrics a marketing team should use

Track these per prompt set and per track, each from the same graded answers:

| metric | what it is | why it matters |
| --- | --- | --- |
| top-pick rate | answers whose single top pick is you ÷ answers to questions that ask for a choice | the strictest, fairest win: one per answer |
| recommended rate | answers graded *recommended* ÷ choice answers | you were among at most three products the answer endorsed |
| named rate | answers graded *recommended* or *mentioned* ÷ all answers | the assistant knows you exist |
| share of voice | answers naming you ÷ answers naming each product, summed over every product | your slice of the conversation, out of 100% |
| avg place | your mean position in the answers that name you | whether you come up first or last |
| share-of-voice rank | your place on the board of every product named | where you stand against the whole field |
| top-pick counts per competitor | how many answers each product won | who is actually winning the questions |
| objections | the concerns answers raised about you | what to fix |
| pages cited and surfaced | which web pages the search track read and linked | where the answers came from |

Every rate carries a 95% Wilson interval, so 0 of 17 reads as uncertain, not as zero. The definitions are in [Mentioned vs. recommended](/guides/mentioned-vs-recommended/); how each answer is graded is in [How grading works](/docs/how-grading-works/).

## Why top picks on the same prompt set is the fair benchmark

**Share of voice depends on the questions.** Ask "Cheap Seats or Semrush AI Toolkit?" and every answer names Cheap Seats. On Cheap Seats' own *head to heads* set, whose questions name Cheap Seats, Claude and an OpenAI model answering from memory on 22 October 2026 named Cheap Seats in 19 of 22 answers: rank 1, ahead of Profound (10), Peec AI (9) and Otterly.AI (9). On the *Choosing an AI visibility tool* set the same day, where buyers ask open questions, Cheap Seats was named in none of 68. Neither number means anything next to a competitor's figure from a different set of questions.

**Mentions are not wins.** In that same head-to-head run, Cheap Seats was named in 19 answers and the top pick in 1. Peec AI was named in 9 and the top pick in 3. Each answer has at most one top pick, so top-pick counts are zero-sum in a way mentions are not: one brand's win is another's loss, on the same answer.

**So compare like for like.** Benchmark only within one prompt set, on one track, with the same answerers and the same grader, and compare top-pick counts first, then recommended and named. Cheap Seats keeps all of that fixed per set: prompt sets live in a git repo, every run snapshots the questions, answerers, grader and grading instructions it used, and the rankings only compare days on what both days asked.

## Worked example: Cheap Seats against its competitors

This is real data from Cheap Seats tracking itself on the *Choosing an AI visibility tool* prompt set: 17 buyer questions such as *"What are good alternatives to Profound for tracking AI search visibility?"* and *"Is there a free AI visibility tracker that's actually useful?"*

### The competitor table

Run `r-20261022-043101-41215d`, 22 October 2026. Claude Opus (via Claude Code) and an OpenAI model (via Codex), each on the search track (2 samples per question) and the recall track (1 sample): **68 graded answers**.

| product | answers naming it (of 68) | named rate | top picks |
| --- | --- | --- | --- |
| Profound | 56 | 82% | 8 |
| Peec AI | 53 | 78% | 11 |
| Otterly.AI | 43 | 63% | 7 |
| Ahrefs Brand Radar | 33 | 49% | 0 |
| Semrush AI Toolkit | 31 | 46% | 2 |
| Scrunch AI | 25 | 37% | 1 |
| AthenaHQ | 22 | 32% | 0 |
| Scrunch | 19 | 28% | 1 |
| ChatGPT | 16 | 24% | 0 |
| Perplexity | 15 | 22% | 0 |
| **Cheap Seats** | **0** | **0%** | **0** |

What it says:

- **Cheap Seats has no rank.** No answer, on either track, named it. Zero of 60 choice answers still leaves a 95% interval up to about 6% for the top-pick rate, but the direction is not in doubt.
- **Profound leads on mentions; Peec AI leads top picks.** Profound was named in 3 more answers, but Peec AI was the top pick in 11 against Profound's 8. If you only tracked mentions, you'd call the wrong leader.
- **Ahrefs Brand Radar is named often and never chosen**: 33 answers, 0 top picks. It is a comparison point, not a winner.
- **Check the board for split names.** "Scrunch AI" and "Scrunch" are one company counted twice, because Scrunch isn't in this set's competitor list. The grader folds names onto the canonical ones you configure, so add it under `[[competitors]]` with its aliases. Don't add the two rows together yourself: an answer naming both would be counted twice.

### The rank trend

The rankings page turns runs into one series per set and per track, from the newest finished run of each UTC day. Here are the two days so far:

| day | track | run | Cheap Seats' rank | leader | named | recommended |
| --- | --- | --- | --- | --- | --- | --- |
| 21 Oct 2026 | search | `r-20261021-200546-84c081` | 23 | Peec AI | 2 / 34 | 1 / 34 |
| 21 Oct 2026 | recall | `r-20261021-200546-84c081` | 32 | Peec AI | 1 / 34 | 1 / 34 |
| 22 Oct 2026 | search | `r-20261022-043101-41215d` | none (new method) | Profound | 0 / 34 | 0 / 30 |
| 22 Oct 2026 | recall | `r-20261022-043101-41215d` | none (new method) | Profound | 0 / 34 | 0 / 30 |

It looks like a drop from 23rd to nothing. It isn't. All three answers that "named" Cheap Seats on 21 October were answers to *"Is Gauge a good tool for tracking AI visibility?"*; they were about Gauge, and the grader credited them to Cheap Seats. On 22 October the grading changed: the grader is told the product a question asks about is never your brand, and Cheap Seats checks the answer's text itself, so an answer that never names your brand is *absent* whatever the model said. That changes the run's **method** (a fingerprint of the answer and search instructions, the grading instructions, the grader model, and the brand's name, aliases and description), so the trend marks 22 October as a new method: it doesn't report a rank change, and the 7-day average starts over. Cheap Seats' real position on 21 October was also unranked; the new method just stopped counting Gauge as Cheap Seats.

Two prompts also became informational (`intent = "info"`) on 22 October, which is why recommended is out of 30 and named out of 34: answers to questions that ask for an explanation count toward named only.

### What it tells us

Cheap Seats isn't losing on objections; it isn't in the answers at all. The search track built its answers from roundups and competitors' pricing and docs pages, and none of Cheap Seats' pages surfaced for any of the 17 questions. That makes each fix concrete: get into the roundups the answers read, and publish the pages the questions need. This page is one of them.

## How the day-by-day ranking stays honest

Questions, answerers and competitors change over time. Cheap Seats keeps one series through those changes and says what changed, rather than restarting or silently mixing:

- **Each day** is the newest finished run of that set on that UTC day, split by track.
- **Each day lists what changed** since the one before: prompts added, removed or reworded, a prompt's intent, competitors added or removed, answerers added or removed, a model version, or the number of samples.
- **The day-over-day comparison** of recommended and named rates uses only the prompts both days asked, worded the same, of the answerers both days used ("on 13 of 15 prompts").
- **Rank movement is reported only** when both days asked the same prompts of the same answerers and both days ranked you; otherwise a rank change says more about the questions than about you.
- **The daily rates count each prompt once**, however many answers it got, and the 7-day average comes with a 95% band computed across prompts, since answers to the same prompt aren't independent.
- **A change of method starts over**: changing the grading instructions, grader model, answer or search instructions, or your brand's name, aliases or description. Adding a competitor is noted but never restarts the trend.

## How to set up the benchmark

1. **Write the questions your buyers ask**, in their words, as a [prompt set](/docs/prompt-sets/). Include open category questions, not only ones that name you, or your share of voice will flatter you.
2. **List your competitors and their aliases** under `[[competitors]]` in `cheapseats.toml`, so "Peec" and "peec.ai" count as Peec AI. A set can add its own. See [Configuration](/docs/configuration/).
3. **Ask more than one assistant, more than once**, with `samples` per track, and keep search and recall separate.
4. **Run it on a schedule** and read the board, the top picks and the trend on the run page and the rankings page ([Reading results](/docs/reading-results/)).
5. **Open the answers behind any number.** Every answer, search, result and citation is stored, so you can see why a competitor won a question, not just that it did.

The same data is available outside the web UI:

```
cheapseats report <run-id> -json     # summary.voice: name, answers, named_rate, share_of_voice, avg_position, top_pick per product
```

```bash
curl -H "Authorization: Bearer <token>" "https://<host>/api/rankings?lastDays=30&set=<set-id>"
```

and through the MCP tools `get_run` (the competitor table) and `get_rankings` (the daily rank, leader, rates and board). Every route is in [CLI, API and MCP](/docs/reference/).

To benchmark your own brand, [start here](/docs/getting-started/).
