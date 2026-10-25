---
title: Track which pages AI assistants cite
description: Whether AI search cites your website, which third-party pages AI assistants rely on in your category, and how it complements Search Console and Bing's report.
weight: 10
---

Use Google Search Console and Bing Webmaster Tools for your own site's exposure on their AI surfaces. Use Cheap Seats to inspect Claude and OpenAI answers to questions you choose, including third-party sources. These measure different things; neither sampled answers nor citation counts establish lost traffic.

## Is AI search taking our organic traffic?

Compare clicks and impressions in [Search Console's Performance report](https://support.google.com/webmasters/answer/7576553) with its [generative AI report](https://support.google.com/webmasters/answer/16984139) over the same dates. Google says the AI data is also included in the overall report. Bing's [AI Performance report](https://www.bing.com/webmasters/help/ai-performance-9f8e7d6c) supplies citation data for Microsoft's AI experiences.

Neither report identifies whether an individual lost click went to an AI answer. Cheap Seats doesn't measure traffic; it shows whether sampled answers cite your pages or other sites.

## Do Google AI Overviews and AI Mode mention our brand?

Search Console's [generative AI performance report for Search](https://support.google.com/webmasters/answer/16984139) measures **links to your site**, rather than every brand mention. According to Google's documentation, read in October 2026:

- it covers **AI Overviews** and **AI Mode** on Google Search ("We expect to update this list over time"); Discover has [its own report](https://developers.google.com/search/blog/2026/06/gen-ai-performance-reports);
- its metric is **impressions**: "how many times links to your site were shown to a user in a generative AI feature on Google Search";
- you can group by **pages**, **countries**, **devices** and **dates**, and export the data;
- it doesn't include experiments in Search Labs;
- as of August 31, 2026, Google says it has rolled out to all websites.

It measures links to your site, by page. It doesn't show which other sites appeared alongside yours, and it covers Google's AI features only.

## Does Bing or Copilot cite our website?

Bing Webmaster Tools' AI Performance report covers Microsoft's AI experiences. According to [Microsoft's June 2026 announcement](https://blogs.bing.com/search/June-2026/New-AI-Visibility-Insights-in-Bing-Webmaster-Tools-Intents-Topics-Citation-Share-Compare):

- it shows how your content appears in AI-generated answers "across Microsoft Copilot, Bing, and select partner AI experiences";
- it answers "Where is my content being cited in AI-generated answers?", with the **grounding queries** behind those citations;
- in preview, it groups grounding queries into **Intents** and **Topics**, shows **Citation Share** for a query, and can **Compare** one period with another;
- Citation Share "does not expose competitor domains, represent traffic share, or assign quality scores to content."

See also Bing's [help page for the report](https://www.bing.com/webmasters/help/ai-performance-9f8e7d6c) and the [original public preview announcement](https://blogs.bing.com/webmaster/February-2026/Introducing-AI-Performance-in-Bing-Webmaster-Tools-Public-Preview).

## How do I monitor whether AI search engines cite our website?

Verify your site in the tools above. For Claude and OpenAI models, configure Cheap Seats' [answerers](/docs/configuration/#answerers) and list your sites under [`[[brand.sites]]`](/docs/configuration/#sites).

The search track keeps queries, returned results, fetched pages when recorded, and citations. On a run, open:

- **Pages referenced** for every returned or cited page, its counts and prompts.
- **Your sites** for your domains and paths, including sites never reached.
- **Every answer** for the text, queries and cited URLs behind a count.

Returned results aren't proof the model read each page. [See the searches behind an AI answer](/guides/see-ai-search-results/) explains how to investigate the trace.

## Which web pages do AI assistants rely on in our category?

Cheap Seats' **Pages referenced** lists your pages and third-party pages, most cited first. Use it to find the reviews, competitor docs and forum threads cited in answers to your category's questions.

To follow one page or one site over time, ask the citations API or MCP tool. It counts each answer that linked a URL once and returns how many answers it scanned, so a page missing from the list reads as uncited across that many answers:

```bash
curl -H "Authorization: Bearer <token>" \
  "https://<host>/api/citations?urlContains=docs.example.com&lastDays=30"
```

The MCP tool `get_citations` returns the same, and `get_result` returns one answer in full with its searches and citations. To see what a single search returns before the assistant writes anything, use the [search probe](/docs/reading-results/#search-probe). All of these are in the [reference](/docs/reference/#json-api).

## An example: Cheap Seats measuring itself

We run Cheap Seats on its own brand. The run "Finding out whether AI assistants recommend us" on 2026-10-21 asked 15 questions and graded 90 answers from Claude (via Claude Code) and GPT (via Codex), on the search and recall tracks. The search-track answers ran 102 web searches.

None of Cheap Seats' own sites surfaced in a search or was cited:

| site                         | cited | surfaced |
| ---------------------------- | ----: | -------: |
| cheapseats.dev                 |     0 |        0 |
| cheapseats.dev/docs            |     0 |        0 |
| cheapseats.dev/blog            |     0 |        0 |
| github.com/cheapseatsdev/cheapseats  |     0 |        0 |

The hosts cited most were:

| host            | answers citing it | answers whose searches surfaced it |
| --------------- | ----------------: | ---------------------------------: |
| amplitude.com   |                10 |                                 10 |
| rivo.io         |                 8 |                                  9 |
| peec.ai         |                 7 |                                  9 |
| frase.io        |                 7 |                                  7 |
| help.ahrefs.com |                 7 |                                  7 |
| tenspeed.io     |                 7 |                                  7 |

Those answers cited third-party sources while our own pages never surfaced. This guide addresses one of the gaps in that run's fix list.

## What each tool covers

|                                  | Google Search Console (generative AI report) | Bing Webmaster Tools (AI Performance) | Cheap Seats |
| -------------------------------- | --------------------------------------------- | ------------------------------------- | ------- |
| AI surfaces                      | AI Overviews and AI Mode on Google Search; Discover in its own report | Microsoft Copilot, Bing, and select partner AI experiences | the assistants you configure: Claude and GPT |
| Data from                        | Google Search                                 | Microsoft's AI experiences            | answers to the questions you write, asked by Cheap Seats |
| What it counts                   | impressions of links to your site             | citations of your content, with grounding queries | searches, results and citations behind every answer |
| Your own pages                   | yes                                           | yes                                   | yes, flagged per site, including sites never reached |
| Other sites' pages               | no                                            | no; Citation Share doesn't expose competitor domains | yes, every page cited or surfaced |
| Whether you're recommended       | no                                            | no                                    | yes: each answer is graded recommended, mentioned or absent |

Cheap Seats samples configured questions; it doesn't observe real users, impressions or clicks. Use the search-engine reports for exposure on their surfaces and sampled traces for answer-level investigation.

## Get started

[Install Cheap Seats](/docs/getting-started/), list your sites under [`[[brand.sites]]`](/docs/configuration/#sites), write the questions your buyers ask as a [prompt set](/docs/prompt-sets/), and run it. The first run's **Pages referenced** and **Your sites** tables answer "which pages do AI assistants rely on in our category, and are any of them ours?"
