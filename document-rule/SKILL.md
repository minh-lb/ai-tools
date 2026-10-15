---
name: document-rule
description: >-
  Write, edit, review, display, and export software engineering documents.
  Prefer Specifications (SRS, BLS, API/Feature Specs); create an Implementation Plan
  only when needed and allowed by the output contract. Apply AMM-inspired principles
  selectively and verify claims. Use for technical documents, business specifications,
  bug-fix specifications when behavior/cause must be aligned, implementation plans,
  runbooks, ADRs, designs, test plans, READMEs, and scoped/full document exports.
---

# document-rule

## Purpose

Write documents that are **truthful, scoped, clear, useful, and verifiable**. A qualified intended reader who did not write the document must be able to perform the documented work correctly, determine when it is complete, and verify the result. Borrow AMM's precision, clarity, structure, actionability, and verifiability, while matching the document type and risk. **Do not** copy aviation forms/section structures or turn every document into a runbook.

## Required workflow (brief)

1. **Resolve the output contract:** identify the requested document/sections, depth, format, language, and whether it should be inline or a file. Do not add deliverables.
2. **Resolve the display language before writing a document file:** if the request does not explicitly choose a language, ask the user to choose `Vietnamese` or `English` and wait for the answer. Do not ask again when the request already specifies the language. For bilingual examples, maintain separate English and Vietnamese files. Preserve specialized industry/domain terminology in its canonical original form; do not translate technical terms, acronyms, product names, or code identifiers.
3. **Classify the task and decide whether a Plan is needed:** do not create Plan files by default for small, low-risk bug fixes/changes. Then read only the relevant references; do not load the whole directory.
4. **Verify sources:** prioritize the user, inspected files/code/documents; distinguish `Verified`, `Assumption`, and `Unknown`. Never invent facts.
5. **Draft only when requested:** use WHAT/WHY in a Specification and HOW/ORDER/VERIFY in a Plan; add guardrails/risks in proportion to actual risk. Do not generate a Spec/Plan from a simple code-fix request.
6. **Review** with the appropriate checklist; check Specification → Plan traceability when both were requested. If review-and-fix/iteration is requested, follow [quality gates](references/review/quality-gates.md); for review-only, do not edit.
7. **Return only what was requested:** if creating a file, verify that it exists before linking it.

## Router — read only what is needed

For bug-fix Specifications, describe **current behavior** and **desired behavior** in separate sections; do not combine them in a single table or section.

