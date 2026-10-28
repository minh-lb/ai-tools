# Foundational Principles

## Priority order

1. **Fidelity:** satisfy the user's request and authoritative sources; do not change meaning when asked only to edit.
2. **Correctness:** do not turn speculation into fact or invent APIs, schemas, metrics, or statuses.
3. **Testability:** important behavior has verifiable conditions and outcomes.
4. **Usability:** the intended reader can find information and perform the right work.
5. **Conciseness:** keep only content that supports decisions, execution, or verification.

## Independent-reader test

A newcomer, including a non-specialist, can understand the purpose, essential terms, behavior/decision, consequences, and limits. The intended qualified reader can also perform the documented work correctly, tell when it is complete, and verify the outcome without relying on the author. For documents that do not prescribe actions, use decision, evidence, or acceptance signals instead of forcing procedural steps. Explain first, then provide precise details; readability does not remove expertise/access requirements. See [writing style](writing-style.md) for the two-level reader check.

## Separate document purposes

- **Specification:** `WHAT`, `WHEN`, inputs/outputs, constraints, errors, and acceptance criteria.
- **Implementation Plan:** `HOW`, order, dependencies, risk, verification, and completion.
- **Design / ADR:** alternatives, rationale, and trade-offs.
- **Runbook:** trigger, prerequisites, procedure, signals, and recovery.
- **README:** verified setup and routine operation.

If the user requests only one document, do not create related documents automatically. If both a Specification and Plan are requested, complete the Specification and its IDs before mapping the Plan. For a simple code change or bug fix, **do not create Specification/Plan files automatically**; see [Plan decision](../plan/plan-decision.md).

## Normative language and IDs

- English: `MUST` = required; `MUST NOT` = prohibited; `SHOULD` = recommended unless a specific reason applies; `MAY` = optional. Vietnamese equivalents: `PHẢI`, `KHÔNG ĐƯỢC`, `NÊN`, `CÓ THỂ`. Use the document's language consistently; normative words are prose, not code identifiers.
- Use stable IDs (`FR-`, `BR-`, `NFR-`, `AC-`, `IMP-`) when traceability or cross-references are useful; do not force IDs into every document. Do not change an ID between versions when its meaning is unchanged.
- Do not add irrelevant sections or meaningless placeholders.
- Match detail to risk and complexity; do not require every document to include rollback, API, database, or procedural-workflow structure.
