---
title: Metric definitions
description: Every number Popcorn reports, with its exact formula and denominator, and how each maps to the metrics in Peec AI, Profound, Gauge, Otterly.AI, Ahrefs Brand Radar and SE Ranking.
weight: 43
---

**What exactly does each Popcorn number mean?** Almost every metric below is a count of graded answers over a count of graded answers, worked out from what's stored. No model is called to build a report. The same numbers are on the run page, in the run's JSON (`/api/runs/<id>` and `/runs/<id>/export.json`, under `Summary`), in `popcorn report <run-id> -json` (under `summary`) and in MCP `get_run`.

Terms used throughout:

- **Graded answer**: one answer from one answerer, on one track, that the grader graded. Errors and unfinished answers count nowhere.
- **Choice prompt**: a prompt that asks for a choice. Prompts marked `intent = "info"` ask for an explanation, so their answers count toward named only, never toward recommended, top pick, named first or top 3.
- **Named**: graded `recommended` or `mentioned`. For your brand this is always the grade, never the grader's list of names, so your named rate and your share-of-voice row always agree.
- **Products named**: the grader's list of every product an answer names, in order, folded onto your competitors' canonical names. Each product counts at most once per answer.

## Your rates

| metric | numerator | denominator | JSON |
| --- | --- | --- | --- |
| **Named** | answers that name the brand | every graded answer | `visible` |
| **Recommended** | answers graded `recommended` | answers to choice prompts | `recommended` |
| **Top pick** | answers whose single top pick is the brand | answers to choice prompts | `top_pick` |

Each comes with a 95% Wilson interval, so 0 of 10 and 0 of 1,000 don't read the same. For `h` hits of `n` answers, with `p = h/n` and `z = 1.96`:

> centre = (p + z²/2n) / (1 + z²/n)
>
> half-width = z · √(p(1 − p)/n + z²/4n²) / (1 + z²/n)

The run page shows these per answerer and track, and for the run as a whole. The run's rates pool its answers: a prompt with more answers counts for more. Rankings and trends instead take the mean over prompts, each prompt counting once (see [Trends](#trends-and-outcomes)).

### Unbranded and branded

A **branded prompt** names your brand or one of its aliases as a whole word ("Is Acme any good?"). Being named in its answers proves little. The track cards lead with the **unbranded** rates, the same three rates over the answers to every other prompt (`unbranded` in JSON), and show the rates with branded prompts underneath. The prompt list marks each branded prompt. Rankings and trends use the overall rates.

## Share of voice and position

The share-of-voice board lists every product the answers named, not only the competitors you configured.

| column | formula | adds up to | JSON |
| --- | --- | --- | --- |
| **Named** | answers naming the product ÷ every graded answer | more than 100% | `named_rate` |
| **Share of voice** | answers naming the product ÷ the sum, over every product, of answers naming it | 100% | `share_of_voice` |
| **Avg place** | mean of the product's place among the products an answer names, over the answers naming it at a known place | | `avg_position` |
| **First** | answers naming it first ÷ answers to choice prompts | | `named_first` |
| **Top 3** | answers naming it first, second or third ÷ answers to choice prompts | | `top3` |
| **Weighted** | mean over every graded answer of (N − place + 1) / N, where N is the number of products the answer names, and 0 where it isn't named | | `position_weighted` |
| **Top pick** | answers whose top pick is the product | | `top_pick` |

- **Named rate was called share of voice.** In earlier versions the board's one rate column was labelled share of voice. That number is now **named rate**; **share of voice** is the true share, which sums to 100%. The JSON still writes the old field, `share`, with the named rate in it, so existing readers keep working.
- **Place.** Your brand's place is the `position` from its grade. Another product's place is where it comes in the grader's list of names. An answer that names your brand without listing it has no known place for it, and is left out of avg place, first, top 3 and weighted.
- **First and top 3** carry 95% Wilson intervals in JSON.
- **Weighted** is position-weighted visibility as SE Ranking defines it: first of four scores 1, fourth of four 0.25, absent 0.
- **Rank** is your place on the board: 1 + the number of products named in more answers than you. Products named in the same number of answers share a rank, and a brand no answer named has none (0 in the API).

### Head to head

For each product on the board, against your brand, over every graded answer (`head_to_head`):

| count | which answers |
| --- | --- |
| both named | name both |
| you ahead / it ahead | of those, which led: the answer's top pick if it's one of the two, otherwise whichever was named first. An answer whose order isn't known counts for neither |
| only you | name your brand and not the product |
| only it | name the product and not your brand |
| neither | name neither |

### Objections

The concerns raised in answers that name your brand (`objections`), folded for counting: lowercase, every run of punctuation and spaces one space, so "Pricing unclear." and "pricing, unclear" count once. Each objection counts once per answer, with the first prompt it came up on as an example.

## Sentiment and themes

