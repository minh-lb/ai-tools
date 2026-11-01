---
name: document-rule
description: >-
  Use when creating, editing, reviewing, displaying, or exporting software docs.
metadata:
  author: Minh Luu
---

# document-rule

Write for readers: clarify purpose, decisions, impact, and acceptance; make instructions actionable and verifiable.

## Rules

1. Resolve scope, type, audience, language, format, and inline/file; ask only blockers. Preserve language/pairs. Ask Vietnamese/English for a new file only if unclear.
2. Inspect sources; separate current/requested/assumed/unknown. Code describes current only. Never invent facts or infer a new outcome/error response by analogy; mark gaps.
3. Spec = WHAT/WHEN/acceptance; Plan = HOW/order/verify; bug-fix Spec separates current/desired/cause. Procedures need preconditions, checks, and risk-based recovery.
4. Narrow edits: check scope/links. Substantive work: use [quality gates](references/review/quality-gates.md) and a checklist. Plan reviews check each step's order, dependencies, and schema/app compatibility. Review-and-fix: fix/verify/review full scope until clear; report blockers.
5. Honor exact output: review-only = no edits; extraction = source wording; only X = only X; complete = no omissions/placeholders. Plan-only adds no Spec/code. Add no unrequested documents. Preserve schemas, verify files, no frontmatter in inline/raw output.

## Load only what applies

Load only relevant guides/checklists; source first for narrow edits. Template for creation, example if useful. See [Spec](references/spec/workflow.md), [Plan](references/plan/plan-decision.md) + [workflow](references/plan/workflow.md), [review](references/review/quality-gates.md) + checklist, [other](references/other/document-type-selection.md), [output](references/output/output-contract.md), and [sources](references/core/sources-and-assumptions.md). Paths are relative; PDF/DOCX needs host tools.
