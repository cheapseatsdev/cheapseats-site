---
title: Your first run, from question to decision
description: Collect an initial measurement, understand the denominators, inspect answers and decide what to do next.
weight: 200
group: Reading what it finds
---

Your first run gives you a starting measurement and a set of answers to inspect. Its job is to reveal useful questions and evidence; a single run cannot establish that your marketing worked.

## Before you start

Finish [setup](../getting-started/), review your brand identity and [buyer questions](../choosing-questions/), and check which answerers are available. Review model prices, sample counts and the daily admission budget. Unavailable answerers are skipped, so confirm which systems the result actually covers.

In the dashboard, open the set and start a run. For a local CLI setup, `cheapseats run <set-id>` collects and grades it. On an existing deployment use its UI or API rather than opening the database from another process. Provider calls use API charges or subscription allowances.

{{< figure name="run-pipeline" >}}

## 1. Check whether the run finished

| What you see | What it means | What to do |
| --- | --- | --- |
| Done | The run completed; inspect its graded count and skipped answerers | Continue to rates and full answers |
| Queued or running | Collection or analysis is still in progress | Watch progress; don't start another copy |
| Budget or partial | Some work remains; completed results are retained | Inspect the reason, then use **Retry unfinished** when ready |
| Failed or cancelled | The intended collection did not complete | Read errors and decide whether to retry |

A missing or failed answer is not an absent brand. Check errors and the actual graded denominators before comparing percentages.

## 2. Ask what each percentage divides by

The **denominator** is the number of eligible answers you divide by. In a reading such as **2/6**, two answers counted as hits out of six eligible graded answers. Always read the count and eligibility beside the percentage.

{{< figure name="first-run-denominators" >}}

Named measures substantive presence of your intended brand. Recommended and top pick concern product-choice answers. A namesake or a name-only disclaimer is absent. [Grading definitions](../how-grading-works/) cover the close calls; [metric definitions](../metrics/) owns the formulas.

Choose the track that answers your question. Search shows what assistants answer with required web retrieval; recall shows answers without tools. Compare the same answerers, tracks and comparable questions. Neither track reproduces every consumer app session.

## 3. Read the answers before choosing work

Open **Every answer**, then a question and its answers. Read at least a clear recommendation, a loss and a close call when present. Check the full text, reasoning, top pick, objections and retained evidence quote. A real quote can still be interpreted incorrectly.

{{< figure name="first-run-decision" >}}

Use **Sources** and **What the assistants searched** to check queries, returned URLs and citations. A missing page in this trace does not prove it is absent from the site or unindexed. [Reading results](../reading-results/) maps each view to its evidence.

## 4. Leave with a decision

Write a short read-out: which buyer situations were measured, which systems answered, what evidence stood out, what remains uncertain, and the next decision. An action might correct a supported factual gap. An investigation might check an unread target. A finding might support keeping an intentional product limit.

**Success:** you can explain what the report says and what it cannot yet establish. You do not need a positive rate change or a list of fixes to make the first run useful.

For a stable, affordable starting routine, consider one sample per enabled track and weekly runs; choose a different cadence when the decision and budget justify it. This is a recommendation, not an automatic precision guarantee. [Choose the right check](../checks-and-evaluations/#when-to-run-what) for new signals, and [measure success](../measuring-success/) after a change.
