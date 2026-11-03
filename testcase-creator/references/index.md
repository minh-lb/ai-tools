# Testcase Creator — Optional Reference Index

| File | Contents |
| --- | --- |
| [source-map](source-map.md) | E2E boundaries, product-visible oracles, and cross-layer assertions |
| [frontend-components](frontend-components.md) | Common UI prompts; use selectively for relevant journeys |
| [frontend-extended](frontend-extended.md) | Accessibility, responsive, i18n, UI states, and uncovered components |
| [backend-api](backend-api.md) | API/auth/validation guidance for understanding linked or cross-layer behavior; not a standalone suite here |
| [backend-systems](backend-systems.md) | Data/async/operations prompts for required end-to-end side-effect assertions |
| [nonfunctional-integration](nonfunctional-integration.md) | In-scope quality attributes, integration flows, and approved thresholds |
| [test-design-techniques](test-design-techniques.md) | Model-based, risk-based E2E journey design and coverage limits |
| [standards-basis](standards-basis.md) | Optional methodology mapping to official ISTQB, ISO/IEC/IEEE, W3C, and OWASP sources |
| [case-design governance](execution-governance.md) | Approval/readiness, reproducible steps, data safety, and separation from execution outcomes |
| [large-projects](large-projects.md) | Feature/service ownership, shared suites, release traceability, and regression selection |
| [testcase template](../templates/testcase.md) | Structured E2E case list and approved-criterion traceability |
| [Compact boundary example (EN)](../examples/task-create.en.md), [VI](../examples/task-create.vi.md) | Case-design examples showing feature scope and actions |
| [Illustrative default-path testcase example](../examples/default-output/docs/testcases/task-create.md), [example contract](../examples/default-output/specs/task-create.md) | Demonstrates document path and requirement traceability; explicitly not approved product requirements |
| [Testcase document validation](../tests/testcase-document.test.mjs) | Validates default output path, requirement trace, and local Markdown links without automation dependencies |
| [Complex multi-screen checkout (EN)](../examples/checkout-flow.en.md), [VI](../examples/checkout-flow.vi.md) | Cross-screen journey with payment recovery and explicit sign-in steps |
| [Multi-step form handling (EN)](../examples/form-submission.en.md), [VI](../examples/form-submission.vi.md) | Wizard submission, conditional validation, value retention, and persisted read-back |
