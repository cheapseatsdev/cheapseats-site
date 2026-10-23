---
title: The CLI, and runs from CI
description: Run a prompt set from the command line and get its rates back with an exit code, check prompt changes in your config repo's CI, start runs from a pipeline.
weight: 440
group: Running it
---

**Can I run AI visibility checks from the command line or in a CI pipeline?** Yes. `cheapseats` is one binary: the web UI, the JSON API, the MCP server and a CLI. `cheapseats run <set>` asks every configured model your buyer questions on both tracks, waits, prints the recommended and named rates and the share-of-voice table, and exits 0 if the run finished and 1 if it didn't. The prompt sets are TOML files in a git repo you own, so a change to the questions is a pull request, and `cheapseats check` and `cheapseats plan` run in that repo's CI. Running the same questions every week needs no CI at all: the schedule is built in. A pipeline that must start a run itself does it over the JSON API.

A hosted tool's CLI, [LLM Pulse's](https://llmpulse.ai/features/cli) for example, is a client for an account: you log in with an API key and pull the data out. With Cheap Seats the prompts, the config and the database are files you hold, so the questions themselves go through review, and every run is recorded on the commit of the config that produced it.

## Run a set from the command line

```bash
cheapseats sets                 # the prompt sets in your config repo
cheapseats run head-to-heads    # ask, grade, report; costs money through the APIs
```

`run` prints progress to stderr every 20 seconds (`12/44 answers`) and, when the run is done, the report to stdout. This is the real one for cheapseats.dev's *head to heads* set on 22 October 2026, two answerers on subscriptions, 11 prompts, both tracks:

```
Cheap Seats head to heads 2026-10-22 05:12  [done]

44 graded, 0 errors, $0.09

ANSWERER          TRACK   TOP PICK     RECOMMENDED  NAMED
all                         2% (0–12)    2% (0–12)   55% (40–68)
unbranded                 –            –            –
claude-code-opus  recall    0% (0–26)    0% (0–26)   82% (52–95)
claude-code-opus  search    0% (0–26)    0% (0–26)   27% (10–57)
codex-sol         recall    9% (2–38)    9% (2–38)  100% (74–100)
codex-sol         search    0% (0–26)    0% (0–26)    9% (2–38)

Share of voice (Cheap Seats is #1):
   1. Cheap Seats                       24 answers ( 55%)    9% of mentions  1 top picks
   2. Profound                          18 answers ( 41%)    7% of mentions  4 top picks
   3. Peec AI                           17 answers ( 39%)    6% of mentions  4 top picks
   4. Otterly.AI                        15 answers ( 34%)    6% of mentions  4 top picks
   ...
```

Each rate comes with its 95% interval in brackets, one row per answerer and track, so the same question's answers from Claude and from OpenAI sit side by side; see [Reading results](../reading-results/) and [Metric definitions](../metrics/). The run is kept, with every answer, search result and citation, and the same report is `cheapseats report <run-id>` later. `-json` prints everything the run page shows, for scripts:

```bash
cheapseats report -json r-20261022-051238-0c6344 |
  jq '.summary.overall.recommended.p, (.summary.voice[:3] | map(.name))'
```

`summary.overall` has `top_pick`, `recommended` and `visible` (named), each as `{hits, n, p, lo, hi}`; `summary.slices` is the per-answerer table; `summary.voice` is the share-of-voice list with `named_rate`, `share_of_voice`, `avg_position` and `top_pick` per product and `is_brand` on yours. `cheapseats fixes <run-id>` prints the run's fix list as markdown.

### Exit codes

| exit | when |
| ---: | --- |
| 0 | the run finished (`done`) and the report printed |
| 1 | the run ended any other way, with `cheapseats: study ended budget; inspect errors and retry unfinished results` on stderr (`budget` when the [daily budget](../cost-and-budget/#the-daily-budget) stopped it, also `cancelled`, `partial` or `failed`), or anything else went wrong: no such set, a config error, no API key |
| 2 | usage: no command, or a flag it doesn't know |

A run that stopped keeps what it finished; `POST /api/runs/{id}/retry`, or the **Retry** button on the run page, finishes the rest, the next day if it was the budget.

### Where to run it

`cheapseats run` opens the database directly, so use it where nothing else has that database open: your own machine, with the `claude` and `codex` CLIs on your subscriptions (`CHEAPSEATS_CONFIG` pointing at your config repo's `cheapseats.toml`, data in `./data` or `CHEAPSEATS_DATA_DIR`), or a container of its own with its own data volume:

```bash
docker run --rm --env-file .env -v cheapseats-data:/data -v "$PWD:/config:ro" \
  ghcr.io/cheapseatsdev/cheapseats:0.3.0 run head-to-heads
```

On a deployment that is already serving, start the run through the API instead (below) or from the set's page. It lands in the same database and the same trend, and counts against the same daily budget.

## Test the same questions against several models

Every `[[answerers]]` entry in `cheapseats.toml` is one model: a Claude model through the `anthropic` API or the `claude` CLI, an OpenAI model through the `openai` API or the `codex` CLI. Every prompt in a set goes to every answerer, on the search track (web search forced on) and the recall track (no tools), and the report has a row for each. `summary.head_to_head` says, for each competitor, how often the answers named you ahead of it, and `summary.voice` ranks every product named. See [Which AI engines Cheap Seats asks](../engines/) and [Configuration](../configuration/#answerers).

## Ask the same questions every week

The schedule is in the config, not in CI:

```toml
[schedule]
daily_hour_utc = 13

[tiers.core]
every_days = 7

[tiers.plg]
every_days = 7
max_samples = 1
```

From that hour, `serve` runs each core set every `every_days` days and each plg set likewise, one after another, and records the result like any other run. The set's page and `GET /api/rankings` then give the day-by-day share-of-voice rank and rates with rolling averages and bands, so a week-over-week change reads as real or as noise; see [Noise and confidence](../noise-and-confidence/). cheapseats.dev runs every set weekly. Leave `daily_hour_utc` unset on a dev machine and nothing runs unless you start it.

## Check prompt changes in your config repo's CI

The prompts are `prompt-sets/*.toml` next to `cheapseats.toml`, in your own git repo. The [config template](https://github.com/cheapseatsdev/cheapseats-config-template) comes with a workflow, [`check.yml`](https://github.com/cheapseatsdev/cheapseats-config-template/blob/main/.github/workflows/check.yml), that runs on every pull request and push, with the Cheap Seats release the repo's `Dockerfile` is pinned to:

```yaml
- name: cheapseats check
  run: docker run --rm -v "$PWD:/config:ro" "$IMAGE" check
- name: cheapseats plan
  if: github.event_name == 'pull_request'
  run: |
    git worktree add -q "$RUNNER_TEMP/base" "$BASE"
    docker run --rm -v "$RUNNER_TEMP/base:/before:ro" -v "$PWD:/after:ro" "$IMAGE" plan /before /after >plan.md
    gh pr comment "$PR" --body-file plan.md --edit-last 2>/dev/null || gh pr comment "$PR" --body-file plan.md
```

`check` fails the build on a typo, a duplicate id, or a prompt that names the brand outside `head-to-heads`. `plan` comments on the pull request what the change does to the trends: prompts added, removed, reworded and moved, answerer and competitor changes, and which of them start a trend over. See [Prompt sets](../prompt-sets/#changing-a-set-doesnt-restart-its-trend). The template's second workflow, `deploy.yml`, builds the image with the config inside on every merge and deploys it; see [Self-hosting](../self-hosting/).

## Start a run from a pipeline

When a pipeline has to start the run itself, after a release or a content launch, say, use the JSON API of your deployment: `POST /api/runs` starts a run and returns at once with `{"id", "status"}`; `GET /api/runs/{id}` has the status under `Run.status` and, when it's `done`, the report under `Summary`. A `Bearer` token from `CHEAPSEATS_TOKENS` authorises both ([Access](../reference/#access)). A scheduled GitHub Actions workflow:

```yaml
name: weekly run
on:
  schedule:
    - cron: '0 13 * * 1'      # Mondays, 13:00 UTC
  workflow_dispatch:

jobs:
  run:
    runs-on: ubuntu-24.04
    env:
      URL: ${{ secrets.CHEAPSEATS_URL }}         # https://cheapseats.example.com
      AUTH: "Authorization: Bearer ${{ secrets.CHEAPSEATS_TOKEN }}"
    steps:
      - name: start the run
        id: start
        run: |
          # 409 means this set already has a run going; its id comes back the same way.
          id=$(curl -sS -H "$AUTH" -H 'content-type: application/json' \
            -d '{"set": "head-to-heads"}' "$URL/api/runs" | jq -r .id)
          echo "id=$id" >>"$GITHUB_OUTPUT"
      - name: wait for it
        run: |
          for _ in $(seq 1 180); do
            status=$(curl -fsS -H "$AUTH" "$URL/api/runs/${{ steps.start.outputs.id }}" | jq -r .Run.status)
            case "$status" in queued|running) sleep 20 ;; *) break ;; esac
          done
          echo "run ${{ steps.start.outputs.id }}: $status"
          test "$status" = done
      - name: the headline
        run: |
          curl -fsS -H "$AUTH" "$URL/api/runs/${{ steps.start.outputs.id }}" | jq -r '
            "recommended \(.Summary.overall.recommended.p * 100 | round)%, named \(.Summary.overall.visible.p * 100 | round)%",
            (.Summary.voice | to_entries[] | select(.value.is_brand) | "share of voice: #\(.key + 1)"),
            (.Summary.voice[:5][] | "  \(.name): named in \(.named_rate * 100 | round)% of answers")'
```

The job fails if the run didn't finish, which is what you want in a pipeline: a `budget` stop or a provider outage shows up red, not as a quiet gap in the trend. `POST /api/runs` with `"dry_run": true` returns the plan and estimated cost without starting anything, if you want a gate before spending. The same calls are MCP tools (`start_run`, `get_run`), so Claude Code can do the same from a terminal; see [CLI, API and MCP](../reference/).
