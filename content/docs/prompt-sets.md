---
title: Prompt sets
description: The buyer questions Cheap Seats asks, as TOML files in your config repo, with ids that keep their history.
weight: 130
group: Start here
---

Each file in your config repo's `prompt-sets/` is one category of buyer questions. Cheap Seats only reads them, so change one with a pull request, after `cheapseats check`.

## Format

```toml
id = "ai-search-visibility"       # never change it: runs and rankings key on it
name = "Finding out whether AI assistants recommend us"
tier = "core"                     # cadence and samples follow [tiers.core] or [tiers.plg]
description = """What the category is, who is competing for it, and what the brand claims."""

[[prompts]]
id = "find-whether-chatgpt-recommends-product"
text = "How can I find out whether ChatGPT recommends my product when people ask about my category?"

[[prompts]]
id = "recommended-versus-mentioned-ai-answers"
text = "What's the difference between being mentioned and being recommended in an AI answer?"
intent = "info"                   # asks to explain, not to choose: scored on named, not recommended

# Products the grader folds onto one canonical name, so share of voice counts "Peec" as Peec AI.
# Competitors every set shares go once in cheapseats.toml; list one here only for this set.
[[competitors]]
name = "Peec AI"
aliases = ["Peec"]
```

## Prompt ids are permanent

Results, trends and fix lists follow a prompt by its id, so:

- **Same id, same question.** Fixing a typo or rewording keeps the id: the prompt's history carries on, marked as reworded that day. Asking something different gets a new id.
- **Ids are unique across every set** and never reused. Moving a prompt to another set keeps its id, and its history moves with it. Once removed, an id stays retired.
- Order in the file is only display order.

## Say what a good answer looks like

Most questions ask an assistant to choose ("what should I use for...", "X vs Y"), so the brand is scored on being recommended and being the top pick. A question that asks it to explain or how-to ("what is...", "how do I...") can be answered well without naming any product.

Mark those `intent = "info"`. Their answers count toward named rate, but are excluded from recommended and top-pick denominators. A good explanation need not recommend a product. Citations are tracked separately.

Don't reword an explanation question into "recommend a tool" to make it scoreable: that's a different question, which needs a new id. Changing a prompt's intent keeps its id and history, and the day it changes is marked like a reword; its rates before and after aren't compared.

## Competitors shared by every set

A competitor list that every set repeats goes once in `cheapseats.toml`:

```toml
[[competitors]]
name = "Peec AI"
aliases = ["Peec", "peec.ai"]
```

Each set gets the shared list plus its own `[[competitors]]`; a set's own entry for the same name wins. Moving a set's competitors to the shared list changes nothing on the trend.

## Reviewing prompts with Claude Code

The config template ships a `review-prompts` skill in `.claude/skills/`. Run `/review-prompts` in your config repo and Claude Code reviews each set as a measurement instrument: whether each prompt fits the set's goal, whether it's a selection or an info question, whether it hints at the brand, and what the set is missing. It reviews; it edits only when asked.

## Changing a set doesn't restart its trend

Rankings annotate set changes. Day-to-day comparisons use only prompts both days asked with the same wording and intent; the table below shows which changes start a new trend.

### What restarts a trend

| change | effect |
|---|---|
| brand `name`, `aliases`, `about` or `audience` | new trend |
| grader model or provider | new trend |
| a Cheap Seats release that changes its answer, search or grading prompts | new trend |
| prompts added, removed or reworded | noted; comparisons use the prompts both days asked |
| a prompt's `intent` | noted; that prompt is left out of the day's comparison |
| competitors | noted |
| answerers, models or samples | noted |
| brand sites or domains, facts, owners | nothing: they change where fixes go, not how answers are graded |
| a set's name, description or tier | nothing |

Before merging a config change, run `cheapseats plan` on a checkout of main and one of the branch:

```bash
cheapseats plan <checkout of main> <checkout of the branch>
```

It produces Markdown for the pull request: prompt, competitor and answerer changes, trend breaks, ids that should have been kept, and planned answers per day.

## Ask the way a buyer would

Only `head-to-heads` names the brand; in every other set it has to be named on its own merits. `cheapseats check` enforces this, matching the brand name and aliases as whole words.

Write each question as someone who has never heard of the brand would ask it. Start with 15–20 distinct buyer questions; precision depends on the number of prompts and comparable runs, not a minimum set size alone.

## Sets written before ids

Sets written before prompts had ids (`prompts = ["...", "..."]`) are converted by `cheapseats migrate-config <dir>`, which makes an id from each prompt's words; review them before committing.

## Review them monthly

Once a set has a month of runs, the [prompt review](../prompt-review/) says which of its prompts tell you nothing, move for no reason, get answered about something else or ask the same thing twice, and what no prompt asks. The review is free; requesting proposed edits makes one analyst call. Review the diff before opening a pull request.

## Keep them public

Prompts are sent to every answerer's provider on each run. Don't put anything in them that isn't public.
