---
title: Cheap Seats vs Semrush AI Toolkit
description: "Cheap Seats, the free, self-hosted AI visibility tracker, beside Semrush's AI Visibility Toolkit: engines, prompts, metrics and price, October 2026."
weight: 50
---

Cheap Seats (cheapseats.dev) is the MIT-licensed, self-hosted AI visibility tracker. It's a free place to start, inspired by tools like Semrush's AI Toolkit, which its knowledge base now calls the [AI Visibility Toolkit](https://www.semrush.com/kb/1493-ai-visibility-toolkit): Cheap Seats asks Claude and OpenAI models your buyers' questions, through their APIs or the Claude Code and Codex CLIs, grades whether the answers recommend you, and ends each run with a ranked fix list. Semrush's toolkit is $99 a month and covers ChatGPT, Google's AI surfaces, Gemini and Perplexity, but not Claude, which Semrush offers only in Enterprise AIO, at a custom price. If tracking your brand in Claude matters, Cheap Seats covers it. If you want AI visibility inside a broader SEO suite, with Google's AI answers in it, Semrush is the natural place to go when you outgrow Cheap Seats, and your prompts come with you.

## Side by side

As of October 2026, from Cheap Seats' docs and Semrush's own pages: the [AI Visibility Toolkit](https://www.semrush.com/kb/1493-ai-visibility-toolkit), [where its data comes from](https://www.semrush.com/kb/1607-semrush-ai-visibility-data), [metrics](https://www.semrush.com/kb/1594-ai-seo-metrics), [Prompt Tracking](https://www.semrush.com/kb/1503-prompt-tracking), [Brand Performance](https://www.semrush.com/kb/1595-brand-performance-reports), and the [toolkit](https://www.semrush.com/pricing/ai/), [Semrush One](https://www.semrush.com/pricing/seo-ai-search/), [Enterprise AIO](https://www.semrush.com/pricing/enterprise/) and [plans](https://www.semrush.com/prices/) pricing pages:

| | Cheap Seats | Semrush AI Visibility Toolkit |
| --- | --- | --- |
| **Price** | Free and open source (MIT); runs on your existing Claude subscription (ChatGPT optional) | $99/month per domain, billed annually. Semrush One "SEO + AI Search": Starter $165.17/month billed annually ($199 monthly), Pro+ $248.17 ($299), Advanced on request |
| **Where it runs** | Self-hosted: one Docker container with SQLite, on Docker, Kubernetes (Helm chart) or an exe.dev VM | Hosted SaaS |
| **Engines** | **Claude** and OpenAI models, through their APIs or the Claude Code and Codex CLIs | ChatGPT, Google AI Mode and Gemini in Prompt Tracking; Google AI Overviews in the prompt database; Perplexity in Brand Performance. Plans page: "Google Search, ChatGPT, Perplexity, Gemini & more" |
| **Claude** | Required | Not tracked: Semrush says Claude and Perplexity ["aren't currently supported"](https://www.semrush.com/blog/how-to-build-an-ai-visibility-dashboard-semrush/) for tracking campaigns. Claude, Copilot, Grok and DeepSeek are in [Enterprise AIO](https://www.semrush.com/kb/1626-ai-visibility-features), at a custom price |
| **How it asks** | Asked of the models directly, on two tracks: search (must search the web first) and recall (no tools), reported separately | From the real AI surfaces, "rather than through LLM APIs"; Prompt Tracking asks each prompt daily. Search vs memory: not stated |
| **Your prompts** | TOML in your own git repo, changed by pull request, as many as you like | Prompt Tracking: 25 prompts, 50 more for $60/month; Semrush One 50, 100 or 200. One platform per campaign, so a second platform counts them again. Plus a 317M+ prompt database from AI search clickstream |
| **Grading** | A Claude grader reads each whole answer: recommended, mentioned or absent, with position, top pick, every product named and objections | A "proprietary AI extraction system" finds brand mentions; Mentions counts the prompts that include you. Recommended vs mentioned: not stated |
| **Headline number and noise** | Named, recommended and top-pick rates, each with a 95% interval; changes tested against noise | AI Visibility score, 0 to 100, against competitors' median mentions; formula not published; no interval stated |
| **Markets** | No location or language setting is documented; prompts are asked as you write them | Prompt Tracking by location and language, 220+ countries; prompt database in [32 countries](https://www.semrush.com/news/458100-semrush-expands-ai-visibility-database-to-32-countries-with-17-new-regional-markets/) |
| **What to fix** | A ranked fix list every run: the page, what it must say, the prompts it should flip, the owner, and a Claude Code prompt; each fix checked against the next runs | "AI Strategic Opportunities" at the end of each Brand Performance report. Whether outcomes are measured afterwards: not stated |
| **Your data, API, MCP** | Your SQLite file; web UI, CLI, JSON API and MCP server | CSV (1,000 rows, 10 exports a day) and Google Sheets export. Toolkit data is [not in the Semrush API](https://www.semrush.com/blog/how-to-build-an-ai-visibility-dashboard-semrush/) or [MCP](https://www.semrush.com/blog/ai-tools-for-competitor-analysis/) yet |
| **SEO suite** | None; Cheap Seats only measures AI answers | Part of Semrush, alongside its SEO tools |

**What it costs.** Cheap Seats is free and open source (MIT). Claude is required, through a subscription or an API key; ChatGPT (Codex or an OpenAI key) is optional and adds a second assistant's answers. On your own machine, with a Claude Code subscription, answers, grading and the fix list can all run on the claude CLI, with no API key and no extra spend. Host it and you pay your host (and, in a container, API usage, since the image has no CLIs: about $0.03 to grade a 68-answer run, under a daily budget cap). [Cost and budget](/docs/cost-and-budget/) has the details.

## What's the same

- **Sources sorted into the same four buckets.** Semrush's Competitor Research [sorts cited sites](https://www.semrush.com/kb/1594-ai-seo-metrics) into missing, shared, strong and unique, and treats missing ones, cited where competitors are named and you aren't, as outreach. Cheap Seats uses the same names, sorted by what the citing answers name rather than what the site says (Semrush's shared means every competitor in the set), and ranks the missing hosts as [Cited without your brand](/docs/metrics/#buckets-outreach-and-found-but-not-cited).
- **A site audit for AI crawlers, bot by bot.** Both check robots.txt for the assistant and search fetchers (Claude-User, Claude-SearchBot, ChatGPT-User, OAI-SearchBot, PerplexityBot), treat GPTBot and ClaudeBot as training crawlers, and look for an llms.txt ([Semrush](https://www.semrush.com/kb/1571-blocked-from-ai-search-site-audit), [Cheap Seats](/docs/site-audit/)).
- **Branded questions kept apart.** Semrush's sentiment metrics are [based on non-branded queries only](https://www.semrush.com/kb/1595-brand-performance-reports). Cheap Seats' track cards lead with the rates over unbranded prompts.
- **One reading is a range.** Semrush's own team writes that a share of voice swinging between 20% and 40% in a day is normal, and reports "30% ± 10%" ([Semrush](https://www.semrush.com/blog/how-we-are-using-semrush-to-drive-llm-visibility/)). Cheap Seats puts a 95% interval on every rate ([How big a change Cheap Seats can detect](/docs/noise-and-confidence/)).

## What's different

- **Where the answers come from.** Semrush captures answers from the consumer surfaces, ChatGPT, Gemini and Google's AI Mode and AI Overviews, [rather than through LLM APIs](https://www.semrush.com/kb/1607-semrush-ai-visibility-data). Cheap Seats asks the models directly, once with web search and once without, and reports the two apart. Semrush's answers are closer to what a person sees; Cheap Seats' tell you whether you lose on the web or in the model's memory ([engines](/docs/engines/)).
- **Whose questions.** Semrush measures you on a database of real prompts you didn't choose, on prompts it writes from your domain, and on the 25 to 200 you track. Cheap Seats asks only the prompts in your TOML files, so it tells you nothing about questions you didn't think to ask.
- **How a mention is decided.** Semrush's extraction system finds the brand in an answer, and Mentions counts the prompts that include it. Cheap Seats has a Claude call grade each whole answer recommended, mentioned or absent, so a table of ten tools that includes you counts as mentioned, not as a win ([How grading works](/docs/how-grading-works/)).
- **The headline number.** Semrush's AI Visibility score is 0 to 100, set against the [median mentions](https://www.semrush.com/kb/1493-ai-visibility-toolkit) of your top competitors, with no published formula. Cheap Seats reports plain rates, answers naming you over graded answers, each with its interval ([Metric definitions](/docs/metrics/)).
- **Share of voice.** Semrush's Brand Performance weights it by [how many times you're mentioned and how high you appear](https://www.semrush.com/blog/how-to-measure-ai-share-of-voice/). Cheap Seats' share of voice is your mentions over every product's, summing to 100%, with position-weighted visibility in its own column.
- **Getting the data out.** Semrush's toolkit data leaves by CSV or Google Sheets; it isn't in the Semrush API or MCP yet. Cheap Seats' data is a SQLite file, a JSON API and an MCP server.

## Start with Cheap Seats if…

- **Claude matters to your buyers.** Cheap Seats asks Claude both with web search and from memory, and grades the two separately. In Semrush that takes Enterprise AIO.
- You want a strict grade per answer, recommended versus merely mentioned, with reasoning you can check.
- You want to know whether a change is real: every rate carries an interval, and each fix is tested on its prompts after it ships.
- You want each run to end in a ranked list of the exact pages to change, with a Claude Code prompt for each.
- You want your prompts reviewed by pull request, as many as you like, and your data in a file you own.

## When to move to Semrush

If you outgrow Cheap Seats, do whatever suits you. Its author would suggest [Gauge](/compare/gauge/); that team is great. If what you need is on this list, Semrush is a good fit:

- **You already live in Semrush.** AI visibility sits next to Semrush's SEO tools, in one bill and one login.
- **You need Google AI Overviews, AI Mode, Gemini or Perplexity,** as people see them. The toolkit collects from those surfaces; Cheap Seats asks only Claude and OpenAI models, directly, and covers none of them.
- **You want prompt research, by market.** Semrush gives topic-level AI volume from clickstream data in 32 countries, and tracks per location and language; in Cheap Seats, you write your own prompts, and there is no location setting.
- **You'd rather not run anything.** Semrush is hosted; Cheap Seats is a container you or your host keeps running.
- **You need Claude, Copilot, Grok and DeepSeek under one contract.** That's Semrush Enterprise AIO, priced on request.

## Taking your prompts with you

Your prompt sets are plain TOML in your own git repo. Each prompt is a line of text with an id, so the buyer questions you've refined in Cheap Seats are yours. They're plain text you can copy into Semrush's Prompt Tracking when you set it up. The toolkit starts at 25 prompts, and each platform you track counts them again, so bring the ones that mattered most.

See [Getting started](/docs/getting-started/) to run it, or [all comparisons](/compare/).
