---
title: Which check or evaluation should I run?
description: Choose the right workflow, run it end to end, interpret its outcomes and decide when to repeat it.
weight: 300
group: Acting on it
---

Start with the uncertainty you need to resolve. A buyer run measures answers; a grader evaluation checks how answers are labeled; a site check inspects access or page evidence. One passing check cannot stand in for the others.

{{< figure name="checks-map" >}}

## Pick a workflow

| Your question | Workflow and availability | What to do end to end |
| --- | --- | --- |
| Do assistants consider us for these buyers? | [Buyer run](../first-run/), released | Choose questions → collect → inspect complete answers and sources → record a decision → repeat comparable runs |
| Are our questions useful? | [Prompt review](../prompt-review/), released | Read flags and gaps → check buyer evidence → review a config diff → validate it → collect against the resulting question set |
| What does a search tool return for this query? | [Search probe](../reading-results/#search-probe), released | Choose a query/engine → explicitly probe → inspect returned URLs against the recorded answer trace; this creates no buyer answer or grade |
| Can a crawler read our pages? | [Site audit](../site-audit/), released | Audit → inspect the exact failing response → correct the owned issue → audit again |
| What do cited pages and access logs show? | [Citation and crawler checks](../site-audit/#citation-check), released | Check cited URLs or import logs → inspect name matches/counts → corroborate before inferring discovery or endorsement |
| Are answers contradicting our known facts? | [Fact check](../got-wrong/), released, optional | Maintain factual claims → check eligible answers → inspect both the contradiction and quote → correct only supported errors |
| Is the advice worth implementing? | [Next steps](../reading-results/#quick-wins), released in 0.6.0 | Read action verification, investigation or finding → confirm current evidence and scope → implement only justified work → track the outcome |
| Is this grade right? | [Human review and independent checks](../evaluation/), preview | Import saved answers → judge them → optionally batch-check → resolve differences → approve a reference version |
| Would different grading instructions be better? | [Grader comparison](../evaluation/#5-compare-prompts-then-review-a-change), preview | Approve references → compare control/candidates on development evidence → freeze candidates → validate on untouched evidence → review a separate change PR |
| Should old runs use today's grading rules? | [Re-grading](../regrading/), released | Preview eligible runs and cost → explicitly start → inspect new grades and preserved history |
| Did our change help? | [Outcome review](../measuring-success/), released | Verify delivery → collect comparable later answers → check time/counts and margins → interpret the outcome |

**Preview** means an unreleased Evaluation build, currently [app PR #161](https://github.com/cheapseatsdev/cheapseats/pull/161), with `CHEAPSEATS_EVALUATION=1`. The 0.6.0 image and public read-only demo do not provide that workbench. A separate advice-verification benchmark is [proposed research](https://github.com/cheapseatsdev/cheapseats/pull/153), not an executable option in it. Current Next steps verification remains a fallible model judgment over supplied artifacts.

## Know what an evaluation changes

Reviewing or checking a saved answer does not change its production grade. Approving a reference dataset freezes a benchmark; it does not deploy a grader. A comparison supplies evidence for a human decision and separate PR. Re-grading explicitly changes stored grades while preserving original answers, dates and replaced grades. A new buyer run collects new answers.

{{< figure name="regrade-or-recollect" >}}

Manual review, imports, version approval and saved reports make no model calls. Independent checks, comparisons, re-grading, buyer collection, search probes and model-assisted advice use their configured providers and allowances. Site checks call no model, but optional Exa fallback reads can cost money. Review each plan before execution; admission budgets are not hard provider billing ceilings.

The optional **Jev second opinion** in a run report compares verdict/evidence with the production grade. The preview **independent check** compares a fresh assessment with your saved human judgment. Both are model outputs; neither creates a human reference or updates the production grade. [Optional providers](../optional-providers/) explains the run-level passes.

## Read the outcome before repeating

| Outcome | Meaning | Useful next step |
| --- | --- | --- |
| Agreement | Two judgments match under the chosen fields | Retain the human reference; agreement does not add another human reviewer |
| Difference | A grade, evidence or interpretation needs a decision | Inspect the complete evidence, keep or revise with a reason, or leave unresolved |
| Unresolved / insufficient coverage | You cannot support a reference or a class-specific conclusion yet | Repair evidence or add relevant reviewed cases; don't force a label |
| Failure / incomplete calls | The intended assessment did not finish | Inspect access, budget or parse errors; resume or explicitly retry within the workflow's limits |
| No justified action | Evidence does not support executable work | Keep the learning, resolve a worthwhile unknown, or make no change |
| An observed improvement | The selected measure improved under this comparison | Inspect regressions, variation, comparability and practical importance before acting |

The [Evaluation guide](../evaluation/#reading-the-comparison-outcome) covers its report and gate in detail. The [success guide](../measuring-success/#what-the-outcome-means) covers visibility changes, which use different evidence and thresholds.

## When to run what

This is a starting operating routine. The app does not automatically schedule every check below.

For recurring buyer collection, configure the [scheduler and tier intervals](../cli-and-ci/#ask-the-same-questions-every-week). Human reviews, independent-check batches and comparisons still require their explicit workflow actions.

| Signal or interval | Recommended action | Stop or continue when… |
| --- | --- | --- |
| First setup or a new buyer hypothesis | Review questions, run the set, inspect answers | You can explain coverage and a useful decision |
| Weekly, for an active stable set | Collect comparable runs; review important changes and failures | Change the cadence only when the decision and budget warrant it |
| Monthly, or new customer/market evidence | Review the question library and a manageable sample of grades | Preserve useful losing questions; expand cases where interpretation is weak |
| Suspicious grade or a recurring edge case | Human review; optional independent checks | Resolve it from evidence, or keep it unresolved |
| Before a grading prompt/model/normalization change | Frozen-reference comparison and required developer checks | You have adequate references, usable held-out evidence and a reviewed change decision |
| After a site, CDN, robots or rendering change | Audit affected pages; inspect logs where relevant | The specific technical issue is verified fixed; this doesn't promise recommendations |
| Product facts or grading inputs change | Update facts and run the appropriate fact check or re-grade preview | You know which historical readings need refreshing and which cannot be compared |
| After shipping an action | Verify the work immediately; assess visibility later | Counts, elapsed time and comparability support the interpretation |

Do not repeat a held-out comparison while tuning until it passes. Once its cases or disputes inform a candidate, use fresh validation evidence for that candidate. Provider failure is a reason to repair execution, not to reinterpret the answer as absent.

## For engineers: tests and the golden set

`go test -race ./...` and `go vet ./...` check implementation behavior with fake providers. They do not establish that model judgments are correct. The opt-in real-provider golden test checks agreement with stored labels and incurs provider usage. Its current bundled labels are model proposals; a reassuring aggregate score can hide failures on rare classes. Approved Evaluation exports do not replace those fixtures automatically. Follow the repository's [grading procedure](https://github.com/cheapseatsdev/cheapseats/blob/main/docs/grading.md) before a grading-method change.

**Success:** the check reduces a specific uncertainty and leads to a defensible next action, including waiting, preserving the current grader, or deciding no change is needed.
