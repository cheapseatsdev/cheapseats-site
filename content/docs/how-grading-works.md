---
title: How grading works
description: How Popcorn decides whether an AI assistant recommended a brand, mentioned it or left it out, which assistants it asks, and how to check every grade.
weight: 42
---

**How does Popcorn decide whether an AI assistant recommended a brand?** It asks each assistant your buyers' questions, then a separate Claude call reads each answer and grades it **recommended**, **mentioned** or **absent** for your brand, with the reasons. It isn't a single opaque score: every answer, every search the assistant ran, every result and citation, and every grade with its reasoning is stored, and you can open any of them from the run page or export them.

## Which assistants it asks

Popcorn asks the models you configure, through their APIs or their command-line tools:

| provider      | asks                                   | billed                     |
| ------------- | -------------------------------------- | -------------------------- |
| `anthropic`   | Claude models, through the API         | per token                  |
| `openai`      | OpenAI models, through the API         | per token                  |
| `claude-code` | Claude models, through the `claude` CLI | your Claude subscription   |
| `codex`       | OpenAI models, through the `codex` CLI  | your ChatGPT subscription  |

**Not covered:** Google AI Overviews, AI Mode, Gemini, Perplexity and Microsoft Copilot. Popcorn doesn't ask them. And it asks the models directly, not the ChatGPT or Claude apps a buyer types into, which can add their own memory and settings.

## Two tracks

Every question is asked of every assistant twice over:

- **search**: the assistant must search the web before answering. This is what the web says about your category today, and it moves as pages are published and crawled.
- **recall**: no tools. This is what the model already believes, and it moves only when a new model is released.

The two are graded and reported separately, never blended, so you can see which one you're losing on. Each is asked as many times as your config's `samples` says, since one answer can be a fluke.

## Three grades

The grader is a separate Claude call (Claude Haiku on popcorn.zone's own runs) that sees the question, the answer, your brand's name and aliases, and the canonical names of your competitors. It grades only your brand:

| verdict       | when                                                                                                   |
| ------------- | ------------------------------------------------------------------------------------------------------ |
| `recommended` | the answer's top pick, or one of at most three primary recommendations it actively endorses for the buyer's situation |
| `mentioned`   | named, but only as one option among many, in passing, as a comparison point, or with reservations       |
| `absent`      | not named at all, aliases included                                                                     |

It's strict on purpose: a brand listed in a table with nine others is mentioned, not recommended. Each grade also records:

- **position**: where your brand first appears among the products the answer names;
- **top pick**: the one product the answer most strongly recommends, if it commits to one;
- **every product named**, folded onto your competitors' canonical names, which is what share of voice counts;
- **reasoning**: one or two sentences quoting the wording that decided the grade;
- **why not #1**: what the answer preferred instead and the reasons it gave;
- **objections**: the specific concerns the answer raised about your brand.

Questions marked `intent = "info"` ask for an explanation, not a choice, so a good answer may recommend nothing. They count toward being named, not toward recommended.

## Worked examples

These are real answers from a Popcorn run of 22 October 2026, to the question *"Popcorn or Semrush AI Toolkit for tracking our brand in ChatGPT and Claude?"*

**Recommended, as one of two primary picks.** An OpenAI model, answering from memory, opened with: *"I'd start by evaluating Popcorn if your main goal is tracking your brand in ChatGPT and Claude. Choose Semrush AI Toolkit if you also want that work tied to a broader SEO program."* It committed to no single top pick, but it endorsed Popcorn as one of two primary options for the buyer's stated goal, so the grade is `recommended` at position 1, top pick none. Its reservations are kept as objections: *insufficient information about Popcorn's capabilities*, *requires verification before buying*.

**Mentioned: named, not endorsed.** Claude, on the search track, began: *"I couldn't find a product called Popcorn, so I can't compare the two fairly."* Popcorn is named first, because the question named it, but the answer doesn't endorse it, so the grade is `mentioned`. The objections recorded were *no public product found under this name* and *could not verify the product exists*, which tells you what to fix.

**Absent, though the answer recommends something.** A question about a competitor, such as *"Is Gauge a good tool for tracking AI visibility?"*, can get an answer that endorses Gauge warmly and never names your brand. That's `absent` for you. The grader is told that the product a question asks about is never your brand, and Popcorn then checks the answer's text itself: if your brand's name and aliases appear nowhere in it, the grade is absent whatever the model said.

## Rates and intervals

The run page reports, for each assistant and track, how often your brand was the top pick, recommended, and named, each with a 95% Wilson interval, so a rate from a handful of answers reads as uncertain rather than precise. Share of voice counts every product named across the run's answers.

## Checking a grade

The run page lists every answer behind its rates. For any answer you can read the full text, the searches the assistant ran, every result and page it cited, and the grade with its reasoning. Each run also stores the grading instructions it used, its config commit and the Popcorn version, and exports to CSV or JSON. When the way answers are asked or graded changes, the trend marks the run where it changed rather than joining two methods into one line.

See [Reading results](../reading-results/) for the run page, and [Configuration](../configuration/) for answerers, models and samples.
