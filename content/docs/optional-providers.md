---
title: "Optional providers: Jev and Exa"
description: "Two optional services, off unless configured. Jev makes typed decisions over what a run found; Exa is a neutral web index beside the assistants' searches."
weight: 445
group: Running it
---

Cheap Seats runs on Claude, optionally OpenAI, and nothing else has to be configured. Two more services can be switched on for jobs the core models do badly or not at all. Both are optional in the strict sense: with neither table in `cheapseats.toml`, nothing about them is called, and switching one off later leaves every page as it was.

- **[TypeSafe](https://typesafe.ai)'s Jev** returns typed judgments, not text: a probability, a choice among options you define, a score on described levels, each with a calibrated probability and a confidence. It can't generate, count or do arithmetic, which is why it only gets small decisions over data Cheap Seats already has. Input is $0.042 per million tokens, output free, as of October 2026.
- **[Exa](https://exa.ai)** is a web search API, a neutral index to ask what the web has, as opposed to what an assistant found. About $4 per thousand searches, and about $1 per thousand pages when it reads a page, which it does only for a page plain HTTP can't.

Every use of either follows the same rules: a switch in its table, on by default when the table is present; a key or a key-adding proxy; a run after the run finishes, or on demand, writing to the database, so no page ever calls a provider; a price in `[pricing]`, spent from the [daily budget](../cost-and-budget/); and the rule the code already had as the floor when the provider is off. None of them changes how answers are asked or graded, so no trend restarts. Cheap Seats 0.4.0 or later has all of them.

## What they add

Each line is a **pass**: it runs after a run, or by hand as `cheapseats <command> <run-id>`, and skips whatever it already decided, so running one again costs nothing.

### Jev

| What | Switch | Where it shows | A run costs |
|---|---|---|---|
| **Fold product names** the grader wrote differently onto one share-of-voice row | `fold_names` | the board; `cheapseats fold` | under a cent |
| **Cluster objections and praise**, so wordings of one complaint count as one | `cluster_phrases` | objections and sentiment, "(3 wordings)"; `cheapseats cluster` | under a cent |
| **Second opinions** on every grade's verdict and evidence sentence | `second_opinions` | a block under the prompt grid, beside each answer, the set page's "Jev agrees" column; `cheapseats verdicts` | under a cent |
| **Page types and source classes** where the rule lists said other or editorial | `page_types` | the Page types and Sources tables, a "typed by Jev" chip; `cheapseats classify` | a fraction of a cent |
| **One card for one page**: fixes from different sets that want the same page | `fix_matches` | quick wins, "also asked for by"; `cheapseats match-fixes` | under a cent |
| **Prompt judgments**: duplicates, off-target, intent and branded wording | `prompt_review` | `cheapseats check` suggestions, the prompt review's Jev section; `cheapseats judge` | a fraction of a cent, once per wording |

**Folding product names.** The grader writes product names as the answers do, so one product can sit on the board twice: "Scrunch" and "Scrunch AI". Your competitor aliases fold the spellings you thought of; Jev folds the ones you didn't. After each run, every new name is put to Jev once, as a choice over the known products it plausibly matches with a "different product" option, given your category and the sentence of an answer that named each. A name is folded when Jev's probability that the two are one product is at or above `min_confidence`. Each name is its own request, since batching lowers the probabilities; a run's pass is a few dozen requests.

**Clustering objections and praise.** The objections table and the sentiment's top praise and objections count the grader's free-text phrases by their exact wording, so "coverage unverified" and "coverage of ChatGPT and Claude unverified" were two rows. After each run, each new wording is put to Jev once against the clusters it plausibly matches, established wordings first, so the same complaint can be followed from run to run. A row that gathered several wordings says so, and `wordings` lists them in the run's JSON and MCP `get_run`.

**Second opinions on grades.** The grader is one model's reading of each answer. After each run, Jev reads every graded answer again, under the grader's own verdict definitions (the two are built from one text, so they can't drift apart), and picks the sentence that most supports the verdict. Each opinion is compared with the answer's *current* grade when read: **agrees**, **disagrees**, or **unsure** below `min_confidence`. The run page shows the counts, the agreement rate and each disagreement with what both said; the set page gains a **Jev agrees** column, which is the drift measure run over run. The disagreements are the answers to read first when the grader is in doubt. `second_opinion` in the run's JSON; MCP `get_run` has the counts and up to ten disagreements, `get_result` one answer's. See [Reading results](../reading-results/).

**Page types and source classes.** The run page types every cited page (listicle, comparison, review, docs and so on) and classes every host (ugc, review, reference, institutional, editorial) from rule lists, with `other` and `editorial` as the defaults, which is where a good share of real citations land. After each run, each page the rules call `other`, and each third-party host they call `editorial`, is put to Jev once, with the rule file's definitions as the criteria. A page or host is decided once ever, whatever run cites it. `[sources]` still wins over Jev, and Jev over the built-in default ([Metric definitions](../metrics/#page-types)).

**One card for one page.** Quick wins list the latest fix list of every set, so three sets that each want a pricing page showed three cards. After a fix list is built, each pair of fixes from different sets with the same type on the same site is decided once: the same page by rule, or a yes/no to Jev when their paths or titles share a word. Matched fixes become one card, the highest ranked, with the others under "also asked for by", and `mark_fix` can still target any of them ([Quick wins](../reading-results/#quick-wins)).

**Prompt judgments.** The [prompt review](../prompt-review/) finds duplicates and off-target prompts from a month of answers, so a new set has none. With `[typesafe]`, the prompts' wording itself is put to Jev, one question per request: whether two prompts would be served by one good answer (`duplicate`), whether a prompt asks about something other than `brand.category` (`off_target`; not asked without a category), whether the useful answer names a product or none (`intent`), and whether a prompt names the brand in any spelling (`branded`). Each answer is keyed by exactly what the question saw, so rewording one prompt re-asks only its own questions and a `cheapseats check` that changes nothing asks nothing. `check` prints one `suggestion:` line per flag and never fails on one (`-no-jev` skips it); the review page lists the same flags; the pass also runs after every run on the run's set, and `cheapseats review -jev` asks before reviewing. A 20-prompt set is about 70 requests the first time, and nothing after.

### Exa

| What | Switch | Where it shows | A run costs |
|---|---|---|---|
| **Coverage**: one search per prompt over your own sites | `coverage`, `results` | under each prompt, as cited, retrieved or unseen; `cheapseats coverage` | $0.004 a prompt |
| **Neutral retrieval baseline**: each prompt as a plain web search | `baseline`, `baseline_results` | a "Neutral retrieval" table and chips under each prompt; `cheapseats baseline` | $0.004 a prompt |
| **Outreach prospects**: pages like the cited listicles that no answer cited | `prospects`, `prospect_seeds`, `prospect_results` | "Prospects" under the outreach table; `cheapseats prospect` | 4 cents for 10 seeds |
| **Competitor discovery**: sites like your competitors', as entries to paste | `discover_results` (on demand only) | `cheapseats discover`, MCP `suggest_competitors` | $0.004 per competitor |
| **Reading a page through Exa** when plain HTTP gets an empty shell | `contents_fallback` | the site audit and the citation check, marked `via: exa` | $0.001 a page, once a day |
| **A second engine for the search probe** | none: on with `[exa]` | the probe's engine selector; `cheapseats probe -engine exa` | under half a cent a probe |

**Coverage.** A miss has two different causes, and a run alone can't tell them apart: no page of yours answers the question, or one does and the assistants never read it. After each run, every prompt is searched once on Exa, restricted to your sites. What it finds is shown under each prompt, each page marked **cited** (an answer to the prompt cited it), **retrieved** (a search returned it and no answer cited it) or **unseen**, or "none found". `coverage` in the run's JSON, `own_pages` per prompt in MCP `get_run`. A search that finds nothing is information: on cheapseats.dev's own first run, Exa found no page of ours for any of 11 prompts, because a neutral index hadn't picked the new domain up yet.

**Neutral retrieval baseline.** When a competitor dominates a run, the web may agree with the assistants (their pages answer the question better, a content problem), or the assistants' own queries may be finding them where a neutral search wouldn't (a query problem). After each run, every prompt is searched once on Exa with no domain filter. Under each prompt the neutral top pages carry whose they are and the coverage status; above them a **Neutral retrieval** table has a row per host: `neutral`, the prompts a neutral index ranks it for, `assistants`, the prompts any answer retrieved or cited it for, and a reading of **content**, **query** or **both**. `baseline` in the JSON, `neutral_retrieval` in `get_run`.

**Outreach prospects.** The outreach list is the hosts the answers already cited without you. After each run, the most-cited third-party listicles and comparisons each go to Exa's find-similar, and the pages it returns from other domains that no answer in the run cited, retrieved or fetched are kept: pages that shape answers like these, that the run didn't know about. Each is read once a day for whether it names you or a competitor, and with `[typesafe]` Jev says whether it's a roundup in your category. They're listed under the outreach table, pages naming competitors and not you first, with an `outreach` chip. `prospects` in the JSON and `get_run`.

**Competitor discovery.** Competitors are configured by hand. `cheapseats discover` asks Exa what resembles each configured competitor's home page and your own, gathers the results by host, cross-references each with the share-of-voice board (`on_board`: answers naming it on the latest runs), asks Jev whether it competes in your category, and prints `[[competitors]]` entries to paste, each with its reason as a comment. It runs on demand only, never after a run. `GET /api/competitors/suggestions` reads the table and `POST /api/competitors/suggestions/<host>/dismiss` hides a host for good. Nothing edits the config: a suggestion becomes a competitor by pull request, like a prompt.

**Reading a page through Exa.** The [site audit and citation check](../site-audit/) read pages with plain HTTP, as a crawler that runs no JavaScript does. A page that is an empty app shell, or that serves a bot challenge, reads as empty or as naming nobody, when the assistants read it fine. With `contents_fallback` on, such a page is read once more through Exa, which renders it; the text is kept for a day. The citation row says whom it names with `via: exa`, and the audit's `page.needs-js` or `page.challenge` finding becomes an info one: the content exists, and crawlers that run no JavaScript still see the empty HTML. A page plain HTTP reads is never sent to Exa.

**A second engine for the search probe.** The [search probe](../reading-results/#search-probe) runs one query through the web search tool the answerers use. With `[exa]`, it takes an engine: `claude` (the default), `exa`, the same query on Exa's index under the model name `exa-search`, or `both`, which returns each result with `overlap`, `only_claude` and `only_exa`. It has no switch and stores nothing: someone asks a question and pays for the answer.

## Getting a key

Both have self-serve sign-ups and free tiers, and for most teams the free tiers are all either will ever need.

- **Exa**: sign up at [dashboard.exa.ai](https://dashboard.exa.ai) and make a key under API keys. As of October 2026 the free plan gives $10 of credits every month, plus a $10 onboarding bonus, with no payment method. At $4 per thousand searches that's 2,500 searches a month. Coverage and the baseline each use one search per prompt per run and prospects one per seed, so five prompt sets of 15 to 20 prompts, run weekly, is about 900 searches a month, inside the free plan.
- **TypeSafe**: make a key in the [TypeSafe console](https://console.typesafe.ai/keys). As of October 2026 the free tier is $5 of usage a month. Jev bills input tokens only, at $0.042 per million, so that's about 119 million tokens, and a run's passes together are tens of thousands: the free tier covers this many hundreds of times over.

Keys go in the environment or `.env` like the others; on exe.dev, add each as an integration and the VM holds no key (below).

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

Each needs a way to reach its API, and either of two will do:

- **A key**: `TYPESAFE_API_KEY`, `EXA_API_KEY`, from the environment or `.env`, like the other keys (see [Getting a key](#getting-a-key)).
- **A key-adding proxy**: `CHEAPSEATS_TYPESAFE_BASE_URL`, `CHEAPSEATS_EXA_BASE_URL`, exactly as `CHEAPSEATS_ANTHROPIC_BASE_URL` works for Anthropic. On [exe.dev](../deploying/#exedev), add each as an integration and the VM holds no key at all.

`cheapseats check` lists the passes the config switches on and, with a table present and neither key nor proxy set, prints a note; the passes are then skipped at run time, the way an answerer whose key is missing is skipped, and the readiness report lists them under `optional`. A missing `[pricing]` entry fails `check`, as it does for any model. Unknown keys are errors too, so upgrade the app before you add a switch the running version doesn't know.

On Kubernetes, keys go in the Secret the chart loads, or in `extraEnv` as a `secretKeyRef`; the proxy URLs, which aren't secrets, go in `env`. See [Self-hosting](../self-hosting/).

## What stays the same

- **Pages never call them.** Every pass runs after a run finishes, or on demand, and writes to the database; the run page, the API and MCP read what was stored. A deployment without them renders the same pages at the same speed, and a provider outage changes no report. The one on-demand use from a page is the search probe's Exa engine, and the probe always was on demand.
- **The budget covers them.** Each call reserves and settles against the daily budget under its `[pricing]` entry, like every other call. Exa's own cost estimate is used when it returns one.
- **Trends don't restart.** No pass changes how an answer is asked or graded. Folding and clustering change how a board or a table is counted, the way adding a competitor alias does; second opinions sit beside the grade and never replace it.
- **The rule stays as the floor.** Without Jev, configured aliases fold, the rule lists type pages and the review reads the answers, as before. Without Exa, the per-prompt lines and the prospects simply aren't there.
- **Decisions keep their provenance.** Each stored decision says who made it and with what probability, and the threshold is read from the config each time, so tightening `min_confidence` never asks anything again.

The design rules, what each pass learned from its first live calls, and the tables each writes are in the repo's [docs/optional-providers.md](https://github.com/cheapseatsdev/cheapseats/blob/main/docs/optional-providers.md).
