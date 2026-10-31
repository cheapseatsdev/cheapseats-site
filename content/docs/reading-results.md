---
title: Reading results
description: Find the answers behind your rates, diagnose why you lost, and choose what to fix next.
weight: 210
group: Reading what it finds
---

Start with the run's rates, then open the answers behind a weak prompt. Use their objections, searches and citations to choose a fix. [Metric definitions](../metrics/) gives the formulas; this page helps you find the evidence.

## Tracks

**Search** answers use web search; **recall** answers use no tools. They are graded and reported separately. [How grading works](../how-grading-works/#two-tracks) explains what each measures.

## Verdicts

A separate Claude call grades your brand in each answer:

| verdict | meaning |
| --- | --- |
| `recommended` | the top pick, or one of at most three primary recommendations actively endorsed |
| `mentioned` | named in passing, among many options, as a comparison point or with reservations |
| `absent` | not named, named only to disclaim knowledge of it, or confused with another product |

Open a grade to see its reasoning, evidence, brand position, top pick and reasons for preferring something else. [How grading works](../how-grading-works/#three-grades) defines these fields and the edge cases.

## The run page

{{< figure name="run-atlas" >}}

| What you want to know | Where to look | What to check |
| --- | --- | --- |
| Are assistants choosing us? | **Scores**, then **Prompt by prompt** | Named, recommended and top-pick rates by answerer and track, with 95% intervals. The track cards lead with unbranded prompts; info prompts count toward named only. |
| Why did we lose? | Expand an **answer**; read **Objections** and **What the answers say about you** | The highlighted evidence, why not #1, praise, tone and themes. Each objection and praise lists the **pages behind it**: up to three pages the answers raising it cited, owned or earned, and how many raised it from memory alone. With second opinions enabled, start with grades Jev disagreed with. |
| Who wins instead? | **Share of voice**, **Head to head** | Named rate measures how often a product appears; share of voice divides its mentions by all products' mentions. Head to head compares answers naming both brands. |
| Which pages shape the answers? | **Sources**, **Page types**, **Your sites in these answers** | Which pages were retrieved or cited, including your sites that were never reached. Site kind says whose page it is; page type says what it does. |
| Should we write or seek coverage? | **Opportunities**, **Cited without you**, **Found but not cited** | Owned opportunities suggest pages to write; earned ones suggest coverage to seek. The outreach list identifies third-party hosts cited alongside competitors and never you. |
| Are our pages discoverable? | **Your pages for this question**, **Neutral retrieval** (with Exa) | Compare a neutral index with the assistants' retrieval. Pages are marked cited, retrieved or unseen. [Optional providers](../optional-providers/) explains the diagnosis and prospects. |
| Did an answer get a fact wrong? | **Got wrong about you** | Contradictions of the facts you listed, with quotes and prompt markers. See [The fact check](../got-wrong/). |
| What should we do next? | **Fix these first**, **Insights** | Proposed pages and changes tied to the answers that lost. |

**Check the evidence.** A highlighted quote is checked against the answer's text; an unverified quote is dropped. Absent answers and grades from before evidence was added have none. See [the evidence rules](../how-grading-works/#three-grades).

Export CSV or JSON to inspect the data, or use **Share** on a finished run for a [read-only report](../sharing/). The page updates while a run is in progress. Each run records its config commit and Cheap Seats version. [Re-graded runs](../regrading/) say when they changed and keep the grades they replaced.

## What the assistants searched

The **searches** page (`/runs/<id>/searches`) shows the queries search-track answers issued and what came back. It uses stored answers and costs nothing. Open it from a run or set; `?pool=1` adds up to six earlier finished runs of the same method. `/sets/<id>/searches` opens that pooled view for the latest run.

Use it to check:

- **Rewritten questions.** **From prompt** is the share of a search's words found in its prompt; **prompt kept** is the share of the prompt's words kept in the search. Low values show rephrasing or narrowing. **Added** and **dropped** list the recurring changes.
- **Added names.** A `+Name` chip marks a brand or competitor added to a query that wasn't in the prompt.
- **Missed pages.** Top queries show whether results reached your sites, which competitors appeared, and how often their answers named you.
- **New prompts.** **Add as prompt** gives a TOML entry for queries whose results named competitors and never reached your sites. Reword it as a buyer would ask before merging; Cheap Seats writes nothing.

The page also counts answers searched, searches and distinct queries, with a prompt-by-prompt breakdown. Distinct queries ignore case, quotes and repeated whitespace. The same data is at `/api/runs/<id>/searches` and MCP `get_search_queries`.

## Fix these first

A finished run builds a ranked fix list. Each fix names the page to create or change, what it must say, a verifiable **done when**, the prompts it could flip and the page it displaces. It includes effort, priority, gap (documentation, positioning, third-party or product), destination site and owner: the site's owner, falling back to `[owners]` by gap.

A ready-to-paste prompt asks Claude Code to make the change without inventing numbers. **Insights** explains the losses, objections, strengths and influential pages behind the list.

Once work is recorded for a fix whose target is on one of your sites, its card shows **On the page now**: whether the page names you and says each of the fix's claim terms yet (**landed**, **not landed** with the missing terms, or **could not read it**), read at most once a day. It's evidence toward the fix's completion test, not an outcome, and it moves no rate.

## Quick wins

Quick wins combines the latest fix list from every set. It ranks by **expected gain**: prompts a fix could flip per working day, weighted by their remaining room to improve. [Metric definitions](../metrics/#trends-and-outcomes) gives the formula. Filter by site to hand each team its list.

With Jev enabled, fixes from different sets asking for the same page become one card, the highest ranked, with the rest under **also asked for by**. Marking the card marks the selected fix; the others can still be marked individually.

Record the commit or pull request as **proposed**, **accepted** or **withdrawn**; withdrawal reopens the fix. **Dismiss** a fix the team won't do, with the reason. It leaves the list, later fixes for the same page stay dismissed, and the analyst stops proposing fixes that rest on the reason's premise. Undo it from the **dismissed** filter. Filter by status to find open work. [From fix to pull request](../fix-to-pull-request/) walks through the process.

**A fix that wasn't enough comes back.** Each run writes a fresh list. If its prompts still lose, a fix for the same page can return as **retry**, with the earlier work and outcome. Work recorded after a list was built also covers that list's fix for the same page.

Outcomes compare the target prompts before and after the work, with a sampling margin. **No detectable change** does not establish that a fix failed; **newly surfaced** means its page appeared in searches or citations after the work. Host citation changes are shown separately. See [outcome statuses and comparison windows](../noise-and-confidence/#what-no-detectable-change-means-for-a-fix).

## Rankings

Rankings shows each set's daily share-of-voice rank, leader and rates, with every prompt counting once. Choose named, recommended or top pick (`?metric=named|recommended|top_pick`) and a 7-, 14- or 28-day rolling window (`?window=`).

- **Shaded band:** uncertainty across prompt-day rates in the window. **Hover a day:** its rate and sampling interval for that day's prompts. These answer different questions; see [the interval definitions](../noise-and-confidence/#the-intervals).
- **Vs day before:** compares shared, unchanged prompts of the same answerers. Changes whose interval covers zero are greyed out as **within noise**. Rank arrows also require a crossing beyond noise.
- **Triangles:** proposed (gold) or accepted (green) fixes, linked to their commits or pull requests.
- **Method breaks:** a change in how answers are asked or graded restarts comparisons. Added, removed or reworded prompts, intents, competitors and answerer models are annotated; comparisons say how many prompts matched. [Re-grade](../regrading/) older answers after a grading change to reconnect eligible runs.

The set page also shows each prompt's daily history and pooled rates over the selected window. A prompt's history follows its id through rewording or a move between sets; pooling stops at changes of wording, intent or method. When answerers take multiple samples, the page reports whether they improve precision.

**Citation stability** shows how consistently the same hosts retain citation share across runs. It needs three same-method transitions. A high score makes a host entering or leaving more informative; a low score means sources vary substantially between runs. [Metric definitions](../metrics/#citation-stability) gives the formulas.

## Search probe

Test a query against the answerers' web search tool and see its ordered results before an answer is written. You can restrict or block domains. Each probe costs a few cents. With Exa, choose `claude`, `exa` or `both`; the combined view marks overlap and results unique to each index. The Exa side costs under half a cent.

## Retrying

For `partial` or `budget` runs, **Retry unfinished** resumes work and reuses saved answers awaiting grades. Runs interrupted by restart or deploy resume automatically, including unfinished fix lists. A run cannot finish after the answer or grading prompts change: it never mixes rubrics.
