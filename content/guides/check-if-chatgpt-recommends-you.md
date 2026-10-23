---
title: Find out if ChatGPT recommends your product
description: "Find out whether ChatGPT recommends your product in about 15 minutes: buyer questions as a prompt set, a grade on each answer, and why checking by hand fails."
weight: 40
---

**The short answer.** Ask ChatGPT your buyers' questions, the ones that don't name you, several times each in a clean context, with web search and without, and grade every answer: did it recommend your product, mention it in passing, or leave it out, and what did it pick instead? Doing that by hand in the ChatGPT app gives you a skewed sample, because ChatGPT remembers you and personalises its answers. [Cheap Seats](/docs/getting-started/) does it for you: 10 to 20 buyer questions in a TOML file, your own OpenAI and Anthropic keys or your ChatGPT and Claude subscriptions, a daily spending cap, and for each question a **recommended**, **mentioned** or **absent** grade with your position, the answer's top pick and every product it named. First run in about 15 minutes; the walkthrough below is the whole setup.

Two things to know first. Cheap Seats asks OpenAI's models directly, through the API or the `codex` CLI, so you see what the model says when nothing about you is in the conversation; the consumer ChatGPT app adds memory, personalisation and shopping features on top, and those differ by user. And it asks OpenAI and Claude models only, not Perplexity, Gemini or Google AI Overviews; the [tools that do](#what-tools-track-how-often-ai-assistants-mention-a-brand) are at the end.

## Why not just ask ChatGPT yourself?

Because the answer you get is yours, not your buyers'. ChatGPT's memory carries what it knows about you across chats, including that you work on your product, and personalises answers accordingly. We asked ChatGPT itself, through the `codex` CLI with web search on, "How can I find out whether ChatGPT recommends my product when people ask about my category?" Its own advice, from the run on 22 October 2026:

> Run each question several times in fresh chats. Disable personalization for a cleaner baseline. Record the date, model or mode, target market, and whether web search was used. Keep these conditions consistent when comparing results. ChatGPT's memory can influence answers and search queries.

