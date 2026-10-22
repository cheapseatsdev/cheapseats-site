---
title: Getting started
description: Run Popcorn on your own machine at no cost, on the Claude subscription you already have, then point it at your own brand.
weight: 10
---

## What you need

- A checkout of [Popcorn](https://github.com/metcalfc/popcorn) and Go 1.25 or later.
- **Claude, required.** Either the `claude` CLI logged in to a Claude subscription, which answers, grades and writes the fix list with no API key and no API spend, or an `ANTHROPIC_API_KEY`.
- **ChatGPT, optional.** The `codex` CLI logged in to a ChatGPT subscription, or an `OPENAI_API_KEY`, adds a second assistant's answers. An answerer Popcorn can't call is skipped.

## Run the example

The repo includes a complete config in `examples/popcorn-config`, with Popcorn itself as the brand, in two versions that differ only in how models are called.

**On your subscriptions**, at no cost:

```bash
POPCORN_CONFIG=examples/popcorn-config/popcorn.subscriptions.toml go run ./cmd/popcorn serve
```

**Through the APIs.** `popcorn.toml` is what Popcorn uses when `POPCORN_CONFIG` isn't set:

```bash
cp .env.example .env              # then fill in ANTHROPIC_API_KEY (and OPENAI_API_KEY, optionally)
go run ./cmd/popcorn serve
```

Open <http://127.0.0.1:3000>, pick a prompt set and run it. Through the APIs, **runs cost money**: check the model ids and prices in `popcorn.toml` before the first paid run, and see [Cost and budget](../cost-and-budget/).

With `POPCORN_TOKENS` unset, `serve` only listens on 127.0.0.1 and everything is open. See [Access](../reference/#access) for listening anywhere else.

## Measure your own brand

What Popcorn asks, and about whom, lives in a config repo of your own, which you can keep private: the brand, answerers, grader, prices, budget and schedule in `popcorn.toml`, and the prompt sets in `prompt-sets/` beside it.

Start a config repo from the [template](https://github.com/metcalfc/popcorn-config-template) (or copy the example), and point Popcorn at it:

```bash
POPCORN_CONFIG=../your-config/popcorn.toml go run ./cmd/popcorn check
POPCORN_CONFIG=../your-config/popcorn.toml go run ./cmd/popcorn serve
```

`popcorn check` validates the config and every prompt set. Then:

1. Set your brand, audience and sites. See [Configuration](../configuration/).
2. Write prompt sets of the questions your buyers ask. See [Prompt sets](../prompt-sets/).
3. Run a set from its page, or `go run ./cmd/popcorn run <set-id>`.
4. Read the run page and the fix list. See [Reading results](../reading-results/).

Your prompt sets are plain TOML in your own repo. If you outgrow Popcorn, the buyer questions you've refined go with you to whichever tool you move to; see [Compare](/compare/).

## Running on your subscriptions

On your own machine, everything can run through the `claude` and `codex` CLIs, logged in to your Claude and ChatGPT subscriptions, instead of the APIs: answerers with `provider = "claude-code"` or `"codex"`, and the grader and analyst with `provider = "claude-code"`. Each call runs in an empty temp directory with your own CLAUDE.md, hooks, skills, MCP servers and Codex config switched off, keeps no session, and has the API key removed from its environment so it can't bill the API instead.

At most three calls per CLI run at once, since subscriptions are rate limited and share their limit with your own use: a 15-prompt set is 90 answers plus their grades, so expect it to take a while and to use a noticeable share of a day's allowance. Check that automated use fits your plans' terms.

A run uses the answerers this machine can call and lists the rest as skipped. The Docker image has no CLIs, so a deployed Popcorn in a container uses the API providers; a VM, such as [exe.dev](../deploying/#exedev), can run the CLIs.
