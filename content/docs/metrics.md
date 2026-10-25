---
title: Metric definitions
description: Every Cheap Seats metric, with its formula, denominator, exclusions and export field.
weight: 230
group: Reading what it finds
---

These metrics are calculated from stored answers and grades, without new model calls. Find them on the run page, in JSON (`/api/runs/<id>` and `/runs/<id>/export.json`, under `Summary`), in `cheapseats report -json <run-id>` (under `summary`) and MCP `get_run`.

Terms used throughout:

- **Graded answer**: one answer from one answerer, on one track, that the grader graded. Errors and unfinished answers count nowhere.
- **Choice prompt**: a prompt whose useful answer requires a product choice, comparison, alternative or suitability decision. Prompts marked `intent = "info"` can be answered completely without that choice, so their answers count toward named only, never toward recommended, top pick, named first or top 3. See [choosing intent](../prompt-sets/#say-what-a-good-answer-looks-like).
- **Named**: graded `recommended` or `mentioned`. For your brand this is always the grade, never the grader's list of names, so your named rate and your share-of-voice row always agree.
- **Products named**: the grader's list of every product an answer names, in order, folded onto your competitors' canonical names. Each product counts at most once per answer.

## Your rates

| metric | numerator | denominator | JSON |
| --- | --- | --- | --- |
| **Named** | answers that name the brand | every graded answer | `visible` |
| **Recommended** | answers graded `recommended` | answers to choice prompts | `recommended` |
| **Top pick** | answers whose single top pick is the brand | answers to choice prompts | `top_pick` |

Each comes with a 95% Wilson interval, so 0 of 10 and 0 of 1,000 don't read the same. For \(h\) hits of \(n\) answers, with \(p = h/n\) and \(z = 1.96\):

$$
\text{centre} = \frac{p + \frac{z^2}{2n}}{1 + \frac{z^2}{n}}
$$

$$
\text{half-width} = \frac{z\sqrt{\frac{p(1-p)}{n} + \frac{z^2}{4n^2}}}{1 + \frac{z^2}{n}}
$$

The run page shows these per answerer and track, and for the run as a whole. The run's rates pool its answers: a prompt with more answers counts for more. Rankings and trends instead take the mean over prompts, each prompt counting once (see [Trends](#trends-and-outcomes)).

### Unbranded and branded

A **branded prompt** names your brand or one of its aliases as a whole word ("Is Acme any good?"). Being named in its answers proves little. The track cards lead with the **unbranded** rates, the same three rates over the answers to every other prompt (`unbranded` in JSON), and show the rates with branded prompts underneath. The prompt list marks each branded prompt. Rankings and trends use the overall rates.

## Share of voice and position

{{< figure name="mention-counts" >}}

The share-of-voice board lists every product the answers named, not only the competitors you configured.

| column | formula | adds up to | JSON |
| --- | --- | --- | --- |
| **Named** | answers naming the product ÷ every graded answer | can exceed 100% | `named_rate` |
| **Share of voice** | answers naming the product ÷ the sum, over every product, of answers naming it | 100% | `share_of_voice` |
| **Avg place** | mean of the product's place among the products an answer names, over the answers naming it at a known place | | `avg_position` |
| **First** | answers naming it first ÷ answers to choice prompts | | `named_first` |
| **Top 3** | answers naming it first, second or third ÷ answers to choice prompts | | `top3` |
| **Weighted** | mean over every graded answer of \(\frac{N - \text{place} + 1}{N}\) at a known place, where \(N = \max(\text{products named}, \text{place})\); 0 when absent or place is unknown | | `position_weighted` |
| **Top pick** | answers whose top pick is the product | | `top_pick` |

- **Named rate was called share of voice.** In earlier versions the board's one rate column was labelled share of voice. That number is now **named rate**; **share of voice** is the true share, which sums to 100%. The JSON still writes the old field, `share`, with the named rate in it, so existing readers keep working.
- **Place.** Every product uses its order in the grader's canonicalized list of names. If that list omits your brand but its grade says named, the grade's `position` is used when available. Unknown positions are excluded from avg place and contribute zero to first, top 3 and weighted.
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

The concerns raised in answers that name your brand (`objections`), folded for counting: lowercase, every run of punctuation and spaces one space, so "Pricing unclear." and "pricing, unclear" count once. Each objection counts once per answer, with the first prompt it came up on as an example. With `[typesafe]` and `cluster_phrases` on, wordings Jev judged to say the same thing count as one row, named by the wording seen first, with `wordings` listing the rest; the same applies to praise.

## Sentiment and themes

The grader records each answer's **tone** about your brand (positive, neutral, mixed or negative; none when absent) and the **praise** it gives, the strengths it credits you with. See [How grading works](../how-grading-works/#three-grades).

| metric | formula | JSON |
| --- | --- | --- |
| **Net sentiment** | (answers positive − answers negative) ÷ answers naming the brand that have a tone, shown in points from −100 to +100 | `net` (−1 to 1) |
| **Tone mix** | answers naming the brand, per tone | `tones` |
| **Praised for**, **Objections** | the five strengths and five objections the most answers named, each counted once per answer | `praise`, `objections` |

Grades from before tone was graded have no tone, so net sentiment is over the answers that do, and the page says how many name the brand in all. With no toned answer, net sentiment is n/a.

**Themes** come from one more grader call after a run is graded. It groups the run's objections, praise and reasons for picking something else into at most eight named themes, each with a kind (strength, weakness or competitive), the answers that said it, the product it helps (always one of your competitors or a product the answers named), and a quote copied word for word from what it groups. Counts, quotes and beneficiaries are checked against the inputs. With fewer than five distinct strings to group there's no call, and the run says so.

## Second opinions

With `[typesafe]` and `second_opinions` on, Jev reads every graded answer again under the grader's own verdict definitions (both are built from one text) and picks the sentence of the answer that most supports its verdict. Each opinion is compared with the answer's *current* grade when read, so a re-grade changes the comparison and not the stored opinion:

| | when |
| --- | --- |
| **agrees** | Jev chose the grader's verdict, at a probability of at least `min_confidence` |
| **disagrees** | Jev chose another verdict, at a probability of at least `min_confidence` |
| **unsure** | Jev's probability for its choice is under the threshold |

**Agreement rate** = agreed ÷ (agreed + disagreed), over opinions Jev was sure about. The set page shows it per run as **Jev agrees**. Changes can reflect different answers as well as grading variation; inspect disagreements before drawing conclusions. Evidence is **same** when the sentences match after folding case, spacing and punctuation, or one contains the other; otherwise **differs** or **none**. `second_opinion` in JSON carries counts and disagreements. MCP `get_run` returns counts and up to ten disagreements; `get_result` returns one answer's.

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

Your sites come first, then competitors' domains, then `[sources]` in `cheapseats.toml`, then the built-in lists; within a list the most specific entry wins. See [Configuration](../configuration/#sources). With `[typesafe]` and `page_types` on, a third-party host the lists would call `editorial` is classed by Jev once, from up to three of its pages' titles and URLs, and that sits between `[sources]` and the built-in lists.

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

### Neutral retrieval

With `[exa]` and `baseline` on, each prompt is also run as a plain web search on Exa, with no domain filter, and the top `baseline_results` pages (default 10) are kept. Per host, with a competitor's domains as one row and your sites as one:

- **neutral**: the prompts a neutral index ranks a page of the host for
- **assistants**: the prompts any answer retrieved or cited a page of the host for
- the **reading** is **content** when neutral is at least 2 and at least the assistants' count (the web agrees with the assistants, so the work is content), **query** when the assistants found it for 2 or more prompts and a neutral search never ranked it (only their own searches find it), and **both** otherwise. A host one answer retrieved once, and the index never ranked, isn't a row.

Under each prompt, the neutral top pages carry whose they are and the same status as coverage: `cited`, `retrieved` or `unseen`. `baseline` in the run's JSON carries all of it; MCP `get_run` carries the top ten rows as `neutral_retrieval`.

### Page types

The kind of site says whose page it is; the **page type** says what the page does, from its URL and the title the search result or citation gave it (`page_type` on each page, rolled up in `page_types` with cited, retrieved, pages and share of citations). The first rule that matches wins:

| type | when |
| --- | --- |
| `forum` | Reddit, Quora, Lobsters, Discord; Hacker News items; Stack Overflow and Stack Exchange questions; GitHub or GitLab issues, pull requests and discussions; `forum.*`, `community.*`, `discuss.*` hosts |
| `repo` | a repository's front page: github.com/owner/repo (and GitLab, Codeberg, Bitbucket) |
| `docs` | `docs.*` hosts, a `/docs/`, `/documentation/` or `/reference/` path, Read the Docs, pkg.go.dev, docs.rs, MDN, Microsoft Learn |
| `comparison` | the path or title says vs, versus, compare or comparison, or "alternative to" |
| `review` | G2, Capterra, TrustRadius, GetApp, Software Advice, Trustpilot, PeerSpot, Gartner reviews; after the listicle rule, any page whose path or title says review |
| `listicle` | best (not "best practices"), top N, N best, alternatives, tools/apps/software/platforms for |
| `article` | a `/blog/`, `/news/`, `/articles/`, `/posts/` path, a dated path (`/2026/05/`), `blog.*` and `news.*` hosts, Medium, dev.to, Substack, Hashnode |
| `product` | the home page, `/pricing`, `/plans`, `/features`, `/product`, `/solutions`, `/integrations` |
| `other` | everything else (Wikipedia, a repository's files) |

What the page is beats where it's filed: `/blog/notion-vs-obsidian` is a comparison and `/blog/best-note-apps` a listicle. MCP `get_run` carries `page_types` and each top page's `page_type`. With `[typesafe]` and `page_types` on, a page the rules call `other` is typed by Jev once, from its URL, title and the definitions above, and its chip says so; a page the rules already type is never asked about.

### Opportunities

The two together (`opportunities`): each kind of site, and each page type within it, as one row. For a row whose pages have `c` of the run's `C` citations, cited by `n` answers of which `b` name the brand and `k` name a competitor:

- **citation share** (`citation_share`) = `c ÷ C`
- **brand presence** (`brand_presence`) = `b ÷ n`, and **competitor presence** (`competitor_presence`) = `k ÷ n`, with `competitors_named` counting each competitor
- **gap** = citation share × (1 − brand presence)

A kind of page the answers lean on and that rarely names you scores highest. A row is **owned** (`own`: your pages, so the fix is writing that kind of page) or **earned** (everyone else's, so the fix is getting onto them). A row with fewer than 3 citations isn't listed on its own, since its presence rate would be one answer's say-so; its citations still count toward its kind of site. Each row carries its most cited hosts and the prompts its citing answers were for. The analyst gets the top rows beside the answers, so an outreach or new-page fix can name the kind of page and its share rather than one host. It's a view over the stored citations and grades: no model call, and no change to any trend. MCP `get_run` carries `opportunities`.

## Citation stability

How much the hosts a set's answers cite move from one run to the next, per track, over the same daily runs the trends use (each day's newest finished run, the last 30 days by default). A run's citations are a vector of host **citation shares** \(s_h\): a host's citations over all the run's citations, so \(\sum_h s_h = 1\). For each run against the one before it, with shares \(a\) and \(b\):

| metric | formula | range |
| --- | --- | --- |
| **Similarity** (Bray–Curtis × 100) | the share of citations the two runs have in common by host; calculated below | 100 when every host kept its share; 0 when no host was cited in both |
| **Overlap** (Jaccard × 100) | 100 · hosts cited in both ÷ hosts cited in either | 0 to 100 |
| **New**, **gone** | hosts cited this run and not the one before, and the other way round, largest share first | |
| **Stability score** | the mean similarity over the transitions, with the mean overlap beside it | shown from **3 transitions** |

$$
\text{Similarity} = 100\left(1 - \frac{\sum_h \lvert a_h - b_h \rvert}{\sum_h (a_h + b_h)}\right)
$$

For citation shares, this simplifies to:

$$
\text{Similarity} = 100\sum_h \min(a_h, b_h)
$$

- **One or two transitions can be a fluke**, so the score waits for three.
- **The chain stops at a change of method**: the run that changed it is the oldest compared.
- **A run that cited nothing** (an outage, or the recall track, which has no search) is skipped rather than read as every host leaving.
- **A change of prompts** flags its transition `prompts_changed`: some of its churn is the questions.

A high score means sources have been consistent; a low score means they vary between runs. Neither establishes why a host entered or left. Find it on the set page, at `GET /api/sets/{id}/citation-stability` and MCP `get_citation_stability`.

## Trends and outcomes

| metric | formula |
| --- | --- |
| **A day's rate** (rankings) | the newest finished run that UTC day, per track: the mean over prompts of each prompt's rate, each prompt counting once |
| **Rolling average** | the mean of the window's days: 7 by default, or 14 or 28 |
| **Band, across prompts** | rolling mean \(\pm 1.96\frac{s}{\sqrt{m}}\), where \(s\) is the standard deviation of the \(m\) prompt-day rates in the window |
| **This set, today** | the day's mean \(\pm 1.96\frac{\sqrt{\sum_k \operatorname{var}_k}}{K}\) over its \(K\) prompts |
| **Vs day before** | \(D\) = mean over the prompts both days asked of (today − yesterday), with a 95% margin; within noise when \(D \pm \text{margin}\) covers 0 |
| **A set's prompts** | each prompt's answers pooled over the window, with a Wilson interval |
| **Fix outcome** | the same paired \(D\), before and after the fix, over its target prompts |
| **Quick wins gain** | speed × mean over the fix's prompts of \((1 - p)\), where speed is prompts per working day and \(p\) is the prompt's recommended rate (named, for an info prompt) pooled over the last 14 days |

\(\operatorname{var}_k\) is a prompt's sampling variance:

$$
\operatorname{var}_k = \frac{\tilde p(1 - \tilde p)}{n},
\qquad \tilde p = \frac{h + 0.5}{n + 1}
$$

[How big a change Cheap Seats can detect](../noise-and-confidence/) explains these intervals and tests, with a worked example.

## How these compare to other tools

See [Comparing metrics across tools](../comparing-metrics/#how-these-compare-to-other-tools) for the vendor definition table and its dated sources.

### Migrating between Cheap Seats and these tools

See [migration differences](../comparing-metrics/#migrating-between-cheap-seats-and-these-tools) before comparing numbers or moving prompts.
