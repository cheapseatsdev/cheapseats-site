---
title: Reviewing grader labels (preview)
description: Review saved answers, batch-check your judgments and compare grader prompts against a frozen reference dataset.
weight: 335
group: Acting on it
---

**Availability:** Evaluation is an unreleased preview in [app PR #155](https://github.com/cheapseatsdev/cheapseats/pull/155), not part of the 0.6.0 image or the public read-only demo. These instructions describe the preview build. It is off by default and unavailable in read-only mode.

Evaluation helps answer “would this grading prompt be better?” First establish human reference labels, then compare the current grader and candidate prompts on the same saved answers. This is separate from [reviewing buyer questions](../prompt-review/) and [re-grading historical runs](../regrading/).

## Start with a separate test database

From the preview app checkout, with the [Go prerequisites](../getting-started/#go-with-subscriptions) installed:

```bash
CHEAPSEATS_EVALUATION=1 \
CHEAPSEATS_CONFIG="$PWD/examples/cheapseats-config/cheapseats.toml" \
CHEAPSEATS_DATA_DIR="$PWD/data/evaluation" \
go run ./cmd/cheapseats serve -addr 127.0.0.1:3000
```

This example config has scheduling disabled. Open `http://127.0.0.1:3000/evaluation`, also available under **Checks → Evaluation**, and choose **Import saved review records**. Reuse the same data directory when restarting: that is where your reviews live. Changing directories does not transfer them.

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

**Save and next** commits the judgment and advances. Drafts autosave without advancing or counting as completed reviews. **End session** saves an unfinished draft for later. The reviewed count measures unique answers; editing one answer repeatedly does not add reviews.

## 2. Check the session as a batch

At **Review session complete**, the app asks whether to run independent checks over the finished judgments. Review the configured grader, cached assessments and allowance, then choose **Run checks for all N**. One progress page tracks the batch and opens the combined comparison when it finishes. If all assessments are already saved, choose **Compare all N saved assessments**.

The Evaluation overview offers the same flow across the selected import's finished judgments, up to 500 cases per batch. You do not need to reopen and save each answer. Leaving the page does not stop the worker; it pauses after 30 minutes or an explicit pause. Saved results survive a restart. Resume reuses completed assessments; retrying failed or interrupted checks is explicit. A crashed worker's lease must expire before recovery. Failures remain unknown, never absent.

The assessor receives the saved question, complete answer, intended brand, competitors and rubric, with old and human labels, notes and quotes removed. That makes the assessment independent of those labels; it does not make two model judgments statistically independent or create another human review.

## 3. Resolve differences together

**Compare independent checks** shows the human and model judgments, reasoning, evidence and failures for all selected answers. Agreements need no action. For differences:

- **Keep your judgments:** select differences, choose **Keep selected judgments** and give the required explanation. Review the selected rows before applying one explanation to several cases.
- **Revise or investigate one:** choose **Change or inspect judgment**. Saving returns to that row in the batch comparison. You may also leave the case unresolved.

The model never accepts its own labels. A changed answer revision or check set requires reviewing the current data before resolving it; successful resolutions on other cases stay saved. This comparison uses current human judgments. It is not yet a frozen benchmark. Checks are optional, but running checks and pending differences must be settled before a case can enter an approved version.

## How many should you review?

There is no universal target of 80 answers. Begin with a short pilot to learn the rubric, then inspect your collection's verdicts, top picks, namesakes, tones, close calls and distinct question/answer groups. Review the whole collection when it is manageable. For a larger collection, curate a set covering those cases, preserve grouped partitions and reserve separate untouched validation evidence. The session limit of ten is a workflow convenience, not a benchmark-size requirement.

**Worked example: Cheap Seats' bundled collection.** For these particular 80 records, we recommend reviewing all 80 in short sessions. Your import may have a different size and distribution. Before human review, all 80 bundled labels are Claude proposals: 74 absent, four recommended and two mentioned, with only three positive top-pick labels and one namesake. Human review may change these counts.

All 80 are still a curated calibration sample, not production prevalence or proof of reliability. With the current grouping rule, the collection splits into 67 development and 13 held-out cases; all 13 held-out proposals are absent. Add fresh real answers covering the rare classes and close calls before treating held-out results as evidence for a prompt improvement. Do not force uncertain answers into a class to fill a quota. Two examples per core class is only the app's minimum coverage floor, not a recommended sample size.

Related questions and strongly overlapping answers stay in the same partition through a lexical grouping rule; this does not prove semantic independence. You may annotate held-out answers, but must not use them or their disputes to tune a candidate. Public fixtures already used in prompt development are not untouched validation, even if the app has no record of that use.

## 4. Approve a reference dataset

From Evaluation, choose **Preview dataset version**. Review membership, current label revisions, blocked rows and grouped partitions. Explain every exclusion. Only complete committed judgments under the current rubric, without running checks or pending differences, can be included.

Approval freezes the evidence, labels, supporting passages, rules, partitions and review history. Download both the JSONL and full manifest: the JSONL keeps the first supporting passage, while the manifest keeps all passages and exclusion details. This is a single-human-reviewed reference, not independent human adjudication. Later edits require a new approved version; existing versions and comparison denominators remain frozen.

## 5. Compare prompts, then review a change

On the approved version, choose **Create a grader comparison**. Select development evidence and one or two candidate prompts that preserve the rubric's meaning. A changed grading definition needs separate review. The control is the production prompt saved in the dataset's rubric. Model, transport and saved answers remain fixed; each grader runs twice to expose variation.

Review the call plan and budget, then explicitly choose **Run remaining assessments**. Inspect per-class counts, missing predictions, paired improvements and regressions, quote validity and repeated-run differences. A high aggregate agreement rate can hide rare-class failures. Masked A/B/C review lets a reviewer judge outputs before seeing candidate identities or the frozen reference label; it does not change that reference.

Freeze candidates before using untouched held-out evidence. Creating a held-out comparison consumes those groups for validation, even if no calls finish; resume that comparison rather than creating another to claim freshness. Candidate changes informed by its results need fresh validation evidence.

A comparison report never installs a new prompt. Passing its conservative gate is a prerequisite for human release review, not statistical proof or deployment approval. Make a separate prompt/code PR with the results, limitations and required checks. Exported labels do not update the repository's golden fixtures or CI automatically; transferring approved labels is another reviewed change. Only a shipped grader change can improve future grading. [Re-grade eligible historical answers](../regrading/) separately if you want them measured under it.

For import limits, private exports, comparison CLI commands, retry rules and complete provenance details, see the preview [repository guide](https://github.com/cheapseatsdev/cheapseats/blob/f7e92be17bac5f91933e15acbb9243b0bb859351/docs/evaluation.md) and [CLI reference](../reference/#evaluation-preview).

## Backups and rollback

The preview uses database schema 19. Opening an existing database backs it up before migration, and an older binary refuses the newer schema. To roll back, restore the pre-migration backup with the older build. Use a separate test directory for the preview; a read-only copy disables writes but does not redact review evidence or private data.
