# Specification Writing Workflow

## Identify the Specification type

- **Feature/SRS:** observable expectations for a feature or system.
- **BLS:** business rules, decisions, states, and side effects.
- **API Specification:** interface contract; do not turn it into implementation details.
- **Bug-fix Specification:** current versus desired behavior, fix scope, and acceptance/non-regression criteria; create when requested or required by project policy. For a fix-only request with unclear behavior, clarify first without adding a file.

## Bug-fix Specification

A bug may need a Specification. This document defines **the behavior to fix**; it is not a root-cause analysis (RCA) report or an Implementation Plan.

- Write one when a Spec is requested or required by project policy. If only a fix is requested and material behavior/contract/scope must be agreed first, clarify the blocking decision or state a concise conditional baseline inline; do not silently add a Spec file.
- For a small, local bug with clear desired behavior and direct verification, do not create a Spec file by default; see the [Plan/Spec decision](../plan/plan-decision.md).
- Put current behavior and desired behavior in **separate sections**; do not combine them in one table/section. Include evidence/reproduction status for current behavior and the source for desired behavior.
- State the **bug cause** separately as well. Describe a verified causal relationship with evidence; if unknown, say `Unknown` and list any hypothesis separately.
- Acceptance criteria should cover the reproduced scenario and related behavior that must be preserved. If desired behavior is unverified, state the open question; do not turn an assumption into a requirement.
- Do not present a hypothesis as fact. The short cause section in a Specification does not replace a full RCA when one is requested.
- Keep the Specification proportionate to impact; do not add a Plan or a full feature specification automatically.

Use the [bug-fix Specification template](../../templates/spec/bug-fix-spec.md) and examples: [English](../../examples/spec/bug-fix-spec.en.md), [Vietnamese](../../examples/spec/bug-fix-spec.vi.md).

## Drafting order

1. Objective and in/out of scope.
2. Actors, triggers, inputs, and preconditions.
3. Terms, states, and business invariants.
4. Functional requirements (`FR-*`) and business rules (`BR-*`).
5. Happy path, alternative/error paths, and side effects.
6. Data/API contracts when in scope.
7. Evidence-based NFRs (`NFR-*`) and acceptance criteria (`AC-*`).
8. Contradictions/open questions, then review traceability.

## Level of detail

- **Small:** scope + behavior/rules/errors + acceptance criteria.
- **Feature:** actors + FR/BR + flows + errors + data/API (if applicable) + acceptance criteria.
- **System / cross-service:** add state transitions, concurrency, compatibility, security, and observability in proportion to risk.

**Boundary:** do not silently choose a tech stack, file path, or transaction strategy unless supplied as a constraint or requested in a technical design.

Use the [Feature Specification template](../../templates/spec/feature-spec.md) for a general Spec; use [BLS](../../templates/spec/bls.md) or [API](../../templates/spec/api-spec.md) for specialized types.
