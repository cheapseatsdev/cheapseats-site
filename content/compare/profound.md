---
title: Cheap Seats vs Profound
description: "Cheap Seats, the free, self-hosted AI visibility tracker, beside Profound: engines, how each asks and grades, history, fixes and price, October 2026."
weight: 10
---

Cheap Seats (cheapseats.dev) is the MIT-licensed, self-hosted AI visibility tracker. It's a free place to start, inspired by tools like Profound: it does the small part of the job most teams use most of the time, asking Claude and OpenAI models your buyers' questions, grading whether the answers recommend you, and ending each run with a ranked fix list. Profound is a hosted enterprise platform for AI search visibility and marketing agents. It captures answers from the consumer front ends of up to ten answer engines, including Google AI Overviews and AI Mode, Gemini, Perplexity and Copilot, with SOC 2 Type II, SSO and custom enterprise pricing. Start with Cheap Seats; if you outgrow it, Profound is one of the places to go, and your prompts come with you.

## Side by side

As of October 2026, from Cheap Seats' docs and Profound's own pages, linked in each row:

| | Cheap Seats | Profound |
| --- | --- | --- |
| **Price** | Free and open source (MIT); runs on your existing Claude subscription (ChatGPT optional) | Free trial (50 prompts, run daily for 7 days); Agency Growth, with 400 credits a month per client workspace; Enterprise is custom ([pricing](https://www.tryprofound.com/pricing), [credits](https://docs.tryprofound.com/getting-started/credits)) |
| **Where it runs** | Self-hosted: one Docker container with SQLite, on Docker, Kubernetes (Helm chart) or an exe.dev VM | Hosted SaaS |
| **Engines** | Claude and OpenAI models, through their APIs or the Claude Code and Codex CLIs | Trial: ChatGPT, Gemini, Google AI Overviews. Enterprise: ChatGPT, Google AI Mode, AI Overviews, Gemini, Copilot, Perplexity, Grok, Meta AI, DeepSeek and Claude, Claude by request ([Claude support](https://product.tryprofound.com/changelog/support-for-claude-is-here)); Exa on request ([changelog](https://product.tryprofound.com/changelog)). The pricing page still says "up to 9" |
| **Web search vs memory** | Both, as separate tracks (search and recall), reported separately; the models are asked directly, never the consumer apps | "We capture directly from the browser" ([Answer Engine Insights](https://www.tryprofound.com/features/answer-engine-insights)): one answer, searching when the app decides; not split |
| **Your prompts** | TOML in your own git repo, changed by pull request; `samples` per answerer and track | Trial: a recommended set you can't edit. Enterprise: a tailored prompt plan, edited in Prompt Designer, with a generator and CSV upload; each runs once a day per platform ([Prompt Designer](https://docs.tryprofound.com/answer-engine-insights/prompt-designer), [about AEI](https://docs.tryprofound.com/answer-engine-insights/about)) |
| **Markets** | No region, language or persona settings | Region and language per prompt; personas run as extra executions ([Prompt Designer](https://docs.tryprofound.com/answer-engine-insights/prompt-designer)) |
| **Grading** | A Claude call grades each answer recommended, mentioned or absent, with a quote checked against the answer, position, top pick, every product named and objections; with your facts listed, what each answer got wrong about you | Mentions, citations, sentiment and claims per response; how a mention is decided is not stated ([glossary](https://docs.tryprofound.com/getting-started/glossary)). FactCheck scores claims against your Knowledge Base ([FactCheck](https://docs.tryprofound.com/answer-engine-insights/factcheck/about)) |
| **Noise** | A 95% interval on every rate; changes tested against noise | A published study of daily noise ([Is once a day enough?](https://www.tryprofound.com/blog/is-once-a-day-enough)); no intervals stated on the numbers |
| **History** | Grades fixed when graded; re-grade when you choose, keeping the old grades | Today's topics, tags and brands are applied to past answers ([why past numbers change](https://docs.tryprofound.com/cookbook/metrics/why-past-numbers-change.md)) |
| **What to fix** | A ranked fix list every run: the page, what it must say, the prompts it should flip, the owner, and a Claude Code prompt | Suggestions (limited on the trial, unlimited on Enterprise); an AI Marketer and Agents that draft and refresh content ([AI Marketer](https://docs.tryprofound.com/aim/about)) |
| **Alerts** | None; trends and fix outcomes on the set's pages | Agents can post to Slack when visibility or citation share changes, on Enterprise ([January release](https://product.tryprofound.com/changelog/workflows-are-now-agents-january-roundup)) |
| **API / MCP** | Web UI, CLI, JSON API and MCP server | REST API on Enterprise ([authentication](https://docs.tryprofound.com/rest-api/authentication)); CSV and JSON exports; an MCP server and a Claude connector ([MCP](https://docs.tryprofound.com/mcp/capabilities)) |
| **Security and data** | Your SQLite file; prompts and answers go only to the model providers you configure | SOC 2 Type II; SSO via SAML and OIDC ([enterprise features](https://www.tryprofound.com/blog/enterprise-features)); hosted by Profound |

**What it costs.** Cheap Seats is free and open source (MIT). Claude is required, through a subscription or an API key; ChatGPT (Codex or an OpenAI key) is optional and adds a second assistant's answers. On your own machine, with a Claude Code subscription, answers, grading and the fix list can all run on the claude CLI, with no API key and no extra spend. Host it and you pay your host (and, in a container, API usage, since the image has no CLIs: about $0.03 to grade a 68-answer run, under a daily budget cap). [Cost and budget](/docs/cost-and-budget/) has the details.

## What's the same

- **One run a day is about enough.** Profound's [noise study](https://www.tryprofound.com/blog/is-once-a-day-enough) splits daily movement into same-day sampling noise and a drift floor from the platforms changing, and finds ten runs a day buy little visibility precision. Cheap Seats' set page uses that same split to tell you whether your extra samples pay off ([How big a change Cheap Seats can detect](/docs/noise-and-confidence/#when-more-samples-help)).
- **Answers checked against your own facts.** Profound's [FactCheck](https://docs.tryprofound.com/answer-engine-insights/factcheck/about) extracts claims about your brand and compares them with a Knowledge Base built from your site and files. Cheap Seats' [fact check](/docs/got-wrong/) reads each answer naming you against the `facts` you list and quotes each contradiction. Both stick to facts about your brand.
- **The searches behind the answer.** Profound's [Query Fanouts](https://www.tryprofound.com/blog/introducing-query-fanouts) show what ChatGPT searched for behind each prompt. Cheap Seats stores every search each answer ran, and its [prompt review](/docs/prompt-review/) flags prompts the assistants search for in other words.
- **AI crawlers from server logs.** Profound's [Agent Analytics](https://www.tryprofound.com/features/agent-analytics) reads CDN or server data, because AI crawlers run no JavaScript. Cheap Seats' [crawler counts](/docs/site-audit/#ai-crawlers) import your access logs for the same reason.
- **An MCP server.** Both let you ask the data from Claude.

## What's different

- **How an answer is got.** Profound drives each engine's consumer front end in a browser, so an answer includes whatever the app adds and searches whenever the app decides. Cheap Seats calls Claude and OpenAI models directly, and asks each question twice, once with web search forced and once with no tools, so you can tell which you're losing on. See [Which AI engines Cheap Seats asks](/docs/engines/).
- **How a mention is decided.** Profound analyses each response for brand mentions; it doesn't say how. Cheap Seats has a separate Claude call read the whole answer and grade it recommended, mentioned or absent, strictly: a brand in a list of ten is mentioned. The quote behind each grade is checked to be in the answer. See [How grading works](/docs/how-grading-works/).
- **The denominator.** Profound's visibility is responses naming you over responses naming [any brand](https://docs.tryprofound.com/getting-started/glossary). Cheap Seats' named rate is over every graded answer, so on the same answers it's lower or equal. Profound works citation share [per model, then averages](https://docs.tryprofound.com/cookbook/citations/top-citing-domains) the models; Cheap Seats pools a run's answers and shows each answerer's rate beside it. [Metric definitions](/docs/metrics/#how-these-compare-to-other-tools) maps the rest.
- **What history means.** In Profound, editing topics, tags or brands changes past numbers, and its docs advise exporting first. In Cheap Seats a run's grades are fixed when graded; a grading change starts a new method on the trend, and a [re-grade](/docs/regrading/) is a step you take.
- **Noise.** Profound measures it in a blog post. Cheap Seats shows it on every number, and judges each fix against it.
- **What a fix is.** Profound's [AI Marketer](https://docs.tryprofound.com/aim/about) plans work and builds Agents that refresh pages, draft comparison articles and write outreach, with a person approving. Cheap Seats writes a brief and a Claude Code prompt; your team writes and ships the page. See [From fix to pull request](/docs/fix-to-pull-request/).
- **Data Profound has and Cheap Seats can't.** [Prompt Volumes](https://docs.tryprofound.com/prompt-volumes/about) estimates how often real people ask a question, from licensed consumer panels. [Shopping](https://docs.tryprofound.com/shopping/about) shows which of your products ChatGPT's shopping results show. Cheap Seats has neither.

## Start with Cheap Seats if…

- You want to start without a sales call or a contract, and keep running it at no cost.
- Your buyers ask Claude and ChatGPT-family models, and you want both what they find on the web and what they already believe, graded separately and strictly.
- You want an interval on every rate, and past numbers that stay as graded when you change your setup.
- You want your prompts reviewed like code, and your data in a file you own.
- You want each run to end with a short, ranked list of the exact pages to change, and your team writes its own pages anyway.

## When to move to Profound

If you outgrow Cheap Seats, do whatever suits you. Its author would suggest [Gauge](/compare/gauge/); that team is great. If what you need is on this list, Profound is a good fit:

- **You need engines Cheap Seats doesn't ask, or the app's own answer.** Cheap Seats asks only Claude and OpenAI models, directly. It doesn't cover Gemini, Perplexity, Microsoft Copilot, Grok, Meta AI, DeepSeek, Google AI Overviews or AI Mode, and it doesn't see what a consumer app adds. Profound lists all of them and captures the app.
- **You sell in several markets.** Profound sets a region and language for each prompt, and runs personas beside the bare question. Cheap Seats has no such settings.
- **You want to know which questions people actually ask.** Profound's Prompt Volumes comes from licensed panel data. Cheap Seats' prompts are the ones you write.
- **You need enterprise procurement boxes ticked.** Profound lists SOC 2, SSO/SAML and dedicated support with an SLA. Cheap Seats is software you run, so its security is your own.
- **You'd rather not run anything.** Profound is hosted; Cheap Seats is software you or your host keeps running.
- **You want content produced for you.** Profound's AI Marketer drafts pages, social posts and launch material. Cheap Seats tells you which page to write and what it must say, and hands you a Claude Code prompt, but your team ships it.
- **You sell products through ChatGPT.** Profound's Shopping tracks your products in its shopping results, on Enterprise.
- **You're an agency.** Profound has an agency plan with per-client workspaces and short-lived pitch workspaces ([agencies](https://docs.tryprofound.com/agencies/manage-brands)). Cheap Seats has no agency tier.

## Taking your prompts with you

Your prompt sets are plain TOML in your own git repo. Each prompt is a line of text with an id, so the buyer questions you've refined in Cheap Seats are yours. They're plain text you can copy into Profound's prompt plan, where Enterprise lets you edit, disable or add prompts, or upload them as a CSV in [Prompt Designer](https://docs.tryprofound.com/answer-engine-insights/prompt-designer). Your run history stays in your SQLite file.

See [Getting started](/docs/getting-started/) to run it, or [all comparisons](/compare/).
