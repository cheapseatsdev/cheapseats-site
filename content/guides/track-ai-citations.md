---
title: Track which pages AI assistants cite
description: How to see whether AI search cites your website, which third-party pages AI assistants rely on in your category, and how Popcorn complements Google Search Console and Bing Webmaster Tools.
weight: 10
---

**The short answer.** To see whether AI search shows or cites your site, use the report each search engine gives site owners: Google Search Console's [generative AI performance report](https://support.google.com/webmasters/answer/16984139) shows how often your pages appeared in AI Overviews and AI Mode, and Bing Webmaster Tools' [AI Performance report](https://www.bing.com/webmasters/help/ai-performance-9f8e7d6c) shows where your content is cited in Microsoft Copilot, Bing and select partner AI experiences. Each covers one company's AI features, and each shows only your own site. To see which pages AI assistants rely on across your whole category, third-party pages included, ask them your buyers' questions and keep every search result and citation behind each answer. That is what [Popcorn](/docs/getting-started/) does.

Use both. The search engine reports count what happened with real users on their surfaces. Popcorn shows what the assistants you choose say, and which pages they read, when asked the questions you care about.

## Is AI search taking our organic traffic?

Start in Google Search Console. The [Performance report](https://support.google.com/webmasters/answer/7576553) shows your clicks and impressions over time. The [generative AI performance report](https://support.google.com/webmasters/answer/16984139) shows, for the same dates, how often links to your site appeared in AI Overviews and AI Mode, by page, country, device and date. Google says this data is also counted in the overall Performance report; the new report is a separate view of it.

Then check Bing Webmaster Tools' [AI Performance report](https://www.bing.com/webmasters/help/ai-performance-9f8e7d6c) for citations of your pages in Copilot and Bing's AI answers.

Neither report tells you, on its own, that a lost click went to an AI answer, and Popcorn doesn't measure traffic at all. What Popcorn adds is the other half of the picture: when buyers ask an assistant the questions that used to send them to you, does the answer cite your pages, or someone else's? If the answers to your questions cite other sites and never reach yours, that is a concrete reason, and a concrete list of pages to fix.

## Do Google AI Overviews and AI Mode mention our brand?

Search Console's [generative AI performance report for Search](https://support.google.com/webmasters/answer/16984139) answers this for your own site. According to Google's documentation:

- it covers **AI Overviews** and **AI Mode** on Google Search ("We expect to update this list over time"); Discover has [its own report](https://developers.google.com/search/blog/2026/06/gen-ai-performance-reports);
- its metric is **impressions**: "how many times links to your site were shown to a user in a generative AI feature on Google Search";
- you can group by **pages**, **countries**, **devices** and **dates**, and export the data;
- it doesn't include experiments in Search Labs;
- as of August 31, 2026, Google says it has rolled out to all websites.

It measures links to your site, by page. It doesn't show which other sites appeared alongside yours, and it covers Google's AI features only.

## Does Bing or Copilot cite our website?

Bing Webmaster Tools' AI Performance report answers this for Microsoft's AI experiences. According to [Microsoft's June 2026 announcement](https://blogs.bing.com/search/June-2026/New-AI-Visibility-Insights-in-Bing-Webmaster-Tools-Intents-Topics-Citation-Share-Compare):

- it shows how your content appears in AI-generated answers "across Microsoft Copilot, Bing, and select partner AI experiences";
- it answers "Where is my content being cited in AI-generated answers?", with the **grounding queries** behind those citations;
- in preview, it groups grounding queries into **Intents** and **Topics**, shows **Citation Share** for a query, and can **Compare** one period with another;
- Citation Share "does not expose competitor domains, represent traffic share, or assign quality scores to content."

See also Bing's [help page for the report](https://www.bing.com/webmasters/help/ai-performance-9f8e7d6c) and the [original public preview announcement](https://blogs.bing.com/webmaster/February-2026/Introducing-AI-Performance-in-Bing-Webmaster-Tools-Public-Preview).

## How do I monitor whether AI search engines cite our website?

Verify your site in both tools above, and check their AI reports alongside your usual search reports. Between them they cover Google's and Microsoft's AI features, for your own site.

For assistants that write the answer themselves after searching the web, such as Claude and GPT, run Popcorn. You configure the assistants that answer (Claude and GPT, through the API or through the `claude` and `codex` CLIs: see [answerers](/docs/configuration/#answerers)) and list your own sites under [`[[brand.sites]]`](/docs/configuration/#sites). On the **search** track every answer must search the web first, and Popcorn keeps, for each answer:

- every **search** the assistant ran, and every **result** each search returned;
- every **citation**: the URLs the answer links to;
- the pages it **fetched**, when the assistant fetches any.

From those, each run shows:

- **Pages referenced**: every page that was cited or surfaced, with how many answers cited it, how many answers' searches returned it, and on which prompts. Your own pages carry an "ours" chip with the kind of site they're on (marketing, docs, blog...).
- **Your sites**: each of your sites with the answers that cited it, the answers whose searches surfaced it, how many of its pages were seen, and on how many prompts. A site the answers never reached is listed as "never reached", not left out.
- **Every answer**, grouped by prompt, with the searches it ran and the URLs it cited; a prompt where none of your pages turned up in any search is flagged.

See [reading results](/docs/reading-results/#the-run-page) for the rest of the run page.

## Which web pages do AI assistants rely on in our category?

This is the question the search engine reports can't answer, because they only show your own site. Popcorn's **Pages referenced** table lists every page the answers to your buyers' questions cited or surfaced, yours and everyone else's, most cited first. That is the reading list the assistants work from: the review sites, competitors' docs, comparison posts and forum threads that shape what they recommend.

To follow one page or one site over time, ask the citations API or MCP tool. It counts each answer that linked a URL once and returns how many answers it scanned, so a page missing from the list reads as uncited across that many answers:

```bash
curl -H "Authorization: Bearer <token>" \
  "https://<host>/api/citations?urlContains=docs.example.com&lastDays=30"
```

The MCP tool `get_citations` returns the same, and `get_result` returns one answer in full with its searches and citations. To see what a single search returns before the assistant writes anything, use the [search probe](/docs/reading-results/#search-probe). All of these are in the [reference](/docs/reference/#json-api).

## An example: Popcorn measuring itself

We run Popcorn on its own brand. The run "Finding out whether AI assistants recommend us" on 2026-10-21 asked 15 questions and graded 90 answers from Claude (via Claude Code) and GPT (via Codex), on the search and recall tracks. The search-track answers ran 102 web searches.

None of Popcorn's own sites surfaced in a search or was cited:

| site                         | cited | surfaced |
| ---------------------------- | ----: | -------: |
| popcorn.zone                 |     0 |        0 |
| popcorn.zone/docs            |     0 |        0 |
| popcorn.zone/blog            |     0 |        0 |
| github.com/metcalfc/popcorn  |     0 |        0 |

The hosts cited most were:

| host            | answers citing it | answers whose searches surfaced it |
| --------------- | ----------------: | ---------------------------------: |
| amplitude.com   |                10 |                                 10 |
| rivo.io         |                 8 |                                  9 |
| peec.ai         |                 7 |                                  9 |
| frase.io        |                 7 |                                  7 |
| help.ahrefs.com |                 7 |                                  7 |
| tenspeed.io     |                 7 |                                  7 |

That is the picture neither search engine report could give us: the assistants answered our buyers' questions from those sites, and our own pages never came up. This guide is one of the fixes Popcorn's own fix list asked for.

## What each tool covers

|                                  | Google Search Console (generative AI report) | Bing Webmaster Tools (AI Performance) | Popcorn |
| -------------------------------- | --------------------------------------------- | ------------------------------------- | ------- |
| AI surfaces                      | AI Overviews and AI Mode on Google Search; Discover in its own report | Microsoft Copilot, Bing, and select partner AI experiences | the assistants you configure: Claude and GPT |
| Data from                        | Google Search                                 | Microsoft's AI experiences            | answers to the questions you write, asked by Popcorn |
| What it counts                   | impressions of links to your site             | citations of your content, with grounding queries | searches, results and citations behind every answer |
| Your own pages                   | yes                                           | yes                                   | yes, flagged per site, including sites never reached |
| Other sites' pages               | no                                            | no; Citation Share doesn't expose competitor domains | yes, every page cited or surfaced |
| Whether you're recommended       | no                                            | no                                    | yes: each answer is graded recommended, mentioned or absent |

Popcorn doesn't see real users, impressions or clicks, and it doesn't query Google's or Microsoft's AI features. The search engine reports don't show which other pages an answer relied on, or what it recommended. Together they cover more than any one of them.

## Get started

[Install Popcorn](/docs/getting-started/), list your sites under [`[[brand.sites]]`](/docs/configuration/#sites), write the questions your buyers ask as a [prompt set](/docs/prompt-sets/), and run it. The first run's **Pages referenced** and **Your sites** tables answer "which pages do AI assistants rely on in our category, and are any of them ours?"
