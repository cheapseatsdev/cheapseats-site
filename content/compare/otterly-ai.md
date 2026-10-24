---
title: Cheap Seats vs Otterly.AI
description: "Cheap Seats, the free, self-hosted AI visibility tracker, beside Otterly.AI: engines, pricing, how each detects a mention, and fixes, October 2026."
weight: 30
---

Cheap Seats (cheapseats.dev) is the MIT-licensed, self-hosted AI visibility tracker. It's a free place to start, inspired by tools like Otterly.AI: it asks Claude and OpenAI models your buyers' questions, grades whether the answers recommend you, and ends each run with a ranked fix list. Otterly.AI is a hosted AI search monitoring tool with published self-serve prices, from $29 a month for 15 prompts. It includes ChatGPT, Google AI Overviews, Perplexity and Copilot on every plan, with Gemini, AI Mode and Claude as paid add-ons, and it asks all but Claude through their own websites, in a country you choose. Start with Cheap Seats; if you outgrow it, Otterly.AI is one of the places to go, and your prompts come with you.

## Side by side

As of October 2026, from Cheap Seats' docs and Otterly.AI's own [pricing](https://otterly.ai/pricing) page and [help center](https://help.otterly.ai/):

| | Cheap Seats | Otterly.AI |
| --- | --- | --- |
| **Price** | Free and open source (MIT); runs on your existing Claude subscription (ChatGPT optional) | Lite $29/month (15 prompts), Standard $189/month (100 prompts), Premium $489/month (400 prompts), Enterprise custom from 1,000 prompts; 15% off annually |
| **Where it runs** | Self-hosted: one Docker container with SQLite, on Docker, Kubernetes (Helm chart) or an exe.dev VM | Hosted SaaS |
| **Engines** | Claude and OpenAI models, through their APIs or the Claude Code and Codex CLIs | Included: ChatGPT, Google AI Overviews, Perplexity, Microsoft Copilot. Add-ons: Google AI Mode and Gemini ($9, $59 or $149 a month by plan), Claude ($29, $109 or $439 a month by plan) ([pricing](https://otterly.ai/pricing), [Claude](https://otterly.ai/blog/track-brand-visibility-on-claude/)) |
| **How it asks** | The models directly, through the providers' APIs and CLIs | Through each engine's website, such as chatgpt.com, as "a neutral, non-personalized user"; Claude through an API ([how it collects data](https://help.otterly.ai/how-otterlyai-collects-data), [what it is](https://help.otterly.ai/what-is-otterly.ai)) |
| **Web search vs memory** | Both, as separate tracks (search and recall), reported separately | Not separated: each website decides whether to search; Claude is asked with web search ([engines](https://help.otterly.ai/which-ai-searches-does-otterlyai-support)) |
| **Markets** | No country setting; prompts in the language you write them | A country per report, 60+ markets ([changelog](https://help.otterly.ai/changelog), June 2026); prompts run in any language, as written ([languages](https://help.otterly.ai/languages)) |
| **Your prompts** | TOML in your own git repo, changed by pull request; no cap | Counted by plan; +100 prompts for $99/month on Standard and Premium |
| **How often** | Your schedule, daily or weekly, with as many samples a prompt as you set | [Daily](https://help.otterly.ai/monitoring-interval), not adjustable; samples per prompt not stated |
| **Grading** | A Claude call grades each answer recommended, mentioned or absent, with the quote that decided it | An exact text match of the names you list, since 27 November 2025 ([brand detection](https://help.otterly.ai/brand-detection)), with a [regex option](https://help.otterly.ai/add-brands) |
| **What it reports** | Named, recommended and top pick, position, share of voice, objections, net sentiment; with your facts listed, what each answer got wrong about you | Brand coverage, share of voice, position, net sentiment, domain coverage ([KPIs](https://help.otterly.ai/brand-report-kpi-definition)); ChatGPT Ads and Shopping cards; [Brand Profiling](https://otterly.ai/blog/brand-profiling/) |
| **Noise** | A 95% interval on every rate; changes tested against noise | Not stated |
| **What to fix** | A ranked fix list every run: the page, what it must say, the prompts it should flip, the owner, and a Claude Code prompt; each attempt judged against noise | [Recommendations](https://help.otterly.ai/ai-recommendations) every 7 days (3 a cycle on Lite, all from Standard), each with its prompt and the source beating you; GEO audits; content briefs. Outcome tracking not stated |
| **API / MCP** | Web UI, CLI, JSON API and MCP server | Public API and MCP from Standard (2,000 requests each a month; 5,000 on Premium) ([API](https://help.otterly.ai/do-you-provide-an-api-for-otterlyai), [MCP](https://help.otterly.ai/does-otterlyai-have-an-mcp)) |
| **Agencies** | No agency tier; one instance per brand | Agency Partner status on Standard or Premium, with branded Looker Studio reports; no native [white-label](https://help.otterly.ai/white-label) |
| **Data** | Your SQLite file; prompts and answers go only to the providers you configure | Hosted by Otterly.AI; API, Looker Studio and PDF exports |

**What it costs.** Cheap Seats is free and open source (MIT). Claude is required, through a subscription or an API key; ChatGPT (Codex or an OpenAI key) is optional and adds a second assistant's answers. On your own machine, with a Claude Code subscription, answers, grading and the fix list can all run on the claude CLI, with no API key and no extra spend. Host it and you pay your host (and, in a container, API usage, since the image has no CLIs: about $0.03 to grade a 68-answer run, under a daily budget cap). [Cost and budget](/docs/cost-and-budget/) has the details.

## What's the same

- **Name variants are yours to list.** Otterly.AI matches the variations you add, with a regex for a brand called something like "On". Cheap Seats folds your aliases onto one name, and its grader uses your brand's `about` to tell a namesake apart.
- **Net sentiment is the same formula.** Both take answers naming you that are positive, minus those negative, over answers with a tone, from −100 to +100 ([KPI definitions](https://help.otterly.ai/brand-report-kpi-definition); [Metric definitions](/docs/metrics/#sentiment-and-themes)).
- **Cited pages that leave you out.** Otterly.AI's citations report flags, for each cited URL, whether it mentions you and which competitors it names ([citations](https://help.otterly.ai/how-can-citations-report-help-you-analyze-your-content-gaps)). Cheap Seats buckets cited hosts by who they name, and its citation check fetches each page and marks the ones that name only competitors.
- **Can AI crawlers read the page.** Otterly.AI's GEO Audit checks AI bots against robots.txt and whether a page's content needs JavaScript ([GEO Audit](https://help.otterly.ai/what-does-the-geo-audit-do)). Cheap Seats' [site audit](/docs/site-audit/) checks robots.txt and firewall blocks per bot, and pages empty without JavaScript.
- **Crawler counts from your logs.** Otterly.AI's Agent Analytics and Cheap Seats' AI crawler import both read your server logs and class requests by user agent ([Agent Analytics](https://help.otterly.ai/agent-analytics)).
- **A fix names the page that wins today.** An Otterly.AI recommendation names its prompt and the source beating you; a Cheap Seats fix names its prompts and the page it displaces.

## What's different

- **Where the answer comes from.** Otterly.AI types each prompt into the engine's website, as a non-personalised user in your chosen country, close to what a buyer there sees. Cheap Seats asks the models directly, once with web search and once without, so you can tell whether you're losing on the web or in the model's memory ([engines](/docs/engines/)).
- **How a mention is decided.** Otterly.AI looks for an exact match of the names you defined in the answer's text. Cheap Seats has a Claude call read the whole answer and grade it recommended, mentioned or absent, and keeps the sentence that decided it. A text match counts any answer containing the name, including "I couldn't find that product" and another company with the same name; Cheap Seats grades both `absent`, since the first only echoes the question and the second isn't you.
- **Recommended versus mentioned.** Otterly.AI reports whether you appear, where and in what tone. It has no grade for being the answer's pick. Cheap Seats' recommended and top-pick rates count only the answers that endorse you.
- **Prompts, not answers.** Otterly.AI's brand coverage is prompts that mention you over all prompts, each counted once per engine per day. Cheap Seats' named rate is answers that name you over every graded answer. To compare, count the prompts whose named rate is above zero ([how the numbers compare](/docs/metrics/#how-these-compare-to-other-tools)).
- **Noise.** Otterly.AI publishes no intervals. Cheap Seats puts a 95% interval on every rate and calls a change within noise when it is ([How big a change Cheap Seats can detect](/docs/noise-and-confidence/)).
- **After a fix.** Otterly.AI writes fresh recommendations every 7 days, once a report has 15 prompts, 3 competitors and 3 days of data; it doesn't say whether it measures one you acted on. Cheap Seats ties each fix to a pull request and judges it on its prompts, before against after ([From fix to pull request](/docs/fix-to-pull-request/)).
- **When the method changes.** Otterly.AI changed detection on 27 November 2025 and doesn't say whether older answers were matched again. Cheap Seats marks a grading change on the trend and lets you [re-grade](/docs/regrading/) the stored answers to carry it on.

## Start with Cheap Seats if…

- You track Claude: on Otterly.AI it's an add-on priced per plan, from $29 to $439 a month, and in Cheap Seats, Claude and OpenAI models are what it asks.
- You want both what the models find on the web and what they already believe, graded separately.
- You want a strict grade per answer, recommended versus merely mentioned, with reasoning you can check, and an interval on every rate.
- You want your prompts reviewed by pull request and your data in a file you own, without a prompt cap set by a plan.

## When to move to Otterly.AI

If you outgrow Cheap Seats, do whatever suits you. Its author would suggest [Gauge](/compare/gauge/); that team is great. If what you need is on this list, Otterly.AI is a good fit:

- **You need Google AI Overviews, Perplexity or Copilot.** Otterly.AI includes them on every plan; Cheap Seats asks only Claude and OpenAI models, and doesn't cover Gemini or AI Mode either.
- **You need the app's answer, in a market.** Otterly.AI asks the engines' own websites, per country. Cheap Seats asks the models cleanly and has no country setting, so its answers aren't what a buyer in Germany sees in ChatGPT.
- **You'd rather not run anything.** Otterly.AI is hosted, with a low published entry price and unlimited team members. Cheap Seats is software you or your host keeps running.
- **You're an agency.** Otterly.AI offers unlimited workspaces, one invoice and client reports with your branding through Looker Studio. Cheap Seats measures one brand per instance.
- **You want page audits and sponsored placements.** Otterly.AI audits pages for crawlability and content, writes content briefs, and counts ChatGPT Ads and Shopping cards. Cheap Seats' free [site audit](/docs/site-audit/) checks what AI crawlers can read (robots.txt and firewall blocks, llms.txt, the sitemap, pages empty without JavaScript), not what a page says, and it doesn't track ads.

## Taking your prompts with you

Your prompt sets are plain TOML in your own git repo. Each prompt is a line of text with an id, so the buyer questions you've refined in Cheap Seats are yours. They're plain text you can copy into Otterly.AI when you set it up, in any language, with the country you want them asked in. Pick the questions that mattered most: Otterly.AI's plans count prompts, from 15 on Lite to 400 on Premium.

See [Getting started](/docs/getting-started/) to run it, or [all comparisons](/compare/).
