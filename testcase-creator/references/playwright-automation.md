# Playwright Automation for E2E Test Cases

Generate one paired Playwright file whenever this skill creates or updates a deterministic testcase suite.

## Inspect the target project first

- Reuse its Playwright package, language, `test`/`expect` imports, config, fixtures, authentication state, data setup/cleanup, locator patterns, and test command. Prefer accessible user-facing locators such as roles and labels.
- Confirm the configured `testDir`/`testMatch` can discover `docs/autotests/`. If not, report the limitation and a supported way to run the file; if none exists, mark it blocked. Do not silently alter project-wide configuration or add dependencies.
- If there is no project convention, use `docs/autotests/<id_short_description>.spec.ts` and the standard `@playwright/test` API; start from the [Playwright template](../templates/playwright.spec.ts.template). If the package or browser setup is missing, report it as a prerequisite instead of installing it. Use only test URLs, controls, selectors, credentials, and fixtures supported by testcase evidence.

## Keep the pair traceable and behaviorally aligned

- Use the same `<id_short_description>` stem for `docs/testcases/<id_short_description>.md` and the automation file. Put a relative Markdown link at the top of the automation source, for example `// Test case: ../testcases/task-create.md`; include a reciprocal link in the testcase.
- Emit a Playwright `test()` for every deterministic case. Begin its title with the exact stable testcase ID (for example, `[TC-001]`). Exploratory charters are not automated pass/fail cases.
- Preserve each case's ordered actions, exact test data, and expected user-visible outcome. Use one named `test.step()` per numbered testcase action so the mapping is explicit. Every assertion must come from an approved testcase oracle; verify persistence with a product read-back when required.
- Use project-supported fixtures and locators. Never guess selectors, routes, copy, business rules, or setup; never put secrets in source. Do not test through direct API calls when the testcase describes a UI journey.
- Do not silently omit a case. If an unresolved oracle or missing project setup prevents valid automation, keep the case ID represented with a clearly reasoned `test.skip()` (or the project's equivalent) and report the exact evidence/setup needed. A skipped test is a gap, not a pass.
- Keep shared setup in existing fixtures where available. Avoid creating new config, dependencies, or app-side hooks as part of testcase generation.

## Output and execution

- Unless the user specifies another location, write the testcase to `docs/testcases/<id_short_description>.md` and the same-stem automation file under `docs/autotests/`. Use the project's existing Playwright extension convention; default to `.spec.ts` when none exists.
- Generate both files in the same task and verify the reciprocal links, every case ID, action-to-step mapping, and assertion-to-oracle mapping.
- State the project's exact Playwright command when known. Run tests only when requested and a valid, approved test environment is available; report blockers rather than implying a skipped or unrun test passed.
