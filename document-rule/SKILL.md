---
name: document-rule
description: >-
  Write, edit, review, display, and export software technical documents:
  specifications (SRS, BLS, API, feature, bug-fix), implementation plans,
  runbooks, ADRs, designs, test plans, READMEs, and scoped/full exports.
  Apply AMM-inspired precision and verifiability without imposing aviation forms
  or creating unrequested documents. Support iterative review-and-fix.
---

# document-rule

## Quality bar

A qualified intended reader who did not author the document can understand the required behavior or decision, perform any documented work, determine completion/acceptance, and verify the result. Apply AMM's precision proportionately; do not turn specifications, ADRs, or references into runbooks.

## Workflow

1. **Resolve the contract:** mode (create/edit/review/print/export), deliverables, scope, format, depth, and inline/file. Follow explicit user/project contracts; templates are selective aids, not mandatory forms.
2. **Language:** for existing documents, preserve each file's language and EN/VI pairs unless translation is requested; do not ask again. For a new document file with no language selected in the request or confirmed context, ask `Vietnamese` or `English` and wait. Inline output follows the conversation unless otherwise requested. Preserve domain terms and code identifiers; localize surrounding prose and normative words.
3. **Ground the content:** inspect relevant sources; distinguish current evidence, requested future behavior, assumptions, and unknowns. Never invent paths, contracts, commands, metrics, approvals, or execution results. Ask only for a missing decision that blocks useful work; otherwise mark the gap and its impact.
4. **Produce only authorized work:** review-only means findings, not edits; printing/extraction preserves source wording. A code-fix request does not authorize Spec/Plan files unless project policy requires them. If both Spec and Plan are requested, write Spec first; Plan-only uses the available baseline without creating a Spec. Small fixes need no Plan file by default; use [Plan decision](references/plan/plan-decision.md) when the boundary is unclear.
5. **Draft for the reader:** Spec = WHAT/WHEN and acceptance; Plan = HOW/ORDER/VERIFY with a concrete outcome-based Goal; procedure = preconditions, actions, expected results, checks, and risk-based stop/recovery. Keep current behavior, desired behavior, and cause in separate bug-fix Spec sections; mark an unverified cause `Unknown` and list hypotheses separately.
6. **Check before delivery:** apply [quality gates](references/review/quality-gates.md), plus the Spec/Plan checklist when applicable. For requested iteration, fix, check, and review the full scope again until no actionable finding remains; disclose blockers rather than looping without progress or claiming a clean result.
7. **Deliver exactly:** “only X” means only X; “complete” means no omitted content or placeholders. For files, follow [file rules](references/output/file-export.md), preserve existing schemas, and verify real artifacts before linking. Never add frontmatter to inline/raw output.

## Router — load progressively

Read only the row(s) needed for the current task. Skip creation templates for review/extraction. Open at most one matching-language example when a pattern is unclear; compare both locales only for bilingual work. Do not preload README indexes, all core modules, or the entire directory.

Paths below are relative to this skill. Templates live under `templates/`; examples under `examples/` use matching `.en.md` / `.vi.md` pairs.

| Task | References under `references/` | Template under `templates/` |
|---|---|---|
| Feature / bug-fix Spec | [spec/workflow](references/spec/workflow.md), [requirements](references/spec/requirements-and-rules.md), [acceptance](references/spec/acceptance-and-nfr.md) | `spec/feature-spec.md` / `spec/bug-fix-spec.md` |
| BLS / business flows | [requirements](references/spec/requirements-and-rules.md), [flows](references/spec/flows-states-errors.md), [acceptance](references/spec/acceptance-and-nfr.md) | `spec/bls.md` |
| API Spec | [contracts](references/spec/data-api-contracts.md), [acceptance](references/spec/acceptance-and-nfr.md) | `spec/api-spec.md` |
| Implementation Plan | [plan/workflow](references/plan/workflow.md), [tasks](references/plan/task-breakdown.md), [traceability](references/plan/traceability.md) | `plan/feature-plan.md` / `plan/small-change.md` |
| Migration / risky procedure | [verification](references/plan/verification-rollout-recovery.md), [AMM](references/core/amm-inspired-procedures.md); add Plan row for migrations | `plan/migration-plan.md` / `other/runbook.md` |
| Other document types | [selection](references/other/document-type-selection.md), then only the relevant specialized reference | Matching `other/` template |
| Spec / Plan review or final check | [spec checklist](references/review/spec-checklist.md) / [plan checklist](references/review/plan-checklist.md) | `other/review-report.md` only if requested |
| Output edge cases | [contract](references/output/output-contract.md); [inline](references/output/inline-and-scoped-output.md) or [file](references/output/file-export.md) as needed | — |
| Source conflicts / writing ambiguity | [sources](references/core/sources-and-assumptions.md), [style](references/core/writing-style.md); [principles](references/core/principles.md) for rationale | — |

Stop expanding context once the task can be completed and checked. Save tokens by removing duplication and irrelevant sections, never by omitting conditions, error cases, safety gates, or acceptance criteria. Label fictional examples and non-executable outlines; they are not evidence about the user's system.
