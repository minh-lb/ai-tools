# Plan Action

Create or refine the `Implement Plan` from the active spec.

Include:

- Ordered rollout steps and file paths.
- Dependency order and technical decisions.
- Test plan: unit, integration, API/feature tests as applicable.
- Test case mapping: convert spec `Test Cases` (prioritize P0/P1 first) into concrete test targets/commands.
- Risks or unknowns that affect implementation.

**Atomicity** (`SPEC.ATOMIC_STEPS`): each step targets exactly one production file. Include the paired test file only when it directly verifies that production file. Per step: exact file path, one-line technical decision, `Depends on`, and `Verify`. If steps exceed ~7, stop — go back and restructure the active spec as an Epic (epic file + sub-specs) before continuing.

For Laravel backend work, follow `domain-driven-design`: migration -> Domain -> Infrastructure -> Application -> Interfaces -> tests.

No approval gate after plan. Proceed directly to `implement`.
