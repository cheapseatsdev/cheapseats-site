---
title: "Mentioned vs. recommended: measuring brands in AI answers"
description: The difference between being mentioned and being recommended by an AI assistant, how to measure each, and how to compute share of voice against competitors.
---

**Being mentioned** means an AI assistant named your product somewhere in its answer. **Being recommended** means the answer told the buyer to use it: it was the top pick, or one of at most three options the answer actively endorsed. A buyer acts on the recommendation, not the mention, so measure both, separately, over many answers.

The short version:

- **Mentioned vs. recommended.** Grade every answer as *recommended*, *mentioned* or *absent*. Being named in a list of nine tools is a mention, not a recommendation.
- **How to measure each.** Ask the same buyer questions to each assistant several times, grade every answer, and report the *recommended rate* and the *named rate* (recommended or mentioned) with an interval, so a small sample reads as uncertain.
- **Share of voice in AI chatbot answers.** For every product an answer names, count the answers that named it. Divide by all graded answers for its *named rate*, or by every product's count added together for its *share of voice*, which sums to 100%. Rank yourself against everyone on that list, not only the competitors you expected.
- **Benchmarking against competitors.** Use the same questions, assistants and grading for every brand, keep web search and model memory apart, and track the numbers day by day.
- **Metrics for a marketing team.** Top-pick rate, recommended rate, named rate, share of voice, average place, the objections answers raise about you, and which web pages (yours and other people's) the answers drew on.

The rest of this page defines each one exactly, shows how to compute it, and ends with a real run where our own brand scored zero.

## Mentioned, recommended and absent

Cheap Seats has a second model read each answer and give it one of three grades:

| grade         | what it means                                                                                                   |
| ------------- | --------------------------------------------------------------------------------------------------------------- |
| `recommended` | the answer's top pick, or one of a small set (three or fewer) of primary recommendations it actively endorses for the buyer's situation |
| `mentioned`   | named, but only as one option among many, in passing, as a comparison point, or with reservations              |
| `absent`      | not named at all, aliases included                                                                              |

The grader is told to be strict: a brand listed in a table with nine others is *mentioned*, not *recommended*. If the answer's single top pick is your brand, the grade is always *recommended*.

Each grade also records:

- **position**: where your brand comes in the order products are first named in the answer (1 is first), or nothing if absent;
- **top pick**: the one product the answer most strongly recommends, or nothing if it doesn't commit;
- **named**: every product, company or platform the answer names, in order;
- **why not #1**: what the answer preferred instead and the reasons it gave;
- **objections**: short phrases for each concern the answer raised about your brand, such as "pricing unclear" or "early stage";
- **tone** and **praise**: how the answer talks about your brand (positive, neutral, mixed or negative), and the strengths it credits you with.

## Why the difference matters

A mention tells you the assistant knows you exist. A recommendation tells you it would send a buyer to you. You can be mentioned in almost every answer and recommended in none, for example when the answer lists you as an alternative "with reservations". Counting mentions alone hides that.

The objections tell you why. If the answers keep saying "early stage" or "no pricing page", that's what to fix.

## How to compute each metric

Every rate below is a count of graded answers divided by a count of graded answers. Cheap Seats shows each with a 95% Wilson interval, so 0 out of 10 and 0 out of 1,000 don't look the same.

### Recommendation rate

Answers graded *recommended*, divided by answers to questions that ask for a choice.

Cheap Seats lets you mark a question as informational (`intent = "info"`, see [Prompt sets](/docs/prompt-sets/)). A good answer to "how does X work?" may recommend nothing, so those answers count toward the named rate only, never toward recommended or top pick.

### Top-pick rate

Answers whose single top pick is your brand, divided by answers to questions that ask for a choice. It's the strictest measure: one winner per answer.

### Mention rate (named rate)

Answers graded *recommended* or *mentioned*, divided by all graded answers. Cheap Seats calls this the **named** rate. It includes recommendations, so it's always at least as high as the recommended rate. If you want "mentioned but not recommended" on its own, subtract: named rate minus recommended rate (on the questions that ask for a choice).

### Position

Cheap Seats records your position in each answer that names you, and reports the mean as **avg place**, over the answers that named you at a known place. Read it next to the named rate: an average of 1.0 across 2 answers out of 90 is not a good result. The run page also shows how often each product was named **first** and in the **top 3** (of answers to questions that ask for a choice), and a position-weighted score. [Metric definitions](/docs/metrics/#share-of-voice-and-position) has the formulas.

### Share of voice

For every product named in any answer, count the answers that named it (once per answer, however often it appears). Cheap Seats reports two rates from that count:

> named rate for a product = answers that named it ÷ all graded answers
>
> share of voice for a product = answers that named it ÷ the sum of that count over every product named

Because one answer usually names several products, the named rates add up to more than 100%; the shares of voice add up to exactly 100%. Cheap Seats also counts, for each product, how many answers made it the top pick. Your brand is counted as named exactly when its grade says so, so your row on the board always matches your named rate. Your rank is your place on that list.

Earlier versions of Cheap Seats showed only the first number and called it share of voice. It's now labelled named rate, with true share of voice beside it.

This is a share of answers, not a share of traffic. Cheap Seats doesn't weight questions by search volume or estimate impressions; every question you choose to ask counts equally.

### Objections

Collect the objections from every answer that named you and count how often each comes up. The run's insights report summarises them for you, and the fix list turns what the answers wanted, and didn't find, into specific pages to write.

### Which pages shaped the answers

On the search track, Cheap Seats keeps every search the assistant ran, every result it got back, and every page it cited. For each page it counts:

- **surfaced**: answers whose searches returned the page, cited or not;
- **cited**: answers that linked the page.

A page that surfaces often but is rarely cited is one the assistant read and passed over. Your own pages are flagged by site, and any of your sites the answers never reached shows up as zeros.

## How to benchmark against competitors

- **Ask the questions your buyers ask**, in their words. Cheap Seats keeps them in [prompt sets](/docs/prompt-sets/) checked into a git repo, so a change to the questions is reviewed like code.
- **Ask more than one assistant, more than once.** Answers vary from run to run; one sample is an anecdote.
- **Keep search and recall apart.** On the **search** track the assistant must search the web first, which shows what the web says today. On the **recall** track it has no tools, which shows what the model already believes. They move at different speeds, so mixing them hides which one you're losing on.
- **Grade every brand the same way.** Share of voice comes from the same graded answers for every product, so the comparison is like for like.
- **Track it over time.** Cheap Seats' rankings page turns runs into a daily series per set, with a 7-day average, and only compares days on the prompts both days asked the same way.

## Worked example: Cheap Seats measuring itself

This is a real run, the baseline before we wrote this page: Cheap Seats asking whether AI assistants recommend Cheap Seats.

- **Run**: "Finding out whether AI assistants recommend us", 21 October 2026, prompt set `ai-search-visibility`, 15 prompts.
- **Answerers**: Claude Opus via Claude Code (`claude-code-opus`) and GPT via Codex (`codex-sol`), each on the search track (2 samples per prompt) and the recall track (1 sample per prompt).
- **90 graded answers.**

### Rates

| answerer           | track  | recommended | named | top pick |
| ------------------ | ------ | ----------- | ----- | -------- |
| `claude-code-opus` | recall | 0 / 15      | 0 / 15 | 0 / 15  |
| `claude-code-opus` | search | 0 / 30      | 0 / 30 | 0 / 30  |
| `codex-sol`        | recall | 0 / 15      | 0 / 15 | 0 / 15  |
| `codex-sol`        | search | 0 / 30      | 0 / 30 | 0 / 30  |
| **all**            |        | **0 / 90**  | **0 / 90** | **0 / 90** |

Cheap Seats was absent from every answer. Zero out of 90 doesn't prove the true rate is zero: the 95% interval's upper bound is about 4%. With no answer naming Cheap Seats, there is no position to record and no objections about it; the "why not #1" for each answer records what the assistant picked instead and the criteria it used.

### Share of voice

| product             | answers naming it (of 90) | named rate |
| ------------------- | ------------------------- | ----- |
| Profound            | 65                        | 72%   |
| Peec AI             | 58                        | 64%   |
| Ahrefs Brand Radar  | 55                        | 61%   |
| ChatGPT             | 54                        | 60%   |
| Otterly.AI          | 46                        | 51%   |
| Semrush AI Toolkit  | 45                        | 50%   |
| Perplexity          | 43                        | 48%   |
| Google AI Overviews | 35                        | 39%   |
| Cheap Seats             | 0                         | 0%    |

The named rates add up to far more than 100% because a typical answer named several products. This run predates the true share-of-voice column, so it isn't shown here.

### Pages that shaped the answers

The search-track answers ran 102 web searches. None of cheapseats.dev's pages surfaced in a search result or was cited. The most-cited hosts were amplitude.com (cited in 10 answers), rivo.io (8), and peec.ai, frase.io, help.ahrefs.com and tenspeed.io (7 each).

### What it tells us

The assistants didn't reject Cheap Seats; they never found it. Nothing on our site answered these questions, so on the search track there was nothing to retrieve, and on the recall track the models had nothing to remember. That's a documentation gap, and this page is the first fix from that run's list. Its "done when": a re-run of the same prompts on the search track lists this page among the pages that shaped the answer.

## Export these metrics yourself

From the command line, on the machine running Cheap Seats:

```
cheapseats report <run-id>          # rates per answerer and track, share of voice, most-cited pages
cheapseats report <run-id> -json    # the same as JSON: overall and per-slice rates, voice, pages, sites, per-prompt rows
```

In the JSON, `summary.overall` and `summary.slices` hold the `top_pick`, `recommended` and `visible` (named) rates, each with `hits`, `n` and the interval (`lo`, `hi`); `summary.voice` is the share-of-voice board with `answers`, `named_rate`, `share_of_voice`, `avg_position` and `top_pick` per product (`share` is the old name for `named_rate`); `summary.pages` has `cited` and `surfaced` per URL.

Over HTTP, with a token:

```bash
# one run in full: every answer with its grade and sources, fixes and insights
curl -H "Authorization: Bearer <token>" "https://<host>/api/runs/<run-id>"

# one row per answer: verdict, position, top_pick, named, why_not_top, objections, searches, cited
curl -H "Authorization: Bearer <token>" -o run.csv "https://<host>/runs/<run-id>/export.csv"

# the daily share-of-voice rank and rates per set
curl -H "Authorization: Bearer <token>" "https://<host>/api/rankings?lastDays=30"
```

The CSV is the easiest place to slice positions or objections your own way in a spreadsheet. The same data is available to Claude Code or any MCP client through the `get_run`, `get_result` and `get_rankings` tools. Every command and route is in [CLI, API and MCP](/docs/reference/); the run page itself is described in [Reading results](/docs/reading-results/).

To measure your own brand, [start here](/docs/getting-started/).