The grader records each answer's **tone** about your brand (positive, neutral, mixed or negative; none when absent) and the **praise** it gives, the strengths it credits you with. See [How grading works](../how-grading-works/#three-grades).

| metric | formula | JSON |
| --- | --- | --- |
| **Net sentiment** | (answers positive − answers negative) ÷ answers naming the brand that have a tone, shown in points from −100 to +100 | `net` (−1 to 1) |
| **Tone mix** | answers naming the brand, per tone | `tones` |
| **Praised for**, **Objections** | the five strengths and five objections the most answers named, each counted once per answer | `praise`, `objections` |

Grades from before tone was graded have no tone, so net sentiment is over the answers that do, and the page says how many name the brand in all. With no toned answer, net sentiment is n/a.

**Themes** come from one more grader call after a run is graded. It groups the run's objections, praise and reasons for picking something else into at most eight named themes, each with a kind (strength, weakness or competitive), the answers that said it, the product it helps (always one of your competitors or a product the answers named), and a quote copied word for word from what it groups. Counts, quotes and beneficiaries are checked against the inputs. With fewer than five distinct strings to group there's no call, and the run says so.

## Sources

Every page an answer cited, or its searches returned, is sorted into a kind of site:

| kind | what |
| --- | --- |
| `own` | your sites (`[[brand.sites]]` and `brand.domains`) |
| `competitor` | a competitor's `domains` |
| `ugc` | forums, Q&A, video and social: Reddit, YouTube, Stack Overflow and Stack Exchange, Hacker News, Quora, Medium, dev.to, X, LinkedIn, GitHub issues and discussions |
| `review` | G2, Capterra, TrustRadius, Product Hunt, Gartner Peer Insights, GetApp, Trustpilot and the like |
| `reference` | Wikipedia, `docs.*` hosts, package registries, the rest of GitHub |
| `institutional` | .gov, .edu, .mil, .int and their country forms (gov.uk, ac.uk) |
| `editorial` | everything else |

Your sites come first, then competitors' domains, then `[sources]` in `popcorn.toml`, then the built-in lists; within a list the most specific entry wins. See [Configuration](../configuration/#sources).

For each page, host and kind:

| metric | numerator | denominator | JSON |
| --- | --- | --- | --- |
| **Retrieved** | answers whose searches returned it | answers that could reach a page: the search track, plus any answer that searched, fetched or cited | `retrieved_rate` |
| **Cited** | answers that linked it | answers that could reach a page: the search track, plus any answer that searched, fetched or cited | `cited_rate` |
| **Share of citations** | its citations, one per answer that linked it | every citation in the run | `citation_share` |
| **Cited when retrieved** | answers that both retrieved and linked it | answers whose searches returned it | `cited_when_surfaced` |

A host counts each answer once, however many of its pages the answer used. Recall answers have no tools, so they're left out of these rates rather than diluting them.

### Buckets, outreach and found but not cited

Each host that isn't yours gets a **bucket** from the products named in the answers that cite it:

| bucket | the answers citing it name |
| --- | --- |
| **missing** | competitors, never your brand |
| **shared** | both, with some competitor named at least as often as you |
| **strong** | your brand more often than any one competitor |
| **unique** | only your brand |

With competitors configured, only they count as competitors here; with none, every other product does. A host whose citing answers name neither gets no bucket.

- **Cited without your brand** (`outreach`): the missing hosts that aren't a competitor's own, ranked by distinct competitors named × answers citing the host. These are the pages to get your brand onto.
- **Found but not cited** (`found_not_cited`): your own pages that searches returned and no answer linked.

## Trends and outcomes

| metric | formula |
| --- | --- |
| **A day's rate** (rankings) | the newest finished run that UTC day, per track: the mean over prompts of each prompt's rate, each prompt counting once |
| **Rolling average** | the mean of the window's days: 7 by default, or 14 or 28 |
| **Band, across prompts** | rolling mean ± 1.96 · s / √m, where s is the standard deviation of the m prompt-day rates in the window |
| **This set, today** | the day's mean ± 1.96 · √(Σ_k var_k) / K over its K prompts |
| **Vs day before** | D = mean over the prompts both days asked of (today − yesterday), with a 95% margin; within noise when D ± margin covers 0 |
| **A set's prompts** | each prompt's answers pooled over the window, with a Wilson interval |
| **Fix outcome** | the same paired D, before and after the fix, over its target prompts |
| **Quick wins gain** | speed × mean over the fix's prompts of (1 − p), where speed is prompts per working day and p is the prompt's recommended rate (named, for an info prompt) pooled over the last 14 days |

`var_k` is a prompt's sampling variance, p̃(1 − p̃)/n with p̃ = (h + 0.5)/(n + 1). [How big a change Popcorn can detect](../noise-and-confidence/) explains these intervals and tests, with a worked example.

## How these compare to other tools

