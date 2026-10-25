---
name: cheapseats-editor
description: Tighten Cheap Seats website articles, documentation and dashboard copy, and choose explanatory visuals while preserving product definitions, evidence and operational caveats. Use when authoring or editing this project's user-facing content.
---

# Cheap Seats editor

Help the reader finish the page's task with less reading. This repository's `CLAUDE.md` owns build and brand rules. Treat published docs as a specification: verify behavior against implementation before changing a factual claim.

## Give each page a job

- Guides: answer the question, show the shortest working path and one useful example. Keep enough context for a direct arrival; link advanced variants and reference details.
- Reference: preserve exact definitions, formulas, flags, fields and exclusions. Make them easy to look up with tables and stable headings.
- Comparisons: retain dated provenance, material qualifications and source links. Let the table carry shared facts; prose should explain consequential differences and selection criteria. An editing pass is not a new external fact check.
- Dashboard: put the interpretation or action beside the result. Explain chart symbols once; keep the metric, window and relevant denominator local. Hide optional methodology behind a clearly named disclosure or link.

Cut repeated product pitches, previews followed by identical summaries, duplicate worked examples and release history interrupting current instructions. Move useful specialist detail rather than deleting it. Preserve working commands, meaningful examples and caveats beside actions. Use estimates to find opportunities, not page-length quotas.

Canonical homes, relative to the site repository:

| Subject | Home |
| --- | --- |
| Verdicts, tracks, quoted evidence | `content/docs/how-grading-works.md` |
| Formulas, denominators, legacy fields | `content/docs/metrics.md` |
| Other tools' metric definitions | `content/docs/comparing-metrics.md` |
| Intervals, comparison tests, outcome thresholds | `content/docs/noise-and-confidence.md` |
| Report navigation | `content/docs/reading-results.md` |
| Shipping and recording a fix | `content/docs/fix-to-pull-request.md` |
| Flags, routes, payloads, provider mechanics | `content/docs/reference.md` |
| Production deployment commands | `content/docs/deploying.md` |

Preserve incoming headings when moving material: leave a brief section linking to its new home. Check local links and fragments after restructuring.

## Protect these distinctions

- **Named** includes answers to informational prompts; **recommended** and **top pick** use choice-prompt answers. Named counts contain recommended counts, but percentages with different denominators need not preserve that ordering. Run rates pool answers; rankings average prompts.
- Named rates can sum above 100%. Share of voice divides by all products' mentions, counting each product once per answer, and sums to 100%. A repeated name without product information can still be absent; namesakes are not the brand.
- A returned URL is evidence of retrieval, not proof the model read the full page. Cited pages need not be a strict subset of recorded retrieval. A citation is not an endorsement. An absent page does not establish an indexing failure.
- Distinguish uncertainty on a reading from uncertainty on a change. A margin is around the observed estimate; “no detectable change” does not establish zero effect or bound every possible effect by that margin. Before/after evidence does not establish causation. Retain sample, prompt, track and baseline assumptions beside worked numbers.
- Re-grading changes stored grades, preserves replaced grades and original dates, and does not re-ask questions. It cannot repair a different answer prompt or search policy. Competitors affect grading inputs without necessarily changing `Method`; verify `internal/run/run.go` in the app checkout.
- An API budget admits calls against reservations and settles actual or estimated costs; it is not a hard provider billing ceiling. Subscription CLIs avoid API charges for those calls, but subscriptions, hosting and optional services still have costs. Container images do not include subscription CLIs.
- Read-only prevents writes, not disclosure of a copied database/config. Keep credential, public-data, revocation, TLS/proxy and database compatibility limits beside operational instructions.

## Make visuals earn their space

Prefer annotated UI crops for orientation, process diagrams for relationships, answer excerpts for verdicts, and interval plots for uncertainty. Use native HTML/SVG for simple diagrams and charts. Keep exact commands and definitions selectable.

Use existing `figure` shortcodes and brand tokens. Every new figure needs a text equivalent in Markdown and `llms-full` outputs. Label synthetic examples; source real chart values from stored records and reconcile counts before plotting. Keep cohorts and denominators comparable. Avoid additive charts of overlapping source classes, numerical retrieval funnels, composite winner scores and price charts implying equivalent coverage.

Replace the explanation a visual makes redundant. Keep a short caption with assumptions and the relevant limitation. Capture current UI in both themes; crop to readable detail and identify historical examples. Check narrow screens, both themes and meaning without color.

## Typeset equations

Use `\( ... \)` for inline math and `$$` on separate lines for display equations. Hugo renders them to native MathML at build time; Markdown and `llms-full` keep the source notation. Single dollar signs are reserved for prices.

Use fractions, roots, sums and subscripts for actual formulas; keep simple counts, rates and export field names in prose or code. Introduce variables beside the equation and retain assumptions and units. Split long derivations into short steps for narrow screens. Do not use screenshots, code blocks or quotations for math. Check the rendered equation, arithmetic and text exports; do not change a statistical definition while improving its notation.

## Verify the edit

Run the Hugo build and brand-token check from `CLAUDE.md`. Inspect representative rendered pages, figures, mobile layout, local links/anchors and Markdown/text exports. For app template changes, run the relevant server tests and required repository checks. Review the diff for deleted caveats and accidental factual changes. Report the practical result, meaningful validation and any remaining limitation briefly.
