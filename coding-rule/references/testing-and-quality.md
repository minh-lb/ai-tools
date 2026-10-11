# Testing and Quality Rules

Tests are executable evidence for specific behavior, not proof that a system is defect-free. Choose layers and depth according to changed contracts, failure impact, and the project's architecture. For security-sensitive changes, use the applicable prompts in [Secure Coding Rules](security.md); for browser performance changes, see [Frontend Performance](frontend-performance.md).

## Test design

- Derive expected results from approved requirements and contracts. Do not change an expected result merely to match current implementation.
- Cover the changed behavior's normal path plus meaningful boundaries, invalid inputs, authorization/state variants, and failure/recovery cases. Prioritize by plausible impact and likelihood; avoid exhaustive Cartesian combinations without a reason.
- Choose the lowest test level that gives reliable evidence, then add integration, contract, UI, end-to-end, performance, or security checks where cross-boundary behavior or risk warrants them.
- Add a regression test for a reproducible defect where feasible. For new behavior, define observable acceptance conditions and tests before or alongside implementation; use test-first development when it improves feedback.
- Test public behavior and invariants, not implementation details that make harmless refactors expensive. Ensure tests can fail when the relevant behavior is broken.
- Keep tests deterministic, isolated, comprehensible, and maintainable. Control time, randomness, network, external services, and shared state explicitly. Avoid over-mocking the behavior the test is meant to verify.
- Use representative, non-sensitive test data. Do not place credentials, personal data, or production data in fixtures, snapshots, logs, or reports.

## Coverage and test layers

- Use unit tests for focused deterministic logic; integration tests for real boundaries such as persistence or service composition; contract tests for producer/consumer agreements; and end-to-end tests for a small number of critical user journeys.
- Do not equate line coverage with behavioral confidence. Do not impose a universal coverage percentage or require every test layer for every change; follow an explicit repository or release policy where one exists.
- Keep test suites proportionate. Avoid redundant tests that check the same invariant at the same layer without added diagnostic or contract value.

## Verification

- Inspect the repository's documented commands and relevant scripts before running them. Treat test/build scripts as executable code; avoid commands that can mutate production data, contact real users, incur meaningful cost, or cause external side effects without authorization.
- Run focused tests first, then applicable type, static analysis, lint, build, integration, accessibility, or broader regression checks. Record exact commands and outcomes.
- For a failure, distinguish a product defect from a test/environment/tooling issue and preserve the failing evidence. Fix the implementation unless the test is demonstrably invalid.
- Inspect the final diff for unrelated changes, missing tests/docs, accidentally included generated files, secrets, and changes to public behavior.
- Report skipped checks and why. Never claim coverage, pass status, accessibility conformance, or security assurance that the executed evidence does not establish.
