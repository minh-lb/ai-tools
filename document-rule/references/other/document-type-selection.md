# Choose the Right Technical Document

| Type | Main question | Template |
|---|---|---|
| Architecture / System Design | What are the components and why? What is the data flow? What are the trade-offs? | [Architecture](../../templates/other/architecture-design.md) |
| ADR | What decision was made, among which choices, and with what rationale and consequences? | [ADR](../../templates/other/adr.md) |
| Runbook / SOP | When should an operation run? What are the steps, checks, and recovery actions? | [Runbook](../../templates/other/runbook.md) |
| Test Plan | What is in scope, how will it be tested, and what are the scenarios and exit criteria? | [Test Plan](../../templates/other/test-plan.md) |
| README / Setup Guide | How should the project be installed, run, configured, and verified? | [README](../../templates/other/technical-readme.md) |
| Incident / RCA | What happened, what evidence exists, what was the impact, and what corrective actions follow? | [Postmortem](../../templates/other/incident-postmortem.md) |
| Review Report | What are the issues, evidence, severity, and proposed corrections? | [Review Report](../../templates/other/review-report.md) |

Details: [Architecture/ADR](architecture-and-adr.md), [Runbook/Test/README/Incident](runbook-readme-test.md).

Use preconditions and ordered steps only for **operational** documents. Explanatory or decision documents do not have to become procedural manuals. For API docs/contracts, apply [API Specification rules](../spec/data-api-contracts.md); for functional requirements, use the [Specification workflow](../spec/workflow.md).
