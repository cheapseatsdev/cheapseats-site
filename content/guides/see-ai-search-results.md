---
title: See the searches behind an AI answer
description: See the web search results an AI assistant got before it wrote its answer, and read them against its top pick and objections to see why it chose a competitor.
weight: 50
---

**The short answer.** To find out why an AI assistant prefers a competitor, read what it read. A search-track answer has a retrieval trace: the queries the assistant typed into its web search tool, every result URL that came back, and the few it cited. Cheap Seats stores all three for every search-track answer, next to the answer's grade: your verdict, your position, the answer's top pick, every product it named and the objections it raised. Put the trace and the grade side by side and the question splits in three: your pages were never returned, they were returned and not used, or you were named and talked down. Each has a different fix. This guide shows where the trace is in the web UI, the CLI, the JSON API and MCP, and works through one real answer.

Two things to know. The searches are the ones the model ran through its own web search tool when Cheap Seats asked it over the API or the `claude` and `codex` CLIs; a buyer typing into the ChatGPT or Claude app gets a session with memory and personalisation on top, and may not see the same results. And a search is a sample: the same question run twice can search differently, which is why the searches page pools runs.

## What Cheap Seats keeps for every answer

For each answer on the search track:

- **searches**: each query the assistant typed, whether it completed, and every **result** it got back, URL and title, in the order the tool returned them.
- **citations**: the URLs the answer linked.
- **usage.searches**: how many searches it ran, which is also what it cost: searches are priced per thousand in `[pricing]`.
- the **grade**: `verdict` (recommended, mentioned or absent), your `position`, the answer's `top_pick`, every product `named` in order, the grader's `reasoning`, `why_not_top`, the `objections` raised about you, and the `evidence` sentence from the answer.

Recall-track answers have no tools, so they have no searches or citations; what they say comes from the model's training. See [Reading results](/docs/reading-results/#tracks).

## Run a question on the search track

Every prompt is asked on both tracks by default. `samples = { search = 2, recall = 1 }` on an answerer asks each question twice with web search forced on and once without. Run a set from its page, or:

```bash
cheapseats run fix-ai-recommendations
```

[The CLI, and runs from CI](/docs/cli-and-ci/) covers the command, its report and exit codes.

## In the web UI

On the run page:

- **Every answer**, at the bottom, opens each answer in full: the text with the grader's evidence highlighted, then **Searches:** the queries it typed, and **Cited:** the links it used. The grade's verdict, position, top pick, named products and objections sit with it.
- **Sources** sorts every page the answers cited or their searches returned by host and kind of site, with four rates per host: **retrieved** (answers whose searches returned it), **cited** (answers that linked it), its **share of citations**, and **cited when retrieved**. Each host that isn't yours gets a bucket: **missing** when the answers citing it name competitors and never you, **shared**, **strong** or **unique**. **Cited without you** is the outreach list.
- **Found but not cited** lists your own pages that searches returned and no answer linked: the assistant saw them and chose something else.
- **Pages referenced** is every page with how often it was cited and surfaced, and on which prompts.

