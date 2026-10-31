---
title: "Got wrong about you: the fact check"
description: Find answers contradicting your listed facts, with verified quotes and evidence for the fix list.
weight: 265
group: Reading what it finds
---

An answer can recommend you and get your price, platform or product wrong. List facts under `[brand]` to check answers that name you for contradictions. Findings appear under **Got wrong about you** and feed the fix list. They do not change grades or trends.

Run the workflow as **maintain current public facts → check eligible answers → inspect the claimed contradiction and quote → decide whether a supported correction is needed**. An empty completed check means no contradiction of those listed facts was found in the checked eligible answers; it does not certify every claim as true. A failed check is incomplete evidence, not an empty successful result.

Revisit after a factual product change, a suspicious claim or a grading change that alters eligibility. Success is a correct, supported interpretation and an appropriate response, including no change when the answer is accurate. [Choose a check](../checks-and-evaluations/) if the concern is visibility, site access or grading rather than a contradiction.

```toml
[brand]
facts = [
  "Cheap Seats is MIT licensed and runs as a single Docker container with a SQLite database.",
  "Answers come from Claude and OpenAI models through their APIs, or local Claude Code and Codex CLIs.",
]

[grader]
check_facts = false   # off; on by default when facts are listed
```

Requires Cheap Seats 0.4.0 or later. No additional key or provider is needed.

## What it checks, and what it never does

The grader model reads each eligible answer beside your listed facts:

- **Eligible:** recommended or mentioned answers about your brand, excluding namesakes marked as [another product](../how-grading-works/#three-grades).
- **Contradictions only:** the claim and listed fact cannot both be true. Omissions, vaguer statements, inability to verify, competitor claims and opinions aren't misstatements. The expected result is usually empty.
- **Verified evidence:** each finding identifies the fact, explains the contradiction and quotes the answer. Invalid fact numbers and quotes absent from the answer are dropped, using the same [evidence check](../how-grading-works/#three-grades) as grading.

Facts never reach the visibility grader. The fact check is stored separately, so changing facts doesn't restart trends.

## Cost, and when it runs again

One grader call per eligible answer. Your subscription covers `claude-code` calls; API calls use the [daily budget](../cost-and-budget/) and cost a few cents per run on Haiku.

Answers are checked once per facts list. Changing the list makes the next run's pass—or `cheapseats misstatements <run-id>` on an older run—check again and replace findings. Until then, the page shows how many answers were checked under the current and older lists.

[Re-grading](../regrading/) doesn't run this pass. Rerun it manually if changed verdicts alter which answers are eligible.

## Where it shows

| surface | what you get |
| --- | --- |
| **Run page** | Contradicted facts, most answers first; prompt markers and findings under each answer's grade. |
| **Fix list** | Facts, prompts and a quote as evidence for `positioning` or `fix-page` work, with a checkable `done_when`. |
| **API / MCP** | `misstatements` in `/api/runs/<id>` and `get_run`: checked count, contradicted facts, answers, claims and quotes. |
| **CLI** | `cheapseats misstatements <run-id>` checks a finished run and prints findings ([reference](../reference/#cli)). |
