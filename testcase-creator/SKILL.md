---
name: testcase-creator
description: Use when the user asks to write feature-level E2E test cases, user-flow scenarios, E2E test plans, or matching Playwright automation based on approved feature evidence.
metadata:
  author: Minh Luu
---

# E2E Test Case Creator

## Scope and output contract

- Choose the output mode from the user's request: **cases-only** for test case documents, scenarios, and E2E plans without automation requested; **cases-and-automation** when the user explicitly asks for Playwright, executable E2E tests, or both artifacts. Do not generate Playwright files in cases-only mode. Ask only if the requested output is materially ambiguous.
- Write the testcase Markdown to `docs/testcases/<id_short_description>.md` unless the user chooses another path. In cases-and-automation mode, also generate `docs/autotests/<id_short_description>.spec.ts` (or the target project's existing Playwright extension/path convention), with the same short slug. Do not ask routine path questions.
- Each deterministic case has a stable ID, one user/business goal, approved requirement/test-condition traceability, separate **Preconditions** and **Test data**, fully numbered and reproducible **User actions**, and an observable expected result/postcondition. Keep IDs stable; follow an existing ID convention.
- Every in-scope approved acceptance criterion and materially distinct expected behavior must map to one or more cases. Cover applicable positive/negative partitions, boundaries, roles, state transitions, errors, and recovery paths. Document genuine gaps/exclusions; do not invent behavior or claim all conceivable combinations.
- Actions must be executable without guessing: begin at an approved URL/route or app deep link; name each navigation target/control, exact input, submit action, and resulting screen/URL. Record a `pending-spec` decision if essential route, control, or oracle evidence is missing. Never include credentials, tokens, or secrets.
- **Cases-and-automation only:** generate a matching Playwright test for every deterministic case, with the same case ID and assertions derived from its expected result. Put a relative testcase link in the automation file and a reciprocal automation link in the testcase file. Use project-supported fixtures and selectors; do not invent selectors, add dependencies, or silently omit cases. See [Playwright automation](references/playwright-automation.md). Cases-only output must not contain a link to a nonexistent automation file.
- E2E journeys start and end at real product boundaries and assert user-visible outcomes. Prefer product read-back for persistence; use a narrowly scoped read-only backend assertion only when an important approved effect is otherwise invisible. Link standalone unit, component, API-contract, authorization-bypass, and database-invariant suites rather than duplicating them here.
- Keep design readiness separate from execution outcome. `pending-spec` means an oracle is unresolved; `blocked` means environment, permissions, data, or tooling prevents a valid run; `failed` means behavior diverged from an approved oracle. Include sign-in actions when auth is in scope; otherwise state the authenticated-session precondition. Use approved credential references, never secrets.

## Workflow

0. **Language.** Preserve existing file language; otherwise follow the user's explicit choice, approved spec, then request language. Preserve IDs, literal UI copy and technical identifiers.
1. **References.** Read [source-map](references/source-map.md). Read [test design](references/test-design-techniques.md) when coverage choices are nontrivial; read [Playwright automation](references/playwright-automation.md) only for cases-and-automation. Select other references from the [index](references/index.md) only for current risks.
2. **Evidence.** Inspect approved acceptance criteria/specs, relevant flows, contracts and roles. In automation mode inspect the project's Playwright config, fixtures and nearby tests. Implementation and local examples never create approved requirements; mark gaps `pending-spec`.
3. **Coverage.** Map every in-scope criterion and distinct positive/negative, boundary, role, state or recovery behavior to stable case ID(s) or an explicit gap. Avoid speculative combinations or duplicated API/unit suites.
4. **Journey.** Start from the approved user-facing entry point, name exact controls/inputs/navigation, and assert observable outcomes. For persistence, verify read-back. Use a read-only backend assertion only when a required effect is otherwise invisible and authorized.
5. **Document.** Write the testcase from [template](templates/testcase.md) at the chosen/default path, with separate setup/data, reproducible numbered actions, expectations and trace IDs. Omit empty optional sections.
6. **Mode.** Cases-only ends with the testcase document—no Playwright file or reciprocal link. In cases-and-automation, generate a matching test for each deterministic ID, follow the same actions/oracles and explain any `test.skip()`; link both artifacts.
7. **Verify.** Check coverage, IDs, sources and assertions. For automation also check selectors, fixtures, cleanup, link pairs and runner discovery. Do not add dependencies or change project-wide config without authorization.
8. **Execute only on request.** Use an approved test environment and record build, tester, date, actual outcome, redacted evidence and defects. A skipped/unrun case is never PASS; exploratory notes are not deterministic cases.

## Token and output discipline

- Keep scope/source context short and avoid repeating shared setup. Prefer plain language, concise headings, and one case per distinct user outcome.
- Never trade away executable detail to save tokens: every action names the route/control, input, action, and material resulting state. Use the smallest set of cases that still traces every in-scope criterion and distinct behavior.
- Do not duplicate API/DB suites or add empty gap/review sections. List only real gaps, exclusions, and pending decisions.
- Do not invent a case count or coverage percentage. Never silently truncate; report when the requested scope cannot be covered in one suite.

## Reference routing

Load only the reference needed for the current decision: [source basis](references/source-map.md) for approved requirements and E2E boundaries; [test design](references/test-design-techniques.md) for nontrivial partitions/roles/transitions; [Playwright automation](references/playwright-automation.md) only in cases-and-automation mode. For specialized frontend, backend, nonfunctional or large-project guidance, consult the [optional index](references/index.md) and select narrowly. Examples are format aids, never product requirements.
