---
title: Cheap Seats vs Bad Popcorn
description: Cheap Seats, the free, self-hosted AI visibility tracker, as a place to start before Bad Popcorn. Markets, engines, grading, fixes and shop feeds, October 2026.
weight: 35
---

Cheap Seats (cheapseats.dev) is the MIT-licensed, self-hosted AI visibility tracker. It's a free place to start: it asks Claude and OpenAI models your buyers' questions, grades whether the answers recommend you, and ends each run with a ranked fix list. Bad Popcorn is a hosted AI visibility platform built for brands selling to shoppers in the Netherlands, Belgium, Germany and France. It asks buying questions in each market's language across ChatGPT, Claude, Gemini and Perplexity, from €890 a year; on Growth it also drafts the content to fix what it finds. Start with Cheap Seats; if you outgrow it, Bad Popcorn is one of the places to go, and your prompts come with you.

## Side by side

As of October 2026, from Cheap Seats' docs and Bad Popcorn's own [home](https://badpopcorn.ai/), [methodology](https://badpopcorn.ai/methodology), [product](https://badpopcorn.ai/product) and [API docs](https://badpopcorn.ai/api-docs) pages:

| | Cheap Seats | Bad Popcorn |
| --- | --- | --- |
| **Price** | Free and open source (MIT); runs on your existing Claude subscription (ChatGPT optional) | Starter €890/year or €89/month (1 brand, 2 websites, 2 users, 50 monitored prompts), Growth €2,190/year or €219/month (3 brands, 5 websites, 5 users, 150 prompts), Enterprise custom; 30-day free trial |
| **Where it runs** | Self-hosted: one Docker container with SQLite, on Docker, Kubernetes (Helm chart) or an exe.dev VM | Hosted |
| **Engines** | Claude and OpenAI models, through their APIs or the Claude Code and Codex CLIs | ChatGPT, Claude, Gemini and Perplexity, "and the others enabled on the account"; its FAQ adds Mistral, Grok, Copilot and DeepSeek on larger plans |
| **How it asks** | The models directly, through the APIs or your own CLI subscriptions; every answer, search and citation kept; daily or every few days, as you schedule it | Provider APIs, "not the same as a logged-in consumer app with personalization"; location and language follow the prompt's country; daily, full answers stored |
| **Noise** | Repeated samples per prompt; a 95% interval on every rate, and a change tested prompt by prompt against the noise before it's called one | Repeated runs, with volatility shown, each reading to be read with its sample size; how many runs, and any interval, not stated |
| **Markets** | One set of questions, as you write them; no per-country runs | Per country, starting with the Netherlands, Belgium, Germany and France, with questions in each market's language |
| **Your prompts** | TOML in your own git repo, changed by pull request; `intent = "info"` marks questions that ask to explain rather than choose | Monitored prompts by plan, suggested from your catalogue and categories; clustered by market and by branded, non-branded, purchase, comparison and research intent |
| **Web search vs memory** | Both, as separate tracks (search and recall), reported separately | Not stated on its methodology or product pages |
| **Grading** | Each answer graded recommended, mentioned or absent, with position, top pick, every product named (share of voice) and objections; with your facts listed, what each answer got wrong about you | Mention, citation (your site used as evidence), position and recommendation strength, and context: sentiment and whether the facts match the catalogue; summed up in a 0 to 100 visibility score, weights unpublished |
| **History** | A run's grades are fixed when it's graded; a change of grading method is marked on the trend, and you can re-grade stored answers to carry it on | Not stated |
| **What to fix** | A ranked fix list every run: the page, what it must say, the prompts it should flip, the owner, and a Claude Code prompt | The reason a competitor gets cited; on Growth, FAQs, collection copy, product facts and schema drafted for you to approve; the same questions asked again to check |
| **Shop and crawler data** | No product feeds; AI crawler visits and AI referrals counted from your own access logs, free | AI-referred visits from Google Analytics 4; shopping and ChatGPT product feeds, and AI crawler visits from Cloudflare logs, on Enterprise |
| **API / MCP** | Web UI, CLI, JSON API and MCP server | API access from Growth; reports and fix lists export to CSV |
| **Data** | Your SQLite file; prompts and answers go only to the model providers you configure | Hosted by Bad Popcorn, under Dutch law |

**What it costs.** Cheap Seats is free and open source (MIT). Claude is required, through a subscription or an API key; ChatGPT (Codex or an OpenAI key) is optional and adds a second assistant's answers. On your own machine, with a Claude Code subscription, answers, grading and the fix list can all run on the claude CLI, with no API key and no extra spend. Host it and you pay your host (and, in a container, API usage, since the image has no CLIs: about $0.03 to grade a 68-answer run, under a daily budget cap). [Cost and budget](/docs/cost-and-budget/) has the details.

## What's the same

- **Both ask the models, not the apps, and say so.** Bad Popcorn's [methodology](https://badpopcorn.ai/methodology) says its answers come through provider APIs and are not the same as a logged-in consumer app with personalization. Cheap Seats asks the models through their APIs and CLIs, with your own coding setup switched off ([engines](/docs/engines/)).
- **Both grade more than a mention.** Bad Popcorn scores position and recommendation strength beside the mention. Cheap Seats grades each answer recommended, mentioned or absent, and records position and top pick ([metric definitions](/docs/metrics/)).
- **Both check what the answer says about you.** Bad Popcorn's methodology checks whether the stated facts match your product catalogue. Cheap Seats reads each answer that names you against the facts you list, and quotes what it got wrong ([the fact check](/docs/got-wrong/)).
- **Both keep branded questions apart.** Bad Popcorn clusters prompts as branded or non-branded. Cheap Seats marks every prompt that names you and leads with the rates over the rest ([metric definitions](/docs/metrics/#unbranded-and-branded)).
- **Both check what AI crawlers can read.** Bad Popcorn's free scan, with no login, checks one URL's robots.txt, meta tags, JSON-LD and FAQ structure ([home](https://badpopcorn.ai/#faq)); its full audit, with llms.txt and JavaScript-only pages, is on Growth ([product](https://badpopcorn.ai/product)). `cheapseats audit` checks robots.txt, firewalls, llms.txt, the sitemap and whether each page's content is in its HTML, and lists each finding with its fix ([site checks](/docs/site-audit/)).
- **Both ask again after a fix.** Bad Popcorn marks the change on the trend and asks the same prompt again ([product](https://badpopcorn.ai/product)). Cheap Seats pools the fix's prompts' answers before and after and gives the attempt a status: moved, worse, mixed or no detectable change ([fix to pull request](/docs/fix-to-pull-request/#4-merge-then-let-the-next-run-check-it)).

## What's different

- **How a mention becomes a number.** Bad Popcorn's [API docs](https://badpopcorn.ai/api-docs) build its 0 to 100 visibility score from mention frequency, position (1 to 10), sentiment and source attribution quality; the weights aren't published. In Cheap Seats a separate Claude call grades each whole answer under published rules, and keeps a quote from the answer, checked to be in it, as evidence ([how grading works](/docs/how-grading-works/)).
- **What share of voice means.** Bad Popcorn's [FAQ](https://badpopcorn.ai/#faq) lists share of voice against competitors beside mention rate, and doesn't say what it divides by. Cheap Seats' share of voice is your mentions over every product's mentions, and adds up to 100% across products ([metric definitions](/docs/metrics/#share-of-voice-and-position)).
- **Markets.** Bad Popcorn asks each prompt per country, in that market's language, with location following the country ([methodology](https://badpopcorn.ai/methodology)). Cheap Seats asks each prompt as you wrote it and has no per-country runs.
- **Web search and memory.** Cheap Seats asks every prompt twice over, once with web search and once without, and reports the two apart ([two tracks](/docs/how-grading-works/#two-tracks)). Bad Popcorn's methodology doesn't say whether its answers searched.
- **Noise.** Bad Popcorn shows how much answers move across repeated runs ([methodology](https://badpopcorn.ai/methodology)). Cheap Seats puts a 95% interval on every rate and tests each change prompt by prompt, so a move smaller than the noise reads "within noise" ([noise and confidence](/docs/noise-and-confidence/)).
- **Who writes the fix.** On Growth, Bad Popcorn drafts FAQs, collection copy, product facts and schema from facts you confirm; once approved, it goes to WordPress as a draft or into Shopify by hand ([product](https://badpopcorn.ai/product)). Cheap Seats writes what the page must say and a prompt for Claude Code; the change lands as a pull request in your own repo, for a person to review.
- **Shop data.** Bad Popcorn syncs products from Shopify and WooCommerce and, on Enterprise, checks ChatGPT shopping results ([product](https://badpopcorn.ai/product)). Cheap Seats has no feeds; it counts AI crawler visits and AI referrals from logs you import ([AI crawlers](/docs/site-audit/#ai-crawlers)).

## Start with Cheap Seats if…

- You want to find out whether assistants recommend you before you pay for a plan.
- You want both what the models find on the web and what they already believe, graded separately.
- You want a strict grade per answer, recommended versus merely mentioned, with reasoning and a quote you can check, and a margin of error on every rate.
- You want your prompts reviewed by pull request and your data in a file you own, without a prompt cap set by a plan.
- You want site changes to go through your own repo and review, rather than be published from a vendor's tool.

## When to move to Bad Popcorn

If you outgrow Cheap Seats, do whatever suits you. Its author would suggest [Gauge](/compare/gauge/); that team is great. If what you need is on this list, Bad Popcorn is a good fit:

- **You sell to shoppers in the Netherlands, Belgium, Germany or France.** Bad Popcorn asks in their languages and reports country by country; Cheap Seats has no per-country runs.
- **You need Gemini or Perplexity.** Bad Popcorn asks both; Cheap Seats asks only Claude and OpenAI models.
- **You run an online shop.** Bad Popcorn checks answers against your catalogue, and on Enterprise handles shopping and ChatGPT product feeds beside AI crawler traffic. Cheap Seats checks answers only against the facts you list, and has no feeds.
- **You want the content drafted for you.** On Growth, Bad Popcorn drafts FAQs, collection copy, product facts and schema for you to approve. Cheap Seats tells you which page to change and what it must say, and leaves the writing to you or Claude Code, with a pull request to review for every fix.
- **You'd rather not run anything.** Bad Popcorn is hosted, with a 30-day free trial and an onboarding sprint on every plan. Cheap Seats costs only your model calls, but someone has to host it, keep it running and edit TOML.

## Taking your prompts with you

Your prompt sets are plain TOML in your own git repo. Each prompt is a line of text with an id, so the buyer questions you've refined in Cheap Seats are yours. They're plain text you can copy into Bad Popcorn when you set it up. Pick the questions that mattered most: Bad Popcorn's plans count monitored prompts, 50 on Starter and 150 on Growth.

See [Getting started](/docs/getting-started/) to run it, or [all comparisons](/compare/).
