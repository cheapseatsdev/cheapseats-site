---
title: From fix to pull request
description: How a quick win becomes a pull request with Claude Code, shown on popcorn.zone's own fix list.
weight: 45
---

Every run ends with a fix list, and [quick wins](../reading-results/#quick-wins) ranks the fixes across sets. Each fix carries a prompt for Claude Code, so the step from "the assistants don't name us here" to a reviewed change is short. Here is the loop as we ran it on popcorn.zone's own dashboard on 21 October 2026. We started from a baseline where Popcorn was named in none of the 90 answers.

## 1. Pick a fix

{{< screenshot name="quickwin" alt="The quick wins page with one fix expanded: where it goes, what it must say, when it's done, which page it displaces, and why." caption="Quick wins on popcorn.zone's dashboard, with the second fix expanded." >}}

Start from the top of quick wins, or filter by site to get the fixes your team owns. Each fix says:

- **Where**: the exact page to create or change.
- **Must say**: the facts the answers were missing.
- **Done when**: a test you can re-run.
- **Displaces**: the page that wins the question today.
- **Why**: the evidence from the run.

We picked two urgent, small documentation fixes. Both were pages popcorn.zone didn't have, on questions where a help-centre article from another vendor shaped the answers. We left the positioning fixes (README and homepage wording) and the competitor comparison page for a person to write. They make claims about other products and about how we describe ourselves, and an assistant shouldn't decide those.

## 2. Hand the prompt to Claude Code

{{< screenshot name="claude-prompt" alt="The fix's Prompt for Claude Code: the questions it affects, what the assistant said, who wins the question today, the task, what the page must say and the rules." caption="The prompt Popcorn writes for each fix. It's self-contained: Claude Code needs nothing else from the dashboard." >}}

Open Claude Code in the repo that owns the site the fix belongs to, and paste the prompt. If you've connected Popcorn's [MCP server](../reference/#mcp), you can ask for it instead: "get the top quick win for popcorn.zone and do it". `get_quick_wins` returns each fix with its prompt.

The prompt does most of the work:

- It names the questions the page has to answer, the page it has to beat, and where the change goes.
- It forbids invented numbers, prices and capabilities. A fact the repo can't back up becomes a marked TODO.
- It asks for one fix, scoped. When you hand over a fix, add the context only you have. We gave Claude Code the real numbers from the run for the worked example, and pointed it at the app's source, so definitions come from the code rather than from the prompt's paraphrase.

## 3. Review the pull request

{{< screenshot name="guide-mvr" alt="The new guide, Mentioned vs. recommended, opening with a direct answer to each buyer question." caption="What the first pull request adds: popcorn.zone/guides/mentioned-vs-recommended, built from the pull request's branch." >}}

Claude Code finishes with a pull request: the page, a summary of what it says, and any TODOs. Review it like any other change:

- **Facts.** Every number and capability should trace to the code, the docs or the run. Check the TODOs and fill or cut them.
- **Scope.** One fix, the page it named, linked from where readers will find it.
- **The answer comes first.** Assistants quote pages that state the answer plainly and early, so the first paragraph should answer the question in the buyer's words.

The review is where you catch what the prompt got wrong. Popcorn's analyst writes the fix from the answers, not from your code, so its summary of your product can be loose. On the first pull request, Claude Code checked the prompt against the app's source and reported six places where they differed. For example:

- The prompt asked for an "average position". Popcorn records each answer's position but doesn't average it, so the page shows how to compute one from the CSV export instead of claiming a metric that doesn't exist.
- The prompt defined "recommended" as "top pick or explicitly endorsed". The grader's rule is stricter: the top pick, or one of three or fewer options the answer actively endorses. The page uses the grader's rule.

That's the reason to give Claude Code the source and not only the prompt.

The two pull requests from this walkthrough:

- [Mentioned vs. recommended](https://github.com/metcalfc/popcorn-site/pull/1): defines the three grades, the rates and share of voice exactly as Popcorn computes them, with Popcorn's own zero-score run as the worked example.
- [Track AI citations](https://github.com/metcalfc/popcorn-site/pull/2): which pages AI assistants rely on, and how that complements Google Search Console's generative AI report and Bing Webmaster Tools' AI Performance report. Claude Code checked each report's scope against Google's and Microsoft's own pages, and left out what it couldn't confirm.

## 4. Merge, then let the next run check it

Once the page is live, the next run of the set re-asks the questions. Each fix's **Done when** says what to look for. For these two, it's the new page among the pages that shaped the answers to the named prompts, which the run page lists under each prompt and in **Pages and searches**. The fix list is written fresh from each run, so a fix that worked usually drops off it, and one that didn't comes back, often with a sharper reason.

It doesn't happen at once. Search-track answers pick up a new page once it's indexed, and recall answers only change when the models do. Give a fix a few weekly runs before you judge it, and read the [rankings](../reading-results/#rankings) trend rather than one day.
