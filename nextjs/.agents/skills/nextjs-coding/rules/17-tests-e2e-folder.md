# Rule 17 - `tests/e2e/`

## Purpose
Automation tests for user flows.

## Must
- Cover observable end-to-end behavior.
- Keep scenario names aligned with route/use-case intent.
- Derive scenarios from `docs/specs` test cases first (execute P0/P1 before lower priorities when available).

## Must Not
- Assert implementation details.
- Skip required P0/P1 test cases from the active spec without documenting the gap.
