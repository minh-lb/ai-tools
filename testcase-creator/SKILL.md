---
name: testcase-creator
description: Create compact, traceable end-to-end (E2E) test case suites and linked Playwright automation from approved feature evidence. Use when asked to write E2E test cases, user-flow scenarios, Playwright E2E tests, or a feature-level E2E test plan.
metadata:
  author: Minh Luu
---

# E2E Test Case Creator

## Scope and output contract

- Produce the testcase Markdown **and its Playwright automation file in the same task**. Unless the user gives another path, use `docs/testcases/<id_short_description>.md` and `docs/autotests/<id_short_description>.spec.ts`. Keep the same short slug; follow the target project's Playwright language/extension convention when one exists. Do not ask routine path questions.
- Each deterministic case has a stable ID, one user/business goal, approved requirement/test-condition traceability, separate **Preconditions** and **Test data**, fully numbered and reproducible **User actions**, and an observable expected result/postcondition. Keep IDs stable; follow an existing ID convention.
- Every in-scope approved acceptance criterion and materially distinct expected behavior must map to one or more cases. Cover applicable positive/negative partitions, boundaries, roles, state transitions, errors, and recovery paths. Document genuine gaps/exclusions; do not invent behavior or claim all conceivable combinations.
- Actions must be executable without guessing: begin at an approved URL/route or app deep link; name each navigation target/control, exact input, submit action, and resulting screen/URL. Record a `pending-spec` decision if essential route, control, or oracle evidence is missing. Never include credentials, tokens, or secrets.
- Generate a matching Playwright test for every deterministic case, with the same case ID and assertions derived from its expected result. Put a relative testcase link in the automation file and a reciprocal automation link in the testcase file. Use project-supported fixtures and selectors; do not invent selectors, add dependencies, or silently omit cases. See [Playwright automation](references/playwright-automation.md).
- E2E journeys start and end at real product boundaries and assert user-visible outcomes. Prefer product read-back for persistence; use a narrowly scoped read-only backend assertion only when an important approved effect is otherwise invisible. Link standalone unit, component, API-contract, authorization-bypass, and database-invariant suites rather than duplicating them here.
- Keep design readiness separate from execution outcome. `pending-spec` means an oracle is unresolved; `blocked` means environment, permissions, data, or tooling prevents a valid run; `failed` means behavior diverged from an approved oracle. Include sign-in actions when auth is in scope; otherwise state the authenticated-session precondition. Use approved credential references, never secrets.

## Workflow

0. **Set display language without an unnecessary round trip.** Preserve the language of existing files. For new output, an explicit user choice wins; otherwise use the approved specification's language when consistent, or infer from the request. Ask only when evidence conflicts or the audience language is consequential and unclear. Use the project's metadata convention; keep IDs, schema keys, API names, error codes, and literal UI copy unchanged.
1. Read [E2E scope and oracle rules](references/source-map.md), [test design techniques](references/test-design-techniques.md), and [Playwright automation](references/playwright-automation.md). Load only relevant prompts: frontend references for user-visible states, backend/API references for an in-scope cross-layer effect, NFR/integration for specified quality attributes, large-project guidance for genuinely large portfolios, and execution governance when defining runs. References are not permission to create standalone backend case tables. Read [standards basis](references/standards-basis.md) only when maintaining this skill or asked about standards; it is methodology context, not product behavior.
2. Inspect the approved **test basis** and smallest relevant evidence set: acceptance criteria, versioned design, role/ownership rules, relevant API contract, business/error/edge-case registers, approved test URLs/routes, supported clients, and relevant implementation. Also inspect the target project's Playwright config, scripts, fixtures, and nearby tests for supported selectors, setup, and run commands. Identify the user goal, entry/exit state, actor, and dependencies; implementation evidence does not override approved requirements. Never present locally authored examples, generated fixtures, or current behavior as approved product requirements; mark illustrative-only evidence and its approval gap explicitly.
3. Derive a checklist of all in-scope acceptance criteria and distinct test conditions, then use [test design](references/test-design-techniques.md) to select applicable partitions, boundaries, decision tables, transitions, roles, and recovery paths. Map every checklist item to case ID(s) or document its gap/exclusion. Avoid irrelevant combinations and duplicate FE/BE cases. Exploratory work remains a separate charter/run note, never a pass/fail testcase.
4. Drive cases through the product's user-facing entry point and assert the important journey outcome, including a read-back after reload/navigation when persistence matters. Use component/accessibility/responsive/i18n references only to identify in-scope checks that belong in an E2E journey; link component/API suites for lower-level coverage rather than copying them.
5. Treat backend state, messages, or jobs as cross-layer assertions only when required by the user outcome. Prefer UI or supported product read-back. If an essential side effect is otherwise invisible, specify the approved read-only verification point and required setup. Do not invent persistence, retry, authorization, or failure policies. A security or API concern needing direct requests belongs in a separate authorized suite.
6. Write the testcase to the default path (or explicit user path) from `templates/testcase.md`. Keep scope notes concise, put requirement/test-condition IDs in each case's Trace, remove unused optional sections, and include only documented coverage gaps. Preserve numbered, precise actions; do not replace steps with vague summaries.
7. Generate the matching Playwright file from the testcase as specified in [Playwright automation](references/playwright-automation.md). Include every deterministic case ID; preserve action order and data, and assert the approved expected outcome. If missing evidence or setup prevents valid automation, emit a clearly explained skipped/blocked test rather than guessing or omitting it. Link the two files.
8. Review the testcase and automation together: every in-scope criterion is covered or explicitly flagged; each action maps to automation; every assertion maps to an oracle; IDs and links agree; selectors, fixtures, routes, and cleanup are supported by evidence. Check that the configured runner can discover the output path and report the exact run command. Do not add project configuration or dependencies without authorization.
9. When execution is requested, use only the approved test environment and record build/environment, tester/date, result, actual result, redacted evidence, and defect ID. Exploratory testing remains a separate charter/run note, never a pass/fail testcase. Do not change an oracle to match implementation without owner approval.

