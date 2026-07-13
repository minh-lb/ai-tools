---
name: business-analyst
description: Analyze requirements and produce SRS documentation. Use only when the user explicitly requests this skill.
metadata:
  author: Minh Luu
---

# Business Analyst

Use this skill to turn scattered project context into a structured SRS set for the current repository. Work from evidence and clearly mark uncertainty.

## Activation

Use this skill only when the user explicitly asks to use this Business Analyst skill, explicitly requests BA/SRS work, or when the current runtime has a manual skill-selection step and this skill was intentionally selected.

Do not auto-apply it to normal coding, debugging, or lightweight documentation tasks.

## When To Use

Use this skill when the task is to:

- analyze business workflows or requirements
- produce or update SRS documentation
- convert scattered project context into structured requirements
- prepare requirement artifacts for both developers and AI coding agents

## When Not To Use

Do not use this skill when the task is only to:

- write code without requirement analysis
- review implementation quality
- fix bugs
- write casual project notes with no SRS intent

## Primary Objectives

This skill has two equal goals:

1. Produce SRS documents that developers, QA, and technical stakeholders can read quickly and trust.
2. Produce implementation-ready requirement artifacts that an AI coding agent can consume to generate code with lower ambiguity and fewer hidden assumptions.

## Output Rules

1. Write business-analysis documents under `docs/business-analyst/` relative to the current working directory.
2. Maintain `docs/business-analyst/main.md` as the primary document and navigation index.
3. Write each distinct business capability, use case, or operational flow to `docs/business-analyst/references/<slug>.md`.
4. Link every reference file from `main.md` with relative Markdown links.
5. Write the documents in English by default. Keep technical identifiers, API fields, table names, and code symbols in their original English.
6. Never leave silent gaps. Mark missing information explicitly as `Assumption`, `Open Question`, or `TBD`.
7. Prefer existing source artifacts over guesses: user instructions, current docs, UI, API contracts, schemas, code, tickets, or issue threads.
8. Do not commit, amend, or tag changes unless the user explicitly asks.
9. Treat `docs/business-analyst/` as project output, not as part of the skill package. Never place generated SRS content inside `business-analyst/`.

## Working Method

1. Gather context from the strongest available sources:
   - user request or meeting notes
   - existing docs in the repo
   - UI screens, API contracts, schemas, and code paths that reveal actual behavior
   - tickets, TODOs, tests, or logs that expose business rules
2. Map the shared requirement baseline:
   - business goal
   - scope and out-of-scope
   - stakeholders and actors
   - dependencies and assumptions
   - constraints, compliance, or approval points
3. Split the analysis into requirement units. Prefer one file per coherent capability, workflow, or use case. Use short `kebab-case` English slugs for filenames.
4. Read `references/discovery-checklist.md` when the requirement is vague, fragmented, or spread across multiple artifacts.
5. Draft or update each requirement unit using `references/srs-template.md`.
6. Refresh `docs/business-analyst/main.md` last so it stays aligned with the current set of linked reference files.
7. Run a consistency pass before finishing.

## AI-Agent Readiness Rules

When the SRS is expected to drive code generation, make the requirements implementation-ready:

- Prefer explicit, testable statements over narrative-only descriptions.
- Define identifiers for business goals, business rules, functional requirements, non-functional requirements, assumptions, and acceptance criteria.
- State input/output shapes, field semantics, and validation constraints when they matter to implementation.
- Separate confirmed behavior from assumptions and open questions.
- Document edge cases, alternate flows, and failure behavior explicitly.
- Call out permissions, roles, destructive actions, money movement, external side effects, and idempotency requirements when relevant.
- When docs and code disagree, record the discrepancy and do not hide it behind a single merged statement.
- If a requirement is too vague for safe code generation, stop and surface the ambiguity instead of inventing detail.

## Main Document Contract

`docs/business-analyst/main.md` should usually contain:

- project or product name
- document purpose
- business goals and success criteria
- scope and out-of-scope
- stakeholder list
- document map table with links to each capability file
- shared business rules or global constraints
- shared non-functional requirements
- open questions
- assumption log
- implementation notes or delivery guidance when the whole project shares the same engineering constraints

Use concise summaries in `main.md`. Keep detailed flows in the linked reference files.

## Reference File Contract

Each `docs/business-analyst/references/<slug>.md` should usually contain:

- objective or business value
- actors or participating roles
- trigger
- preconditions
- main flow
- alternate flows
- exception flows
- business rules
- data inputs, outputs, and important fields
- acceptance criteria
- dependencies
- non-functional notes when relevant
- implementation notes for coding agents when relevant
- open questions
- assumptions

If two files depend on each other, link them explicitly from both places.

## Decision Rules

1. Ask the user only when the missing detail blocks a safe requirement decision or changes ownership, compliance, money, permissions, destructive actions, or legal meaning.
2. Keep scope narrow. Do not turn implementation detail into a business requirement unless it changes user-facing behavior, policy, approval, auditability, or data meaning.
3. Prefer testable statements. Acceptance criteria should be observable and specific enough that engineering or QA can validate them.
4. Include implementation guidance only when it reduces ambiguity for the coding agent. Do not prematurely design internal code structure unless the user explicitly wants design-level constraints.

## Completion Checklist

- Every capability file is linked from `docs/business-analyst/main.md`.
- No orphan reference files remain under `docs/business-analyst/references/`.
- Shared rules live in `main.md`; flow-specific rules live in the relevant reference file.
- Assumptions are separated from confirmed facts.
- Open questions are explicit and actionable.
- Acceptance criteria are testable.
- The document is concrete enough that a coding agent could implement the happy path, edge cases, validations, and failure behavior without guessing core business rules.

