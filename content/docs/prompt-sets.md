---
title: Prompt sets
description: The buyer questions Popcorn asks, as TOML files in your config repo, with ids that keep their history.
weight: 30
---

Each file in your config repo's `prompt-sets/` is one category of buyer questions. Popcorn only reads them, so change one with a pull request, after `popcorn check`.

## Format

```toml
id = "ai-search-visibility"       # never change it: runs and rankings key on it
name = "Finding out whether AI assistants recommend us"
tier = "core"                     # core: daily, full samples. plg: every tiers.plg.every_days, one sample
description = """What the category is, who is competing for it, and what the brand claims."""

[[prompts]]
id = "find-whether-chatgpt-recommends-product"
text = "How can I find out whether ChatGPT recommends my product when people ask about my category?"

# Products the grader folds onto one canonical name, so share of voice counts "Peec" as Peec AI.
[[competitors]]
name = "Peec AI"
aliases = ["Peec"]
```

## Prompt ids are permanent

Results, trends and fix lists follow a prompt by its id, so:

- **Same id, same question.** Fixing a typo or rewording keeps the id: the prompt's history carries on, marked as reworded that day. Asking something different gets a new id.
- **Ids are unique across every set** and never reused. Moving a prompt to another set keeps its id, and its history moves with it. Once removed, an id stays retired.
- Order in the file is only display order.

## Changing a set doesn't restart its trend

Rankings carry on through added, removed and reworded prompts, new competitors and new answerer models, and each day says what changed since the day before. Comparisons with the day before only count the prompts both days asked, worded the same. Editing a set's name, description or tier changes nothing.

### What restarts a trend

Only a change to how answers are asked or graded starts a new trend; anything else carries the trend on, noted on the day it happened.

| change | effect |
|---|---|
| brand `name`, `aliases`, `about` or `audience` | new trend |
| grader model | new trend |
| a Popcorn release that changes its answer, search or grading prompts | new trend |
| prompts added, removed or reworded | noted; comparisons use the prompts both days asked |
| competitors | noted |
| answerers, models or samples | noted |
| brand sites or domains, facts, owners | nothing: they change where fixes go, not how answers are graded |
| a set's name, description or tier | nothing |

Before merging a config change, run `popcorn plan` on a checkout of main and one of the branch:

```bash
popcorn plan <checkout of main> <checkout of the branch>
```

It lists the prompts added, removed, reworded and moved, competitor and answerer changes, which of them start a trend over, ids that should have been kept, and the answers a day the new config asks for, as Markdown for the pull request.

## Ask the way a buyer would

Only `head-to-heads` names the brand; in every other set it has to be named on its own merits. `popcorn check` enforces this, matching the brand name and aliases as whole words.

Write each question the way someone who has never heard of the brand would type it, and keep each set at 15–20 prompts so a rate means something.

## Sets written before ids

Sets written before prompts had ids (`prompts = ["...", "..."]`) are converted by `popcorn migrate-config <dir>`, which makes an id from each prompt's words; review them before committing.

## Keep them public

Prompts are sent to every answerer's provider on each run. Don't put anything in them that isn't public.
