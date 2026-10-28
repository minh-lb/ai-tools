# Quality Gates for All Documents

## P0 — must be fixed before delivery

- Wrong deliverable/scope/format or a missing requested section; this includes **creating an unrequested Spec/Plan file** for a simple bug fix when no project policy requires it.
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
- The stated audience cannot understand the purpose, essential terms, behavior/decision, or consequences without asking the author; jargon without explanation blocks a non-specialist or mixed audience.
- For an action-oriented document, a qualified intended reader who did not author it cannot determine the prerequisites/actions, expected outcome, completion condition, or how to verify the result.
- A Markdown template shipped with this skill omits its default root-level frontmatter, or a template/example hides placeholders or unknowns, implies unperformed work, or presents a non-executable procedure as ready to run. For user/project templates, check the applicable schema instead of imposing the default.

## P2 — optional improvement

- Minor presentation defects, unnecessary headings/template sections, or style suggestions that do not affect meaning or usability.
- Avoid churn for subjective preferences; make such changes only when requested or when they clearly improve readability/usability.

## Review sequence

1. Establish scope, output contract, sources, and applicable project conventions/contracts; record what cannot be checked.
2. Compare content with requirements/sources; check semantics and internal consistency.
3. Apply both reading levels: can a newcomer understand purpose, essential terms, behavior/decision, consequences, and limits; can the qualified intended reader use it independently, determine completion/decision state, and verify the result? Use document-type-appropriate signals; do not force procedures into reference/decision documents. For exact extraction or a narrow edit, preserve the requested scope rather than adding explanations outside it.
4. Check verifiability, usability, and risk/recovery proportional to impact.
5. Edit content/style only when the user asks for changes; for review-only, stop after reporting findings.
6. For requested review-and-fix: keep a compact ledger (location, severity, evidence, correction, open/resolved/blocked). Fix actionable P0/P1 findings and requested/material P2 improvements; run appropriate checks, then review the entire scope again, including cross-file consistency and regressions. Do not inflate the deliverable with repeated round reports unless requested.
7. Finish after a full pass finds no remaining actionable issue at that quality bar. Do not invent new scope or churn stylistic alternatives to prolong the loop. If a material finding cannot be resolved without unavailable evidence, permission, or a decision, stop that branch, report the blocker and next required input; do not bypass denied operations, retry equivalent commands, or loop on the same unchanged finding. Continue independent safe fixes when possible.

## Checks matched to the change

- Check referenced paths/links, IDs/traceability, examples versus rules, and localized pairs touched by shared changes.
- For templates/file outputs, check applicable frontmatter/schema, placeholders, and parseable JSON/YAML examples. Preserve intentional Markdown hard breaks; distinguish them from accidental trailing whitespace.
- Test the relevant request scenarios: exact extraction, JSON-only, review-only versus review-and-fix, language preservation, missing sources, and no unrequested documents. A static check verifies structure/rules, not actual model compliance; report which checks were run and which behavior remains untested.
- Apply the independent-reader test to the final revision: identify who acts/decides, their inputs, the outcome, and the evidence they use. Unsupported choices stay explicit gaps, not invented facts.

## Disposition

- `Ready`: no in-scope finding requiring action remains, based on the inspected sources; mention material optional P2 items that remain. Deferring a material P0/P1 finding does not make the document Ready.
- `Changes requested`: an in-scope finding still needs correction.
- `Needs verification`: a material point depends on an unavailable source, decision, or check.

Disposition applies only to the stated scope and evidence. A clean static document review does not prove code/production readiness, operational safety, or compliance. Use the [review template](../../templates/other/review-report.md) when a report is requested.
