---
title: How grading works
description: How Cheap Seats decides whether an AI assistant recommended a brand, mentioned it or left it out, which assistants it asks, and how to check every grade.
weight: 220
group: Reading what it finds
---

**How does Cheap Seats decide whether an AI assistant recommended a brand?** It asks each assistant your buyers' questions, then a separate Claude call reads each answer and grades it **recommended**, **mentioned** or **absent** for your brand, with the reasons. It isn't a single opaque score: every answer, every search the assistant ran, every result and citation, and every grade with its reasoning is stored, and you can open any of them from the run page or export them.

## Which assistants it asks

Cheap Seats asks the models you configure, through their APIs or their command-line tools:

| provider      | asks                                   | billed                     |
| ------------- | -------------------------------------- | -------------------------- |
| `anthropic`   | Claude models, through the API         | per token                  |
| `openai`      | OpenAI models, through the API         | per token                  |
| `claude-code` | Claude models, through the `claude` CLI | your Claude subscription   |
| `codex`       | OpenAI models, through the `codex` CLI  | your ChatGPT subscription  |

**Not covered:** Google AI Overviews, AI Mode, Gemini, Perplexity and Microsoft Copilot. Cheap Seats doesn't ask them. And it asks the models directly, not the ChatGPT or Claude apps a buyer types into, which can add their own memory and settings.

## Two tracks

Every question is asked of every assistant twice over:

- **search**: the assistant must search the web before answering. This is what the web says about your category today, and it moves as pages are published and crawled.
- **recall**: no tools. This is what the model already believes, and it moves only when a new model is released.

The two are graded and reported separately, never blended, so you can see which one you're losing on. Each is asked as many times as your config's `samples` says, since one answer can be a fluke.

## Three grades

