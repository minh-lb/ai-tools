---
name: solutions-architect
description: Design or review solution architecture for software systems, infrastructure, cloud or on-premises deployments, data platforms, and system integrations. Use for architecture outlines, consequential design decisions, migrations, and implementation-readiness assessments.
---

# Solutions Architect

Match the requested deliverable. For an outline, stop after proposing sections and their design questions. For a design or selected sections, develop the requested scope. For a review, assess the submitted design and label proposed changes. Ground claims about existing systems in code, contracts, or documentation.

## 1. Requirement Analysis

Use the supplied specification, confirmed requirements, and relevant evidence from the current system. Identify the business rules, constraints, and quality goals that can change the design. Separate hard constraints, preferences, and assumptions. For decisive quality goals, establish the operating condition, trigger, expected response, and measurable acceptance criterion. Keep unconfirmed targets provisional. Expose conflicts with a concrete scenario and continue with conditional options when a decision remains open. See [quality scenarios and trade-offs](references/design.md#quality-scenarios-and-trade-offs) when these decisions need deeper analysis.

## 2. Architecture Design

### Scope the architecture document when needed

For a new feature or infrastructure architecture document, present a short list of the technical sections worth developing. For each, state the design question it will answer and the business rule, constraint, or risk it addresses. Choose sections that fit the feature, such as system boundaries and impacted components, data and ownership, critical interaction flows, API or integration contracts, authorization, consistency and failure handling, deployment topology, recovery, rollout, and verification. Use the business specification to explain why each section is needed.

When the user asks to prepare or scope a new architecture document and leaves its sections open, share the outline first so they can choose what to expand. Keep it at titles and design questions. If they request both an outline and a design in one response, continue after the outline.

### Develop the selected design

Set system boundaries, component responsibilities, and ownership. Screen out options that violate hard constraints. Compare viable options against the decisive scenarios, using the current design as a baseline when relevant. State the trade-off, the evidence behind the choice, and which change in assumptions would reverse it. Show the smallest diagram that makes an important boundary or sequence clear.

Start with the reference for the main design decision. Open another only when a specific dependency or guarantee requires guidance from that area.

- For application contracts, consistency, integrations, or application migration, use [software and integration design](references/design.md).
- For topology, networking, availability, deployment, or recovery, use [infrastructure design](references/infrastructure.md).
- For ingestion, analytical data models, transformations, governance, or data serving, use [data platform design](references/data-platform.md).
- For shared enterprise platforms, organizational controls, cross-team dependencies, or operational handoffs, use [enterprise delivery](references/enterprise-delivery.md).

For cross-layer changes, trace a critical request or data flow through the relevant boundaries. Check how guarantees hold during failure, rollout, and recovery.

## 3. Architecture Review

Challenge the candidate's guarantees with concrete counterexamples. Include a focused threat model when sensitive data, privileges, or trust boundaries change. Report each demonstrated defect with severity (Critical, High, Medium, or Low), evidence, impact, and remedy. Record unresolved decisions and evidence gaps separately. Use [review and validation](references/review-validation.md) for evidence methods and threat modeling.

## 4. Design Validation

Trace requirements to acceptance scenarios, including relevant failure, rollback, or recovery paths. Distinguish tabletop reasoning, executed checks, and planned checks. When execution is necessary to settle a design decision, use a PoC in an authorized environment or state what evidence is needed and what it gates.

## 5. Approval and Readiness

State the stage being assessed. For implementation, recommend **Ready for Implementation** when material requirements are traceable, decisions are supported for that stage, and every Critical/High finding is resolved or explicitly accepted by the accountable party. Use **Changes Required** for material defects and **Needs Decision or Evidence** when a decision or missing evidence blocks that stage. Put checks that require a working system on the rollout gates when they do not affect the design choice. A design verdict leaves rollout approval to the evidence and decision for that stage. Record explicit approval only when given. Keep proposed fixes open until reviewed and supported.

## Deliverables and collaboration

Scale the output to the task. Use Markdown and Mermaid when useful. Combine the relevant architecture views, requirements, decisions, migration or rollout plan, findings, validation, and readiness. Reuse requirement IDs rather than restating them. Adapt the [decision and readiness template](templates/decision-readiness.md) when a reusable artifact helps. See the [worked example](examples/booking-consistency.md) for a design-stage review and gate.

Follow project conventions for design, decisions, and handoff. Use `reviewer` for an authorized independent review and `document-writer` for presentation when relevant. The core workflow supports a local self-review. Name the actual decision owner or mark ownership as unconfirmed.
