---
title: Cheap Seats vs Profound
description: "Cheap Seats, the free, self-hosted AI visibility tracker, beside Profound: engines, how each asks and grades, history, fixes and price, October 2026."
weight: 10
---
Profound is a hosted enterprise platform for AI search visibility and marketing agents. It captures answers from the consumer front ends of up to nine answer engines, including Google AI Overviews and AI Mode, Gemini, Perplexity and Copilot, with SOC 2 Type II, SSO and custom enterprise pricing. [Cheap Seats](/compare/) asks only Claude and OpenAI models, directly, and grades each answer; this page says where that is enough and where Profound's reach is the point.

## Side by side

As of October 2026, from Cheap Seats' docs and Profound's own pages, linked in each row:

| | Cheap Seats | Profound |
| --- | --- | --- |
| **Price** | Free and open source (MIT); runs on your Claude subscription or API key, ChatGPT optional ([cost and budget](/docs/cost-and-budget/)) | Free trial (50 prompts, run daily for 7 days). Agency Growth: 400 credits a month per client workspace, with no price on the pricing page; Profound's [agency launch post](https://www.tryprofound.com/blog/agencies-launch-your-aeo-practice-with-profound) of November 2025 put it at $399 a month per client workspace. Enterprise is custom ([pricing](https://www.tryprofound.com/pricing)) |
| **Where it runs** | One Docker container with SQLite; also a Helm chart or an exe.dev VM ([self-hosting](/docs/self-hosting/)) | Hosted SaaS |
| **Engines** | Claude and OpenAI models, through their APIs or the Claude Code and Codex CLIs | Trial: ChatGPT, Gemini, Google AI Overviews. Enterprise: "up to 9" of ChatGPT, Perplexity, Google AI Mode, AI Overviews, Gemini, Copilot, DeepSeek, Claude and Exa ([pricing](https://www.tryprofound.com/pricing)); the product page lists Grok in place of Exa ([Answer Engine Insights](https://www.tryprofound.com/features/answer-engine-insights)) |
| **Web search vs memory** | Search and recall, as separate tracks ([two tracks](/docs/how-grading-works/#two-tracks)) | "We capture directly from the browser" ([Answer Engine Insights](https://www.tryprofound.com/features/answer-engine-insights)): one answer, searching when the app decides; not split |
| **Your prompts** | TOML in your own git repo, changed by pull request; `samples` per answerer and track | Trial: a recommended set you can't edit. Enterprise: a tailored prompt plan, edited in [Prompt Designer](https://docs.tryprofound.com/answer-engine-insights/prompt-designer); one run per prompt, model, region, persona and day ([why past numbers change](https://docs.tryprofound.com/cookbook/metrics/why-past-numbers-change)) |
| **Markets** | No region, language or persona settings | Region and language per prompt, from 150+ regions and 30+ languages ([Answer Engine Insights](https://www.tryprofound.com/features/answer-engine-insights)); up to three personas per category, each run as an extra prompt ([Personas](https://docs.tryprofound.com/answer-engine-insights/personas)) |
| **Grading** | Recommended, mentioned or absent per answer, with position, top pick, share of voice, objections and tone; what each answer got wrong against your facts ([how grading works](/docs/how-grading-works/)) | A model, the Entity Parser, lists the brands each answer names, and Name Matching joins variant names; which model is not stated ([settings](https://docs.tryprofound.com/answer-engine-insights/settings)). FactCheck scores claims against your Knowledge Base ([FactCheck](https://docs.tryprofound.com/answer-engine-insights/factcheck/about)) |
| **Noise** | A 95% interval on every rate; changes tested against noise ([how big a change](/docs/noise-and-confidence/)) | A published study of daily noise ([Is once a day enough?](https://www.tryprofound.com/blog/is-once-a-day-enough)); no intervals stated on the numbers |
| **History** | Grades fixed when graded; re-grade when you choose, keeping the old grades | Stored answers are never re-analysed; today's topics, tags and brands are applied to them ([why past numbers change](https://docs.tryprofound.com/cookbook/metrics/why-past-numbers-change)) |
| **What to fix** | A ranked fix list every run, each fix measured after it ships ([from fix to pull request](/docs/fix-to-pull-request/)) | Suggestions (limited on the trial, unlimited on Enterprise); an AI Marketer and Agents that draft and refresh content ([AI Marketer](https://docs.tryprofound.com/aim/about)) |
| **Alerts** | None; trends and fix outcomes on the set's pages | Agents can run on a trigger, such as visibility moving 5%, and post to Slack or Teams ([October release](https://product.tryprofound.com/changelog/meet-the-new-agents-work-with-your-ai-marketer-in)) |
| **API / MCP** | Web UI, CLI, JSON API and MCP server | REST API and MCP server on Enterprise ([REST API](https://docs.tryprofound.com/rest-api/introduction), [MCP](https://docs.tryprofound.com/mcp/overview)); an official Claude connector ([connector](https://www.tryprofound.com/blog/the-profound-connector-is-live-in-claude-part-2)); CSV and JSON exports |
| **Security and data** | Your SQLite file; prompts and answers go only to the model providers you configure | SOC 2 Type II; SSO via SAML or OIDC ([enterprise](https://www.tryprofound.com/enterprise)); hosted by Profound |

## What's the same

- **One run a day is about enough.** Profound's [noise study](https://www.tryprofound.com/blog/is-once-a-day-enough) splits daily movement into same-day sampling noise and a drift floor from the platforms changing, and finds ten runs a day tighten daily visibility by only about 11%. Cheap Seats' set page uses that same split to tell you whether your extra samples pay off ([How big a change Cheap Seats can detect](/docs/noise-and-confidence/#when-more-samples-help)).
- **Answers checked against your own facts.** Profound's [FactCheck](https://docs.tryprofound.com/answer-engine-insights/factcheck/about) extracts claims about your brand and compares them with a Knowledge Base built from your site and files. Cheap Seats' [fact check](/docs/got-wrong/) reads each answer naming you against the `facts` you list and quotes each contradiction.
- **The searches behind the answer.** Profound's [Query Fanouts](https://www.tryprofound.com/blog/introducing-query-fanouts) show what an engine searched for behind each prompt. Cheap Seats stores every search each answer ran, and its [prompt review](/docs/prompt-review/) flags prompts the assistants search for in other words.
- **AI crawlers from server logs.** Profound's [Agent Analytics](https://www.tryprofound.com/features/agent-analytics) uses "server logs instead of JavaScript trackers". Cheap Seats' [crawler counts](/docs/site-audit/#ai-crawlers) import your access logs.
- **An MCP server.** Both let you ask the data from Claude.

## What's different

- **How an answer is got.** Profound drives each engine's consumer front end in a browser, so an answer includes whatever the app adds and searches whenever the app decides. Cheap Seats calls Claude and OpenAI models directly, and asks each question twice, once with web search forced and once with no tools, so you can tell which you're losing on. See [Which AI engines Cheap Seats asks](/docs/engines/).
- **How a mention is decided.** Profound has a model extract the brands each answer names, and counts any naming. Cheap Seats has a separate Claude call read the whole answer and grade it recommended, mentioned or absent, strictly: a brand in a list of ten is mentioned. The quote behind each grade is checked to be in the answer. See [How grading works](/docs/how-grading-works/).
- **The denominator.** Profound's visibility is answers naming you over answers naming [any brand](https://docs.tryprofound.com/cookbook/metrics/how-metrics-are-calculated). Cheap Seats' named rate is over every graded answer, so on the same answers it's lower or equal. Profound works every metric per model, then averages the models with equal weight; Cheap Seats pools a run's answers and shows each answerer's rate beside it. [Metric definitions](/docs/metrics/#how-these-compare-to-other-tools) maps the rest.
- **What a fix is.** Profound's [AI Marketer](https://docs.tryprofound.com/aim/about) plans work and builds Agents that refresh pages, draft comparison articles and write outreach, with a person approving. Cheap Seats writes a brief and a Claude Code prompt; your team writes and ships the page. See [From fix to pull request](/docs/fix-to-pull-request/).
- **Data Profound has and Cheap Seats can't.** [Prompt Volumes](https://docs.tryprofound.com/prompt-volumes/faq) estimates how often real people ask a question, from licensed consumer panels. [Shopping](https://docs.tryprofound.com/shopping/about) shows which of your products ChatGPT's shopping results show. Cheap Seats has neither.

## Start with Cheap Seats if…

- You want to start without a sales call or a contract, and keep running it at no cost.

The rest of the case for starting here, strict grades, two tracks, intervals, prompts and data you own, is on [the compare index](/compare/#start-here).

## When to move to Profound

If what you need is on this list, Profound is a good fit:

- **You need engines Cheap Seats doesn't ask, or the app's own answer.** Cheap Seats asks only Claude and OpenAI models, directly. It doesn't cover Gemini, Perplexity, Microsoft Copilot, Grok, DeepSeek, Google AI Overviews or AI Mode, and it doesn't see what a consumer app adds. Profound lists all of them and captures the app.
- **You sell in several markets.** Profound sets a region and language for each prompt, and runs personas beside the bare question. Cheap Seats has no such settings.
- **You want to know which questions people actually ask.** Profound's Prompt Volumes comes from licensed panel data. Cheap Seats' prompts are the ones you write.
- **You need enterprise procurement boxes ticked.** Profound lists SOC 2, SSO/SAML and support up to a dedicated specialist with a 24-hour SLA ([pricing](https://www.tryprofound.com/pricing)). Cheap Seats is software you run, so its security is your own.
- **You want content produced for you.** Profound's AI Marketer drafts pages, social posts and launch material ([Profound](https://www.tryprofound.com/)). Cheap Seats tells you which page to write and what it must say, and hands you a Claude Code prompt, but your team ships it.
- **You sell products through ChatGPT.** Profound's Shopping tracks your products in its shopping results, on Enterprise.
- **You're an agency.** Profound has an agency plan with per-client workspaces and short-lived pitch workspaces ([Agency Mode](https://docs.tryprofound.com/agencies/agency-mode-overview)). Cheap Seats has no agency tier.

## Taking your prompts with you

They're plain text in your own repo ([why that matters](/compare/#if-you-grow-out-of-it)), so copy them into Profound's prompt plan, or upload them as a CSV in [Prompt Designer](https://docs.tryprofound.com/answer-engine-insights/prompt-designer).

[All comparisons](/compare/).
