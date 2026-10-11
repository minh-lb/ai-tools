---
name: testcase-creator
description: Create compact, traceable end-to-end (E2E) test case suites for user journeys from approved specifications, designs, and relevant QA guidance. Use when asked to write E2E test cases, user-flow scenarios, or a feature-level E2E test plan.
metadata:
  author: Minh Luu
---

# E2E Test Case Creator

## Scope and output contract

- Create a coherent feature-level E2E journey suite and follow the repository's file, status, metadata, and case-ID conventions. If no convention exists, use one Markdown file per independently scoped feature under the agreed output directory and stable IDs local to that suite (for example, `TC-001`). Put cross-feature paths under their initiating feature and link shared suites instead of duplicating cases.
- Each deterministic case should express one user/business goal, approved source/test-condition traceability, separate **Preconditions** and **Test data**, reproducible **User actions**, and an observable expected end-to-end result/postcondition. Include risk/priority rationale only when the target format uses it. Keep referenced IDs stable; do not impose a specific prefix or renumber existing references.
- Make User actions detailed enough for another tester to execute without guessing: start with the approved test base URL plus route (or native-app deep link), then name each navigation target/control, entered value, submit action, and resulting screen/URL. If the exact URL or control is not in approved evidence, do not invent it; use the known base URL plus explicit UI navigation, or record a pending decision when the route is essential. Never include credentials, session tokens, or other secrets.
- The E2E journey starts and ends at a real product boundary. Assert the user-visible result; verify persistent backend effects through a user-visible read-back when possible. Add a narrowly scoped, read-only backend assertion only when the effect is important and cannot be observed through the product. Backend behavior is part of the same journey, not a second case table.
- This skill does **not** generate standalone unit, component, API-contract, authorization-bypass, or database-invariant test suites. Link those to their dedicated suites. Direct API calls may prepare/clean up data or start a genuinely API-native user journey, but a pure endpoint check is not an E2E case. E2E coverage never proves all backend security controls; a hidden UI button is not proof of API authorization.
- Keep design readiness separate from execution outcome. An unresolved expected user outcome is `pending-spec` and not runnable; `blocked` means the environment, permissions, data, or tooling prevent a valid run; `failed` means actual behavior diverged from an approved oracle. Do not invent errors, copy, status codes, thresholds, or business rules. Include login/sign-in in User actions when authentication is part of the tested journey; otherwise state the pre-authenticated session in Preconditions. Never put passwords, tokens, or other secrets in testcase files; use an approved test-credential reference.
- Do not promise coverage of “all possible” scenarios. Build a finite, risk-prioritized set from available evidence and state important exclusions/residual risks. Use combinatorial coverage only when justified.

## Workflow

0. **Set display language without an unnecessary round trip.** An explicit user choice wins. Otherwise use the approved specification's language when consistent, or infer from the request. Ask only when evidence conflicts or the audience language is consequential and unclear. Use the project's metadata convention for language; do not restrict it to a fixed language set. Keep IDs, schema keys, API names, error codes, and literal UI copy unchanged.
1. Read [E2E scope and oracle rules](references/source-map.md) and [test design techniques](references/test-design-techniques.md). Then load only relevant prompts: `frontend-components`/`frontend-extended` for user-visible states, backend API/system references only to understand an in-scope cross-layer effect, NFR/integration for specified quality attributes, large-project guidance for genuinely large portfolios, and execution governance when defining runs. These references are not permission to create standalone backend case tables. Read [standards basis](references/standards-basis.md) only when maintaining this skill or asked about standards; it is methodology context, not product behavior.
2. Inspect the approved **test basis** and smallest relevant evidence set: acceptance criteria, versioned design, role/ownership rules, API contract where the journey depends on it, business/error/edge-case registers, approved test base URLs/routes or native deep links, supported-client matrix, NFRs, and relevant architecture/current implementation. Identify the user's goal, entry point, actor, starting state, end state, and dependencies. Code shows current behavior but does not override approved requirements.
3. For **deterministic E2E cases only**, derive test conditions from the test basis and select techniques from [test design](references/test-design-techniques.md): equivalence partitions, boundaries, decision tables, state transitions, use-case paths, and justified combinatorial selection. Cover materially different user outcomes and high-risk paths; do not enumerate irrelevant combinations or duplicate a single journey as separate FE and BE cases. Keep each case's oracle observable and project-specific. Exploratory work is defined and recorded only as a separate charter/run note, never as a pass/fail testcase.
4. Drive cases through the product's user-facing entry point and assert the important journey outcome, including a read-back after reload/navigation when persistence matters. Use component/accessibility/responsive/i18n references only to identify in-scope checks that belong in an E2E journey; link component/API suites for lower-level coverage rather than copying them.
5. Treat backend state, messages, or jobs as cross-layer assertions only when required by the user outcome. Prefer UI or supported product read-back. If an essential side effect is otherwise invisible, specify the approved read-only verification point and required setup. Do not invent persistence, retry, authorization, or failure policies. A security or API concern needing direct requests belongs in a separate authorized suite.
6. Copy `templates/testcase.md` to the requested output directory; otherwise use the single canonical testcase directory if exactly one exists, ask only if multiple plausible destinations remain, and use `./docs/testcases/` if none exists (state that choice). Keep scope/source notes brief, populate concrete per-case trace links, and remove instructional comments and unused optional sections. Render each deterministic case as a structured list entry with a short feature-local ID, separate Preconditions and Test data fields, and numbered User actions—not a table. Add a pending-decision list only when an oracle is unresolved; add no coverage-matrix or review-summary section.
7. Review the journey-to-case and case-to-source links, start/end states, alternate/error/recovery paths, permissions, data boundaries, observable outcomes, cleanup, and relevant side effects. State material exclusions and residual risks without claiming exhaustive coverage. Do not report a single coverage percentage unless its denominator and selection method are defined.
8. When execution is requested, create a separate deterministic E2E run record linked by feature ID/suite path plus local case ID, with build/environment, tester/date, result, actual result, redacted evidence, and defect ID. Exploratory testing is a **separate charter**, not a pass/fail testcase: define its objective, observation focus, scope/data, timebox, safety, and risk in the optional charter section; record charter-session observations, evidence, and follow-ups only in optional exploratory run notes. Never assign a charter `passed` or `failed`; turn any finding into a defect or a new deterministic case with an approved oracle. Never change an oracle to match implementation without owner approval. Do not run destructive, security, load, or fault-injection work against production without explicit authorization.

## Token and output discipline

- Checklists are selection prompts, not one-to-one testcase requirements. Emit only feature-specific E2E journeys with distinct outcomes.
- Keep scope/source context short, but do not compress User actions into vague phrases such as “go to the page” or “fill the form.” Include the start URL/route, concrete navigation/control, input value, action, and resulting screen for every material transition.
- Do not duplicate API/DB test suites or emit an open-questions register or review summary unless there is material content or the user/project requires it.
- Do not generate a target case count or percentage without an agreed denominator. Never silently truncate a suite; state when scope must be split or prioritized.

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
| [testcase template](templates/testcase.md) | Structured E2E case list plus optional sections |
| [Compact boundary example (EN)](examples/task-create.en.md), [VI](examples/task-create.vi.md) | Small single-form E2E suite |
| [Complex multi-screen checkout (EN)](examples/checkout-flow.en.md), [VI](examples/checkout-flow.vi.md) | Cross-screen journey with payment recovery and explicit sign-in steps |
| [Multi-step form handling (EN)](examples/form-submission.en.md), [VI](examples/form-submission.vi.md) | Wizard submission, conditional validation, value retention, and persisted read-back |
