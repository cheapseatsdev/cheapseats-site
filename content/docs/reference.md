---
title: CLI, API and MCP
description: Every command, JSON route and MCP tool, and how access works.
weight: 70
---

## CLI

```
popcorn serve [-addr 127.0.0.1:3000]   web UI, JSON API, MCP and the daily schedule
popcorn sets                           list prompt sets
popcorn run <set-id>                   run one set and wait for it (costs money)
popcorn report <run-id> [-json]        rates, share of voice and top pages for a run
popcorn fixes <run-id> [-rebuild]      the run's fix list as markdown
popcorn check                          validate the config and every prompt set
popcorn plan <before> [<after>]        what a config change does to trends, for its pull request
popcorn migrate-config [dir]           give each prompt an id, in sets written before ids
popcorn version                        this build's version and database schema
```

From a checkout, run any of them with `go run ./cmd/popcorn <command>`.

## MCP server

`/api/mcp` is an MCP server (Streamable HTTP), so Claude Code, Claude Desktop or any MCP client can list prompt sets, start runs and read the results without the web UI.

```bash
claude mcp add --transport http popcorn https://<host>/api/mcp --header "Authorization: Bearer <token>"
```

| tool               | what it does                                                                    |
| ------------------ | ------------------------------------------------------------------------------- |
| `list_prompt_sets` | the checked-in prompt sets with ids, descriptions and counts                    |
| `get_prompt_set`   | the prompts in one set, and the competitor names the grader folds onto          |
| `start_run`        | start a run over a set (costs money; returns the id)                            |
| `list_runs`        | recent runs with status and headline rates                                      |
| `get_run`          | rates, share of voice, top pages, the fix list, insights, one line per prompt   |
| `get_result`       | one answer in full: text, grade, searches and citations                         |
| `get_quick_wins`   | the ranked fixes, filterable by gap, set and site, each with its Claude prompt  |
| `get_citations`    | every URL linked in an answer across runs, filterable by URL, set and window   |
| `search_probe`     | one query through the answerers' web search tool, returning the exact result    |
| `get_rankings`     | the brand's daily share-of-voice rank and rates per set, with day-over-day change |
| `cancel_run`       | stop an in-progress run                                                         |

## JSON API

| route                                | what it returns                                                       |
| ------------------------------------ | --------------------------------------------------------------------- |
| `GET /api/status`                    | the brand, set count and today's spend against the budget              |
| `GET /api/version`                   | the Popcorn version, config commit and database schema                  |
| `GET /api/progress`                  | runs in progress: answers done, errors, in flight and waiting, per answerer, with time left |
| `GET /api/live`                      | a version stamp that changes whenever a run does, and whether one is in progress |
| `GET /api/sets`, `/api/sets/{id}`    | the checked-in prompt sets                                            |
| `GET /api/runs`                      | runs with headline rates; takes `set` and `limit`                     |
| `POST /api/runs`                     | starts a run over `{"set": "<id>"}` (costs money)                     |
| `GET /api/runs/{id}`                 | one run in full: every answer with its grade and sources, fixes, insights |
| `GET`/`POST /api/runs/{id}/fixes`    | the fix list; POST rebuilds it and the insights (one paid Claude call) |
| `POST /api/runs/{id}/cancel`, `/retry` | stop a run, or finish an unfinished one                             |
| `GET /api/quick-wins`                | the ranked fixes across sets; takes `gap`, `set` and `site` (a url, a kind like `docs`, or `elsewhere`) |
| `GET /api/rankings`                  | daily rank and rates per set; takes `lastDays` and `set`              |
| `GET /api/citations`                 | cited URLs across runs; takes `urlContains`, `lastDays` and `set`     |
| `POST /api/search-probe`             | one search, verbatim; takes `{"query", "allowed_domains"?, "blocked_domains"?}` |

```bash
curl -H "Authorization: Bearer <token>" \
  "https://<host>/api/citations?urlContains=docs.example.com&lastDays=30"
```

`/api/citations` counts each answer that linked a URL once, and returns `runs_scanned` and `answers_scanned` alongside the pages, so a URL missing from the list reads as uncited across that many answers.

`GET /healthz` answers `ok` without a token, for a container's liveness probe.

## Access

With `POPCORN_TOKENS` unset, `serve` only listens on 127.0.0.1 and everything is open. To listen anywhere else, set `POPCORN_TOKENS` (comma-separated, so one can be rotated at a time): every `/api/*` request, MCP included, then needs `Authorization: Bearer <token>`, and the web UI asks for a token once and keeps it in a cookie.

On [exe.dev](../deploying/#exedev), Popcorn instead trusts the proxy's signed-in email header (`POPCORN_AUTH_HEADER`, narrowed by `POPCORN_ALLOWED_EMAILS`). API and MCP clients get through the proxy with an exe.dev token scoped to the VM; see [connecting Claude Code](../deploying/#exedev).

Behind a proxy on the same machine, set `POPCORN_HOSTS` to the host names it serves Popcorn as (comma-separated). MCP refuses a request that reaches Popcorn on loopback under any other name, against DNS rebinding.

## Data and privacy

Prompts and answers are sent to the model providers on every run, and `brand.about` and `brand.facts` go to the grader and analyst, so keep anything private out of them. API keys are masked out of provider error messages before they're logged or stored.
