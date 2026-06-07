# Implement Action

## Prerequisites

- Active spec must exist in `docs/current-feature.md`. If missing, run `spec` first or ask the user.
- Implement Plan must exist in the active spec. If missing, run `plan` first or ask the user.

## Steps

1. Read active spec and Implement Plan.
2. Create a feature/fix branch only when the user or workflow requires it.
3. Implement in dependency order. Follow `docs/coding-standards.md` for all code rules.
4. Add/update behavior tests for changed code.
5. Run the smallest relevant test command first, then broader tests when reasonable.
6. Fix root causes up to 3 attempts. Stop and report if still failing.
7. Remove debug code and confirm the diff is scoped.
