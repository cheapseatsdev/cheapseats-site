---
name: cheapseats-editor
description: Tighten Cheap Seats website articles, documentation and dashboard copy, and choose explanatory visuals while preserving product definitions, evidence and operational caveats. Use when authoring or editing this project's user-facing content.
---

# Cheap Seats editorial guide

Respect the reader's time: make the answer easy to find and preserve what they need to act correctly. This repository's `CLAUDE.md` owns build and brand rules. Treat published docs as a specification: verify behavior against implementation before changing a factual claim.

## Give each page a job

- Guides: answer the question, show the shortest working path and one useful example. Keep enough context for a direct arrival; link advanced variants and reference details.
- Blogs: lead with the finding, show its evidence and explain the practical implication. Keep historical dates and examples accurate; link specialist methodology instead of repeating a full product introduction.
- Reference: preserve exact definitions, formulas, flags, fields and exclusions. Make them easy to look up with tables and stable headings.
- Comparisons: retain dated provenance, material qualifications and source links. Let the table carry shared facts; prose should explain consequential differences and selection criteria. An editing pass is not a new external fact check.
- Dashboard: put the interpretation or action beside the result. Explain chart symbols once; keep the metric, window and relevant denominator local. Hide optional methodology behind a clearly named disclosure or link.

Put the useful result before background: an answer, buying decision, working path or next action. On hubs, let readers browse before the product pitch. Keep titles, descriptions and openings useful on their own; cut boilerplate repeated within the reading path.

## Teach the workflow before assuming expertise

Readers may be engineers or startup marketers new to AI visibility and evaluation.
For a feature's workflow guide, explain:

- the decision it helps make, required inputs and what it changes;
- the shortest end-to-end path, including the point that starts provider usage;
- likely outcomes and their next actions, including failures, uncertainty and no justified work;
- signals or a suggested cadence for repeating it, distinguished from implemented thresholds and automatic scheduling;
- what success means, what would settle the decision and what the check cannot establish.

Define jargon where needed. Distinguish buyer questions from grading instructions,
measurement from label validation, shipping from observed effects, and a software
floor from a recommended sample size. Keep example corpus sizes explicitly local
to that example. Use a flow or decision diagram when it replaces a prose walkthrough;
give it a complete text equivalent. Reference pages should link the relevant
workflow rather than repeat it for every field.

Give each explanation one home: comparable facts in tables, relationships in diagrams, consequences in prose. Cut repeated product pitches, engine lists, workflow descriptions, previews followed by identical summaries and release history interrupting current instructions. Link useful specialist detail from its canonical home. Repeat brief units and qualifications where readers need them locally; preserve working commands and meaningful examples.

Canonical homes, relative to the site repository:

| Subject | Home |
| --- | --- |
| AEO/GEO and the learning loop | `content/docs/understanding-ai-visibility.md` |
| Choosing buyer questions | `content/docs/choosing-questions.md` |
| First run and interpretation | `content/docs/first-run.md` |
| Selecting checks and rerun signals | `content/docs/checks-and-evaluations.md` |
| Grader evaluation lifecycle and outcomes | `content/docs/evaluation.md` |
| Success and follow-up decisions | `content/docs/measuring-success.md` |
| Verdicts, tracks, quoted evidence | `content/docs/how-grading-works.md` |
| Formulas, denominators, legacy fields | `content/docs/metrics.md` |
| Other tools' metric definitions | `content/docs/comparing-metrics.md` |
| Intervals, comparison tests, outcome thresholds | `content/docs/noise-and-confidence.md` |
| Report navigation | `content/docs/reading-results.md` |
| Shipping and recording a fix | `content/docs/fix-to-pull-request.md` |
| Flags, routes, payloads, provider mechanics | `content/docs/reference.md` |
| Production deployment commands | `content/docs/deploying.md` |

Preserve incoming headings when moving material: leave a brief section linking to its new home. Check local links and fragments after restructuring.

## Make comparisons quick to use

Put the buying decision and the most consequential difference before the full reference table. On the hub, put the comparison links first. Keep plan limits, prices, exceptions and dated source links in the table; remove prose that only repeats its lists.

Start with the visual that explains the most consequential difference: a collection path, work handoff, annotated answer or counting example. When illustrating one counting rule, hold the answers, matching and other rules fixed; state the cohort and denominator. Preserve unknowns and conflicting source claims rather than smoothing them into a definitive diagram.

