---
title: Cheap Seats
description: Measure recommendations in Claude and OpenAI answers, inspect the evidence, and choose which pages to improve.
preview:
  title: Head-to-heads
  description: Does AI choose Cheap Seats when buyers compare?
  track: Search
  answers: 4
  kind: choice
  recommended: 1
  named: 3
---

## How it works {#how}

{{< figure name="run-pipeline" >}}

## Read the evidence before choosing work {#inside}

Track named and recommended rates with 95% intervals, and share-of-voice rankings over time. Prompt and method changes remain visible. Check quoted answers and sources before acting. Fix briefs name the page, required content, target questions, effort and owner. Later comparable answers can measure change; they do not establish that the fix caused it. [Read a run](/docs/reading-results/) or [ship and measure a fix](/docs/fix-to-pull-request/).

## Who it's for {#who}

For marketing, docs and product messaging teams using direct Claude and OpenAI model responses. Consumer apps are not covered. [Compare alternatives](/compare/) for more engines, managed hosting or client reporting.

## Keep the work in your repo {#yours}

- **MIT-licensed and self-hosted**, with SQLite storage. Run on a [Docker host, Kubernetes or an exe.dev VM](/docs/deploying/).
- **Config in git:** your brand, questions, assistants, budget and schedule in TOML. Preview trend changes with `cheapseats plan`.
- **Web UI, CLI, JSON API and MCP server** for your existing tools and agents.

Prompts and answers go to the services you configure. [Check provider and data boundaries](/docs/self-hosting/#where-your-data-goes) before enabling them.

## Run the example {#start}

**Use Go for subscriptions, or Docker for the quickest API setup.**

| Start here | What you need |
| --- | --- |
| [Go with subscriptions](/docs/getting-started/#go-with-subscriptions) | Go 1.27+ and an installed, logged-in `claude` CLI; `codex` is optional. Calls share your subscription allowance, with no API spend. |
| [Docker with API keys](/docs/getting-started/#docker-with-api-keys) | Docker and an Anthropic API key; an OpenAI key is optional. No Go installation. The release image has no subscription CLIs. |

The example measures Cheap Seats itself. API runs cost money; budgets admit calls against reservations and are not hard billing ceilings. Hosting and optional services may add costs. [Settled charges can exceed estimates](/docs/cost-and-budget/).

[Getting started](/docs/getting-started/) also covers creating your own config from the [template](https://github.com/cheapseatsdev/cheapseats-config-template).
