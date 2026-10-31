---
title: Configuration
description: cheapseats.toml, the file that says whose brand Cheap Seats measures, with which assistants, and how much it may spend.
weight: 120
group: Start here
---

Everything except secrets lives in `cheapseats.toml` in your config repo, with the prompt sets in `prompt-sets/` beside it. Secrets (API keys, tokens) come from the environment or `.env`. Unknown keys are errors, so a typo fails `cheapseats check` instead of being ignored.

The examples below are from [`examples/cheapseats-config/cheapseats.toml`](https://github.com/cheapseatsdev/cheapseats/blob/main/examples/cheapseats-config/cheapseats.toml), which measures Cheap Seats itself.

## Brand

```toml
[brand]
name = "Cheap Seats"
aliases = ["CheapSeats", "cheapseats.dev", "cheapseatsdev/cheapseats"]
# What the product is, so the grader can tell it apart from other things called "cheapseats".
about = "Cheap Seats is an open-source, self-hosted tool that asks AI assistants a brand's buyer questions, grades whether they recommend the brand, and builds a ranked list of fixes."
# The market, as a noun phrase: what a prompt should be about, as opposed to what this one product is.
category = "AI search visibility tools, which measure whether AI assistants recommend a brand"
# Who asks the questions. The answerers are told they're answering this person's question.
# Changing `about` or `audience` changes how answers are asked or graded, so every trend restarts.
audience = "a product marketing lead"
```

- `aliases` are other names the grader counts as the brand.
- `category` names the market. Jev uses it for off-target prompt checks; without it, those checks are skipped.
- `audience` is who asks the questions, for example "a software developer"; the answerers are told so.
- `facts` is a list of public claims the analyst may build fixes on, and that the [fact check](../got-wrong/) reads each answer naming you against.

`brand.about` goes to the grader and analyst, and `brand.facts` to the analyst and the fact check, so keep anything private out of them. Changing `about` or `audience` restarts every trend; changing `facts` restarts none.

## Advisory brief

Use `[brand.advisory]` for optional positioning, goals and deliberate product
boundaries that guide advice and prompt curation. Keep public identity and claims
in `brand.about` and `brand.facts`. Buyer answerers and graders do not receive
the advisory brief; advisory providers do. See [the fields and privacy boundary](../reference/#advisory-brief)
and [Next steps](../reading-results/#quick-wins). The table requires 0.6.0 or later.

## Sites

List your sites to identify your pages, assign fixes to owners, and see which sites assistants use or miss.

```toml
[[brand.sites]]
url = "cheapseats.dev"
kind = "marketing"
# owner = "web team"

[[brand.sites]]
url = "github.com/cheapseatsdev/cheapseats"
kind = "code"
```

- `url` is a host or host/path. A host covers its subdomains unless they're listed themselves; a host/path covers that prefix.
- `kind` is one of `marketing`, `docs`, `blog`, `community`, `code` or `other`.
- `owner` is optional. Fixes on a site without one go to `[owners]`.
- A bare `domains` list works too. Adding or changing sites never restarts a trend.

## Answerers

Every assistant that answers, one `[[answerers]]` entry each:

```toml
[[answerers]]
id = "claude-opus"
name = "Claude Opus"
provider = "anthropic"
model = "claude-opus-5-5"
samples = { search = 2, recall = 1 }
```

`provider` decides how it answers and who pays:

| provider      | answers through                                      | billed                     |
| ------------- | ---------------------------------------------------- | -------------------------- |
| `claude-code` | your local `claude` CLI, logged in (`claude /login`) | your Claude subscription   |
| `codex`       | your local `codex` CLI, logged in (`codex login`)    | your ChatGPT subscription  |
| `anthropic`   | the API, with `ANTHROPIC_API_KEY`                    | per token                  |
| `openai`      | the API, with `OPENAI_API_KEY`                       | per token                  |

- Results and rankings key on `id`: never reuse an id for a different model; add a new answerer instead.
- `name` is an optional display name.
- `samples` is how many answers it takes per track (`search` and `recall`) for each prompt: 0 to 20 each, with at least one across the two.
- `claude-code` and `codex` only work on your own machine or a VM with the CLIs installed. `cheapseats check` notes a subscription answerer whose CLI isn't installed where it's checked, since runs skip it, and fails only when no answerer can run there.

## Shared competitors

```toml
[[competitors]]
name = "Peec AI"
aliases = ["Peec", "peec.ai"]
domains = ["peec.ai"]
```

Shared aliases fold competitor spellings onto one share-of-voice row. A set adds its own competitors; its entry for the same name wins. See [Prompt sets](../prompt-sets/#competitors-shared-by-every-set).

`domains` identifies the competitor's sites: a host covers subdomains; a host/path covers that prefix. Reports use today's domain config to assign page ownership, including for old runs. Changing domains does not restart trends.

## Sources

The run page sorts every page the answers drew on into a kind of site: `own` (the brand's sites), `competitor` (their `domains`), then `ugc`, `review`, `reference`, `institutional` or `editorial` from a built-in list ([Metric definitions](../metrics/#sources) has it). Move a host to another kind here:

```toml
[sources]
ugc = ["community.example.com"]
editorial = ["medium.com"]   # instead of ugc
review = ["example.com/reviews"]
```

- The keys are `ugc`, `review`, `reference`, `institutional` and `editorial`.
- `[sources]` wins over the built-in list, the most specific entry wins, and a host may be in only one class.
- With `[typesafe]` and `page_types` on, a third-party host the list calls `editorial` is classed by Jev once; `[sources]` still wins over Jev ([Optional providers](../optional-providers/)).
- The brand's sites are always `own` and competitors' domains always `competitor`, whatever `[sources]` says. Changing it changes no trend.

## Grader and analyst

```toml
[grader]
model = "claude-haiku-5-5"
# provider = "claude-code"  # default: anthropic
# themes = false           # skip the theme pass (on by default)
# check_facts = false      # skip fact checks when [brand] facts are listed

[analyst]
model = "claude-opus-5-5"
# provider = "claude-code"
```

The grader scores every answer. The analyst writes fixes and insights, and drafts prompt suggestions. Both default to the Anthropic API, using `ANTHROPIC_API_KEY` or `CHEAPSEATS_ANTHROPIC_BASE_URL`; `provider = "claude-code"` uses your logged-in local Claude CLI instead. The Docker image has no CLIs. Changing the grader's provider starts a new method.

Two optional grader passes run after grading:

- **Themes:** one call groups objections, praise and reasons for losing. Set `themes = false` to skip it.
- **[Fact check](../got-wrong/):** when `[brand] facts` is present, one call per answer naming you checks for contradictions. Set `check_facts = false` to skip it.

Both use the grader's provider and cost $0 API spend on `claude-code`. Neither changes grades or trends. Their switches belong in `[grader]`, not `[analyst]`.

## Optional providers

Add `[typesafe]` for Jev's typed judgments or `[exa]` for a separate search index and fallback page reads. Each table enables its switches by default. [Optional providers](../optional-providers/#turning-them-on) has the full config, prices, keys and switches; omit the tables to leave them off.

## Budget

```toml
[budget]
# Admission budget across every provider attempt. In-flight operations can exceed reservations.
daily_usd = 40.0
reservation_usd = 0.60
concurrency = 6
```

`concurrency` is 1 to 64 calls in flight (unset means 4). Every billable attempt reserves an allowance in the SQLite ledger before it starts, then settles to known usage. If a new reservation won't fit, the call is refused; a run stopped as `budget` keeps completed work and can be retried the next UTC day. Unknown or cancelled attempts retain at least their reservation.

This is an admission limit, not a provider billing cap: actual costs, including calls already in flight, can exceed reservations. Set provider-side limits too. Subscription calls in any role are recorded at $0. See [Cost and budget](../cost-and-budget/#the-daily-budget).

## Sampling

```toml
[sampling]
adaptive = true
max_extra = 12
```

Adaptive sampling gives each run of a `core` set up to `max_extra` extra answers, for the prompts whose named rate has been least certain over the last 28 days of runs asked and graded the same way. It's all decided before the run starts, a cell gets at most as many extras as it has planned samples, and extras on API answerers have to fit in what's left of today's budget.

- Off by default. `adaptive = true` needs `max_extra` (1 to 1000).
- It never starts a trend over: extras don't change the method.
- Extras count in the run's rates like any other answer, so those prompts weigh a little more in its totals. Trends count each prompt once either way.

See [How big a change Cheap Seats can detect](../noise-and-confidence/#when-more-samples-help).

## Pricing

USD per million tokens; `search_per_1k` is USD per 1,000 web searches and `page_per_1k` USD per 1,000 pages read. An API answerer whose model has no price in `[pricing]` can't run, and neither can an optional provider's pass. Confirm prices against the providers' current price lists before relying on the cost figures.

```toml
[pricing.claude-haiku-5-5]
input = 0.10
output = 0.50
cache_read = 0.01
cache_write = 0.125
search_per_1k = 10.0

[pricing."jev-1.14.0"]      # TypeSafe: input only
input = 0.042

[pricing.exa-search]
search_per_1k = 4.0

[pricing.exa-contents]      # a page read through Exa, only when plain HTTP got an empty shell
page_per_1k = 1.0
```

## Schedule and tiers

```toml
[schedule]
# UTC hour for the daily runs. Leave unset on a dev machine so it doesn't spend money.
# daily_hour_utc = 13

[tiers.core]
every_days = 2

[tiers.plg]
every_days = 7
max_samples = 1
```

Set `schedule.daily_hour_utc` and, from that hour, every `core` set runs every `tiers.core.every_days` days (default 1, daily) and every `plg` set every `tiers.plg.every_days` with `max_samples` a track (default 1, at most 20), one set after another. Locally it's off unless you set it.

Weekly runs use one-seventh the answers of daily runs. Choose the cadence for how soon you need to detect changes; either track can vary between runs.

## Owners

```toml
[owners]
# Who picks up each kind of fix. Unlisted gaps go to `default`.
default = ""
# by_gap = { documentation = "", positioning = "", "third-party" = "", product = "" }
```

A fix goes to its site's owner, else to the owner for its gap here, else `default`.

## Environment

| variable | what it does |
| --- | --- |
| `ANTHROPIC_API_KEY` | `anthropic` answerers, and the grader and analyst unless they run on the `claude` CLI or `CHEAPSEATS_ANTHROPIC_BASE_URL` is set |
| `CHEAPSEATS_ANTHROPIC_BASE_URL` | a base URL for Cheap Seats' own Anthropic calls, such as a proxy that adds the key ([exe.dev](../deploying/#exedev) integrations); the `claude` CLI doesn't read it, so `claude-code` answerers stay on your subscription |
| `OPENAI_API_KEY` | `openai` answerers |
| `TYPESAFE_API_KEY`, `EXA_API_KEY` | the [optional providers](../optional-providers/), only with `[typesafe]` or `[exa]` in the config; or a key-adding proxy in `CHEAPSEATS_TYPESAFE_BASE_URL` or `CHEAPSEATS_EXA_BASE_URL` |
| `CHEAPSEATS_TOKENS` | comma-separated bearer tokens; required to listen beyond 127.0.0.1 |
| `CHEAPSEATS_AUTH_HEADER`, `CHEAPSEATS_ALLOWED_EMAILS` | trust a signing-in proxy's email header, optionally narrowed to emails or `@domain`s ([exe.dev](../deploying/#exedev)) |
| `CHEAPSEATS_HOSTS` | host names a proxy on the same machine serves Cheap Seats as, comma-separated; MCP (and, with no sign-in, everything) refuses loopback requests under any other name, and forms from any other origin are refused |
| `CHEAPSEATS_PUBLIC_URL` | the address [share links](../sharing/) use, such as `https://cheapseats.example.com`. Unset, they use the first of `CHEAPSEATS_HOSTS` over https, else the host the request came in on (`X-Forwarded-Host` first) |
| `CHEAPSEATS_READONLY` | set to anything for a [read-only copy](../read-only-copy/): serves pages and the JSON API to anyone, refuses every change and MCP, runs nothing |
| `CHEAPSEATS_CLI_USER` | a user to run the `claude` and `codex` CLIs as, through `sudo`, so nothing a model-driven tool can reach includes this user's files ([CLI answerers](../reference/#cli-answerers)); the exe.dev deploy sets it |
| `CHEAPSEATS_CLI_ENV` | more environment variables to pass the CLIs, comma-separated; by default they get only what they need, never this process's keys or tokens |
| `CHEAPSEATS_CONFIG` | path to `cheapseats.toml`; prompt sets are read from `prompt-sets/` beside it |
| `CHEAPSEATS_PROMPT_SETS` | read the prompt sets from this directory instead |
| `CHEAPSEATS_CONFIG_REV` | the config commit, when the config is deployed without its `.git` |
| `CHEAPSEATS_ADDR` | listen address, default `127.0.0.1:3000` |
| `CHEAPSEATS_DATA_DIR` | where the database lives, default `data` |
| `CHEAPSEATS_DEBUG` | set to anything for debug logging |

Cheap Seats reads `.env` in the working directory at startup; the real environment wins. Keys and `CHEAPSEATS_TOKENS` load from it. Variables that redirect requests or change sign-in don't: a `.env` line setting a `*_BASE_URL`, a proxy or certificate variable, `CHEAPSEATS_CLI_ENV`, `CHEAPSEATS_AUTH_HEADER`, `CHEAPSEATS_ALLOWED_EMAILS`, or a variable that loads code at startup (`LD_*`, `NODE_OPTIONS`...) is ignored with a warning. Export those in the real environment.
