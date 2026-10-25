---
title: See the searches behind an AI answer
description: Compare an assistant's queries, returned results and citations with its answer to investigate why it chose a competitor.
weight: 50
---

Compare the answer with its retrieval trace: **queries**, **returned pages** and **citations**. Did your pages never surface, surface without a citation, or appear alongside objections? Each points to different work. A returned result alone doesn't establish that the model read or rejected a page.

Cheap Seats records Claude and OpenAI model calls through APIs or local CLIs. Consumer apps may add memory, personalization and different retrieval. Searches also vary between runs; use pooled runs before treating one trace as a pattern.

## Reading the trace against the grade: a real answer

The question is prompt 13 of our *Getting recommended instead of a competitor* set, which happens to be this guide's own question: "How can I see the web search results an AI assistant gets for a question before it writes its answer, to understand why we're missing?" Asked of `gpt-6.1-sol` through the `codex` CLI on the search track, 22 October 2026, result 556:

| | |
| --- | --- |
| **searched** | once, three queries joined: "OpenAI responses API web search sources include action sources search results \| Perplexity search API raw ranked search results API \| Bing webmaster tools AI performance citations grounding queries" |
| **results returned** | 46 URLs: OpenAI's web-search docs, Bing's AI Performance help page, Perplexity's API forum and platform pages, twelve Reddit threads, four arXiv papers, Wikipedia, and news |
| **cited** | 3: perplexity.ai/api-platform, developers.openai.com's web search guide, bing.com's AI Performance help |
| **named** | Perplexity Search API, OpenAI Responses API, Bing Webmaster Tools |
| **verdict** | `absent`; no top pick: the answer lays out three tools without choosing one |
| **grader's reasoning** | "The answer names no brand, alias, or Cheap Seats reference; it discusses Perplexity, OpenAI, and Bing tools only." |

None of the 46 results was on cheapseats.dev or our GitHub repo: **our pages weren't retrieved in this answer**. The queries favored vendor documentation and known tool names. That suggests checking query coverage, indexing and relevant third-party pages—not assuming the page's wording alone caused the miss.

Across the run, 80 search answers ran 149 searches. On average, 22% of query words came from the original prompt. Assistants added Profound to 29 searches on 13 prompts and Peec AI to 22 on 12, although no prompt named them. Query rewriting can therefore favor products the model already associates with the category.

{{< figure name="source-trace" >}}

These observations guide investigation; they don't prove why the model chose a source. The [fix list](/blog/prioritize-ai-visibility-fixes/) attaches answer evidence and a page to displace to each proposed change.

## What Cheap Seats keeps for every answer

Search-track answers retain each query, completion status, returned URLs and titles, citations, usage and the grade with its evidence. Recall uses no tools, so it has no search trace. Search usage contributes to API cost at your configured `[pricing]` rates; subscription calls record $0. See [Cost and budget](/docs/cost-and-budget/).

## Run a question on the search track

`samples = { search = 2, recall = 1 }` asks each question twice with search required and once without tools. Run a set from its page or the CLI:

```bash
cheapseats run fix-ai-recommendations
```

[CLI and CI](/docs/cli-and-ci/) covers reports and exit codes.

## In the web UI

Open **Every answer** on a run to see the text, highlighted grading evidence, queries and citations together. For aggregate diagnosis:

| view | use it to |
| --- | --- |
| **Sources** | compare hosts' retrieval and citation rates; find **Cited without you** opportunities |
| **Found but not cited** | inspect your returned pages that no answer linked |
| **Pages referenced** | trace each page to its prompts and cited/surfaced counts |
| **What the assistants searched** | inspect common queries, sites reached, and competitors added to queries |

The searches view also compares words retained from prompts with words added or dropped. **Add as prompt** offers a TOML entry for relevant queries that found competitors but missed your sites. `/sets/<id>/searches` opens the latest run; `?pool=1` adds up to six earlier compatible runs. Viewing these stored traces makes no model calls.

## From the CLI

```bash
cheapseats report r-20261022-043101-7d213e           # cited pages and hosts cited without you
cheapseats report -json r-20261022-043101-7d213e     # aggregate source data
cheapseats check-citations r-20261022-043101-7d213e  # fetch cited pages and check brand names
```

For a single answer's trace, use the UI, JSON API or MCP.

## From the JSON API

`GET /api/runs/<id>` (also `/runs/<id>/export.json`) includes traces under `Results[].answer`:

```bash
curl -sS -H "Authorization: Bearer $TOKEN" "$URL/api/runs/r-20261022-043101-7d213e" |
  jq '.Results[] | select(.id == 556) | .answer |
      {queries: [.searches[].query], results: ([.searches[].results[]] | length), cited: [.citations[].url]}'
```

`GET /api/runs/<id>/searches` returns the aggregate searches view. `POST /api/search-probe` runs a new query before any answer is written; it can use domain filters and incurs model/search cost. Request fields and access rules are in [CLI, API and MCP](/docs/reference/#json-api).

## Over MCP

Use `get_run` to find result ids, `get_result` for a full answer and trace, or `get_search_queries` for pooled queries. `search_probe` makes a new query; unlike reading stored results, it incurs cost.

## What this does and doesn't show

This is evidence from your configured Claude and OpenAI models, not Perplexity, Gemini or Google's AI surfaces. Profound's [query fan-out page](https://www.tryprofound.com/features/answer-engine-insights/query-fan-out), as read in October 2026, describes query variations across its supported engines. [Which AI engines Cheap Seats asks](/docs/engines/) explains the coverage tradeoff.
