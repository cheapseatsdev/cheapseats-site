---
title: Reviewing grader labels (preview)
description: Learn what each grader evaluation is for, run the full review and comparison workflow, and interpret its outcomes and rerun signals.
weight: 335
group: Acting on it
---

**Availability:** Evaluation is a preview in 0.7.0 and later, including batch checks and saved-run imports. It is off by default: set `CHEAPSEATS_EVALUATION=1` to enable it. It is unavailable in read-only mode, so the public demo does not show it.

Evaluation helps answer “would this grading prompt be better?” First establish human reference labels, then compare the current grader and candidate prompts on the same saved answers. This is separate from [reviewing buyer questions](../prompt-review/) and [re-grading historical runs](../regrading/).

## What each part is for

| Part | Question it answers | Result |
| --- | --- | --- |
| Human review | What does this saved answer actually say about the intended brand? | A committed judgment, supporting evidence and reviewer history |
| Independent check | Does another model assessment disagree with my judgment? | Agreement, differences or a failed check; the human still decides |
| Approved dataset | Which references and exclusions will this experiment use? | A frozen version, with an explicit denominator and provenance |
| Grader comparison | How does a candidate perform against the current grader on those references? | Per-class results, improvements/regressions and repeated-run differences |
| Release review | Does the evidence justify shipping a change? | A human decision and a separate change PR; the workbench never deploys it |

{{< figure name="evaluation-lifecycle" >}}

### Words used in the experiment

| Word | Meaning |
| --- | --- |
| Rubric | The written rules for recommended, mentioned, absent and the other scored fields |
| Reference | The human-reviewed label the experiment compares predictions against |
| Class | One category within a scored field, such as recommended, namesake-only true, or negative tone |
| Class coverage | How many reviewed references represent each category; this is different from web-page coverage |
| Control | The production grader instructions saved in the approved version |
| Candidate | A proposed alternative set of grading instructions |
| Development | Evidence you can inspect and use while tuning a candidate |
| Held-out | Evidence kept unused for tuning, reserved to validate a frozen candidate |
| Repetition | A separate model call on the same case; it exposes variability |
| Regression | A core-field prediction the candidate gets wrong where the control matched the frozen reference |
| Baseline | A deliberately simple classifier, such as always predicting absent, used to expose a weak benchmark |

## Start with a separate test database

