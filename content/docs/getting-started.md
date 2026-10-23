---
title: Getting started
description: Run Cheap Seats on your own machine at no cost, on the Claude subscription you already have, then point it at your own brand.
weight: 110
group: Start here
---

## What you need

- A checkout of [Cheap Seats](https://github.com/cheapseatsdev/cheapseats) and Go 1.25 or later.
- **Claude, required.** Either the `claude` CLI logged in to a Claude subscription, which answers, grades and writes the fix list with no API key and no API spend, or an `ANTHROPIC_API_KEY`.
- **ChatGPT, optional.** The `codex` CLI logged in to a ChatGPT subscription, or an `OPENAI_API_KEY`, adds a second assistant's answers. An answerer Cheap Seats can't call is skipped.

## Run the example

The repo includes a complete config in `examples/cheapseats-config`, with Cheap Seats itself as the brand, in two versions that differ only in how models are called.

**On your subscriptions**, at no cost:

```bash
CHEAPSEATS_CONFIG=examples/cheapseats-config/cheapseats.subscriptions.toml go run ./cmd/cheapseats serve
```

**Through the APIs.** `cheapseats.toml` is what Cheap Seats uses when `CHEAPSEATS_CONFIG` isn't set:

```bash
cp .env.example .env              # then fill in ANTHROPIC_API_KEY (and OPENAI_API_KEY, optionally)
go run ./cmd/cheapseats serve
```

Open <http://127.0.0.1:3000>, pick a prompt set and run it. Through the APIs, **runs cost money**: check the model ids and prices in `cheapseats.toml` before the first paid run, and see [Cost and budget](../cost-and-budget/).

With `CHEAPSEATS_TOKENS` unset, `serve` only listens on 127.0.0.1 and everything is open. See [Access](../reference/#access) for listening anywhere else.

## Measure your own brand

What Cheap Seats asks, and about whom, lives in a config repo of your own, which you can keep private: the brand, answerers, grader, prices, budget and schedule in `cheapseats.toml`, and the prompt sets in `prompt-sets/` beside it.

### Start one from your website: `cheapseats init`

```bash
go run ./cmd/cheapseats init https://yoursite.com                  # writes ./<brand>-cheapseats-config
go run ./cmd/cheapseats init yoursite.com ../acme-config -dry-run  # prints what it found and would write
go run ./cmd/cheapseats init yoursite.com -name "Acme" -competitors "Asana,Trello" -suggest
```

It makes three requests, through the same guarded fetcher as the [site audit](../site-audit/) (public addresses only): the home page, `/llms.txt` and `/sitemap.xml`. No model is called unless you pass `-suggest`. From them it works out:

- **Name**: the first of `og:site_name`, `application-name`, a JSON-LD Organization or SoftwareApplication `name`, the part of `<title>` that spells the domain, llms.txt's heading, the domain.
- **About**: the meta description, else `og:description`, the JSON-LD description, llms.txt's summary.
- **Aliases**: the domain, and the name without spaces.
- **Sites**: the host (marketing); `docs.`, `developers.`, `help.`, `blog.` and `community.` subdomains and `/docs`, `/blog`, `/community` paths it finds linked; docs on readthedocs.io or gitbook.io named after the brand; up to three GitHub repositories or owners named after the brand or its domain, as `code`.
- **Category**: what buyers would call the product, from the description ("platform", "app", "database"...). With none, the prompts say "tool" and a TODO says to replace it.

It writes:

```
<brand>-cheapseats-config/
  cheapseats.toml                   brand, sites, competitors; claude-code answerer, grader and
                                 analyst (codex commented out); budget; schedule off
  prompt-sets/
    discovery.toml      core     "What's the best <category> for a small team?" ...
    use-cases.toml      plg      the jobs buyers hire it for (a TODO: use theirs)
    alternatives.toml   plg      "What are good alternatives to <competitor>?" ...
    pricing.toml        plg      cost and value
    head-to-heads.toml  plg      "<brand> vs <competitor>: which should I pick?": the only set
                                 that names the brand
```

| flag | |
| --- | --- |
| `-name X` | the brand's name, instead of what the site calls itself |
| `-competitors a,b` | competitors, comma-separated: `[[competitors]]` entries, alternatives prompts and head-to-heads |
| `-suggest [-n 10]` | add suggested prompts to the starter sets: one analyst call on the `claude` CLI, so nothing on a subscription |
| `-dry-run` | print what it found and every file it would write; write nothing |

The generated files pass `cheapseats check` before they're written. `init` refuses to overwrite a file that exists, and writes nothing if one does. Review every TODO (`grep -rn TODO`): `audience` and `facts` are left for you, and `about` and the category are guesses. Settle `about` and `audience` before the first run, since changing them restarts every trend. Commit the directory as its own git repo.

### Or start from the template

Start a config repo from the [template](https://github.com/cheapseatsdev/cheapseats-config-template), or copy the example, instead.

### Point Cheap Seats at it

```bash
CHEAPSEATS_CONFIG=../your-config/cheapseats.toml go run ./cmd/cheapseats check
CHEAPSEATS_CONFIG=../your-config/cheapseats.toml go run ./cmd/cheapseats serve
```

`cheapseats check` validates the config and every prompt set.

**A free first step: `cheapseats audit`.** Before you ask a single question, check what AI crawlers can read on your sites: robots.txt and firewall blocks per AI bot, llms.txt, the sitemap, and pages that are empty without JavaScript. It calls no model and costs nothing. See [Free site checks](../site-audit/).

```bash
CHEAPSEATS_CONFIG=../your-config/cheapseats.toml go run ./cmd/cheapseats audit
```

Then:

1. Set your brand, audience and sites. See [Configuration](../configuration/).
2. Write prompt sets of the questions your buyers ask. See [Prompt sets](../prompt-sets/).
3. Run a set from its page, or `go run ./cmd/cheapseats run <set-id>`.
4. Read the run page and the fix list. See [Reading results](../reading-results/).

Your prompt sets are plain TOML in your own repo. If you outgrow Cheap Seats, the buyer questions you've refined go with you to whichever tool you move to; see [Compare](/compare/).

## Running on your subscriptions

On your own machine, everything can run through the `claude` and `codex` CLIs, logged in to your Claude and ChatGPT subscriptions, instead of the APIs: answerers with `provider = "claude-code"` or `"codex"`, and the grader and analyst with `provider = "claude-code"`. Each call runs in an empty temp directory with your own CLAUDE.md, hooks, skills, MCP servers and Codex config switched off, keeps no session, and has the API key removed from its environment so it can't bill the API instead.

At most three calls per CLI run at once, since subscriptions are rate limited and share their limit with your own use: a 15-prompt set is 90 answers plus their grades, so expect it to take a while and to use a noticeable share of a day's allowance. Check that automated use fits your plans' terms.

A run uses the answerers this machine can call and lists the rest as skipped. The Docker image has no CLIs, so a deployed Cheap Seats in a container uses the API providers; a VM, such as [exe.dev](../deploying/#exedev), can run the CLIs.
