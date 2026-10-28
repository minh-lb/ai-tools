---
name: testing-rule
description: Use when running, automating, reviewing, or troubleshooting end-to-end (E2E) tests, frontend user journeys, UI interactions, forms, responsive layouts, accessibility, smoke checks, regression testing, or flaky E2E failures. Not for unit-only tests or test case documentation alone.
metadata:
  author: Minh Luu
---

# Testing Rule

Verify a user goal through the product's real entry point and observable outcome. Match every conclusion to the environment, boundaries, and evidence actually tested.

## Workflow

1. Inspect repository instructions, acceptance criteria, existing tests, runner configuration, fixtures, and available tools. Reuse the project's stack and commands; do not install a new framework by default.
2. Define the actor, entry point, initial state, expected outcome, and important system boundaries. Select a small set of journeys based on changed behavior and risk. Separate requirement gaps from execution blockers.
3. Confirm the target environment, account, test data, dependencies, and permitted side effects. Reuse existing authorization; ask only when a missing decision or permission blocks a necessary action.
4. Execute through the user-facing boundary. Check meaningful outcomes, persistence, and recovery where required. Record what ran and which integrations were real, sandboxed, or mocked.
5. Investigate failures before changing tests or retrying. Preserve the initial failure and distinguish product defects, test defects, environment issues, and unresolved causes.
6. Report coverage, exact execution results, evidence, and remaining gaps. A written test or a passing lower-level check does not establish E2E success.

## Read only what the task needs

Use this entrypoint as the shared checklist. Open the relevant reference when reaching its decision; do not preload the reference library. For a simple existing smoke run, read environment guidance before execution and reporting guidance when summarizing.

| Current need | Reference |
|---|---|
| Choose journeys, assertions, roles, negative paths, or scope | [Scope and test design](references/scope-and-design.md) |
| Prepare services, credentials, fixtures, isolation, and cleanup | [Environment and data](references/environment-and-data.md) |
| Drive a browser or inspect UI outcomes interactively | [Browser execution](references/browser-execution.md) |
| Test frontend screens, navigation, components, or visual behavior | [Frontend checks](references/frontend-checks.md) |
| Test frontend forms, validation, async states, or request races | [Frontend forms and state](references/frontend-forms-and-state.md) |
| Test responsive layout, touch, keyboard, focus, or accessibility | [Frontend accessibility and responsive](references/frontend-accessibility-and-responsive.md) |
| Create or modify automated E2E tests and CI runs | [Automation](references/automation.md) |
| Diagnose timeout, inconsistent pass/fail, or a failed run | [Failure diagnosis](references/failure-diagnosis.md) |
| Summarize results or decide whether verification is sufficient | [Evidence and reporting](references/evidence-and-reporting.md) |

## Essential boundaries

- Use approved requirements as the oracle. Existing implementation is evidence of behavior, not proof of correctness. Explore unclear behavior without inventing acceptance criteria.
- Keep production and external side effects within explicit authorization. Use owned test data; protect secrets in logs, screenshots, traces, and reports.
- Verify the product outcome, not only a toast, HTTP status, screenshot, or successful click. When persistence is required, read back through the product after reload or a fresh navigation.
- Report retries, mocks, excluded journeys, and blocked checks. Never convert missing execution evidence into a pass or weaken an assertion to hide a defect.
