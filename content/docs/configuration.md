---
title: Configuration
description: popcorn.toml, the file that says whose brand Popcorn measures, with which assistants, and how much it may spend.
weight: 20
---

Everything except secrets lives in `popcorn.toml` in your config repo, with the prompt sets in `prompt-sets/` beside it. Secrets (API keys, tokens) come from the environment or `.env`. Unknown keys are errors, so a typo fails `popcorn check` instead of being ignored.

The examples below are from [`examples/popcorn-config/popcorn.toml`](https://github.com/metcalfc/popcorn/blob/main/examples/popcorn-config/popcorn.toml), which measures Popcorn itself.

## Brand

```toml
[brand]
name = "Popcorn"
aliases = ["popcorn.zone", "metcalfc/popcorn"]
# What the product is, so the grader can tell it apart from other things called "popcorn".
about = "Popcorn is an open-source, self-hosted tool that asks AI assistants a brand's buyer questions, grades whether they recommend the brand, and builds a ranked list of fixes."
# Who asks the questions. The answerers are told they're answering this person's question.
# Changing `about` or `audience` changes how answers are asked or graded, so every trend restarts.
audience = "a product marketing lead"
```

- `aliases` are other names the grader counts as the brand.
- `audience` is who asks the questions, for example "a software developer"; the answerers are told so.
- `facts` is a list of public claims the analyst may build fixes on.

`brand.about` and `brand.facts` are sent to the grader and analyst, so keep anything private out of them. Changing `about` or `audience` restarts every trend.

## Sites

The brand's websites. Pages on them count as its own; the fix list puts each fix on the site that suits it and assigns it to that site's owner; each run shows which sites the answers drew on, including ones they never reached.

```toml
[[brand.sites]]
url = "popcorn.zone"
kind = "marketing"
# owner = "web team"

[[brand.sites]]
url = "github.com/metcalfc/popcorn"
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
- `samples` is how many answers it takes per track (`search` and `recall`) for each prompt.
- `claude-code` and `codex` only work on your own machine or a VM with the CLIs installed. `popcorn check` fails on a config whose subscription answerers can't run where it's checked.

## Shared competitors

```toml
[[competitors]]
name = "Peec AI"
aliases = ["Peec", "peec.ai"]
```

Competitors the grader folds onto one canonical name in every prompt set, so share of voice counts "Peec" as Peec AI. A set's own `[[competitors]]` adds to the list, and its entry for the same name wins. See [prompt sets](../prompt-sets/#competitors-shared-by-every-set).

## Grader and analyst

```toml
[grader]
model = "claude-haiku-5-5"
# provider = "claude-code"   # on your Claude subscription, through the claude CLI

[analyst]
model = "claude-opus-5-5"
# provider = "claude-code"
```

The grader grades each answer; the analyst writes the fix list and insights. By default both go through the Anthropic API, with `ANTHROPIC_API_KEY` or the proxy in `POPCORN_ANTHROPIC_BASE_URL`. With `provider = "claude-code"` they run on the local `claude` CLI and your Claude subscription instead; with subscription answerers too, Popcorn needs no API key at all (`examples/popcorn-config/popcorn.subscriptions.toml` is set up that way). The Docker image has no CLIs, so keep the API there. Switching the grader's provider starts a new method on every trend, since answers are graded a different way.

## Budget

```toml
[budget]
# Admission budget across every provider attempt. In-flight operations can exceed reservations.
daily_usd = 40.0
reservation_usd = 0.60
concurrency = 6
```

Every API call (API answers, grading, the fix list, search probes) reserves an allowance against `budget.daily_usd` in a SQLite ledger before it goes out, and settles to the real cost after. A run that would go over stops with status `budget`; retry it the next day.

This is an admission limit, not a provider billing cap: one call can cost more than its reservation, so set provider-side limits too. Subscription answers are recorded at $0 and don't count against the budget.

## Pricing

USD per million tokens; `search_per_1k` is USD per 1,000 web searches. An API answerer whose model has no price in `[pricing]` can't run. Confirm prices against the providers' current price lists before relying on the cost figures.

```toml
[pricing.claude-haiku-5-5]
input = 0.10
output = 0.50
cache_read = 0.01
cache_write = 0.125
search_per_1k = 10.0
```

## Schedule and tiers

```toml
[schedule]
# UTC hour for the daily runs. Leave unset on a dev machine so it doesn't spend money.
# daily_hour_utc = 13

[tiers.core]
every_days = 1

[tiers.plg]
every_days = 7
max_samples = 1
```

Set `schedule.daily_hour_utc` and, from that hour, every `core` set runs every `tiers.core.every_days` days (default 1, daily) and every `plg` set every `tiers.plg.every_days` with one sample, one set after another. Locally it's off unless you set it.

Weekly is usually enough: recall only moves when models change, and search with the web over days to weeks. Daily mostly buys a smoother trend line, at seven times the answers.

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
| `ANTHROPIC_API_KEY` | `anthropic` answerers, and the grader and analyst unless they run on the `claude` CLI or `POPCORN_ANTHROPIC_BASE_URL` is set |
| `POPCORN_ANTHROPIC_BASE_URL` | a base URL for Popcorn's own Anthropic calls, such as a proxy that adds the key ([exe.dev](../deploying/#exedev) integrations); the `claude` CLI doesn't read it, so `claude-code` answerers stay on your subscription |
| `OPENAI_API_KEY` | `openai` answerers |
| `POPCORN_TOKENS` | comma-separated bearer tokens; required to listen beyond 127.0.0.1 |
| `POPCORN_AUTH_HEADER`, `POPCORN_ALLOWED_EMAILS` | trust a signing-in proxy's email header, optionally narrowed to emails or `@domain`s ([exe.dev](../deploying/#exedev)) |
| `POPCORN_HOSTS` | host names a proxy on the same machine serves Popcorn as, comma-separated; MCP refuses loopback requests under any other name |
| `POPCORN_CONFIG` | path to `popcorn.toml`; prompt sets are read from `prompt-sets/` beside it |
| `POPCORN_CONFIG_REV` | the config commit, when the config is deployed without its `.git` |
| `POPCORN_ADDR` | listen address, default `127.0.0.1:3000` |
| `POPCORN_DATA_DIR` | where the database lives, default `data` |

Popcorn reads `.env` at startup; the real environment wins.
