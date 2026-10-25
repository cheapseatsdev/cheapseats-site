---
title: From fix to pull request
description: How a quick win becomes a pull request with Claude Code, shown on cheapseats.dev's own fix list.
weight: 310
group: Acting on it
---

Pick a fix, give its prompt to Claude Code, review the change, then record the pull request so later runs can measure the outcome. The worked example began on 21 October 2026 with 0 of 90 answers naming Cheap Seats. The screenshots show a different fix in the current demo UI, captured on 24 October; they illustrate the controls, not the original PR.

## 1. Pick a fix

{{< screenshot name="quickwin-current" format="jpg" alt="The quick wins page with one fix expanded: where it goes, what it must say, when it's done, which page it displaces, and why." caption="A generated fix in the demo on 24 October. Read its evidence and verify its claims before implementing it." >}}

Start from the top of quick wins, or filter by site to get the fixes your team owns. Each fix says:

- **Where**: the exact page to create or change.
- **Must say**: the facts the answers were missing.
- **Done when**: a test you can re-run.
- **Displaces**: the page that wins the question today.
- **Why**: the evidence from the run.

We chose two small documentation gaps where answers cited another vendor's help centre. We reserved positioning and competitor claims for human review.

## 2. Hand the prompt to Claude Code

{{< screenshot name="claude-prompt-current" format="jpg" alt="The fix's Prompt for Claude Code: the questions it affects, what the assistant said, who wins the question today, the task, what the page must say and the rules." caption="An excerpt of that fix's Claude Code prompt: target questions, recorded evidence, competing page and task. Scroll the prompt in the app to read the required claims and rules." >}}

Open Claude Code in the repo that owns the site the fix belongs to, and paste the prompt. If you've connected Cheap Seats' [MCP server](../reference/#mcp-server), you can ask for it instead: "get the top quick win for cheapseats.dev and do it". `get_quick_wins` returns each fix with its prompt.

The prompt names the target questions, competing page, required facts and scope. It forbids invented claims: anything the repo cannot support becomes a TODO. Add context only you have, such as actual run numbers, and point Claude Code at the source so it can verify the definitions.

## 3. Review the pull request

Claude Code finishes with a pull request: the page, a summary of what it says, and any TODOs. Review it like any other change:

- **Facts.** Every number and capability should trace to the code, the docs or the run. Check the TODOs and fill or cut them.
- **Scope.** One fix, the page it named, linked from where readers will find it.
- **Answer first.** The opening should answer the buyer's question directly and make its claims easy to verify.

Check the prompt itself too: the analyst works from answers, not your source. Our first PR corrected this definition:

| Analyst draft | Verified rule |
| --- | --- |
| Top pick or explicitly endorsed | Top pick or active endorsement among **three or fewer** primary options |

The page used the grader's rule.

The walkthrough produced [Mentioned vs. recommended](https://github.com/cheapseatsdev/cheapseats-site/pull/1) and [Track AI citations](https://github.com/cheapseatsdev/cheapseats-site/pull/2). Both checked definitions and report scope against source material.

Mark the fix with the pull request while it's open: from its card in quick wins, or ask Claude Code to do it over MCP (`mark_fix`) as part of the same task. It leaves the open list, so the next person picking a fix doesn't pick it again. When it merges, mark it accepted (`set_attempt_state`).

## 4. Merge, then let the next run check it

{{< figure name="fix-lifecycle" >}}

Once the page is live, run the same set again. Check the fix's **Done when** criteria and whether its page appears in the recorded searches or citations. A search result shows the page surfaced; a citation links it to the answer. Neither proves the change caused an improvement.

The analyst writes a fresh fix list with the work already tried. An unresolved fix can return as *retry*, carrying its pull request and results for the target prompts. Search answers may discover a new page after indexing; both tracks can also vary between runs without a model release.

Cheap Seats pools comparable answers for the fix's target prompts from up to five runs before it was marked and the runs since. Its outcome distinguishes:

- **too early:** fewer than 7 days, or fewer than 4 post-change answers per target prompt on average;
- **moved, worse or mixed:** named or recommended changed beyond its 95% margin; the direction and the other metric determine the status;
- **no detectable change:** available answers do not distinguish the observed change from zero. `D ±X` is a margin around D, not a bound saying every possible effect is smaller than X;
- **needs regrade:** later runs use another grading method; **not comparable:** they were asked differently, which re-grading cannot repair.

A *newly surfaced* note means the page began appearing in recorded searches or citations. Fix markers on the [rankings](../reading-results/#rankings) chart help you inspect the surrounding trend. These before/after observations do not establish causality; [Noise and confidence](../noise-and-confidence/#what-no-detectable-change-means-for-a-fix) explains the limits.
