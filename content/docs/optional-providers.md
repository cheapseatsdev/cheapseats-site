---
title: "Optional providers: Jev and Exa"
description: Two optional services, off unless configured, for jobs the core models do badly or not at all. TypeSafe's Jev folds product names the grader wrote differently onto one row of the share-of-voice board; an Exa search per prompt over your sites says which of your own pages answer each question. Keys or key-adding proxies, budgeted like every other call.
weight: 445
group: Running it
---

Cheap Seats runs on Claude, optionally OpenAI, and nothing else has to be configured. Two more services can be switched on for jobs the core models do badly or not at all. Both are optional in the strict sense: with neither table in `cheapseats.toml`, nothing about them is called, and switching one off later leaves every page as it was.

- **[TypeSafe](https://typesafe.ai)'s Jev** returns typed judgments, not text: a probability, a choice among options you define, a score on described levels, each with a calibrated probability and a confidence. It can't generate, count or do arithmetic, which is why it only gets small decisions over data Cheap Seats already has. Input is $0.042 per million tokens, output free, as of October 2026.
- **[Exa](https://exa.ai)** is a web search API, a neutral index to ask what the web has, as opposed to what an assistant found. About $4 per thousand searches; page contents cost extra and aren't fetched.

## What they do

### Jev folds product names

The grader writes product names as the answers do, so one product can sit on the share-of-voice board twice: "Scrunch" and "Scrunch AI". Your configured competitor aliases fold the spellings you thought of. Jev folds the ones you didn't.

After each run, every name the grader wrote that isn't the brand, a competitor or an alias, and hasn't been decided before, is put to Jev once: a choice over the known products it plausibly matches (a shared word, or one name containing the other), with a "different product" option, given your category from `brand.about` and the sentence of an answer that named each product. Decisions are stored with their confidence; the board folds a name when its decision is at or above `min_confidence` (default 0.8). A re-run asks nothing. Tightening the threshold re-reads the stored decisions and asks nothing either. A run's whole pass is usually one call and a fraction of a cent.

### Exa checks coverage

A miss has two different causes, and a run alone can't tell them apart: no page of yours answers the question, or one does and the assistants never read it. After each run, every prompt is searched once on Exa, restricted to your sites (`[[brand.sites]]` and `brand.domains`). What it finds is shown under each prompt on the run page as your pages for that question, each marked **cited** (an answer to the prompt cited it), **retrieved** (a search returned it and no answer cited it) or **unseen**, or "none found". The same is in the run's JSON as `coverage` and in MCP `get_run` as `own_pages` per prompt. Fifteen prompts is fifteen searches, about six cents.

A search that finds nothing is information: for a new domain it usually means the index hasn't picked the site up yet, which no amount of writing fixes until it does.

## Turning them on

```toml
[typesafe]
model = "jev-1.14.0"     # pin a version; aliases like jev-latest move
# fold_names = true      # unset means on
# min_confidence = 0.8

[exa]
# coverage = true        # unset means on
# results = 3            # pages to keep per prompt, 1 to 10

[pricing."jev-1.14.0"]
input = 0.042

[pricing.exa-search]
search_per_1k = 4.0
```

Each needs a way to reach its API, and either of two will do:

- **A key**: `TYPESAFE_API_KEY`, `EXA_API_KEY`, from the environment or `.env`, like the other keys.
- **A key-adding proxy**: `CHEAPSEATS_TYPESAFE_BASE_URL`, `CHEAPSEATS_EXA_BASE_URL`, exactly as `CHEAPSEATS_ANTHROPIC_BASE_URL` works for Anthropic. On [exe.dev](../deploying/#exedev), add each as an integration and the VM holds no key at all.

With a table present and neither set, `cheapseats check` prints a note and the pass is skipped at run time, the way an answerer whose key is missing is skipped; the readiness report lists both under `optional`. A missing `[pricing]` entry fails `check`, as it does for any model.

On Kubernetes, keys go in the Secret the chart loads, or in `extraEnv` as a `secretKeyRef`; the proxy URLs, which aren't secrets, go in `env`. See [Self-hosting](../self-hosting/).

## What stays the same

- **Pages never call them.** Both passes run after a run finishes and write to the database; the run page, the API and MCP read what was stored. A deployment without them renders the same pages at the same speed, and a provider outage changes no report.
- **The budget covers them.** Each call reserves and settles against the daily budget under its `[pricing]` entry, like every other call. Exa's own cost estimate is used when it returns one.
- **Trends don't restart.** Folding happens after grading and changes no method; it changes historical share-of-voice numbers the way adding a competitor alias does today.
- **The old rule stays as the floor.** Without Jev, configured aliases fold as before. Without Exa, the per-prompt line simply isn't there.

The design rules and the list of what's next for each are in the repo's [docs/optional-providers.md](https://github.com/cheapseatsdev/cheapseats/blob/main/docs/optional-providers.md).
