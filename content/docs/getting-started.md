---
title: Getting started
description: Use Docker with API keys or Go with your subscriptions, then configure your brand.
weight: 110
group: Start here
---

## What you need

If AI visibility is new to you, read [what AEO/GEO means and how the workflow works](../understanding-ai-visibility/) first. This page gets the app running; [your first run](../first-run/) explains what to do with its answers.

**Use Go with subscriptions, or Docker for the quickest setup with API keys.**

| How you access models | Setup | What you need |
| --- | --- | --- |
| API keys | [Docker](#docker-with-api-keys) | Docker, Git and an `ANTHROPIC_API_KEY`. `OPENAI_API_KEY` is optional. |
| Claude subscription (ChatGPT optional) | [Go](#go-with-subscriptions) | Go 1.27 or later, Git and the `claude` CLI installed and logged in. The `codex` CLI is optional. |

Claude is required for grading and the fix list; OpenAI adds a second assistant's answers.
The Docker image contains neither subscription CLI. The Go route below uses your subscriptions
without API keys or API spend; calls share your plan's allowance.

## Run the example

Both routes start with Cheap Seats itself as the example brand. Choose one.

### Docker with API keys

Clone the [config template](https://github.com/cheapseatsdev/cheapseats-config-template).
The released image supplies the app; no Go installation or compilation is needed.

```bash
git clone https://github.com/cheapseatsdev/cheapseats-config-template cheapseats-config
cd cheapseats-config
umask 077
printf 'CHEAPSEATS_TOKENS=%s\n' "$(openssl rand -hex 32)" > .env
"${EDITOR:-vi}" .env
```

Keep the generated `CHEAPSEATS_TOKENS` line and add `ANTHROPIC_API_KEY=<your key>` in the editor.
Add `OPENAI_API_KEY=<your key>` if you want OpenAI answers too; otherwise that answerer is skipped.
The template ignores `.env` in git.

Start the container:

```bash
docker run --rm --name cheapseats --stop-timeout 30 \
  -p 127.0.0.1:3000:3000 \
  --env-file .env \
  -v "$PWD:/config:ro" \
  -v cheapseats-data:/data \
  ghcr.io/cheapseatsdev/cheapseats:0.7.1
```

Open <http://127.0.0.1:3000> and sign in with the token from `.env`. The `cheapseats-data` volume
keeps your results after the container stops. Press Ctrl+C to stop it.

**API runs cost money.** Check the model IDs, prices and budget in `cheapseats.toml` before
starting a set. The budget admits calls against estimated reservations; actual charges can
exceed them. See [Cost and budget](../cost-and-budget/).

### Go with subscriptions

With Go 1.27 or later and the `claude` CLI installed and logged in:

```bash
git clone https://github.com/cheapseatsdev/cheapseats
cd cheapseats
CHEAPSEATS_CONFIG=examples/cheapseats-config/cheapseats.subscriptions.toml go run ./cmd/cheapseats serve
```

Open <http://127.0.0.1:3000>, choose a set and run it. The `claude` CLI handles answers, grading
and analysis. An installed, logged-in `codex` CLI adds OpenAI answers; unavailable answerers
are skipped. These calls use your subscription allowances, with no API spend.

This local setup has no sign-in by default: local users and programs can read results and start
runs. See [Access](../reference/#access) for tokens and remote access.

## Measure your own brand

What Cheap Seats asks, and about whom, lives in a config repo of your own, which you can keep private: the brand, answerers, grader, prices, budget and schedule in `cheapseats.toml`, and the prompt sets in `prompt-sets/` beside it.

### Start one from your website: `cheapseats init`

**For the Go/subscription route**, run this from the app checkout:

```bash
go run ./cmd/cheapseats init https://yoursite.com ../your-config
```

This reads your home page, `/llms.txt` and `/sitemap.xml` and writes `../your-config`: `cheapseats.toml` and five starter prompt sets. It calls no model unless you add `-suggest`, uses only public addresses, and refuses to overwrite existing files.

Review every TODO (`grep -rn TODO` in the new directory). Fill in `audience` and `facts`, and check the guessed name, `about`, category, sites and questions. Settle `about` and `audience` before the first run: changing either starts a new trend. Commit the directory as its own git repo.

See [init options and discovery rules](../reference/#init-options) for a dry run, explicit competitors and suggested prompts.

### Or start from the template

**For the Docker/API route**, edit the template you cloned above: replace the example brand
in `cheapseats.toml` and the questions in `prompt-sets/`. Keep its API providers.
The [template](https://github.com/cheapseatsdev/cheapseats-config-template) can be your own private
repo. [Configuration](../configuration/) and [prompt sets](../prompt-sets/) explain the fields.

### Point Cheap Seats at it

**Docker:** from your config checkout, validate it with the released image:

```bash
docker run --rm --env-file .env -v "$PWD:/config:ro" \
  ghcr.io/cheapseatsdev/cheapseats:0.7.1 check
```

Then stop and restart the [Docker command above](#docker-with-api-keys) to load your changes.
It mounts the config read-only; edit the files on your machine.

**Go:** from the app checkout, point the app at your generated config:

```bash
CHEAPSEATS_CONFIG=../your-config/cheapseats.toml go run ./cmd/cheapseats check
CHEAPSEATS_CONFIG=../your-config/cheapseats.toml go run ./cmd/cheapseats serve
```

`cheapseats check` validates the config and every prompt set.

Before asking questions, use **Checks → Site audit** in the web UI to
[check what AI crawlers can read on your sites](../site-audit/). It makes no model calls;
optional Exa fallback reads can cost money.

Then [run a set and read the answers](../first-run/). Leave with a useful decision before choosing work; the [results reference](../reading-results/) maps every view.

## Running on your subscriptions

Set answerers to `provider = "claude-code"` or `"codex"`, and the grader and analyst to `provider = "claude-code"`. The CLIs must be installed and logged in on the machine running Cheap Seats; the [subscription example](https://github.com/cheapseatsdev/cheapseats/blob/main/examples/cheapseats-config/cheapseats.subscriptions.toml) supplies this config.

Each call uses an empty temporary directory, disables your local agent configuration and removes API keys from its environment. See [CLI answerers](../reference/#cli-answerers) for the isolation boundaries and separate-user setup.

At most three calls per CLI run at once. A 15-prompt set with two answerers and one sample per track produces 60 answers, plus grading, so expect it to take time and share your subscription's allowance. Check that automated use fits your plans' terms.

Unavailable answerers are listed as skipped. The Docker image has no CLIs; use API providers there, or a [VM](../deploying/#exedev) for subscriptions.
