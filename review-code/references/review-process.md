# Review Process

## Contents

1. Objective
2. Review Sequence (Codebase Review: 5 steps / Code Change Review: 6 steps)
3. Evidence Standard
4. Reporting Format
5. Large Diff Strategy
6. When To Mark N/A

## Objective

The purpose of review is to identify meaningful risk before merge or deployment. Focus on defects, regressions, unsafe assumptions, missing controls, and operational blind spots. A good review does not try to rewrite the whole change. It isolates the highest-value findings with enough evidence that another engineer can validate and act on them.

## Review Sequence

### Codebase Review

1. Map scope.
   Identify the boundaries being reviewed (full project, a module, a service). List entry points: HTTP handlers, CLI commands, queue consumers, scheduled jobs, SDK surfaces.
2. Trace critical paths.
   From each entry point, follow inputs, validation, domain logic, persistence, side effects, and outputs. Cover success paths, failure paths, and partial failures.
3. Evaluate the 12 dimensions across the entire scope.
   All dimensions are potentially relevant. Mark N/A only where the codebase has no surface for that concern.
4. Check safeguards.
   Verify tests, alerting, rollback readiness, permissions, and operational coverage across the critical paths inspected.
5. Write findings.
   Report only issues with a concrete path to impact. Order by severity, then by confidence and blast radius. Note confidence limits for subsystems not deeply inspected.

### Code Change Review

1. Establish intent.
   Read the diff, commit message, and PR description to understand what changed and why.
2. Trace execution paths of the changed code.
   Follow the changed behavior through success paths, failure paths, and partial failures.
3. Check impact logic (mandatory).
   For each changed function, method, type, schema, event, or config key: use grep, LSP, or file reads to find all call sites and dependents in the codebase. For each one, verify its logic still holds under the new behavior:
   - Return value assumptions: shape, range, or nullability that the caller expects.
   - Side effect assumptions: writes, events, or cache updates the caller relies on.
   - Error condition assumptions: error types or handling paths the caller expects.
   - Data shape assumptions: fields the caller accesses, iterates, or indexes into.
   Do not rely on the diff alone. A change silently breaks caller logic when assumptions no longer hold even though no compile error appears.
4. Evaluate the 12 dimensions for the changed surface.
   Load only the references that apply. Mark remaining dimensions N/A.
5. Check safeguards.
   Verify tests, logging, retries, rollbacks, feature flags, and migration safety for the changed paths.
6. Write findings.
   Report only issues with a concrete path to impact. Order by severity, then by confidence and blast radius.

## Evidence Standard

A review finding should answer five questions:

1. What exact condition triggers the issue?
2. Where in the code or diff does that condition appear?
3. What incorrect behavior, security exposure, or operational failure follows?
4. Who or what is affected?
5. What change would reduce the risk?

Avoid findings that rely on vague phrases such as "might be bad" or "could be cleaner" without a concrete failure mode.

## Reporting Format

The authoritative output format is defined in `SKILL.md` — Review Output Contract. It has three parts:

1. **Checklist table** — one fixed row per dimension (CORR, SEC, PERF, ARCH, DB, API, TEST, MAINT, OBS, CONC, INFRA, COMPAT), showing the worst severity found in that dimension.
2. **Detail blocks** — grouped by code location (file:line). Each location lists all findings at that spot, each tagged with its dimension Code (e.g., [SEC], [DB]). One location can have multiple findings from different dimensions.
3. **Summary** — open questions, risk areas, testing gaps.

If there are no findings, all table rows show ✅ Đạt or — N/A and the summary confirms coverage.

## Large Diff Strategy

When the diff is large:

1. Identify high-risk entry points first: auth, data writes, schema changes, queues, caches, money paths, destructive operations, and external contracts.
2. Sample repeated mechanical changes only after confirming they are actually mechanical.
3. Prefer reviewing invariants and interfaces over reading every line equally.
4. Call out confidence limits when parts of the system were not inspected deeply enough.

## When To Mark N/A

- **Codebase Review**: mark N/A when the codebase has no meaningful surface for that concern (e.g., no database layer → Database is N/A; no async processing → Concurrency is N/A).
- **Code Change Review**: mark N/A when the change does not touch that concern in any meaningful way (e.g., no schema change → Database may be N/A; no interface change → API may be N/A).

Do not mark an area N/A simply because no bug was found there.
