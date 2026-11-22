---
name: tester
description: Write unit, integration, and E2E tests, author feature-level E2E test case documents, or run and diagnose existing tests and interactive frontend checks.
metadata:
  author: Minh Luu
---

# Tester

Follow repository instructions, the approved test basis, and the project's existing tools. Select the workflow from the requested deliverable.

- **Design test cases.** When asked for E2E scenarios or a test case document, read [case design](references/case-design.md). Use `docs/testcases/<id_short_description>.md` as the default if the project and user leave the path open. Preserve IDs when updating a suite. Document expected results, setup, and observable postconditions.
- **Run or diagnose tests.** When asked to verify a journey, run an existing suite, or investigate a failure, follow the workflow below. For a concrete execution question, consult the [execution guides](references/execution/guide.md).
- **Implement automated tests.** Follow the project's coding workflow and the [automation guidance](references/execution/automation.md). Before writing, map every in-scope requirement, distinct behavior, and reachable failure to an existing or new check at the layer that can prove it. Review the map after running the tests. Report missing coverage and blocked or unrun checks. For a combined request, keep the test case document, code, and observed results distinct. A request for case documentation alone stays within that document.

## Execution workflow

1. Inspect the relevant acceptance criteria, project commands, runner, fixtures, and environment. Choose journeys by changed behavior and risk. Prefer an authorized local, test, or sandbox environment with isolated data. Mark unknown expected behavior `pending-spec` while continuing checks with approved expectations.
2. Use the product's normal entry point and verify observable outcomes. Read state back after reload when persistence matters. Record which services were real, stubbed, or mocked.
3. Preserve failure evidence and diagnose before retrying. After a mutation timeout, reconcile the resulting state before resubmitting. Retry only when the operation is safe to repeat. Clean up owned test data within the authorized scope and report anything that remains.
4. Reconcile requested cases and environments with what actually ran. Check filters, skips, retries, and effective configuration when they can change coverage. An empty or all-skipped selection gives no passing evidence. Report commands, results, and gaps. Keep passing retries visible alongside the original failures.

A configured smoke run can use this workflow alone. Open a reference only when it answers a current decision. Testing does not authorize real charges, external messages, or changes to others' data.
