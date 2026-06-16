# SRS Template

Use these templates as a starting point. Keep only sections that add signal, but preserve the structural blocks needed for a more formal SRS.

## `docs/business-analyst/main.md`

```md
# <Project or Product Name> - Business Analysis & SRS

## 1. Document Control

### Version

- Version: 0.1
- Status: Draft
- Owner: <Owner or Team>
- Last Updated: YYYY-MM-DD

### Change History

| Version | Date | Author | Summary |
| --- | --- | --- | --- |
| 0.1 | YYYY-MM-DD | ... | Initial draft |

## 2. Introduction

### Purpose

Summarize the purpose of this requirements document and the business area it covers.

### Scope Of This Document

Describe the system, module, or initiative covered by this document.

### Definitions, Acronyms, Glossary

| Term | Meaning |
| --- | --- |
| ... | ... |

## 3. Business Context

### Business Goals

- BG-001: ...
- BG-002: ...

### Success Criteria

- ...

## 4. Scope

### In scope

- ...

### Out of scope

- ...

## 5. Stakeholders And User Classes

| Role / User Class | Team / Department | Responsibility | Goal |
| --- | --- | --- | --- |
| ... | ... | ... | ... |

## 6. System Context

### External Systems

| System | Interaction | Notes |
| --- | --- | --- |
| ... | ... | ... |

### Context Notes

- Entry points:
- Upstream dependencies:
- Downstream consumers:
- Primary implementation surfaces likely affected:

## 7. Global Business Rules

- BR-001: ...
- BR-002: ...

## 8. Shared Data Definitions

| Entity / Field | Meaning | Source | Constraint |
| --- | --- | --- | --- |
| ... | ... | ... | ... |

## 9. Shared Non-Functional Requirements

- NFR-001: ...
- NFR-002: ...

## 10. Constraints

- C-001: ...

## 11. Assumptions

- A-001: ...

## 12. Open Questions

- Q-001: ...

## 13. Requirement Document Map

| Capability / Workflow | File | Status | Notes |
| --- | --- | --- | --- |
| Example capability | [references/example-capability.md](references/example-capability.md) | Draft | Covers BG-001 |

## 14. Traceability Overview

| Business Goal | Requirement Files | Acceptance Coverage |
| --- | --- | --- |
| BG-001 | `references/example-capability.md` | AC listed in file |

## 15. Implementation Readiness Notes

- Domain terms that must remain consistent in code:
- Required validations shared across capabilities:
- Shared error semantics:
- Shared permission or role assumptions:
- Shared integration constraints:
```

## `docs/business-analyst/references/<slug>.md`

```md
# <Capability Name>

## 1. Document Control

### Requirement ID

- Capability ID: CAP-001
- Status: Draft
- Priority: Must / Should / Could
- Owner: <Owner or Team>

### Change History

| Version | Date | Author | Summary |
| --- | --- | --- | --- |
| 0.1 | YYYY-MM-DD | ... | Initial draft |

## 2. Overview

Describe the business value of this capability or workflow.

### Related Business Goals

- BG-001

### Related Global Rules / Constraints

- BR-001
- C-001

## 3. Actors And User Classes

- Primary actor:
- Supporting actors:

## 4. Trigger

- ...

## 5. Preconditions

- ...

## 6. Postconditions

- ...

## 7. Main Flow

1. ...
2. ...
3. ...

## 8. Alternate Flows

- ...

## 9. Exception Flows

- ...

## 10. Functional Requirements

- FR-001: ...
- FR-002: ...

## 11. Business Rules

- ...

## 12. Data Requirements

### Inputs

- ...

### Outputs

- ...

### Important Fields

| Field | Meaning | Source / Constraint |
| --- | --- | --- |
| ... | ... | ... |

### Validation Rules

- VR-001: ...
- VR-002: ...

## 13. External Interface Requirements

### UI

- ...

### API / Integration

- ...

### Notifications / Reports

- ...

## 14. Edge Cases And Failure Behavior

- EC-001: ...
- FB-001: ...

## 15. Non-Functional Requirements

- NFR-CAP-001: ...

## 16. Acceptance Criteria

- AC-001: ...
- AC-002: ...

## 17. Dependencies

- ...

## 18. Implementation Notes For Coding Agents

- Suggested implementation boundaries or modules, only if explicitly known:
- State transitions or invariants that code must preserve:
- External side effects to trigger:
- Error conditions that must produce deterministic outcomes:
- Areas where the coding agent must not infer behavior without clarification:

## 19. Traceability

| Source | Maps To |
| --- | --- |
| BG-001 | FR-001, AC-001 |
| BR-001 | FR-002 |

## 20. Open Questions

- Q-001: ...

## 21. Assumptions

- A-001: ...
```