It linked [OpenAI's explanation of memory](https://help.openai.com/en/articles/8590148-memory-in-chatgpt) for that last point. It then recommended three hosted tools, and closed with "start with a spreadsheet and 25 buyer questions for two weeks."

That spreadsheet is the hard part. Each question needs several answers, because one answer is weak evidence; the answers with web search and without are different measurements; each answer needs grading the same way every time; and the sources each answer read are the only way to find out why a competitor won. Cheap Seats is that spreadsheet, filled in by the models themselves and kept with every answer behind every number.

## Step 1: write 10 to 20 buyer questions as a prompt set

The questions are a TOML file in a config repo of your own. Ask the way a buyer would, and don't name your product: being named when the question names you proves little.

```toml
id = "discovery"
name = "Finding a tool like ours"
tier = "core"
description = """What the category is and who competes in it."""

[[prompts]]
id = "best-for-small-team"
text = "What's the best <category> for a small team?"

[[prompts]]
id = "alternatives-to-competitor"
text = "What are good alternatives to <competitor>?"

[[prompts]]
id = "how-to-choose"
text = "How do I choose a <category>, and what should I compare?"
intent = "info"    # asks to explain, not to choose: scored on named, not recommended
```

`cheapseats init https://yoursite.com` writes a starter config repo from your website, with five prompt sets like this and your brand, sites and competitors filled in, and nothing is asked until you run a set. See [Prompt sets](/docs/prompt-sets/) for the format and [Getting started](/docs/getting-started/#start-one-from-your-website-cheapseats-init) for `init`.

## Step 2: choose how ChatGPT answers

ChatGPT is OpenAI's product, so Cheap Seats asks OpenAI's models. Either way below gives you ChatGPT-side answers; Claude is required as well, because a Claude model grades every answer.

**Through the APIs**, with your own keys in `.env`:

```bash
ANTHROPIC_API_KEY=...   # grading, the fix list, and a Claude answerer
OPENAI_API_KEY=...      # the ChatGPT-side answerer
```

```toml
[[answerers]]
id = "chatgpt"
name = "ChatGPT"
provider = "openai"
model = "gpt-6.1-sol"
samples = { search = 2, recall = 1 }

[[answerers]]
id = "claude"
name = "Claude"
provider = "anthropic"
model = "claude-opus-5-5"
samples = { search = 2, recall = 1 }
```

**Or on the subscriptions you already have**, on your own machine, with the `codex` CLI logged in to ChatGPT and the `claude` CLI logged in to Claude: `provider = "codex"` and `provider = "claude-code"` instead, and no API key at all. Answers then cost nothing extra; see [Cost, API keys and the daily budget](/docs/cost-and-budget/#your-own-api-keys-or-your-own-subscriptions).

`samples = { search = 2, recall = 1 }` asks each question twice with web search forced on and once with no tools, so you get both what the web says about you today and what the model already believes. See [Which AI engines Cheap Seats asks](/docs/engines/).

## Step 3: set a daily budget and run

Through the APIs, runs cost money, so cap it before the first one:

```toml
[budget]
daily_usd = 10.0
```

Every API call is checked against today's spend before it goes out, and a run that would go over stops and keeps what it finished. Then check the config and run the set, with Docker:

```bash
docker run --rm --env-file .env -v cheapseats-data:/data -v "$PWD/your-config:/config:ro" \
  ghcr.io/cheapseatsdev/cheapseats:0.4.2 check
docker run --rm --env-file .env -v cheapseats-data:/data -v "$PWD/your-config:/config:ro" \
  ghcr.io/cheapseatsdev/cheapseats:0.4.2 run discovery
```

or from a checkout, `CHEAPSEATS_CONFIG=../your-config/cheapseats.toml go run ./cmd/cheapseats run discovery`. A 15-prompt set with these two answerers is 90 answers; graded with Claude Haiku, grading cost us about three cents for 68 answers, and the answering is a few dollars through the APIs or $0 on subscriptions. [Cost, API keys and the daily budget](/docs/cost-and-budget/) has the measured figures. `cheapseats serve` gives you the web UI at `127.0.0.1:3000` with a Run button per set, and a weekly schedule once you set `schedule.daily_hour_utc`.

## Step 4: read the grade for each question

Every answer gets a verdict from a second model, the grader, with the sentence of the answer that proves it:

| verdict | meaning |
| --- | --- |
| `recommended` | the answer's top pick, or one of at most three primary recommendations it actively endorses |
| `mentioned` | named, but only as one option among many, in passing, or with reservations |
| `absent` | not named at all, aliases included |

Alongside the verdict: your **position** in the answer, the answer's **top pick**, every product it **named** in order (that's the share-of-voice board), the **objections** it raised about you, its **tone**, and the grader's reasoning. The run page shows every prompt against every answerer and track, the rates with 95% intervals, who the answers picked instead, and which pages they read first. [Mentioned vs. recommended](/guides/mentioned-vs-recommended/) explains the metrics; [How grading works](/docs/how-grading-works/) has the rules.

## A graded answer

The ChatGPT answer quoted above, as Cheap Seats recorded it. The question was prompt 3 of our *Finding out whether AI assistants recommend us* set, asked of `gpt-6.1-sol` through the `codex` CLI on the search track:

| | |
| --- | --- |
| **verdict** | `absent` |
| **named** | ChatGPT, Peec AI, Otterly.AI, Profound |
| **top pick** | none: the answer shortlists three tools without choosing one |
| **grader's reasoning** | "The answer never names Cheap Seats, CheapSeats, or any alias; it only recommends Peec AI, OtterlyAI, and Profound as monitoring tools." |
| **searches** | 2, every result URL kept; the answer cited 4 of them |
| **cost** | $0.0013 to grade; $0 to answer, on the subscription |

So on that day, a buyer asking ChatGPT how to check whether ChatGPT recommends them was pointed at three other tools and never at us, and the run tells us which pages ChatGPT read to get there. That's the fix list's job next.

For contrast, an answer graded `recommended`, from our *head to heads* set the same day, where ChatGPT on the recall track was asked to choose between us and Semrush AI Toolkit:

| | |
| --- | --- |
| **verdict** | `recommended`, position 1, top pick |
| **evidence** | "I'd lean toward Cheap Seats for a focused ChatGPT-and-Claude tracking need, provided it demonstrates reliable coverage of both." |
| **objections** | coverage of ChatGPT and Claude unverified; uncertain about product capabilities |
| **tone** | mixed |

The objections are the useful part: the answer recommended us while saying it couldn't verify what we do, which is a documentation gap with a page name on it.

## What tools track how often AI assistants mention a brand?

Cheap Seats is the free, open-source one: it asks Claude and OpenAI models, grades recommended, mentioned or absent, keeps every answer and citation, and ends each run with a ranked fix list, on your own machine or host. It does not ask Perplexity, Gemini, Microsoft Copilot or Google AI Overviews. Hosted tools that cover more engines, as of October 2026 from their own pages: [Peec AI](/compare/peec-ai/), [Profound](/compare/profound/), [Otterly.AI](/compare/otterly-ai/), [Gauge](/compare/gauge/) and [Semrush AI Toolkit](/compare/semrush-ai-toolkit/); [AI visibility tools compared](/blog/ai-visibility-tools-compared/) puts them in one table. If your buyers ask Perplexity or Google, one of those is the right tool, or the second tool next to this one.

## Then what

Run the set weekly, on the built-in schedule. One run is a snapshot; the trend is what tells you whether a change worked, and [How many runs to trust AI visibility](/blog/how-many-runs-to-trust-ai-visibility/) says how many answers that takes. Each run's fix list names the page to write or change, what it must say, and the prompts it should flip; [From fix to pull request](/docs/fix-to-pull-request/) takes one from the list to a merged page.