Most AI visibility tools use the same few words for different formulas. The table below is from each vendor's published documentation as of October 2026: [Peec AI](https://docs.peec.ai/metrics/brand-metrics), [Profound](https://docs.tryprofound.com/cookbook/metrics/how-metrics-are-calculated.md), [Gauge](https://docs.withgauge.com/introduction/core-aeo-metrics), [Otterly.AI](https://help.otterly.ai/brand-report-kpi-definition), [Ahrefs Brand Radar](https://help.ahrefs.com/en/articles/15501968-ai-visibility-metrics) and [SE Ranking](https://visible.seranking.com/?p=4633). Check their pages for changes since.

| concept | Popcorn | Peec AI | Profound | Gauge | Otterly.AI | Ahrefs | SE Ranking |
| --- | --- | --- | --- | --- | --- | --- | --- |
| **Visibility** | **named rate**: answers naming you ÷ every graded answer | visibility: responses mentioning you ÷ all responses | visibility: runs naming you ÷ runs naming any brand | visibility: answers naming you ÷ all answers | brand coverage: prompts mentioning you ÷ all prompts | a mention: you appear at least once in an answer | visibility: mean of (N − best position + 1)/N, 0 when absent |
| **Share of voice** | your mentions ÷ every product's mentions, one per answer, all products named | your mentions ÷ all brand mentions | your mentions ÷ all brand mentions, one per run | your mentions ÷ yours plus selected competitors' | your mentions ÷ all brand mentions | your share of impressions, weighted by search volume, against tracked brands | |
| **Position** | **avg place**, over answers naming you; every product named counts | average rank among all brands detected, where you appear | average position, over runs naming you | not scored | | | in visibility, as above |
| **Win** | **top pick**, and **first** (named first ÷ choice answers) | win rate: chats where you're position 1 ÷ all chats | | | | | |
| **Position-weighted** | **weighted**, SE Ranking's formula | | | | | | visibility |
| **Sentiment** | **net sentiment**: % positive − % negative of answers naming you | 0–100 score | positive claims ÷ all claims | positive ÷ (positive + neutral + negative) | net sentiment: (positive − negative) ÷ total × 100 | | net sentiment: % positive − % negative |
| **Citations** | cited rate (÷ answers) and citation share (÷ all citations) | | citation share: your domain's citations ÷ all citations | citation rate: answers citing the page or domain ÷ all answers | | | |
| **Branded prompts** | left out of the headline rates; shown underneath | | | left out of rankings by default | | | |
| **After a config change** | grades and rates stay as graded; which pages are whose follows today's config | | re-applied to history from today's config | | | | |
| **Intervals** | 95% intervals on every rate; changes tested against noise | none published | none published | none published | none published | "directional indicators" | none published |

The Semrush AI Toolkit [sorts sources](https://www.semrush.com/kb/1594-ai-seo-metrics) into the same four buckets Popcorn uses: missing, shared, strong and unique.

### Migrating between Popcorn and these tools

- **Popcorn's visibility is stricter than Profound's.** Profound leaves out the runs that name no brand at all; Popcorn's named rate counts every graded answer. On the same answers, Popcorn's number is lower or equal. To reproduce Profound's, take Popcorn's export and drop the answers whose `named` list is empty.
- **Profound averages per model.** It works each metric out per AI model, then averages the models with equal weight. Popcorn's run-level rates pool the answers; its per-answerer rates are the per-model numbers, so average those to match.
- **Gauge's share of voice depends on whom you compare with.** It divides by your mentions plus the selected competitors'. Popcorn divides by every product the answers named, so adding a competitor to your config doesn't change your share, except where it folds two spellings into one name.
- **Peec AI's visibility is Popcorn's named rate.** Responses mentioning you over all responses. Peec's position also counts every brand detected, as Popcorn's avg place does.
- **Otterly.AI counts prompts, not answers.** Brand coverage is the share of prompts that mention you. In Popcorn, count the prompts in the prompt list whose named rate is above zero.
- **Ahrefs weights by search volume.** Brand Radar's AI share of voice is a share of estimated impressions. Popcorn weights every prompt you choose to ask the same, and estimates no traffic.
- **SE Ranking's visibility is Popcorn's weighted column**, the same formula.
- **History.** Profound applies today's topics, tags and brands to past answers, so editing your setup changes past numbers ([why past numbers change](https://docs.tryprofound.com/cookbook/metrics/why-past-numbers-change.md)). In Popcorn, a run's grades, rates and share of voice are fixed when it's graded; a change in how answers are asked or graded starts a new method on the trend rather than rewriting the old one. Only which pages count as yours or a competitor's, and the source kinds, are read from today's config for every run.
- **Your prompts move with you.** Popcorn's prompt sets are plain TOML in your own repo. Each prompt is a line of text, so you can paste them into any of these tools. See [Compare](/compare/).
