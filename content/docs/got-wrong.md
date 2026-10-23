---
title: "Got wrong about you: the fact check"
description: "Each answer naming you is read against your listed facts for claims that contradict one, quoted from the answer and handed to the fix list. No grade changes."
weight: 265
group: Reading what it finds
---

An answer can name you and get you wrong: a hosted product you aren't, a price you don't have, a platform you don't run on. The grader records whether you were recommended, named or absent, and the answer's tone, and nothing flags the error. The **fact check** does. After a run, each answer that names the brand is read once more by the grader model, beside the `facts` listed under `[brand]`, for the claims that contradict one. The run page lists them under **Got wrong about you**, by fact, with the answer's own words, and the fix list gets them as evidence.

```toml
[brand]
facts = [
  "Cheap Seats is MIT licensed and runs as a single Docker container with a SQLite database.",
  "Answers come from Claude and OpenAI models through their APIs, or local Claude Code and Codex CLIs.",
]

[grader]
check_facts = false   # off; on by default when facts are listed
```

It needs Cheap Seats 0.4.0 or later, and nothing else: no key, no new section. List facts and it runs.

## What it checks, and what it never does

- Only answers whose verdict is recommended or mentioned, and that name the brand itself, not a namesake the grader marked as [another product](../how-grading-works/).
- Only contradictions of a listed fact: the claim and the fact can't both be true. A fact an answer leaves out, a vaguer or lesser version of one, an answer that says it can't verify you, a claim about a competitor, and an opinion are not misstatements. The checker is told that an empty list is the usual answer.
- Each misstatement names the fact, says in a sentence what the answer got wrong, and quotes the answer's span. The quote is checked to be in the answer, the same check as the grader's [evidence](../reading-results/#the-run-page); one the model didn't copy is dropped, and so is a fact number off the list.

It changes no grade and no trend. The grader's prompt and inputs are part of a run's method ([re-grading](../regrading/)); the fact check is a separate reading, stored in its own tables, and the facts never reach the grader. Add, change or remove a fact and every trend carries on.

## Cost, and when it runs again

One grader call per answer that names the brand. On `provider = "claude-code"` it's $0, on your subscription; through the API it's spent from the same [daily budget](../cost-and-budget/) as runs, a few cents a run on Haiku. An answer is checked once per facts list: running the pass again asks nothing. Change, add or remove a fact and the next run's pass, or `cheapseats misstatements <run-id>` on an older run, checks every answer again under the new list and replaces what it found. Until then the page says how many answers were checked, and how many under an older list.

A [re-grade](../regrading/) doesn't run it: the grades change, the answers don't. Rerun it with the command if the verdicts moved enough that different answers now name you.

## Where it shows

- **Run page**: *Got wrong about you* lists each contradicted fact with the answers that did, most answers first; the prompt grid marks prompts with a misstatement; each answer shows its own under its grade.
- **Fix list**: the analyst gets each contradicted fact, the prompts and one quote, as evidence for a `positioning` or `fix-page` fix on the page that should state the fact, with a `done_when` like "no answer to prompts 3, 7 contradicts fact 2".
- **API and MCP**: `misstatements` in `/api/runs/<id>` and `get_run`: answers checked, and the facts contradicted with their answers, claims and quotes.
- **CLI**: `cheapseats misstatements <run-id>` runs it on a finished run and prints the facts ([reference](../reference/#cli)).
