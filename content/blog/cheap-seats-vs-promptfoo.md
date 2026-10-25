---
title: "Cheap Seats vs. Promptfoo for AI visibility"
date: 2026-10-22
author: Chad Metcalf
description: Promptfoo is a general LLM eval and red-teaming tool; Cheap Seats tracks whether AI assistants recommend you. When each fits, and what you'd build on top.
---

Use **Cheap Seats** to track whether Claude and OpenAI models recommend your product and what to change. Use **Promptfoo** to evaluate or red-team an LLM app, or to build a visibility check with your own rubric. Both are open source; the difference is how much of the visibility workflow you want to build.

<!--more-->

## Why this comparison

We ask the assistants about Cheap Seats' own category on a schedule. When Claude Opus was asked, on the search track, *"What's a good open-source way for a developer-tools startup to check whether AI assistants recommend it over alternatives?"*, its top pick was Promptfoo. From that Cheap Seats run, shortened:

> **Option 2: Build your own checks with promptfoo (my pick for a dev-tools team)** … Write 30–100 questions your buyers actually ask … Run them against several models … Write automatic checks for each answer: is your brand mentioned, does it come before your competitors, and does the answer link to your docs … Run the suite on a schedule … Ask each question 5–10 times.

That is a workable approach. Cheap Seats was graded `absent` in the answer; this post explains the visibility workflow it already provides.

## What Promptfoo is

Promptfoo describes itself as an open-source CLI and library for evaluating and red-teaming LLM apps. Its October 2026 README says it is part of OpenAI and remains MIT licensed.

For visibility checks, it supplies multiple providers, web-search configuration, deterministic and model-graded assertions, repeated tests, derived metrics, and a browser results viewer. If you already use it, you can point those at your buyers' questions.

## What you'd have to build

The custom work is the domain logic: distinguish active endorsement from a name in a long list; handle aliases and name collisions; retain queries and citations; aggregate brands consistently; compare runs with uncertainty; and turn answer evidence into actionable fixes.

Cheap Seats supplies that workflow. Each grade records a verdict, position, top pick and objections. It keeps search and recall separate and proposes a page, required facts and target prompts for each fix. [How grading works](/docs/how-grading-works/) defines the rubric; [Noise and confidence](/docs/noise-and-confidence/) explains comparisons.

## Side by side

As of October 2026, from each project's own docs:

| | Cheap Seats | [Promptfoo](https://github.com/promptfoo/promptfoo) |
| --- | --- | --- |
| **Built for** | Whether AI assistants recommend your brand, and what to fix | Evaluating and red-teaming LLM apps |
| **License** | MIT | MIT |
| **Runs** | Self-hosted: one Docker container with SQLite, or locally | Locally, as a CLI or library, or in CI/CD |
| **Models asked** | Claude and OpenAI, by API or the local `claude` and `codex` CLIs | Many providers, including OpenAI, Anthropic, Google, Azure, Bedrock and Ollama |
| **Same questions, several models** | Yes | Yes |
| **Web search vs. memory** | Both on every question, graded separately | Configurable per provider |
| **Grading** | Recommended, mentioned or absent, with position, top pick, objections | Assertions you write, including `llm-rubric` |
| **Share of voice** | Built in | Build it yourself |
| **Trends over time** | Day-by-day series per prompt set | Diff one eval against another |
| **What to fix** | Ranked fix list per run | Not in scope |
| **Questions live in** | TOML in your own git repo, changed by PR | YAML config (`promptfooconfig.yaml`) |
| **Interfaces** | Web UI, CLI, JSON API, MCP server | CLI, library, web viewer |

## Can you test the same buyer questions against several models?

Yes. Configure several answerers in Cheap Seats or several providers in Promptfoo. Cheap Seats returns its fixed visibility report; Promptfoo evaluates the assertions you configure.

## When to use Promptfoo instead

- **You need models Cheap Seats doesn't ask.** Cheap Seats asks Claude and OpenAI models only. It doesn't cover Gemini, Perplexity, Copilot or Google AI Overviews. Promptfoo's provider list is much longer, Google's models among them, and you can add a custom provider for any LLM API.
- **You're testing your own LLM app.** Prompt regressions, RAG quality, red-teaming and security scanning are what Promptfoo is for. Cheap Seats doesn't do any of that.
- **You want a check in CI.** If all you need is "fail the build if the answer stops naming us," a few Promptfoo assertions do it.
- **You already run Promptfoo** and want a rough visibility signal without another service.

They also pair well: Promptfoo for your app's quality and safety, Cheap Seats for whether the assistants send buyers your way.

## What it costs

Both projects' software is free. With Cheap Seats, local CLI answerers, grading and analysis can use existing subscriptions; API calls and hosting cost extra if you choose them. Subscription usage limits still apply. See [Cost and budget](/docs/cost-and-budget/).

## Try it

The code is on [GitHub](https://github.com/cheapseatsdev/cheapseats), and [Getting started](/docs/getting-started/) takes you from a checkout to your first run. If you're coming from paid tools, [A free, open-source AI visibility tracker](/blog/free-open-source-ai-visibility-tracker/) compares Cheap Seats with the free options.