## Token and output discipline

- Keep scope/source context short and avoid repeating shared setup. Prefer plain language, concise headings, and one case per distinct user outcome.
- Never trade away executable detail to save tokens: every action names the route/control, input, action, and material resulting state. Use the smallest set of cases that still traces every in-scope criterion and distinct behavior.
- Do not duplicate API/DB suites or add empty gap/review sections. List only real gaps, exclusions, and pending decisions.
- Do not invent a case count or coverage percentage. Never silently truncate; report when the requested scope cannot be covered in one suite.

## References

| File | Contents |
| --- | --- |
| [source-map](references/source-map.md) | E2E boundaries, product-visible oracles, and cross-layer assertions |
| [frontend-components](references/frontend-components.md) | Common UI prompts; use selectively for relevant journeys |
| [frontend-extended](references/frontend-extended.md) | Accessibility, responsive, i18n, UI states, and uncovered components |
| [backend-api](references/backend-api.md) | API/auth/validation guidance for understanding linked or cross-layer behavior; not a standalone suite here |
| [backend-systems](references/backend-systems.md) | Data/async/operations prompts for required end-to-end side-effect assertions |
| [nonfunctional-integration](references/nonfunctional-integration.md) | In-scope quality attributes, integration flows, and approved thresholds |
| [test-design-techniques](references/test-design-techniques.md) | Model-based, risk-based E2E journey design and coverage limits |
| [standards-basis](references/standards-basis.md) | Optional methodology mapping to official ISTQB, ISO/IEC/IEEE, W3C, and OWASP sources |
| [execution-governance](references/execution-governance.md) | E2E readiness, reproducibility, execution evidence, and safety |
| [large-projects](references/large-projects.md) | Feature/service ownership, shared suites, release traceability, and regression selection |
| [testcase template](templates/testcase.md) | Structured E2E case list, coverage trace, and automation link |
| [Playwright template](templates/playwright.spec.ts.template) | Starter spec for projects without an existing Playwright file convention |
| [Playwright automation](references/playwright-automation.md) | Case-to-test mapping, locator, setup, and file-link rules |
| [Compact boundary example (EN)](examples/task-create.en.md), [VI](examples/task-create.vi.md) | Case-design examples; see the paired example for the required automation output |
| [Illustrative default-path testcase example](examples/default-output/docs/testcases/task-create.md), [Playwright automation](examples/default-output/docs/autotests/task-create.spec.ts), [fixture contract](examples/default-output/specs/task-create.md), [app fixture](examples/default-output/fixtures/task-server.mjs) | Demonstrates the default paths, same stem, links, and case/action mapping; explicitly not approved product requirements or coverage evidence |
| [Paired-example validation](tests/paired-example.test.mjs) | Run `node --test testcase-creator/tests/paired-example.test.mjs` from repo root for links, trace/step mapping, Node syntax check, TS transpile, and local app smoke checks |
| [Complex multi-screen checkout (EN)](examples/checkout-flow.en.md), [VI](examples/checkout-flow.vi.md) | Cross-screen journey with payment recovery and explicit sign-in steps |
| [Multi-step form handling (EN)](examples/form-submission.en.md), [VI](examples/form-submission.vi.md) | Wizard submission, conditional validation, value retention, and persisted read-back |
