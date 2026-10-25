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
name = "Understanding and measuring AI visibility"
tier = "core"                     # cadence and samples follow [tiers.core] or [tiers.plg]
description = """What the category is, who is competing for it, and what the brand claims."""

[[prompts]]
id = "tools-track-chatgpt-recommendations"
text = "Which tools can track whether ChatGPT recommends my product when people ask about my category?"

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
- **Ids are unique across every set** and never reused. Keep the id when moving a prompt to another set; stored runs retain their original set and prompt ids. Once removed, an id stays retired.
- Order in the file is only display order.

## Say what a good answer looks like

Choose intent by what a complete, useful answer requires, not by the opening words:

- **Selection** (the default) asks for a product choice, comparison, alternative or suitability decision: "Which tracker should our team use?" A question starting "how" can still require a choice.
- **Information** (`intent = "info"`) can be answered completely with an explanation, method, checklist or calculation: "What should I compare when evaluating trackers?" A product example might help without being required. Details of an already-named product can also be informational.

Info answers count toward named rate, but are excluded from recommended and top-pick denominators. Citations are tracked separately. A 20-question set with only three selection questions has a three-question recommendation benchmark; the other seventeen broaden its informational coverage.

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

Only `head-to-heads` may name your brand; every other set must omit it. `cheapseats check` enforces this, matching the brand name and aliases as whole words.

Outside branded evaluation, write as someone who has never heard of the brand would ask. Keep three situations distinct:

| situation | example | what it measures |
| --- | --- | --- |
| Open discovery | Which visibility tracker should a small team use? | Whether the assistant independently brings a product into consideration. |
| Competitor-aware discovery or shortlist | What are alternatives to Profound? / Peec AI or Profound? | Alternatives to a known product, or preference within a supplied shortlist. An answer may reasonably stay within the named choices. |
| Known-brand evaluation (`head-to-heads`) | Is Cheap Seats a good fit for our agency? | Fit, preference and objections after the buyer already knows the brand. Named presence alone proves little. |

These are review categories, not new TOML fields. Cheap Seats' unbranded rates exclude questions naming your brand; they can still include competitor shortlists. Use separate sets when you need separate reported rates for these buying situations.

Start with roughly **15–20 distinct buyer questions** as a planning guide, not a precision threshold. A smaller coherent set needn't be padded, and many paraphrases of one need don't establish broad market coverage.

- **Distinct questions** cover different buyer needs and constraints.
- **Repeated samples** estimate answer variability for those questions.
- **Runs across days** capture variation over time. A week containing one weekly run isn't seven daily runs.

Check the selection-question count, answer counts and intervals for the metric you plan to use. [Sampling and change detection](../noise-and-confidence/) explains the assumptions behind precision estimates; neither a question count nor a narrow sampling interval proves the set represents your market.

Record why a question belongs in the set: a public buyer question, recurring sales or support need, research finding, or an unvalidated hypothesis. Keep this evidence in comments or review notes and omit private customer information. Cover constraints that can rule your product out, such as operating capacity, engine or locale requirements, and multi-client needs. Feature-specific questions can be useful, but their frequency in your set isn't evidence of market demand.

The configured `brand.audience` is sent to answerers. Put any additional buyer or task context needed to interpret a particular question in its text; a technical operator's question may need more context than the global audience supplies.

## Sets written before ids

Sets written before prompts had ids (`prompts = ["...", "..."]`) are converted by `cheapseats migrate-config <dir>`, which makes an id from each prompt's words; review them before committing.

## Review them monthly

Once a set has a month of runs, the [prompt review](../prompt-review/) flags flat rates, noisy answers, possible category mismatches and overlap, and suggests gaps to investigate. These are review candidates, not proof a question is bad or a buyer need is missing. The review is free; requesting proposed edits makes one analyst call.

Keep a stable core for comparison and test new questions separately before replacing it. Preserve legitimate unfavorable questions as gap or regression checks. Retire a question when its buyer need is no longer relevant or another question covers the same need and constraints, not simply because the brand always loses or wins. Review the diff before opening a pull request.

## Keep them public

Prompts are sent to every answerer's provider on each run. Don't put anything in them that isn't public.
