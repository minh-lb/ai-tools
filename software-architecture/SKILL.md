---
name: software-architecture
description: >-
  Use when asked to analyze, design, review, or validate software architecture,
  including a feature architecture outline or design based on an existing
  business specification. Also use when a redesign changes system boundaries,
  data ownership, consistency guarantees, or deployment topology. Routine code
  changes and document edits stay in their own workflows.
---

# Software Architecture

Use the five phases at the depth the decision warrants. For review-only work, use the submitted design in phase 2 and label any proposed changes. Ground existing-system claims in the relevant code, contracts, or documentation. Keep the user's requested scope.

## 1. Requirement Analysis

Use the supplied business specification as the source of feature scope and rules. When working without a specification, use the requirements already confirmed in the request. Read the relevant sources and inspect the current architecture where available. Reference requirement IDs or section titles and extract the actors, invariants, constraints, edge cases, and quality needs that drive architectural decisions. Label assumptions and unknowns. Expose contradictions with a concrete scenario. Ask only for information that materially changes the design or readiness. Continue with conditional options where possible.

## 2. Architecture Design

### Outline the architecture document first

For a new feature architecture document, present a short list of the technical sections worth developing. For each, state the design question it will answer and the business rule, constraint, or risk it addresses. Choose sections that fit the feature, such as system boundaries and impacted components, data and ownership, critical interaction flows, API or integration contracts, authorization, consistency and failure handling, rollout, and verification. Use the business specification to explain why each section is needed.

Share the outline first so the user can select the sections to expand in a follow-up. Keep it at section titles and design questions. Reserve solution choices, concrete schemas, and endpoint contracts for the expanded design. If the user requests the full design in one response or specifies the sections to develop, continue directly in that scope. Use the supplied design and scope for review-only requests.

### Develop the selected design

Set system boundaries, component responsibilities, and domain/data ownership. Define storage, APIs, integrations, and consistency where needed. Use the smallest useful C4 view and sequence diagrams for critical interactions. Compare viable options for consequential choices against actual constraints. Prefer simple existing capabilities and use SOLID or DDD where they clarify responsibilities. Justify microservices, CQRS, or Event Sourcing with specific needs. For data, integration, migration, diagrams, or standards guidance, read [design](references/design.md).

## 3. Architecture Review

Re-read the candidate from a reviewer perspective and attempt to disprove its guarantees. Check business correctness, data consistency and transactions, security and authorization, reliability and concurrency, scale and performance, maintainability and debt, and operational feasibility and cost. Report each supported finding with its explicit severity (Critical, High, Medium, or Low), evidence, impact, and remedy, even in a brief review. Use [review and validation](references/review-validation.md). A narrow change calls for an impact analysis and review of changed and affected contracts. Broaden scope when a shared invariant, interface, data owner, or operational dependency changes.

## 4. Design Validation

Trace requirements to acceptance scenarios, including critical sequences, failure paths and relevant interleavings for concurrency, retry, timeout, and idempotency. Record actual observations, expected outcomes and missing evidence. Use a PoC or architecture test when a consequential claim requires execution. State whether each result comes from a tabletop walkthrough, an executed check, or a planned check.

## 5. Approval and Readiness

Record consequential decisions as ADRs and summarize trade-offs, residual risks, and requirement coverage. Recommend **Ready for Implementation** only when required evidence exists, material requirements are traceable, and every Critical/High finding is resolved or has explicit acceptance from the accountable party. Track proposed fixes as open until reviewed and supported by evidence. Use **Changes Required** for material design defects and **Needs Decision or Evidence** for unresolved decisions or proof gaps. Revisit affected phases after material changes. Stop at a supported verdict or a blocker requiring input. Record actual user approval only when explicitly given.

## Deliverables and collaboration

Scale the output to the task. Use Markdown and Mermaid when useful. Combine overview, requirements, C4, data/API design, findings, validation, and readiness as needed. Reuse requirement IDs rather than restating them. Adapt the [decision and readiness template](templates/decision-readiness.md) when a reusable artifact helps. See the [worked example](examples/booking-consistency.md) for a design-stage review and gate.

Invite an independent pass with `reviewer` via an authorized embedded handoff when warranted. Apply `document-rule` to presentation when available. The core workflow stands alone. If relevant support is unavailable, do the reviewer pass or clarity check locally and disclose that limit. Architecture owns decisions and readiness. Delegated findings and writing guidance support that work.