From an app checkout at v0.7.0 or later, with the [Go prerequisites](../getting-started/#go-with-subscriptions) installed:

```bash
CHEAPSEATS_EVALUATION=1 \
CHEAPSEATS_CONFIG="$PWD/examples/cheapseats-config/cheapseats.toml" \
CHEAPSEATS_DATA_DIR="$PWD/data/evaluation" \
go run ./cmd/cheapseats serve -addr 127.0.0.1:3000
```

This example config has scheduling disabled. Open `http://127.0.0.1:3000/evaluation`, also available under **Checks → Evaluation**, and choose **Import saved review records**. Reuse the same data directory when restarting: that is where your reviews live. Changing directories does not transfer them.

For your own results, choose **Add answers from a saved run**. Select answers from a finished run and explicitly choose **Import selected answers**. You can also enter from **Review saved answers** on a run or **Review this grade** beside an answer. One unique case opens directly; larger selections open their review queue. There is no required collection size; a single import accepts up to 500 selected answers within 16 MiB.

Run imports keep the exact saved answer, question, intent and recorded brand/competitor context, including completed regrade context. They retain source IDs and keep matching cases' existing reviews. If the run changes after preview, review the selection again. Missing source evidence stays unavailable. A source-run link is shown only when the exact saved answer and question are present in this deployment. Bundled or foreign evidence keeps its provenance without linking to a missing local run. The source-run link reveals the old model grade, so visiting the report first does not create independently blinded adjudication.

To use your own collection, import a private JSONL file before starting the server:

```bash
CHEAPSEATS_DATA_DIR="$PWD/data/evaluation" \
go run ./cmd/cheapseats evaluation import /path/to/records.jsonl
```

The file uses the [golden record contract](https://github.com/cheapseatsdev/cheapseats/blob/main/docs/grading.md#the-golden-set). Select its evidence import in Evaluation. Importing a label marked `human` does not create a human review event in the workbench.

Importing, manual review, dataset approval and export make no model calls. Independent checks and grader comparisons require access to the configured grader. API calls cost money; CLI calls use their subscription allowance. Opening a preview or report starts no calls. Budget limits admit estimated usage, rather than guaranteeing a provider billing ceiling.

The usual [authentication rules](../reference/#access) apply. A loopback instance without tokens trusts every local user or program; use tokens on a shared machine. Keep private imports and exports private.

## 1. Review the saved answers

Choose **Start review · up to 10 cases**. Read each complete answer, buyer question and intended brand identity before judging it. Imported labels, quotes and notes stay hidden until you commit a human judgment. A draft does not unlock them.

Use the [normal grading definitions](../how-grading-works/#three-grades). Evidence depends on the answer:

| Your judgment | Supporting evidence |
| --- | --- |
| Recommended or mentioned | Quote the passage that supports the verdict; choose tone, and explicitly decide top pick for a recommendation |
| Absent: no reference to the intended brand | Leave passages blank and confirm you read the whole answer |
| Absent: echoed name or unrelated namesake | Quote the disclaimer or wording that identifies the other product |
| Cannot finish the judgment | Choose **Leave unresolved**, select the issue and explain what prevents a decision |

For example, “I don't have reliable information on a product called Cheap Seats or its methodology” is **absent: echoed name** when the rest of the answer supplies no concrete product information. Quote that disclaimer. A hedged statement about a real feature or fit can instead make the answer mentioned.

“What remains unclear, if unresolved?” asks what prevents you from deciding, such as a truncated answer or ambiguous product identity. Leave it blank when you can finish the judgment. A quote match establishes that the words occur in the answer; you still decide whether they support your interpretation.

**Save and next** commits the judgment and advances. The reviewed count measures unique answers; editing one answer repeatedly does not add reviews.

Uncommitted drafts autosave without advancing or counting as completed reviews. Edits to a saved judgment or unresolved decision stay in the browser tab until an explicit save; autosave does not replace either decision. Reopening a session after an interrupted save offers continuation without saving the same judgment again.

**End session** pauses at the same case. A saved judgment or unresolved decision stays unchanged; unfinished work is saved as a draft.

## 2. Check the session as a batch

At **Review session complete**, the app asks whether to run independent checks over the finished judgments. Review the configured grader, cached assessments and allowance, then choose **Run checks for all N**. One progress page tracks the batch and opens the combined comparison when it finishes. If all assessments are already saved, choose **Compare all N saved assessments**.

The Evaluation overview offers the same flow across the selected import's finished judgments, up to 500 cases per batch. You do not need to reopen and save each answer. Leaving the page does not stop the worker; it pauses after 30 minutes or an explicit pause. Saved results survive a restart.

Resume reuses completed assessments. Stopping the enclosing run, its 30-minute deadline and exhausted admission budgets preserve the assessment allowance and resume without selecting retry; recorded provider charges remain. A single request hitting its three-minute limit counts as a failed attempt and the worker continues to the later cases. Request failures and crashed claims still need explicit retry, within the two-attempt limit.

A crashed worker's lease must expire before recovery. After a final-attempt crash, an expired lease is an unknown result rather than a permanently running check; late workers cannot save after expiry. Failures remain unknown, never absent.

The assessor receives the saved question, complete answer, intended brand, competitors and rubric, with old and human labels, notes and quotes removed. That makes the assessment independent of those labels; it does not make two model judgments statistically independent or create another human review.

## 3. Resolve differences together

**Compare independent checks** shows the human and model judgments, reasoning, evidence and failures for all selected answers. Agreements need no action. For differences:

- **Keep your judgments:** select differences, choose **Keep selected judgments** and give the required explanation. Review the selected rows before applying one explanation to several cases.
- **Revise or investigate one:** choose **Change or inspect judgment**. Saving returns to that row in the batch comparison. You may also leave the case unresolved.

The model never accepts its own labels. A changed answer revision or check set requires reviewing the current data before resolving it; successful resolutions on other cases stay saved. This comparison uses current human judgments. It is not yet a frozen benchmark. Checks are optional, but running checks and pending differences must be settled before a case can enter an approved version.

## How many should you review?

There is no universal target of 80 answers. Begin with a short pilot to learn the rubric, then inspect your collection's verdicts, top picks, namesakes, tones, close calls and distinct question/answer groups. Review the whole collection when it is manageable. For a larger collection, curate a set covering those cases, preserve grouped partitions and reserve separate untouched validation evidence. The session limit of ten is a workflow convenience, not a benchmark-size requirement.

**Worked example: Cheap Seats' bundled collection.** For these particular 80 records, we recommend reviewing all 80 in short sessions. Your import may have a different size and distribution. Before human review, all 80 bundled labels are Claude proposals: 74 absent, four recommended and two mentioned, with only three positive top-pick labels and one namesake. Human review may change these counts.

This is a curated calibration sample, not production prevalence or proof of reliability. Add fresh real answers covering the rare classes and close calls before treating held-out results as evidence for a prompt improvement. Do not force uncertain answers into a class to fill a quota. Two examples per core class is only the app's minimum coverage floor, not a recommended sample size.

Related questions and strongly overlapping answers stay in the same partition through a lexical grouping rule; this does not prove semantic independence. You may annotate held-out answers, but must not use them or their disputes to tune a candidate. Public fixtures already used in prompt development are not untouched validation, even if the app has no record of that use.

## 4. Approve a reference dataset

From Evaluation, choose **Preview dataset version**. Review membership, current label revisions, blocked rows and grouped partitions. Explain every exclusion. Only complete committed judgments under the current rubric, without running checks or pending differences, can be included.

Approval freezes the evidence, labels, supporting passages, rules, partitions and review history. Download both the JSONL and full manifest: the JSONL keeps the first supporting passage, while the manifest keeps all passages and exclusion details. This is a single-human-reviewed reference, not independent human adjudication. Later edits require a new approved version; existing versions and comparison denominators remain frozen.

## 5. Compare prompts, then review a change

On the approved version, choose **Create a grader comparison**. Select development evidence and one or two candidate prompts that preserve the rubric's meaning. A changed grading definition needs separate review. The control is the production prompt saved in the dataset's rubric. Model, transport and saved answers remain fixed; each grader runs twice to expose variation. With one candidate, that means four planned calls per case: two control and two candidate calls, before retries.

Review the call plan and budget, then explicitly choose **Run remaining assessments**. Inspect per-class counts, missing predictions, paired improvements and regressions, quote validity and repeated-run differences. A high aggregate agreement rate can hide rare-class failures. Masked A/B/C review lets a reviewer judge outputs before seeing candidate identities or the frozen reference label; it does not change that reference.

Freeze candidates before using untouched held-out evidence. Creating a held-out comparison consumes those groups for validation, even if no calls finish; resume that comparison rather than creating another to claim freshness. Candidate changes informed by its results need fresh validation evidence.

A comparison report never installs a new prompt. Passing its conservative gate is a prerequisite for human release review, not statistical proof or deployment approval. Make a separate prompt/code PR with the results, limitations and required checks. Exported labels do not update the repository's golden fixtures or CI automatically; transferring approved labels is another reviewed change. Only a shipped grader change can improve future grading. [Re-grade eligible historical answers](../regrading/) separately if you want them measured under it.

## Reading the comparison outcome

{{< figure name="evaluation-outcomes" >}}

| What you find | What it means | What to do next |
| --- | --- | --- |
| Incomplete predictions or provider errors | The planned experiment did not finish; missing results are not absent predictions | Repair access or budget and resume; explicitly retry only when intended |
| Insufficient coverage | Some core classes lack enough reviewed references to report their rates | Add relevant evidence and approve a new version; don't interpret an aggregate score as validation |
| Critical-class failure | A represented important class has zero recall | Inspect those cases; a majority-class score cannot make this acceptable |
| Paired regressions | The candidate changed some correct core-field predictions to incorrect ones | Inspect the exact cases and tradeoff; the conservative gate blocks release-review eligibility |
| No observed improvement or more repeat variation | The candidate lacks the required evidence of gain or is less consistent in these repeats | Keep the control or investigate using development evidence; report uncertainty |
| Conservative prerequisites met | This candidate clears the implemented checks on the selected held-out comparison | Review provenance, real disagreements, meaning of the rubric and practical importance before proposing a change |

**Recall** asks how many references in a class the grader found. **Precision** asks how many predictions of that class were correct. Inspect both and their counts; a classifier can look accurate overall while missing every recommendation. The four core fields are verdict, top pick, namesake-only and tone. Quote checks establish occurrence, not logical support; entity extraction and every downstream claim are not thereby validated.

**Success:** a supported decision to change or retain the grader, with explicit remaining uncertainty. A more complicated prompt, model agreement, a high aggregate score or a passing gate alone is not that decision. A changed reference label needs a new approved version and a new comparison.

## When to run these evaluations

| Signal | Recommended workflow |
| --- | --- |
| First use or an unfamiliar answer type | Run a small human-review pilot; inspect friction and rubric questions before scaling |
| A suspicious grade or repeated disagreement | Import those saved answers, review them and optionally run independent checks |
| New evidence, brand ambiguity or class gaps | Add relevant cases and review them; reuse existing human work rather than starting it over |
| A proposed grader prompt, model or normalization change | Compare fixed control/candidates against approved references before changing production |
| Results informed a candidate revision | Continue on development evidence; obtain fresh untouched evidence for validation |
| An active deployment's periodic health review | Sample grades at a useful interval, for example monthly, and investigate recurring failures |

These are suggested triggers, not an automatic schedule or a mandate to relabel every case each month. Reuse cached independent assessments only when their evidence, rubric, model and evaluator context still match. Running a comparison on new evidence answers a different question from repeating a call on the same case. Set the cadence by the risk, change rate and decisions you need to make.

For import limits, private exports, comparison CLI commands, retry rules and complete provenance details, see the [repository guide](https://github.com/cheapseatsdev/cheapseats/blob/v0.7.0/docs/evaluation.md) and [CLI reference](../reference/#evaluation-preview). For other kinds of checks, use [Which check or evaluation should I run?](../checks-and-evaluations/).

## Backups and rollback

0.7.0 uses database schema 19, whether or not Evaluation is enabled. Opening an existing database backs it up before migration, and an older binary refuses the newer schema. To roll back, restore the pre-migration backup with the older build; see [Upgrading to 0.7.0](../upgrading/#upgrading-to-070). Use a separate test directory while you try the workbench; a read-only copy disables writes but does not redact review evidence or private data.
