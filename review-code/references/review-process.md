# Review Process

## Contents

1. Objective
2. Scenario Enumeration (mandatory for every review)
3. Review Sequence (Codebase Review: 6 steps / Code Change Review: 7 steps)
4. Evidence Standard
5. Reporting Format
6. Large Scope and Diff Strategy
7. When To Mark N/A

## Objective

The purpose of review is to identify meaningful risk before merge or deployment. Focus on defects, regressions, unsafe assumptions, missing controls, and operational blind spots. A good review does not try to rewrite the whole change. It isolates the highest-value findings with enough evidence that another engineer can validate and act on them.

## Scenario Enumeration

Before evaluating any dimension, identify the materially distinct reachable scenario classes for each entry point or changed path. Do not enumerate every Cartesian combination: combine variants when they do not change behavior, and split them when interactions (for example, tenant + retry, or mixed-version rollout + old data) alter the outcome. Assume a scenario is reachable unless code, schema, or infrastructure explicitly prevents it. Record meaningful scope limits instead of implying exhaustive coverage when the codebase is too large to inspect fully.

| Category | Key scenarios to enumerate |
|----------|---------------------------|
| **Input** | Empty/null/zero · boundary min/max and off-by-one · malformed or truncated · very large (10×/100×) · duplicate or idempotency-retried · out-of-order or stale · adversarially crafted |
| **State** | Fresh system (no data) · near resource limits · concurrent modification of same record · partially completed prior op · expired/revoked credentials · dependency down or slow · clock skew |
| **Actor** | Unauthenticated · wrong role/tenant/owner · minimum permissions · admin (can they reach what they shouldn't?) · automated caller (cron, bot, service account) |
| **Operational** | First deploy (no prior config/data) · rolling deploy (old + new code running together) · rollback (old code against new-format state) · missing/stale config · 10× traffic · partial write failure |

For each materially distinct reachable scenario class: trace the path to its terminal state and check whether the outcome is correct, safe, and recoverable. A scenario handled silently and incorrectly is a finding even if untested.

## Review Sequence

### Codebase Review

1. Map scope.
   Identify the boundaries being reviewed (full project, a module, a service). List entry points: HTTP handlers, CLI commands, queue consumers, scheduled jobs, SDK surfaces. If the user says only `codebase`, use repository-owned application code plus relevant tests and configuration as the default scope; normally exclude generated, vendored, build, and dependency files unless they are directly relevant. State the scope and material exclusions in the report, and do not claim complete coverage if only a subset could be inspected.
2. Enumerate scenarios (mandatory).
   For each entry point, identify materially distinct reachable scenario classes across input, state, actor, and operational variants. Use the four categories in [Scenario Enumeration](#scenario-enumeration); do not mechanically enumerate their full Cartesian product. Separate combinations when their interaction changes the path or outcome. An unexamined material scenario that causes a bug is a missed finding.
3. Trace critical paths.
   From each entry point, follow inputs, validation, domain logic, persistence, side effects, and outputs. Cover success paths, failure paths, partial failures, and local execution after calls to external dependencies return. When a call fails or throws, continue through catch, retry, fallback, compensation, and cleanup/finally handling instead of stopping at the exception. Verify whether a target is local or external from the available code and contracts rather than guessing from its name; an unresolved target should be marked as such. Treat an external boundary as a limit on tracing into the external callee, not as a reason to stop tracing the local caller's subsequent behavior. For asynchronous work, trace the producer to its acknowledgment/cutoff point, then document consumers as separate paths when they are in scope.
4. Evaluate the 12 dimensions across the entire scope.
   All dimensions are potentially relevant. Mark N/A only where the codebase has no surface for that concern.
5. Check safeguards.
   Run relevant tests and static checks when safe and feasible. Inspect project-defined commands before running them; do not trigger production access, external messages, destructive data changes, or other consequential side effects without authorization. Also verify alerting, rollback readiness, permissions, and operational coverage across the critical paths inspected. Record exact commands/results or why checks were not run.
6. Write findings.
   Report only issues with a concrete path to impact. Order by severity, then by confidence and blast radius. Note confidence limits for subsystems not deeply inspected.

### Code Change Review

1. Establish intent.
   Read the diff source first, then any associated issue/PR description and acceptance criteria when available. Translate criteria into observable behavior and trace them to implementation and tests. If criteria are unavailable, state inferred intent and assumptions rather than inventing requirements.
2. Enumerate scenarios (mandatory).
   For each changed entry point or function, identify materially distinct reachable scenario classes across input, state, actor, and operational variants. Use the four categories in [Scenario Enumeration](#scenario-enumeration); do not mechanically enumerate the full Cartesian product. Do not limit the scenario set to what the author tested or described.
3. Trace execution paths of the changed code.
   Follow the changed behavior through each enumerated scenario: success paths, failure paths, and partial failures. When a call fails or throws, continue through catch, retry, fallback, compensation, and cleanup/finally handling instead of stopping at the exception. Verify whether a target is local or external from the available code and contracts rather than guessing from its name; an unresolved target should be marked as such. Trace local caller behavior after an external call returns; stop at the external boundary only for tracing into the external callee. Treat asynchronous consumers as separate paths when they are in scope.
4. Check impact logic (mandatory).
   For each changed function, method, type, schema, event, or config key: use grep, LSP, or file reads to find call sites and dependents within the reviewed repository/revision. For each one, verify its logic still holds under the new behavior:
   - Return value assumptions: shape, range, or nullability that the caller expects.
   - Side effect assumptions: writes, events, or cache updates the caller relies on.
   - Error condition assumptions: error types or handling paths the caller expects.
   - Data shape assumptions: fields the caller accesses, iterates, or indexes into.
   Do not rely on the diff alone. A change silently breaks caller logic when assumptions no longer hold even though no compile error appears.
5. Evaluate the 12 dimensions for the changed surface.
   Load only the references that apply. Mark remaining dimensions N/A.
6. Check safeguards.
   Run relevant tests and static checks when safe and feasible; inspect project-defined commands before running them and do not trigger production access, external messages, destructive data changes, or other consequential side effects without authorization. Verify logging, retries, rollbacks, rollout guards, and migration safety for the changed paths. Record exact commands/results or why checks were not run.
7. Write findings.
   Report only issues with a concrete path to impact. Order by severity, then by confidence and blast radius.

## Evidence Standard

A review finding should answer five questions:

1. What exact condition triggers the issue?
2. Where in the code or diff does that condition appear?
3. What incorrect behavior, security exposure, or operational failure follows?
4. Who or what is affected?
5. What change would reduce the risk?

Before saving the report, verify every cited path exists in the reviewed revision and every line/range points to the relevant code. For changed code, use coordinates that identify the actual source in the reviewed revision; do not confuse patch hunk offsets with current file lines. If the target revision is unavailable, cite coordinates from the supplied patch and state that basis in the Summary rather than presenting current-checkout lines as if they matched. Cite the service, controller, or other source that owns the behavior being described. Never fabricate test execution, caller coverage, or external vulnerability/license checks. Avoid findings that rely on vague phrases such as "might be bad" or "could be cleaner" without a concrete failure mode.

## Reporting Format

The authoritative output format is defined in `SKILL.md` — Review Output Contract. It has three parts:

1. **Checklist table** — one fixed row per dimension (CORR, SEC, PERF, ARCH, DB, API, TEST, MAINT, OBS, CONC, INFRA, COMPAT), showing the worst severity found in that dimension.
2. **Findings** — one bullet per finding, ordered by severity descending. A code location may appear multiple times across different dimensions. Each finding includes: dimension code, severity, description, Path, Why, and Fix. See `SKILL.md` for the exact bullet format.
3. **Summary** — reviewed scope/revision, open questions, major risk areas, checks actually run, testing gaps, and residual risks.

If there are no findings, all table rows show ✅ Đạt or — N/A and the summary confirms coverage. For each N/A status, briefly explain the reason in the Summary when it is not obvious from the stated scope.

## Large Scope and Diff Strategy

When the codebase/module scope or diff is large:

1. Identify high-risk entry points first: auth, data writes, schema changes, queues, caches, money paths, destructive operations, and external contracts.
2. Sample repeated mechanical changes only after confirming they are actually mechanical.
3. Prefer reviewing invariants and interfaces over reading every line equally.
4. For a large codebase, prioritize critical paths and explicitly list important areas not inspected; do not describe a partial review as complete.
5. Call out confidence limits when parts of the system were not inspected deeply enough.

## When To Mark N/A

- **Codebase Review**: mark N/A when the codebase has no meaningful surface for that concern (e.g., no database layer → Database is N/A; no async processing → Concurrency is N/A).
- **Code Change Review**: mark N/A when the change does not touch that concern in any meaningful way (e.g., no schema change → Database may be N/A; no interface change → API may be N/A).

Do not mark an area N/A simply because no bug was found there.