The grader is a separate Claude call (Claude Haiku on cheapseats.dev's own runs) that sees the question, the answer, your brand's name and aliases, and the canonical names of your competitors. It grades only your brand:

| verdict       | when                                                                                                   |
| ------------- | ------------------------------------------------------------------------------------------------------ |
| `recommended` | the answer's top pick, or one of at most three primary recommendations it actively endorses for the buyer's situation |
| `mentioned`   | named, but only as one option among many, in passing, as a comparison point, or with reservations       |
| `absent`      | not named at all, aliases included, or the name is used only for another product that shares it        |

It's strict on purpose: a brand listed in a table with nine others is mentioned, not recommended. Each grade also records:

- **position**: where your brand first appears among the products the answer names;
- **top pick**: the one product the answer most strongly recommends, if it commits to one;
- **every product named**, folded onto your competitors' canonical names, which is what share of voice counts;
- **reasoning**: one or two sentences quoting the wording that decided the grade;
- **why not #1**: what the answer preferred instead and the reasons it gave;
- **objections**: the specific concerns the answer raised about your brand;
- **tone**: how the answer talks about your brand itself, not the category: **positive** (endorses it or describes it favorably), **negative** (mostly warnings or criticism), **mixed** (clear praise and clear criticism) or **neutral** (describes or lists it without judging it). None when it's absent;
- **praise**: short phrases for each strength the answer credits your brand with, such as "open source" or "easy setup", the mirror of objections;
- **evidence**: the one sentence of the answer that most supports the verdict, copied word for word. None when the brand is absent.

**Evidence is checked, not trusted.** A model asked to quote can paraphrase. Cheap Seats looks for the grader's quote in the answer itself, ignoring case, spacing, markdown emphasis and curly quotes, and keeps the answer's own span of text. A quote it can't find is dropped, never shown. So every quote on the run page, where it's highlighted in the answer, is one the answer contains. It's `evidence` in the grade, in the JSON and CSV exports and in MCP `get_result`.

Tone and praise feed the run's **net sentiment** (the share of answers naming you that are positive, minus the share negative) and its **themes**: after a run is graded, one more grader call groups its objections, praise and reasons for picking something else into a few named themes, each with the product it helps and a quote. [Metric definitions](../metrics/#sentiment-and-themes) has the formulas.

**Adding tone and praise changed the grading instructions once.** Every trend marks the first run graded with them as a new method, since answers are graded a different way, rather than joining the two into one line. Runs graded before have no tone, so their net sentiment is n/a.

**Adding evidence changed them once more.** In Cheap Seats 0.2.5 the grader started returning an evidence quote, so each set's trend marks a new method at its first run on 0.2.5. Grades from before have no evidence.

**Re-grading carries a trend on.** Instead of letting a grading change restart the trend, you can [re-grade](../regrading/) the answers older runs already have under today's grader. The answers aren't asked again; the re-graded runs join the new method's trend from their own dates on, and the grades they replaced are kept. On the `claude` CLI it costs nothing.

Questions marked `intent = "info"` ask for an explanation, not a choice, so a good answer may recommend nothing. They count toward being named, not toward recommended.

## Worked examples

These are real answers from Cheap Seats' runs of 22 October 2026, asked about Cheap Seats itself.

**Mentioned: named, not endorsed.** Asked *"Is Cheap Seats a good open-source alternative to paid AI visibility tools?"*, Claude, answering from memory, opened with *"I can't vouch for Cheap Seats specifically"* and said it had no reliable information about a tool by that name. Cheap Seats is named first, because the question named it, but the answer doesn't endorse it, so the grade is `mentioned`, and its objections say what to fix.

**A close call.** Asked *"Cheap Seats or Semrush AI Toolkit for tracking our brand in ChatGPT and Claude?"*, an OpenAI model opened with: *"I'd start by evaluating Cheap Seats if your main goal is tracking your brand in ChatGPT and Claude. Choose Semrush AI Toolkit if you also want that work tied to a broader SEO program."* That reads as one of two primary picks, which is `recommended`, but the same answer says *"I don't have reliable enough information about Cheap Seats' capabilities"*, which hedges it to `mentioned`. Graded ten more times, it came back `mentioned` nine times and `recommended` once. Close calls like this are why every question is asked more than once and every rate carries an interval, and why each grade shows its reasoning: you can read the close ones yourself.

**Absent: another product with the same name.** Asked *"Cheap Seats vs Profound…"*, an answer said it *"couldn't verify the specific Cheap Seats product you mean"* and went on to describe an unrelated product that *"sells WhatsApp sales and support agents"*. The name is in the answer, but the brand isn't. The grader tells products that share your name apart using your brand's `about`, and records when every use of the name means something else; that grade is `absent`. An answer that says it can't find your brand, without taking it for something else, still names it.

**Absent, though the answer recommends something.** A question about a competitor, such as *"Is Gauge a good tool for tracking AI visibility?"*, can get an answer that endorses Gauge warmly and never names your brand. That's `absent` for you. The grader is told that the product a question asks about is never your brand, and Cheap Seats then checks the answer's text itself: if your brand's name and aliases appear nowhere in it, the grade is absent whatever the model said.

## Rates and intervals

The run page reports, for each assistant and track, how often your brand was the top pick, recommended, and named, each with a 95% Wilson interval, so a rate from a handful of answers reads as uncertain rather than precise. The share-of-voice board counts every product named across the run's answers: each one's named rate, its true share of voice (which adds up to 100%), and where it comes in the answers. Every formula is in [Metric definitions](../metrics/), and how much a rate can move by chance is in [How big a change Cheap Seats can detect](../noise-and-confidence/).

## Checking a grade

The run page lists every answer behind its rates. For any answer you can read the full text, with the grade's evidence highlighted in it, the searches the assistant ran, every result and page it cited, and the grade with its reasoning. Each run also stores the grading instructions it used, its config commit and the Cheap Seats version, and exports to CSV or JSON.

**The grader is measured, not assumed.** A golden set of real stored answers, each labeled by a person, lives in the Cheap Seats repo (`internal/grade/testdata/golden/`); `CHEAPSEATS_GOLDEN=1 go test ./internal/grade/... -run Golden` grades every record with the real grader and fails under a threshold, and `cheapseats golden export <snapshot.db>` samples a deployment's own answers into the same format for labeling. Any change to the grader passes it first; the [grading doc](https://github.com/cheapseatsdev/cheapseats/blob/main/docs/grading.md) in the repo has the procedure. When the way answers are asked or graded changes, the trend marks the run where it changed rather than joining two methods into one line. A re-graded run says so on its page, with the method it had before.

See [Reading results](../reading-results/) for the run page, and [Configuration](../configuration/) for answerers, models and samples.