| Task | References to read | Template (when creating) | Examples (EN / VI) |
|---|---|---|---|
| Any document | [core/principles](references/core/principles.md), [core/sources](references/core/sources-and-assumptions.md) | — | — |
| Decide whether a Plan file is needed / code task or bug fix | [plan/decision](references/plan/plan-decision.md) | — | [No Plan](examples/plan/no-plan-required.en.md) / [Vietnamese](examples/plan/no-plan-required.vi.md) |
| Write a bug-fix Specification (when requested/needed to align behavior and cause) | [spec/workflow](references/spec/workflow.md), [requirements](references/spec/requirements-and-rules.md), [acceptance](references/spec/acceptance-and-nfr.md) | [Bug-fix Spec](templates/spec/bug-fix-spec.md) | [EN](examples/spec/bug-fix-spec.en.md) / [VI](examples/spec/bug-fix-spec.vi.md) |
| Write a Specification / SRS | [spec/workflow](references/spec/workflow.md), [spec/requirements](references/spec/requirements-and-rules.md), [spec/acceptance](references/spec/acceptance-and-nfr.md) | [Feature Spec](templates/spec/feature-spec.md) | [EN](examples/spec/order-cancellation-spec.en.md) / [VI](examples/spec/order-cancellation-spec.vi.md) |
| Write a BLS / business flows | [spec/rules](references/spec/requirements-and-rules.md), [spec/flows](references/spec/flows-states-errors.md) | [BLS](templates/spec/bls.md) | [EN](examples/spec/order-cancellation-bls.en.md) / [VI](examples/spec/order-cancellation-bls.vi.md) |
| Write an API Specification | [spec/api](references/spec/data-api-contracts.md), [spec/acceptance](references/spec/acceptance-and-nfr.md) | [API Spec](templates/spec/api-spec.md) | [EN](examples/spec/order-cancellation-api.en.md) / [VI](examples/spec/order-cancellation-api.vi.md) |
| Write an Implementation Plan | [plan/workflow](references/plan/workflow.md), [plan/tasks](references/plan/task-breakdown.md), [plan/traceability](references/plan/traceability.md) | [Feature Plan](templates/plan/feature-plan.md) | [EN](examples/plan/order-cancellation-plan.en.md) / [VI](examples/plan/order-cancellation-plan.vi.md) |
| **Write a requested Plan** for a small change/migration | [plan/decision](references/plan/plan-decision.md), [plan/tasks](references/plan/task-breakdown.md), [plan/verification](references/plan/verification-rollout-recovery.md) | [Small Change](templates/plan/small-change.md) / [Migration](templates/plan/migration-plan.md) | [Small](examples/plan/small-change-plan.en.md) / [Migration](examples/plan/migration-plan.en.md) (see matching `.vi.md` files) |
| Architecture, ADR, README, Runbook, Test | [other/selection](references/other/document-type-selection.md), then the specialized reference | See `templates/other/` | See matching EN/VI files in `examples/other/` |
| Write a risky operational procedure | [core/AMM](references/core/amm-inspired-procedures.md), [plan/verification](references/plan/verification-rollout-recovery.md) | [Runbook](templates/other/runbook.md) | [EN](examples/other/runbook.en.md) / [VI](examples/other/runbook.vi.md) |
| Review a document | [review/quality](references/review/quality-gates.md), [review/spec](references/review/spec-checklist.md) or [review/plan](references/review/plan-checklist.md) | [Review report](templates/other/review-report.md) | [EN](examples/other/review-findings.en.md) / [VI](examples/other/review-findings.vi.md) |
| Any response / print / file export | [output/contract](references/output/output-contract.md); add [inline](references/output/inline-and-scoped-output.md) or [file](references/output/file-export.md) as needed | — | See EN/VI pairs in `examples/output/` |

## Rules to apply even before opening references

- **Do not create an Implementation Plan file by default for every task.** Small, local, low-risk bug fix → fix and verify directly; medium task → use a short checklist if useful, no file by default; high-risk task → establish sequence and verification, and create a Plan file only when requested or required by repository/project policy. Details: [Plan decision](references/plan/plan-decision.md).
- Write **Specification first, then Plan** only when **both** are requested. If only a Plan is requested, base it on the available baseline; do not generate a full Specification. If the user requests a Plan for a small task, still create an appropriately concise Plan.
- Do not invent APIs/schemas/paths/test results/business conditions. Do not present examples as evidence about a real system.
- Specifications describe behavior, exceptions, and acceptance criteria; Plans describe steps, dependencies, expected results, and verification. Every Plan must begin with a concrete, outcome-based Goal naming the target, desired state/behavior, key scope or constraint, and observable success signal, traceable to the baseline requirements. Avoid generic “implement/improve X” goals; if source facts are unknown, state a conditional Goal and the blocker rather than guessing.
- In a bug-fix Specification, always separate the description of current behavior from the description of desired behavior.
- Important information must be easy to find and verify. Remove inapplicable template sections rather than leaving empty headings.
- Every Markdown document template must include root-level YAML frontmatter showing the default properties, with clear placeholders for project-specific values and `status: draft`. Use a unique task/ticket ID for `id` when available; otherwise generate a UUID. Frontmatter `status` may only be `draft` or `approved`; use `draft` unless the user explicitly approves the document. Domain statuses in document content remain governed by their own contract.
- If the user requests **"print only X,"** output only **X**—no lead-in, recommendation, plan, or summary.
- If the user requests **"everything,"** do not replace it with a summary, `...`, or a placeholder. If a file is requested, create the actual file and provide the correct link.
- Treat templates and examples as documents subject to the same independent-reader test. Label fictional content and placeholders; for an example that is not execution-ready, state that clearly and name the evidence/details required before use. Never claim or imply that a repository was inspected, a test was run, a file was created, or a deployment occurred unless it actually happened.

**Navigation:** [README.md](README.md). Read [references/core/writing-style.md](references/core/writing-style.md) when clarity/conciseness guidance is needed.