Keep qualifications attached to simplified claims. In the October 2026 examples, [Bad Popcorn](../../content/compare/bad-popcorn.md) keeps Growth drafting separate from Enterprise feeds; [Gauge and Cheap Seats](../../content/compare/gauge.md) retain different timing and sample gates. Different completion criteria need distinct endpoints. Describe each tool on its own terms; unpublished weights or an unknown denominator cannot support a numerical winner.

## Protect these distinctions

- **Named** includes answers to informational prompts; **recommended** and **top pick** use choice-prompt answers. Named counts contain recommended counts, but percentages with different denominators need not preserve that ordering. Run rates pool answers; rankings average prompts.
- Named rates can sum above 100%. Share of voice divides by all products' mentions, counting each product once per answer, and sums to 100%. A repeated name without product information can still be absent; namesakes are not the brand.
- A returned URL is evidence of retrieval, not proof the model read the full page. Cited pages need not be a strict subset of recorded retrieval. A citation is not an endorsement. An absent page does not establish an indexing failure.
- Distinguish uncertainty on a reading from uncertainty on a change. A margin is around the observed estimate; “no detectable change” does not establish zero effect or bound every possible effect by that margin. Before/after evidence does not establish causation. Retain sample, prompt, track and baseline assumptions beside worked numbers.
- Re-grading changes stored grades, preserves replaced grades and original dates, and does not re-ask questions. It cannot repair a different answer prompt or search policy. Competitors affect grading inputs without necessarily changing `Method`; verify `internal/run/run.go` in the app checkout.
- An API budget admits calls against reservations and settles actual or estimated costs; it is not a hard provider billing ceiling. Subscription CLIs avoid API charges for those calls, but subscriptions, hosting and optional services still have costs. Container images do not include subscription CLIs.
- Read-only prevents writes, not disclosure of a copied database/config. Keep credential, public-data, revocation, TLS/proxy and database compatibility limits beside operational instructions.

## Make visuals earn their space

Choose the format by the reader's question:

| Reader needs to see | Use | Prose it can replace |
| --- | --- | --- |
| Who does what next | Workflow lanes | Repeated handoff and execution paragraphs |
| Why the same answers yield different rates | Counting chart with explicit units | A repeated arithmetic walkthrough |
| Why an answer received its grade | Annotated answer excerpt | Repeated explanation of that example |
| Where an engine or feature is available | Coverage map | Lists repeated across the introduction and selection bullets |
| Where to look in the product | Readable UI crop | Several paragraphs of navigation instructions |
| How uncertain a reading or change is | Interval plot | Prose describing the same ranges |

Use native HTML/SVG for simple diagrams and charts. Keep exact commands and definitions selectable. A screenshot should show evidence or orientation that a simpler diagram cannot convey.

Use existing `figure` shortcodes and brand tokens. Every new figure needs a text equivalent in Markdown and `llms-full` outputs. Label synthetic examples; source real chart values from stored records and reconcile counts before plotting. Keep cohorts and denominators comparable. Avoid additive charts of overlapping source classes, numerical retrieval funnels, composite winner scores and price charts implying equivalent coverage.

Identify the passage a visual replaces, then cut it. Keep captions and labels short, with assumptions and the relevant limitation. Capture current UI in both themes; crop to readable detail and identify historical examples. A current screenshot from another run cannot stand in for a historical result. Check narrow screens, both themes and meaning without color.

## Typeset equations

Use `\( ... \)` for inline math and `$$` on separate lines for display equations. Hugo renders them to native MathML at build time; Markdown and `llms-full` keep the source notation. Single dollar signs are reserved for prices.

Use fractions, roots, sums and subscripts for actual formulas; keep simple counts, rates and export field names in prose or code. Introduce variables beside the equation and retain assumptions and units. Split long derivations into short steps for narrow screens. Do not use screenshots, code blocks or quotations for math. Check the rendered equation, arithmetic and text exports; do not change a statistical definition while improving its notation.

## Verify the edit

Assess the whole reading burden, including descriptions, labels, captions and text equivalents. Prefer a shorter path to understanding over a word-count or figure-count quota. Check that HTML and text exports offer the same facts and navigation without duplicate generated lists.

Run the Hugo build and brand-token check from `CLAUDE.md`. Inspect representative rendered pages, figures, mobile layout, local links/anchors and Markdown/text exports. For app template changes, run the relevant server tests and required repository checks. Review the diff for deleted caveats and accidental factual changes. Report the practical result, meaningful validation and any remaining limitation briefly.
