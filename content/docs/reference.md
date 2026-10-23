---
title: CLI, API and MCP
description: Every command, JSON route and MCP tool, and how access works.
weight: 450
group: Running it
---

## CLI

```
cheapseats init [-name X] [-competitors a,b] [-suggest [-n 10]] [-dry-run] <url> [dir]
                                       a new config repo from the brand's website (free unless -suggest)
cheapseats serve [-addr 127.0.0.1:3000]   web UI, JSON API, MCP and the daily schedule
cheapseats sets                           list prompt sets
cheapseats run <set-id>                   run one set and wait for it (costs money)
cheapseats report <run-id> [-json]        rates, share of voice and top pages for a run
cheapseats fixes <run-id> [-rebuild]      the run's fix list as markdown
cheapseats themes <run-id> [-rebuild]     net sentiment and the run's themes; -rebuild runs the theme pass again (one grader call)
cheapseats suggest-prompts <set-id> [-n 10]  new buyer questions for a set, as TOML to paste (one analyst call; writes nothing)
cheapseats regrade [-since 28d] [-dry-run=false] <set-id|run-id>
                                       grade stored answers again with today's grader, brand and competitors;
                                       a dry run with its cost unless -dry-run=false
cheapseats review [-days 30] [-json] [-suggest] <set-id>
                                       the prompts themselves: flat, noisy, off-target, duplicate and branded ones, and gaps (free; -suggest: one analyst call)
cheapseats audit [-pages 10] [-info] [-json] [site...]   what AI crawlers can read on the brand's sites (free)
cheapseats check-citations [-n 25] [-json] <run-id>      which pages the run cited name the brand, and which competitors (free)
cheapseats crawl import [-host example.com] <logfile>... AI crawler fetches and AI referrals from access logs; - reads stdin, .gz is read as gzip
cheapseats crawl report [-days 30] [-json]               those counts per page, beside how the latest runs cite it
cheapseats backup <file>                  a consistent copy of the database, safe while serve runs
cheapseats check                          validate the config and every prompt set
cheapseats plan <before> [<after>]        what a config change does to trends, for its pull request
cheapseats migrate-config [dir]           give each prompt an id, in sets written before ids
cheapseats version                        this build's version and database schema
```

