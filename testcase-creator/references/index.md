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
| [execution-governance](execution-governance.md) | E2E readiness, reproducibility, execution evidence, and safety |
| [large-projects](large-projects.md) | Feature/service ownership, shared suites, release traceability, and regression selection |
| [testcase template](../templates/testcase.md) | Structured E2E case list, coverage trace, and automation link |
| [Playwright template](../templates/playwright.spec.ts.template) | Starter spec for projects without an existing Playwright file convention |
| [Playwright automation](playwright-automation.md) | Cases-and-automation mode only: case-to-test mapping, locator, setup, and file-link rules |
| [Compact boundary example (EN)](../examples/task-create.en.md), [VI](../examples/task-create.vi.md) | Case-design examples; see the paired example for the required automation output |
| [Illustrative default-path testcase example](../examples/default-output/docs/testcases/task-create.md), [Playwright automation](../examples/default-output/docs/autotests/task-create.spec.ts), [fixture contract](../examples/default-output/specs/task-create.md), [app fixture](../examples/default-output/fixtures/task-server.mjs) | Demonstrates the default paths, same stem, links, and case/action mapping; explicitly not approved product requirements or coverage evidence |
| [Paired-example validation](../tests/paired-example.test.mjs) | Run `node --test testcase-creator/tests/paired-example.test.mjs` from repo root for links, trace/step mapping, Node syntax check, TS transpile, and local app smoke checks |
| [Complex multi-screen checkout (EN)](../examples/checkout-flow.en.md), [VI](../examples/checkout-flow.vi.md) | Cross-screen journey with payment recovery and explicit sign-in steps |
| [Multi-step form handling (EN)](../examples/form-submission.en.md), [VI](../examples/form-submission.vi.md) | Wizard submission, conditional validation, value retention, and persisted read-back |
