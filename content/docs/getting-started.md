---
title: Getting started
description: Run the example, create a config for your brand, and check your first results.
weight: 110
group: Start here
---

## What you need

- A checkout of [Cheap Seats](https://github.com/cheapseatsdev/cheapseats) and Go 1.26 or later.
- **Claude, required.** Either the `claude` CLI logged in to a Claude subscription, which answers, grades and writes the fix list with no API key and no API spend, or an `ANTHROPIC_API_KEY`.
- **ChatGPT, optional.** The `codex` CLI logged in to a ChatGPT subscription, or an `OPENAI_API_KEY`, adds a second assistant's answers. An answerer Cheap Seats can't call is skipped.

## Run the example

The repo includes a complete config in `examples/cheapseats-config`, with Cheap Seats itself as the brand, in two versions that differ only in how models are called.

**On your existing subscriptions**, with no additional API spend:

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
go run ./cmd/cheapseats init https://yoursite.com
```

This reads your home page, `/llms.txt` and `/sitemap.xml` and writes `./<brand>-cheapseats-config`: `cheapseats.toml` and five starter prompt sets. It calls no model unless you add `-suggest`, uses only public addresses, and refuses to overwrite existing files.

Review every TODO (`grep -rn TODO` in the new directory). Fill in `audience` and `facts`, and check the guessed name, `about`, category, sites and questions. Settle `about` and `audience` before the first run: changing either starts a new trend. Commit the directory as its own git repo.

See [init options and discovery rules](../reference/#init-options) for a dry run, explicit competitors and suggested prompts.

### Or start from the template

Start a config repo from the [template](https://github.com/cheapseatsdev/cheapseats-config-template), or copy the example, instead.

### Point Cheap Seats at it

```bash
CHEAPSEATS_CONFIG=../your-config/cheapseats.toml go run ./cmd/cheapseats check
CHEAPSEATS_CONFIG=../your-config/cheapseats.toml go run ./cmd/cheapseats serve
```

`cheapseats check` validates the config and every prompt set.

**A free first step: `cheapseats audit`.** Before you ask a single question, check what AI crawlers can read on your sites: robots.txt and firewall blocks per AI bot, llms.txt, the sitemap, and pages that are empty without JavaScript. It calls no model; optional Exa fallback reads can incur page-read charges. See [Free site checks](../site-audit/).

```bash
CHEAPSEATS_CONFIG=../your-config/cheapseats.toml go run ./cmd/cheapseats audit
```

Then:

1. Set your brand, audience and sites. See [Configuration](../configuration/).
2. Write prompt sets of the questions your buyers ask. See [Prompt sets](../prompt-sets/).
3. Run a set from its page, or `go run ./cmd/cheapseats run <set-id>`.
4. Read the run page and the fix list. See [Reading results](../reading-results/).

## Running on your subscriptions

Set answerers to `provider = "claude-code"` or `"codex"`, and the grader and analyst to `provider = "claude-code"`. The CLIs must be installed and logged in on the machine running Cheap Seats; the [subscription example](https://github.com/cheapseatsdev/cheapseats/blob/main/examples/cheapseats-config/cheapseats.subscriptions.toml) supplies this config.

Each call uses an empty temporary directory, disables your local agent configuration and removes API keys from its environment. See [CLI answerers](../reference/#cli-answerers) for the isolation boundaries and separate-user setup.

At most three calls per CLI run at once. A 15-prompt set with two answerers and one sample per track produces 60 answers, plus grading, so expect it to take time and share your subscription's allowance. Check that automated use fits your plans' terms.

Unavailable answerers are listed as skipped. The Docker image has no CLIs; use API providers there, or a [VM](../deploying/#exedev) for subscriptions.
