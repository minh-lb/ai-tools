# Analyze Action

## Prerequisites

- An active spec path must be set in `docs/current-feature.md`, or raw requirement text must be provided via `$ARGUMENTS`. If neither, run `spec` first.
- If `docs/current-feature.md` Status is `Not Started` and `$ARGUMENTS` contains a raw requirement, run `spec` first rather than analyzing the raw text directly.

## Steps

1. Resolve spec: use active spec from loaded `docs/current-feature.md`; if `$ARGUMENTS` is raw text, run `spec` first.
2. Verify spec completeness: confirm the spec has non-empty Goals, Requirements, Business Rules, Implement Plan, Test Plan, and Out of Scope sections. If any required section is missing or empty, stop and ask the user to complete it before proceeding.
3. Use already-loaded project overview and coding standards; read them only if unavailable in context.
4. Inspect only source/tests related to the spec.
5. Output affected modules, new files, modified files, risks, and assumptions.
