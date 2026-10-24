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
- `category` is the market in a noun phrase. With `[typesafe]`, the prompt review's off-target question is asked against it; without a category that question isn't asked, since against `about` it would flag every prompt that isn't about this one product. New in 0.4.0.
- `audience` is who asks the questions, for example "a software developer"; the answerers are told so.
- `facts` is a list of public claims the analyst may build fixes on, and that the [fact check](../got-wrong/) reads each answer naming you against.

`brand.about` goes to the grader and analyst, and `brand.facts` to the analyst and the fact check, so keep anything private out of them. Changing `about` or `audience` restarts every trend; changing `facts` restarts none.

## Sites

The brand's websites. Pages on them count as its own; the fix list puts each fix on the site that suits it and assigns it to that site's owner; each run shows which sites the answers drew on, including ones they never reached.

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
- `samples` is how many answers it takes per track (`search` and `recall`) for each prompt.
- `claude-code` and `codex` only work on your own machine or a VM with the CLIs installed. `cheapseats check` notes a subscription answerer whose CLI isn't installed where it's checked, since runs skip it, and fails only when no answerer can run there.

## Shared competitors

```toml
[[competitors]]
name = "Peec AI"
aliases = ["Peec", "peec.ai"]
domains = ["peec.ai"]
```

Competitors the grader folds onto one canonical name in every prompt set, so share of voice counts "Peec" as Peec AI. A set's own `[[competitors]]` adds to the list, and its entry for the same name wins. See [prompt sets](../prompt-sets/#competitors-shared-by-every-set).

- `domains` are the competitor's own sites, each a host (covering its subdomains) or a host/path prefix (`github.com/withgauge`). The run page counts pages on them as that competitor's, in its sources, buckets and outreach list. Like the brand's sites, domains only decide whose pages are whose: they're read from today's config for every run, and adding or changing them changes no trend.

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
# provider = "claude-code"   # on your Claude subscription, through the claude CLI

[analyst]
model = "claude-opus-5-5"
# provider = "claude-code"
```

The grader grades each answer; the analyst writes the fix list and insights, and drafts prompts for `cheapseats suggest-prompts`. By default both go through the Anthropic API, with `ANTHROPIC_API_KEY` or the proxy in `CHEAPSEATS_ANTHROPIC_BASE_URL`. With `provider = "claude-code"` they run on the local `claude` CLI and your Claude subscription instead; with subscription answerers too, Cheap Seats needs no API key at all (`examples/cheapseats-config/cheapseats.subscriptions.toml` is set up that way). The Docker image has no CLIs, so keep the API there. Switching the grader's provider starts a new method on every trend, since answers are graded a different way.

```toml
[grader]
model = "claude-haiku-5-5"
themes = false   # skip the theme pass
```

After each run is graded, one more grader call groups its objections, praise and reasons for losing into a few named **themes**, shown on the run page. It's on by default; `themes = false` turns it off. It changes no rate or trend. `themes` belongs in `[grader]`, not `[analyst]`.

```toml
[grader]
model = "claude-haiku-5-5"
check_facts = false   # skip the fact check
```

With `facts` listed under `[brand]`, each answer that names the brand is read once more after the run, against those facts, for claims that contradict one ([Got wrong about you](../got-wrong/)). One grader call per such answer, from the same budget; nothing on `claude-code`. It's on whenever facts are listed; `check_facts = false` turns it off. It changes no grade or trend, and like `themes` it belongs in `[grader]`.

## Optional providers

```toml
[typesafe]
model = "jev-1.14.0"
# fold_names, cluster_phrases, second_opinions, page_types, fix_matches, prompt_review: on unless false
# min_confidence = 0.7

[exa]
# coverage, baseline, prospects, contents_fallback: on unless false
# results = 3
# baseline_results = 10
# prospect_seeds = 10
# prospect_results = 5
# discover_results = 10
```

Two optional services for jobs the core models do badly or not at all, each off until its table is present and then on in full. Every switch, what each pass adds, where it shows and what it costs are on [Optional providers](../optional-providers/). Keys are `TYPESAFE_API_KEY` and `EXA_API_KEY`, or the proxies `CHEAPSEATS_TYPESAFE_BASE_URL` and `CHEAPSEATS_EXA_BASE_URL` ([Environment](#environment)). Each model needs a `[pricing]` entry (below). Unknown keys are errors, so upgrade the app before adding a switch the running version doesn't know.

## Budget

```toml
[budget]
# Admission budget across every provider attempt. In-flight operations can exceed reservations.
daily_usd = 40.0
reservation_usd = 0.60
concurrency = 6
```

Every API call (API answers, grading, the theme pass, the fix list, prompt suggestions, search probes) reserves an allowance against `budget.daily_usd` in a SQLite ledger before it goes out, and settles to the real cost after. A run that would go over stops with status `budget`; retry it the next day.

This is an admission limit, not a provider billing cap: one call can cost more than its reservation, so set provider-side limits too. Subscription answers are recorded at $0 and don't count against the budget.

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

Cheap Seats reads `.env` at startup; the real environment wins.
