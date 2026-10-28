---
name: document-rule
description: >-
  Use when creating, editing, reviewing, displaying, or exporting software
  documentation (specifications, plans, runbooks, ADRs, READMEs), including
  mixed technical and nontechnical audiences.
metadata:
  author: Minh Luu
---

# document-rule

## Quality bar

A non-specialist newcomer can understand purpose, behavior/decision, consequences, and acceptance signals. A qualified operator can perform and verify documented work. Borrow Aircraft Maintenance Manual (AMM) precision, not aviation forms or procedures for every document.

Explain business outcomes before technical details, essential jargon/acronyms on first use, and identifiers beside their meaning. Comprehension does not replace training/access. Consult [writing style](references/core/writing-style.md) for substantial explanations/rewrites.

## Workflow

1. **Resolve:** mode, deliverables, scope, format, audience, depth, inline/file. Infer audience; default to newcomer-friendly context. Ask only for blocking choices. Templates are optional aids.
2. **Language:** preserve existing files and EN/VI pairs unless translation is requested. New file with no language selected in the request/confirmed context: ask `Vietnamese` or `English` and wait. Inline follows the conversation. Localize prose; retain identifiers.
3. **Ground:** inspect relevant sources. Separate current evidence, future requirements, assumptions, and unknowns. Never invent contracts, paths, commands, metrics, approvals, or results. Mark gaps and impacts; ask only for blocking decisions.
4. **Draft:** new/rewritten prose starts with plain-language purpose and essential terms (including states/fields), then precise detail. Explain only source-supported meanings; mark unknown semantics. Spec = WHAT/WHEN/acceptance; Plan = HOW/ORDER/VERIFY with an outcome-based Goal. Bug-fix Spec separates current behavior, desired behavior, and cause (`Unknown` if unverified; hypotheses separate). Procedures include preconditions, actions, results/checks, and risk-based stop/recovery.
5. **Check:** for a narrow edit/extraction, verify meaning, exact scope, and affected cross-references directly. For substantive creation/review, use [quality gates](references/review/quality-gates.md) and the relevant checklist. Requested iteration: fix → check → review the full scope until no actionable finding remains; report blockers without looping on unchanged evidence.
6. **Deliver:** review-only = findings, no edits; extraction = source wording; “only X” = only X; “complete” = no omissions/placeholders. Spec + Plan = Spec first; Plan-only adds no Spec or implementation. Code fixes add no document unless requested/required; consult [Plan decision](references/plan/plan-decision.md) if unclear. Files use [file rules](references/output/file-export.md); preserve schemas, verify artifacts before linking. No frontmatter inline/raw.

## Router — load progressively

Narrow edit/extraction: source first, references only for unresolved rules. Otherwise read matching rows. Skip creation templates for review/extraction. Examples: one matching locale if needed; both for bilingual work. Do not preload indexes/directories.

Paths are skill-relative; Markdown/text needs no other skill, MCP, network, or repository script. Other exports need host tools; disclose missing capabilities. Examples: `.en.md` / `.vi.md` pairs.

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

Stop loading once drafting/checking is possible. Cut duplication, not conditions, errors, safety gates, or acceptance criteria. Fictional examples and non-executable outlines are not system evidence.