**What the assistants searched** (`/runs/<id>/searches`, linked from the run page) is the set-wide view: answers that searched, searches and distinct queries, the **top queries** with the prompts that ran each, whether its results reached your sites, which competitors showed up in them, and how often the answers that ran it named you. **Names the assistants added** lists the brand or a competitor put into a search whose prompt didn't name it. **How the prompts were rewritten** gives **from prompt** (the share of a search's words that were in its prompt) and **prompt kept** (the share of the prompt's words still in the search), with the words searches add and drop across the set. **Add as prompt** offers queries whose results named competitors and never reached your sites, as a TOML entry to paste. `?pool=1` adds up to six of the set's earlier runs asked and graded the same way, and `/sets/<id>/searches` opens that for the set's latest run. Nothing on these pages calls a model.

## From the CLI

```bash
cheapseats report r-20261022-043101-7d213e           # most-cited pages, hosts cited without you
cheapseats report -json r-20261022-043101-7d213e     # summary.pages, hosts, outreach, found_not_cited
cheapseats check-citations r-20261022-043101-7d213e  # which cited pages name you, and which competitors (free)
```

The CLI prints the run's aggregate: the most-cited pages, with how often each was surfaced, and the hosts cited without your brand. The per-answer trace is in the JSON API and MCP, below, or in the web UI.

## From the JSON API

Every answer's searches, results and citations are in the run's JSON, `GET /api/runs/<id>` (also `/runs/<id>/export.json`), under `Results[].answer`. One answer's trace with curl and jq:

```bash
curl -sS -H "Authorization: Bearer $TOKEN" "$URL/api/runs/r-20261022-043101-7d213e" |
  jq '.Results[] | select(.id == 556) | .answer |
      {queries: [.searches[].query], results: ([.searches[].results[]] | length), cited: [.citations[].url]}'
```

`GET /api/runs/<id>/searches` is the searches page as data: `queries` (each with `prompts`, `answers`, `first_party`, `named`, `from_prompt`, `prompt_kept`), `injected` (the names added), `suggested` (the add-as-prompt entries, with their TOML), and the set-wide `from_prompt`, `prompt_kept`, `added` and `dropped`. `POST /api/search-probe` with `{"query": "..."}` runs one query through the same web search tool the answerers use and returns the links in order, before any answer is written; `allowed_domains` and `blocked_domains` restrict it. A probe costs a few cents. Routes and access are in [CLI, API and MCP](/docs/reference/#json-api).

## Over MCP

From Claude Code or any MCP client connected to your Cheap Seats:

- `get_run` for the run's rates, sources, hosts, outreach and one line per prompt with its result ids;
- `get_result` with a `run` and `result` id for one answer in full: text, grade with evidence, every search, result URL and citation;
- `get_search_queries` for the searches page, with `pool` and `limit`;
- `search_probe` for one query, verbatim.

## Reading the trace against the grade: a real answer

The question is prompt 13 of our *Getting recommended instead of a competitor* set, which happens to be this guide's own question: "How can I see the web search results an AI assistant gets for a question before it writes its answer, to understand why we're missing?" Asked of `gpt-6.1-sol` through the `codex` CLI on the search track, 22 October 2026, result 556:

| | |
| --- | --- |
| **searched** | once, three queries joined: "OpenAI responses API web search sources include action sources search results \| Perplexity search API raw ranked search results API \| Bing webmaster tools AI performance citations grounding queries" |
| **results returned** | 46 URLs: OpenAI's web-search docs, Bing's AI Performance help page, Perplexity's API forum and platform pages, twelve Reddit threads, four arXiv papers, Wikipedia, and news |
| **cited** | 3: perplexity.ai/api-platform, developers.openai.com's web search guide, bing.com's AI Performance help |
| **named** | Perplexity Search API, OpenAI Responses API, Bing Webmaster Tools |
| **verdict** | `absent`; no top pick: the answer lays out three tools without choosing one |
| **grader's reasoning** | "The answer names no brand, alias, or Cheap Seats/Popcorn reference; it discusses Perplexity, OpenAI, and Bing tools only." |

Now read the two together. None of the 46 results was on cheapseats.dev or our GitHub repo, so this is the first kind of miss: **not retrieved**. No fix to our wording would have helped, because nothing of ours was in front of the model. The query tells us what would: the assistant searched in its own words, for vendor documentation about retrieval traces, with the names of the tools it already knew. Across the whole run, 80 search answers ran 149 searches; on average 22% of a search's words came from its prompt, and the assistants added Profound to 29 searches on 13 prompts and Peec AI to 22 on 12, names no prompt contained. The products the model already associates with the category get searched for by name; the rest have to be on the pages those searches return.

The answer itself said as much. Its advice was to record "the original question and any rewritten search queries, returned URLs and snippets, whether your brand appears directly or through third-party coverage, which competitors appear, and which sources support them", then classify the gap as **not retrieved**, **retrieved but not mentioned**, or **mentioned inaccurately**. That is this page's trace and grade, and the three cases map onto it:

| the gap | how it shows in Cheap Seats | the fix is usually |
| --- | --- | --- |
| not retrieved | `absent`, and no page of yours among the results or in **Found but not cited** | a page that answers the query in the words the searches use, on a site that's indexed, or getting into the third-party page the results did return (**Cited without you**) |
| retrieved but not used | your page in **Found but not cited**, or retrieved but a competitor's page cited | the page the model chose instead is the one to displace: say what it says, plainly and with a date |
| named but talked down | `mentioned` with **objections**, or `recommended` with `why_not_top` | the objection names the missing fact; put it where the cited page would have it |

The fix list does this reading for you: each fix names the page it **displaces**, the one that shaped the answer today, with the prompt number and the quote as **evidence**. See [Which fix first, and who owns AI visibility](/blog/prioritize-ai-visibility-fixes/).

## What this does and doesn't show

Cheap Seats shows the actual queries each answer ran and the actual results it got, per answer and pooled over a set's runs, with the words and names the assistants add. It asks Claude and OpenAI models only, so it says nothing about what Perplexity, Gemini or Google AI Overviews retrieved. Hosted tools approach the same question differently: Profound's [query fan-out](https://www.tryprofound.com/features/answer-engine-insights/query-fan-out) page, as of October 2026, describes sub-query variations with share percentages, word transformations, freshness tokens and persona comparisons across the engines it tracks. If those engines are where your buyers ask, see [Which AI engines Cheap Seats asks](/docs/engines/) for who covers them.
