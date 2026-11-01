---
title: "Optional providers: Jev and Exa"
description: "Two optional services, off unless configured. Jev makes typed decisions over what a run found; Exa is a neutral web index beside the assistants' searches."
weight: 445
group: Running it
---

Cheap Seats needs Claude; OpenAI is optional. Two additional services can enrich a run:

- **[TypeSafe](https://typesafe.ai)'s Jev** makes typed judgments over names, phrases, grades and prompts.
- **[Exa](https://exa.ai)** searches a separate web index and can read pages that plain HTTP cannot.

Each is off until its table is present in `cheapseats.toml`; its switches then default on. Calls use the [daily admission budget](../cost-and-budget/#the-daily-budget). Neither changes how answers are asked or graded, so enabling them does not restart trends. Name folding and clustering can still change displayed counts.

Most passes run after a run or on demand and store their results. Reports read those results without calling a provider; the interactive search probe is the exception. These features require Cheap Seats 0.4.0 or later.

Choose a pass when its additional evidence could change a decision: ambiguous name grouping, disputed grades, unclear source coverage or a specific query to investigate. [Which check or evaluation should I run?](../checks-and-evaluations/) explains the end-to-end paths, outcomes and rerun signals, including how Jev second opinions differ from the Evaluation preview's independent checks.

## What they add

The tables list each pass, its switch and command. Passes reuse stored decisions where their inputs are unchanged; some web content caches expire. Costs below use the example `[pricing]` rates and exclude hosting.

### Jev

| What | Switch | Where it shows | A run costs |
|---|---|---|---|
| **Fold product names** the grader wrote differently onto one share-of-voice row | `fold_names` | the board; `cheapseats fold` | under a cent |
| **Cluster objections and praise**, so wordings of one complaint count as one | `cluster_phrases` | objections and sentiment, "(3 wordings)"; `cheapseats cluster` | under a cent |
| **Second opinions** on every grade's verdict and evidence sentence | `second_opinions` | a block under the prompt grid, beside each answer, the set page's "Jev agrees" column; `cheapseats verdicts` | under a cent |
| **Page types and source classes** where the rule lists said other or editorial | `page_types` | the Page types and Sources tables, a "typed by Jev" chip; `cheapseats classify` | a fraction of a cent |
| **One card for one page**: fixes from different sets that want the same page | `fix_matches` | Next steps actions, "also asked for by"; `cheapseats match-fixes` | under a cent |
| **Prompt judgments**: duplicates, off-target, intent and branded wording | `prompt_review` | `cheapseats check` suggestions, the prompt review's Jev section; `cheapseats judge` | a fraction of a cent, once per wording |

Jev supplements the existing rules: configured competitor aliases still fold names, and `[sources]` overrides Jev's host classification. Decisions below `min_confidence` do not take effect. From 0.7.1, folding reads the decisions the same way every time: configuration always wins, each name takes its most confident decision, and names whose decisions point at each other in a circle (Jev folds "Scrunch" onto "Scrunch AI" and "Scrunch AI" onto "Scrunch") are one product on one row, displayed as the circle's most confident decision has it (at equal confidence, the spelling that sorts first byte by byte). `cheapseats fold` shows where each name lands, or why a decision isn't read. Second opinions appear beside the original grades and never replace them; read disagreements first when checking a grade.

Prompt judgments can help before a set has a month of answers. They flag possible duplicates, off-target questions, intent and branded wording. Off-target checks require `brand.category`. `cheapseats check` prints suggestions without failing on them; `-no-jev` skips these judgments.

### Exa

| What | Switch | Where it shows | A run costs |
|---|---|---|---|
| **Coverage**: one search per prompt over your own sites | `coverage`, `results` | under each prompt, as cited, retrieved or unseen; `cheapseats coverage` | $0.004 a prompt |
| **Neutral retrieval baseline**: each prompt as a plain web search | `baseline`, `baseline_results` | a "Neutral retrieval" table and chips under each prompt; `cheapseats baseline` | $0.004 a prompt |
| **Outreach prospects**: pages like the cited listicles that no answer cited | `prospects`, `prospect_seeds`, `prospect_results` | "Prospects" under the outreach table; `cheapseats prospect` | 4 cents for 10 seeds |
| **Competitor discovery**: sites like your competitors', as entries to paste | `discover_results` (on demand only) | `cheapseats discover`, MCP `suggest_competitors` | $0.004 per competitor |
| **Reading a page through Exa** when plain HTTP gets an empty shell | `contents_fallback` | the site audit and the citation check, marked `via: exa` | $0.001 a page, once a day |
| **A second engine for the search probe** | none: on with `[exa]` | the probe's engine selector; `cheapseats probe -engine exa` | under half a cent a probe |

Use coverage and baseline together:

- **Coverage** asks whether a separate index finds relevant pages on your sites. Each result is marked cited, retrieved or unseen in the run. No result can mean an indexing gap; it does not establish that no useful page exists.
- **Neutral retrieval** compares hosts returned for the original prompt with hosts surfaced by the assistants. The content/query/both labels are diagnostic clues, not proof of why an assistant chose a source. Different indexes and rankings can also explain a gap.
- **Prospects** finds pages similar to cited third-party listicles and comparisons, excluding pages already cited, retrieved or fetched in the run. Pages naming competitors but not you come first.
- **Competitor discovery** runs only on demand. It prints `[[competitors]]` entries to review and paste; it never changes your config. Jev can check whether a suggested host competes in your category.
- **Page reads** retry empty app shells or bot challenges through Exa, caching the text for a day. A `via: exa` label identifies that result. The audit downgrades the finding to info: content exists, but crawlers without JavaScript may still see empty HTML. Pages plain HTTP can read are not sent to Exa.
- **Search probe** accepts `claude` (default), `exa` or `both`. With both, links are marked `overlap`, `only_claude` or `only_exa`. It stores nothing and is called only when requested.

See [provider mechanics](../reference/#optional-provider-mechanics) for caching and decision provenance.

## Getting a key

Create keys in the [Exa dashboard](https://dashboard.exa.ai) and [TypeSafe console](https://console.typesafe.ai/keys). Check each service’s current prices and allowances before relying on an estimate.

At the example rates below, Exa costs $0.004 per search and $0.001 per page read; Jev costs $0.042 per million input tokens. Coverage and baseline each use one search per prompt, and prospects one per seed. A 15-prompt run with both searches and 10 prospect seeds uses 40 searches, about $0.16, before page reads. Jev's small judgments typically total under a cent per run.

Put keys in the environment or `.env`. On exe.dev, a key-adding integration can keep them off the VM.

## Turning them on

Every switch is on when its table is present; set one `false` to leave that pass out.

```toml
[brand]
category = "AI search visibility tools, which measure whether AI assistants recommend a brand"   # the market in a noun phrase; the off-target question is asked against it

[typesafe]
model = "jev-1.14.0"       # pin a version; aliases like jev-latest move
# fold_names = true
# cluster_phrases = true
# second_opinions = true
# page_types = true
# fix_matches = true
# prompt_review = true
# min_confidence = 0.7     # a decision takes effect at this probability; changing it re-reads stored decisions, asks nothing

[exa]
# coverage = true
# results = 3              # pages to keep per prompt, 1 to 10
# baseline = true
# baseline_results = 10    # 1 to 25
# prospects = true
# prospect_seeds = 10      # cited listicles and comparisons to start from, 1 to 50
# prospect_results = 5     # similar pages to keep from each, 1 to 25
# discover_results = 10    # for cheapseats discover, 1 to 25
# contents_fallback = true

[pricing."jev-1.14.0"]
input = 0.042

[pricing.exa-search]
search_per_1k = 4.0

[pricing.exa-contents]
page_per_1k = 1.0
```

Provide each service's key (`TYPESAFE_API_KEY`, `EXA_API_KEY`) or key-adding proxy (`CHEAPSEATS_TYPESAFE_BASE_URL`, `CHEAPSEATS_EXA_BASE_URL`). On [exe.dev](../deploying/#exedev), add integrations for the proxies.

`cheapseats check` lists enabled passes. A configured provider without a key or proxy is noted and skipped at run time; a missing `[pricing]` entry or unknown key fails validation. Upgrade the app before adding a switch an older version doesn't recognize.

On Kubernetes, put keys in the chart's Secret or `extraEnv` with `secretKeyRef`; proxy URLs belong in plain `env`. See [Deploying](../deploying/#kubernetes-with-helm).

## What stays the same

- **Reports read stored results.** An outage leaves earlier results available; it can prevent new passes from completing.
- **All billable attempts are budgeted.** Calls reserve and settle under their `[pricing]` entries. Exa's returned cost estimate is used when available. This remains an admission limit, not a billing ceiling.
- **Grades and methods stay intact.** Second opinions never replace a grade. Folding and clustering change grouped counts, like adding an alias, without restarting trends.
- **Rules remain the fallback.** Without Jev, aliases and rule lists still apply. Without Exa, its per-prompt coverage and prospects are absent.
- **Provenance is retained.** Stored Jev decisions identify the provider and probability. Changing `min_confidence` reinterprets them without new calls.

Implementation details and first-call observations are in the repo's [optional-provider spec](https://github.com/cheapseatsdev/cheapseats/blob/main/docs/optional-providers.md).