From a checkout, run any of them with `go run ./cmd/cheapseats <command>`. Running a set from a terminal or a pipeline, with the exit codes and a scheduled workflow, is in [The CLI, and runs from CI](../cli-and-ci/). `audit`, `check-citations` and `crawl` call no model and cost nothing; see [Free site checks](../site-audit/). `init` is in [Getting started](../getting-started/#start-one-from-your-website-cheapseats-init), `regrade` in [Re-grading stored answers](../regrading/), `review` in [Reviewing your prompts](../prompt-review/).

- **`init`**: `-name` sets the brand's name instead of what the site calls itself; `-competitors` adds `[[competitors]]` entries, alternatives prompts and head-to-heads; `-suggest` adds `-n` suggested prompts to the starter sets with one analyst call; `-dry-run` prints what it found and every file it would write, and writes nothing. It writes to `./<brand>-cheapseats-config` unless you name a directory.
- **`regrade`**: `-since` takes `28d`, `72h` or `all` (default 28 days) and applies to a set; `-dry-run` is true by default.

## MCP server

`/api/mcp` is an MCP server (Streamable HTTP), so Claude Code, Claude Desktop or any MCP client can list prompt sets, start runs and read the results without the web UI.

```bash
claude mcp add --transport http cheapseats https://<host>/api/mcp --header "Authorization: Bearer <token>"
```

| tool               | what it does                                                                    |
| ------------------ | ------------------------------------------------------------------------------- |
| `get_started`      | call it first: the brand and its sites, each set's tier, last run and status, today's spend against the budget, which answerers and the grader can run here, the latest audit's errors and warnings, open and urgent fixes, attempts awaiting an outcome, `data_state` (`no_runs`, `running`, `stale` or `ready`) and `next_steps`, the tool calls worth making now with their arguments. Free |
| `list_prompt_sets` | the checked-in prompt sets with ids, descriptions and counts                    |
| `get_prompt_set`   | the prompts in one set, and the competitor names the grader folds onto          |
| `start_run`        | start a run over a set (costs money; returns the id); takes `set` and `dry_run`. With `dry_run: true` it starts nothing and returns the plan: answers per answerer and track, answerers skipped, estimated cost from each answerer's recent answers and their grading (priced by `[pricing]`; re-grades count toward grading, so it errs high), today's remaining budget, and whether it would be refused |
| `list_runs`        | recent runs with status and headline rates                                      |
| `get_run`          | rates per answerer and track (and `unbranded`, without branded prompts), share of voice with named rate, positions and top 3, head to head, objections, sources by kind and host, the outreach list, the brand's pages found but not cited, net sentiment with top praise and objections, the run's themes, the fix list, insights, one line per prompt |
| `get_result`       | one answer in full: text, grade, searches and citations                         |
| `get_quick_wins`   | the ranked fixes, filterable by gap, set, site, status and priority, each with its Claude prompt and the work submitted for it; `brief` leaves out the prompts and `limit` caps the list |
| `mark_fix`         | record the commit or pull request submitted for a fix, as proposed or accepted  |
| `set_attempt_state` | move submitted work on: accepted when it merges, withdrawn when it's closed    |
| `list_attempts`    | the work submitted for fixes, with each one's outcome (moved, worse, mixed, no detectable change...) tested against noise |
| `get_citations`    | every URL linked in an answer across runs, filterable by URL, set and window   |
| `search_probe`     | one query through the answerers' web search tool, returning the exact result    |
| `get_citation_stability` | how much the hosts a set's answers cite move from run to run: Bray–Curtis similarity and Jaccard overlap of consecutive runs, the headline score from 3 transitions, and the newest transition's new and gone hosts (ten of each); takes `set`, `track` (`search` by default, or `recall`) and `last_days` (default 30). Free |
| `get_rankings`     | the brand's daily share-of-voice rank and rates per set, with rolling averages and 95% bands, and day-over-day change with its margin (`within_noise` when it could be chance); takes `set`, `last_days` and `window` (7, 14 or 28) |
| `get_search_queries` | the searches behind a run's search-track answers: top queries, names the assistants added, words added and dropped, and queries worth adding as prompts; takes `run`, `pool` and `limit`. Free |
| `suggest_prompts`  | drafts new buyer questions for a set as TOML to paste, with repeats dropped; takes `set` and `n` (default 10, max 50). One analyst call; writes nothing |
| `audit_sites`      | audits the brand's sites for AI crawlers and returns the errors and warnings, each with a fix; takes `site`, `cached` and `info`. Free |
| `check_citations`  | fetches a run's most-cited third-party pages and says which name the brand and which competitors; takes `run`, `limit` and `cached`. Free |
| `get_crawlers`     | AI crawler fetches and AI referrals per page from imported logs, beside how often runs cite each; takes `last_days`, `flag` and `limit`. User agent only, unverified |
| `review_prompts`   | a set's [prompt review](../prompt-review/): flat, noisy, off-target, duplicate, rewritten and branded prompts, and gaps; takes `set`, `days` (30, 60 or 90) and `suggest`. Free unless `suggest`, which is one analyst call for proposed edits |
| `regrade`          | grade a set's, or one run's, stored answers again with today's grader, brand and competitors; takes `target` (a set or run id), `since_days` (default 28, 0 for all) and `dry_run` (true unless set to false). The dry run says how many answers and the estimated cost; the real one runs in the background within the daily budget. See [Re-grading](../regrading/) |
| `share_run`        | a read-only [share link](../sharing/) to a run's report; takes `run`, or `set` for its newest finished run, `days` (default 30, max 365) and `include_answers`. The URL is shown only this once |
| `cancel_run`       | stop an in-progress run                                                         |

The server also offers three **prompts**, each telling the model which tools to call:

| prompt | what it asks for | arguments |
| --- | --- | --- |
| `weekly_pulse` | a short weekly read-out: what moved, what's open, what to do this week | `set` (default: every set) |
| `competitor_radar` | who is winning which prompts, and from which sources | `set`, `competitor` (default: the leaders) |
| `why_not_recommended` | why the assistants don't recommend the brand for one prompt, and what would change that | `prompt` (its text or number; required), `set` |

## JSON API

| route                                | what it returns                                                       |
| ------------------------------------ | --------------------------------------------------------------------- |
| `GET /api/status`                    | the brand, set count and today's spend against the budget              |
| `GET /api/version`                   | the Cheap Seats version, config commit and database schema                  |
| `GET /api/progress`                  | runs in progress: answers done, errors, in flight and waiting, per answerer, with time left |
| `GET /api/live`                      | a version stamp that changes whenever a run does, and whether one is in progress |
| `GET /api/sets`, `/api/sets/{id}`    | the checked-in prompt sets                                            |
| `GET /api/sets/{id}/citation-stability` | the set's citation stability, every transition in full; takes `track` (`search` or `recall`) and `lastDays` (default 30) |
| `GET /api/runs`                      | runs with headline rates; takes `set` and `limit`                     |
| `POST /api/runs`                     | starts a run over `{"set": "<id>"}` (costs money); with `"dry_run": true` it returns the plan and estimated cost and starts nothing |
| `GET /api/runs/{id}`                 | one run in full: every answer with its grade and sources, fixes, insights |
| `GET`/`POST /api/runs/{id}/fixes`    | the fix list; POST rebuilds it and the insights (one paid Claude call) |
| `POST /api/runs/{id}/cancel`, `/retry` | stop a run, or finish an unfinished one                             |
| `GET`/`POST /api/runs/{id}/shares`   | the run's share links; POST makes one from `{"days"?, "include_answers"?}` and returns it as `url`, once |
| `DELETE /api/shares/{id}`            | revokes a share link                                                  |
| `GET /api/quick-wins`                | the ranked fixes across sets; takes `gap`, `set`, `site` (a url, a kind like `docs`, or `elsewhere`), `status` (`open`, `proposed`, `accepted`) and `priority` |
| `POST /api/runs/{id}/fixes/{rank}/attempts` | records work submitted for a fix: `{"url", "state"?, "note"?}`, state `proposed` (default) or `accepted` |
| `POST /api/attempts/{id}`            | moves an attempt on: `{"state": "accepted"}` or `"withdrawn"`          |
| `GET /api/attempts`                  | the work submitted for fixes, newest first, with outcomes; takes `set` |
| `GET /api/rankings`                  | daily rank and rates per set, with rolling averages, bands and day-over-day margins; takes `lastDays`, `set` and `window` (7, 14 or 28) |
| `GET /api/runs/{id}/searches`        | what the assistants searched in a run; `pool=1` adds the set's earlier same-method runs |
| `GET`/`POST /api/audit`              | the latest site audit; POST runs one over the brand's sites and waits for it (free) |
| `GET`/`POST /api/runs/{id}/citation-check` | the run's latest citation check; POST runs one over its `n` most-cited third-party pages (default 25) and waits for it (free) |
| `GET /api/crawlers`                  | AI crawler and referral counts per page, from imported logs; takes `days` (default 30) |
| `GET /api/citations`                 | cited URLs across runs; takes `urlContains`, `lastDays` and `set`     |
| `POST /api/search-probe`             | one search, verbatim; takes `{"query", "allowed_domains"?, "blocked_domains"?}` |

```bash
curl -H "Authorization: Bearer <token>" \
  "https://<host>/api/citations?urlContains=docs.example.com&lastDays=30"
```

A run's JSON (`/api/runs/{id}`, and `/runs/{id}/export.json`) carries everything on the run page under `Summary`: `voice` with `named_rate`, `share_of_voice`, `avg_position`, `named_first`, `top3` and `position_weighted` per product (and `share`, the old name for `named_rate`), `unbranded`, `head_to_head`, `objections`, `source_classes`, `hosts` with `bucket`, `outreach` and `found_not_cited`; net sentiment and themes are under `opinion`; each source page has a `page_type`, rolled up in `page_types`. Each grade carries its `evidence`, and a re-graded run lists its `regrades`: when, how many answers, the cost, and the method and grader it had before. [Metric definitions](../metrics/) defines each field. An attempt's `outcome` has `status`, `summary`, and `named` and `recommended` as `{d, margin, prompts}`.

`/api/citations` counts each answer that linked a URL once, and returns `runs_scanned` and `answers_scanned` alongside the pages, so a URL missing from the list reads as uncited across that many answers.

In the web UI, `/sets/{id}/review` is a set's [prompt review](../prompt-review/) (`/api/sets/{id}/review` its JSON), `/sets/{id}/regrade` shows a set's re-grade dry run and starts one ([Re-grading](../regrading/)), and `/share/{token}` is a run's [share page](../sharing/).

`GET /healthz` answers `ok` without a token, for a container's liveness probe. `GET /share/{token}` is the only other page open without a sign-in besides `/login` and static files, and serves only that link's run.

## Access

With `CHEAPSEATS_TOKENS` unset, `serve` only listens on 127.0.0.1 and everything is open. To listen anywhere else, set `CHEAPSEATS_TOKENS` (comma-separated, so one can be rotated at a time): every `/api/*` request, MCP included, then needs `Authorization: Bearer <token>`, and the web UI asks for a token once and keeps it in a cookie.

On [exe.dev](../deploying/#exedev), Cheap Seats instead trusts the proxy's signed-in email header (`CHEAPSEATS_AUTH_HEADER`, narrowed by `CHEAPSEATS_ALLOWED_EMAILS`). API and MCP clients get through the proxy with an exe.dev token scoped to the VM; see [connecting Claude Code](../deploying/#exedev).

Behind a proxy on the same machine, set `CHEAPSEATS_HOSTS` to the host names it serves Cheap Seats as (comma-separated). MCP refuses a request that reaches Cheap Seats on loopback under any other name, against DNS rebinding, and so does the whole of an open (token-less) Cheap Seats. A form or fetch from another origin that would change anything is refused everywhere, unless its origin is one of these names. So a proxy that rewrites `Host` to the upstream address, as nginx does unless told `proxy_set_header Host $host;`, needs `CHEAPSEATS_HOSTS` to name the public host, or every form answers `403` and says so. Set `CHEAPSEATS_PUBLIC_URL` to the address people reach Cheap Seats at, so [share links](../sharing/#where-links-point) point there.

## Data and privacy

Prompts and answers are sent to the model providers on every run, and `brand.about` and `brand.facts` go to the grader and analyst, so keep anything private out of them. API keys are masked out of provider error messages before they're logged or stored.

## CLI answerers

The `claude-code` and `codex` answerers run the CLIs you've logged in, and each CLI carries a shell and file access that the model drives. On the search track the model reads pages it doesn't control, so treat what it could do with those tools as the boundary, not what the brief tells it. What Cheap Seats does on every call:

- an empty temporary directory, no session, and your own CLAUDE.md, hooks, skills, MCP servers and Codex config switched off;
- an environment of only what the CLI needs (its home, PATH, locale, proxies, certificates and its own settings directory): no API keys, no `CHEAPSEATS_TOKENS`, nothing else this process holds. `CHEAPSEATS_CLI_ENV` names more variables to pass, comma-separated;
- `claude` with `--tools` set to exactly WebSearch and WebFetch on the search track and nothing on recall, which the CLI enforces;
- `codex` with a read-only sandbox and an empty environment for any command it runs. The sandbox stops writes, not reads or commands: Codex always has its shell, and on recall only the brief tells it not to use it.

So on a machine that holds anything a prompt-injected answer could read, run the CLIs as a separate user: set `CHEAPSEATS_CLI_USER` and Cheap Seats runs them through `sudo -n -H -u <user>`, with a sudoers rule that allows the two commands and `SETENV` for the environment it passes. The [exe.dev deploy](../deploying/#exedev) does this for you with a `cheapseats-cli` user. On a laptop the CLIs run as you, the same as when you use them by hand. The Docker image and Helm chart have no CLIs: deployed answerers use the APIs, and the keys they hold never reach a model's shell.
