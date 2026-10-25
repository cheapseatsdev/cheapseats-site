---
title: Find out if ChatGPT recommends your product
description: "Find out whether ChatGPT recommends your product in about 15 minutes: buyer questions as a prompt set, a grade on each answer, and why checking by hand fails."
weight: 40
---

Ask your buyers' questions several times in a clean context, with and without search. Grade each answer **recommended**, **mentioned** or **absent**, and keep what it chose instead. One personalized chat isn't a representative sample.

Cheap Seats automates this with OpenAI models through the API or `codex` CLI. Those calls don't reproduce the consumer ChatGPT app's memory, personalization or shopping features. It also asks Claude; it doesn't cover Perplexity, Gemini or Google AI Overviews.

## Why not just ask ChatGPT yourself?

ChatGPT can personalize answers using memory about you and your product. For a cleaner baseline, use fresh contexts and keep the date, model, search mode and target market consistent. See [OpenAI's memory explanation](https://help.openai.com/en/articles/8590148-memory-in-chatgpt).

Repeat each question, separate search from recall, and grade consistently. Cheap Seats stores the answers and sources behind the resulting rates.

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

ChatGPT is OpenAI's product, so Cheap Seats asks OpenAI's models. These are OpenAI-model answers, rather than recordings of the ChatGPT app. Claude is also required to grade them.

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

**Or on the subscriptions you already have**, on your own machine, with the `codex` CLI logged in to ChatGPT and the `claude` CLI logged in to Claude: `provider = "codex"` and `provider = "claude-code"` for answerers. Configure the grader and analyst with `provider = "claude-code"` too for a setup without API keys. These CLIs must be installed locally; they aren't in the Docker image. Subscription calls add no API charge; subscription usage limits still apply. See [Cost, API keys and the daily budget](/docs/cost-and-budget/#your-own-api-keys-or-your-own-subscriptions).

`samples = { search = 2, recall = 1 }` asks each question twice with web search forced on and once with no tools, so you get both what the web says about you today and what the model already believes. See [Which AI engines Cheap Seats asks](/docs/engines/).

## Step 3: set a daily budget and run

For API calls, set an admission budget before the first run:

```toml
[budget]
daily_usd = 10.0
```

Before an API call, Cheap Seats reserves estimated spend against the UTC day's budget; actual cost settles afterward and can exceed the reservation. If admission stops the run, finished work is kept. For the API-key setup, check and run with Docker:

```bash
docker run --rm --env-file .env -v cheapseats-data:/data -v "$PWD/your-config:/config:ro" \
  ghcr.io/cheapseatsdev/cheapseats:0.4.5 check
docker run --rm --env-file .env -v cheapseats-data:/data -v "$PWD/your-config:/config:ro" \
  ghcr.io/cheapseatsdev/cheapseats:0.4.5 run discovery
```

For local subscription CLIs, run from a checkout: `CHEAPSEATS_CONFIG=../your-config/cheapseats.toml go run ./cmd/cheapseats run discovery`. With 15 prompts and the samples above, two answerers produce 90 answers. [Cost and budget](/docs/cost-and-budget/) has measured costs. `cheapseats serve` opens the web UI at `127.0.0.1:3000`; scheduling also requires the tier cadence in your config.

## Step 4: read the grade for each question

Every answer gets a verdict from a second model, the grader, with a sentence from the answer supporting the grade:

| verdict | meaning |
| --- | --- |
| `recommended` | the answer's top pick, or one of at most three primary recommendations it actively endorses |
| `mentioned` | named, but only as one option among many, in passing, or with reservations |
| `absent` | not named at all, aliases included, or named only to say the answer can't find or verify it |

Alongside the verdict: your **position** in the answer, the answer's **top pick**, every product it **named** in order (that's the share-of-voice board), the **objections** it raised about you, its **tone**, and the grader's reasoning. The run page shows every prompt against every answerer and track, the rates with 95% intervals, who the answers picked instead, and their returned pages and citations. [Mentioned vs. recommended](/guides/mentioned-vs-recommended/) explains the metrics; [How grading works](/docs/how-grading-works/) has the rules.

## A graded answer

One recorded answer to prompt 3 of *Finding out whether AI assistants recommend us*, asked of `gpt-6.1-sol` through `codex` on the search track, 22 October 2026:

| | |
| --- | --- |
| **verdict** | `absent` |
| **named** | ChatGPT, Peec AI, Otterly.AI, Profound |
| **top pick** | none: the answer shortlists three tools without choosing one |
| **grader's reasoning** | "The answer never names Cheap Seats, CheapSeats, or any alias; it only recommends Peec AI, OtterlyAI, and Profound as monitoring tools." |
| **searches** | 2, every result URL kept; the answer cited 4 of them |
| **cost** | $0.0013 to grade; $0 to answer, on the subscription |

This OpenAI-model answer pointed to three other tools and omitted us. Its stored citations show where to investigate next.

For contrast, an answer graded `recommended`, from our *head to heads* set the same day, where the OpenAI model on the recall track was asked to choose between us and Semrush AI Toolkit:

| | |
| --- | --- |
| **verdict** | `recommended`, position 1, top pick |
| **evidence** | "I'd lean toward Cheap Seats for a focused ChatGPT-and-Claude tracking need, provided it demonstrates reliable coverage of both." |
| **objections** | coverage of ChatGPT and Claude unverified; uncertain about product capabilities |
| **tone** | mixed |

The objections are the useful part: the answer recommended us while saying it couldn't verify what we do, which is a documentation gap with a page name on it.

## What tools track how often AI assistants mention a brand?

For broader engine coverage, hosted options documented in October 2026 include [Peec AI](/compare/peec-ai/), [Profound](/compare/profound/), [Otterly.AI](/compare/otterly-ai/), [Gauge](/compare/gauge/) and [Semrush AI Toolkit](/compare/semrush-ai-toolkit/); [AI visibility tools compared](/blog/ai-visibility-tools-compared/) puts them in one table. Check their current coverage if your buyers use engines Cheap Seats doesn't ask.

## Then what

Run the set weekly, on the built-in schedule. One run is a snapshot; repeated comparable runs help assess a change, and [How many runs to trust AI visibility](/blog/how-many-runs-to-trust-ai-visibility/) says how many answers that takes. Each run's fix list names the page to write or change, what it must say, and the prompts it should flip; [From fix to pull request](/docs/fix-to-pull-request/) takes one from the list to a merged page.
