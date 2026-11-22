# E2E Test Case Design

## Scope and output contract

- **The case-design workflow outputs testcase documentation only.** Write deterministic, manually executable E2E test cases in Markdown. Do not create, modify, or run automated tests, Playwright scripts, test fixtures, or test-runner configuration. If the request also includes automation, keep it as a separate implementation task from case design.
- Write testcase Markdown to `docs/testcases/<id_short_description>.md` when the user and project leave the destination open. Follow existing naming and schema. When updating an existing suite, preserve IDs and read [change-impact guidance](change-impact.md) to update only affected cases.
- Use the project's existing schema or the [case template](../templates/testcase.md). In the default schema, give each case its own heading with a stable ID and one user goal. Include separate **Preconditions** and **Test data**, numbered **User actions**, an observable expected outcome, and its approved source. Use a coverage table as an index when helpful.
- Every in-scope approved acceptance criterion and materially distinct expected behavior must map to one or more cases. Cover applicable positive/negative partitions, boundaries, roles, state transitions, errors, and recovery paths. Document genuine gaps/exclusions; do not invent behavior or claim all conceivable combinations.
- Actions must be reproducible: use an approved entry route or navigation path, named controls, and exact data. Expected results must be specific and observable, not just "works" or "error shown". Use only documented navigation, screen changes, messages, and record-count guarantees. For negative cases, verify unchanged state/no unintended side effects when approved requirements call for it. Mark material missing details `pending-spec`; never include secrets.
- E2E journeys start and end at real product boundaries and assert user-visible outcomes. Prefer product read-back for persistence; use a narrowly scoped read-only backend assertion only when an important approved effect is otherwise invisible. Link standalone unit, component, API-contract, authorization-bypass, and database-invariant suites rather than duplicating them here.
- Keep testcase **design readiness** separate from observed test results: `pending-spec` means an expected result is not approved; a test case earns PASS only after an execution meets its expected outcome. Include sign-in actions when auth is in scope; otherwise state the authenticated-session precondition. Use approved credential references, never secrets.

## Workflow

0. **Language.** Preserve existing file language; otherwise follow the user's explicit choice, approved spec, then request language. Preserve IDs, literal UI copy and technical identifiers.
1. **References.** Read the [source map](source-map.md) when expected results or boundaries need clarification. Use [test design](test-design-techniques.md) for nontrivial coverage decisions and the [reference index](index.md) for specific risks.
2. **Evidence.** Inspect approved acceptance criteria/specs, relevant user flows, contracts and roles. Implementation and local examples do not create approved requirements; mark gaps `pending-spec`.
3. **Coverage.** Map each approved criterion/test condition → distinct behavior/risk → case ID or explicit gap. Route conflicting sources through a pending decision with its owner; avoid speculative combinations and duplicated lower-level suites.
4. **Journey.** Start from the approved user-facing entry point, name exact controls/inputs/navigation, and assert observable outcomes. For persistence, verify read-back. Use a read-only backend assertion only when a required effect is otherwise invisible and authorized.
5. **Document.** Write the testcase from [template](../templates/testcase.md) at the chosen/default path, with separate setup/data, reproducible numbered actions, expectations and trace IDs. Omit empty optional sections.
6. **Output boundary.** Deliver the Markdown testcase document only. When an automation request is combined with case design, keep test code and observed results separate from this document.
7. **Quality gate.** Verify stable unique IDs, source trace, concrete preconditions/data/actions, observable oracles and postconditions; check negative/no-side-effect behavior, high-risk paths, contradictions, gaps and links. Preserve unaffected IDs; never claim execution.

## Token and output discipline

- Keep scope/source context short and avoid repeating shared setup. Prefer plain language, concise headings, and one case per distinct user outcome.
- Never trade away executable detail to save tokens: every action names the route/control, input, action, and material resulting state. Use the smallest set of cases that still traces every in-scope criterion and distinct behavior.
- Do not duplicate API/DB suites or add empty gap/review sections. List only real gaps, exclusions, and pending decisions.
- Do not invent a case count or coverage percentage. Never silently truncate; report when the requested scope cannot be covered in one suite.

## Reference routing

Read [source basis](source-map.md) for requirements/oracles, [test design](test-design-techniques.md) for nontrivial techniques, and [change impact](change-impact.md) only when updating existing files. Use the [optional index](index.md) for narrowly relevant domains; examples are format aids, not product requirements.
