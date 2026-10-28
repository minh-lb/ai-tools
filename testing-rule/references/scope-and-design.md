# Scope and test design

## Establish an oracle

Use approved acceptance criteria, business rules, role/ownership rules, and supported product contracts. Identify the source for each expected outcome. If sources conflict or an essential outcome is unspecified, mark that check `pending-spec`; continue independent checks with known expectations.

Distinguish modes:

- **Smoke:** a small set of critical journeys showing the environment is usable.
- **Regression:** journeys affected by a change plus nearby behavior at risk.
- **Exploratory:** a bounded question or charter; record observations without turning unapproved expectations into deterministic pass/fail cases.

## Select meaningful journeys

For each journey capture an ID, actor/role, entry point, preconditions, test data, actions, observable expected result, and cleanup needs. Link the outcome to its acceptance criterion so omitted criteria remain visible. Keep this in existing tests or a short run note; do not require duplicate documents.

Set a practical execution/investigation budget using the task deadline and project policy; choose a bounded budget if neither exists. Reserve time for authorized teardown. Prioritize critical outcomes within the remaining budget. At the investigation limit, stop new probes, perform bounded teardown, and report unresolved cases and the next discriminating check; a deadline does not change a case's status.

Start with the critical happy path. Add materially different risks where applicable:

- Invalid input and relevant boundaries; rejected actions leave state unchanged.
- Anonymous, expired session, and distinct authorized/unauthorized roles.
- Where ownership or tenancy matters, two identities with the same role and separate owned records. Check both allowed access and denied cross-owner access through supported test paths; a hidden UI action alone does not prove authorization.
- Empty, loading, error, recovery, and partial completion states.
- Reload, direct navigation, history, or repeat submission when these affect the changed journey.
- Delayed jobs, dependency failure, duplicate actions, or interrupted flows when their outcomes are specified.

Select browsers, viewports, locale, keyboard, and accessibility checks from supported clients and changed behavior. Avoid a full Cartesian matrix without evidence it is useful. Automated scans do not establish full accessibility conformance.

## Keep E2E boundaries clear

Drive the public UI, CLI, or other product entry point and follow the cross-system journey to its approved outcome. A direct service request can be E2E for an API product; it cannot establish that a separate UI works. Setup APIs may create prerequisites but must not perform the behavior being tested.

For invisible required side effects, use an approved read-only API, event, or state observation correlated to the journey. Keep lower-level validation in unit/integration/contract suites and state which boundaries remain untested.

Example: for an approved “saved drafts survive refresh” requirement, create a uniquely named draft through the UI, refresh, reopen it, and verify its content. A success notification alone misses the persistence contract. If persistence is unspecified, record the observation and resolve the oracle before classifying a defect.
