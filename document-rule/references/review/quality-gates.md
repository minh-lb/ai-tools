# Quality Gates for All Documents

## P0 — must be fixed before delivery

- Wrong deliverable/scope/format or a missing requested section; this includes **creating an unrequested Plan file** for a simple bug fix.
- Unsupported claims or fabricated code paths/test/deployment status.
- Contradictions among requirements, states, API schema, error handling, and acceptance criteria.
- A risky production/data-change step without necessary safety conditions/checkpoints.
- Invalid JSON/YAML/command examples that would cause readers to fail.
- A request for the complete document answered only with a summary/placeholder.

## P1 — must be fixed to meet the request/quality bar

- Inconsistent terminology/IDs or missing traceability.
- Long statements that combine multiple behaviors and are hard to test.
- Plan tasks that are too broad, have hidden dependencies, or vague verification.
- Duplication or a proposal presented as fact.
- For an action-oriented document, a qualified intended reader who did not author it cannot determine the prerequisites/actions, expected outcome, completion condition, or how to verify the result.
- A Markdown document template omits root-level frontmatter properties, or a template/example hides placeholders or unknowns, implies unperformed work, or presents a non-executable procedure as ready to run.

## P2 — optional improvement

- Minor presentation defects, unnecessary headings/template sections, or style suggestions that do not affect meaning or usability.
- Avoid churn for subjective preferences; make such changes only when requested or when they clearly improve readability/usability.

## Review sequence

1. Establish scope, output contract, sources, and applicable project conventions/contracts; record what cannot be checked.
2. Compare content with requirements/sources; check semantics and internal consistency.
3. Apply the independent-reader test: can the intended qualified reader use the document without relying on the author, determine the relevant completion/decision state, and verify the result? Use document-type-appropriate signals; do not force procedures into reference/decision documents.
4. Check verifiability, usability, and risk/recovery proportional to impact.
5. Edit content/style only when the user asks for changes; for review-only, stop after reporting findings.
6. For explicitly requested review-and-fix/iteration: fix in-scope findings that require action, run appropriate checks, then review the entire scope again. Repeat until no finding requiring action remains under the requested quality bar. Report deferred findings, blockers, and missing evidence; do not claim `Ready` while material points remain open.

## Disposition

- `Ready`: no in-scope finding requiring action remains, based on the inspected sources; mention material optional P2 items that remain.
- `Changes requested`: an in-scope finding still needs correction.
- `Needs verification`: a material point depends on an unavailable source, decision, or check.

Disposition applies only to the stated scope and evidence. A clean static document review does not prove code/production readiness, operational safety, or compliance. Use the [review template](../../templates/other/review-report.md) when a report is requested.
