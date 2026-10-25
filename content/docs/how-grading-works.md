---
title: How grading works
description: How answers become recommended, mentioned or absent grades, and how to check the evidence behind each one.
weight: 220
group: Reading what it finds
---

Cheap Seats asks assistants your buyers' questions. A separate Claude call grades each answer **recommended**, **mentioned** or **absent** for your brand. Every answer, search, result, citation and grade is stored so you can check the reasoning or export the evidence.

## Which assistants it asks

Claude and OpenAI models, through their APIs or the `claude` and `codex` CLIs. These are model responses, not the consumer apps; Google's AI surfaces, Gemini, Perplexity and Copilot aren't covered. [Which AI engines Cheap Seats asks](../engines/) explains the coverage and limits.

## Two tracks

{{< figure name="run-pipeline" >}}

Search requires web retrieval before answering; recall uses no tools. Repeated answers on either track can vary. Set `samples` per assistant and track; zero disables that track.

## Three grades

The grader sees the question, answer, brand name, aliases and `about`, plus competitors' canonical names and aliases. It grades only your brand:

| verdict | when |
| --- | --- |
| `recommended` | the top pick, or one of at most three primary recommendations actively endorsed for the buyer's situation |
| `mentioned` | named among many options, in passing, as a comparison point or with reservations |
| `absent` | not named (including aliases); named only to disclaim knowledge of it; or the name means another product |

A table listing your brand alongside nine others is `mentioned`, not `recommended`.

**An echoed name is not visibility.** “I couldn't find a product called Cheap Seats,” followed by evaluation advice or hypothetical features, is `absent`. An answer must state something about the brand itself—a feature, price, quality or fit, even hedged—to count as `mentioned`.

Each grade also records:

| field | meaning |
| --- | --- |
| **Position** | where your brand first appears among named products |
| **Top pick** | the single product most strongly recommended, if any |
| **Products named** | every product, folded onto competitors' canonical names for share of voice |
| **Reasoning** | one or two sentences explaining the deciding wording |
| **Why not #1** | what the answer preferred and why |
| **Objections / praise** | specific concerns and credited strengths |
| **Tone** | positive, negative, mixed (clear praise and criticism) or neutral (no judgment) about your brand; none when absent |
| **Evidence** | the sentence best supporting the verdict; none when absent |

**Evidence is checked.** Cheap Seats matches the grader's quote to the answer, ignoring case, spacing, markdown emphasis and curly quotes, then keeps the answer's own span. Unmatched quotes are dropped. The run page highlights the retained text; exports and MCP `get_result` include it as `evidence`.

Tone and praise feed [net sentiment and themes](../metrics/#sentiment-and-themes). Questions marked `intent = "info"` can be answered completely without a product choice, so they count toward named only, not recommended or top pick. See [choosing intent](../prompt-sets/#say-what-a-good-answer-looks-like).

Grading changes mark new methods in trends. Older grades may have no tone or evidence; evidence arrived in 0.2.5. Version 0.4.4 restored `absent` for echoed names after 0.4.3 briefly graded them `mentioned`; agreement on the 80-answer golden set rose from 90% to 97–99%. [Re-grade stored answers](../regrading/) to apply today's grading without asking the assistants again; replaced grades are retained.

## Worked examples

These are from Cheap Seats' own runs on 22 October 2026:

| answer | grade and reason |
| --- | --- |
| “I can't vouch for Cheap Seats specifically,” followed by no reliable product information | **Absent:** an echoed name states nothing about the product. A hedged feature or fit would make it mentioned. |
| “I'd start by evaluating Cheap Seats,” but also “I don't have reliable enough information about Cheap Seats' capabilities” | **Close call:** graded ten more times, this answer was mentioned nine times and recommended once. Read the reasoning on borderline answers. |
| An answer couldn't verify the intended product, then described an unrelated product selling WhatsApp agents | **Absent:** a namesake isn't your brand. The grader uses `about` to distinguish them. |
| An answer warmly endorsed Gauge and never named Cheap Seats | **Absent for Cheap Seats:** endorsing a competitor doesn't endorse your brand. A text check enforces absent if neither your name nor any alias appears. |

## Rates and intervals

The run page shows named, recommended and top-pick rates per assistant and track, each with a 95% Wilson interval. The share-of-voice board counts all named products. [Metric definitions](../metrics/) gives every denominator; [How big a change Cheap Seats can detect](../noise-and-confidence/) explains sampling uncertainty.

## Checking a grade

Expand an answer on the run page to read its full text, highlighted evidence, searches, results, citations and grading reasons. Each run stores its grading instructions, config commit and Cheap Seats version, and exports to CSV or JSON.

The grader is checked against human-labeled stored answers in `internal/grade/testdata/golden/`. Run the real grader with:

```bash
CHEAPSEATS_GOLDEN=1 go test ./internal/grade/... -run Golden
cheapseats golden export <snapshot.db>
```

The test fails below its agreement threshold; the export samples a deployment's answers for labeling. Grader changes must pass this check. The repository's [grading procedure](https://github.com/cheapseatsdev/cheapseats/blob/main/docs/grading.md) has the details.
