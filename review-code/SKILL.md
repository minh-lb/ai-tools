---
name: review-code
description: Structured code review for pull requests, commits, diffs, or AI-generated changes. Use this skill when reviewing correctness, security, performance, architecture, database, API, testing, maintainability, observability, concurrency, infrastructure, and backward compatibility, and when producing prioritized findings with evidence and remediation guidance.
argument-hint: codebase|git-diff
---

# Review Code

Use this skill for two types of code review. Route based on the argument:

- `codebase` → follow the [Codebase Review](#codebase-review) section below.
- `git-diff` → follow the [Code Change Review](#code-change-review) section below.

Both modes share the same 12 dimensions and output format but differ in starting point and required steps.

## Clarification

- `codebase`: start immediately, no questions needed.
- `git-diff`: if base branch and feature branch are not provided, ask for them before proceeding. Nothing else.

## Codebase Review

Review the full source code of a project or a bounded module. No diff — all code is in scope.

1. Map entry points first: HTTP handlers, CLI commands, queue consumers, scheduled jobs, and public SDK surfaces.
2. From each entry point, trace critical paths, domain logic, and integration boundaries.
3. Apply all 12 dimensions to the scope. Mark N/A only where the codebase has no surface for that concern.
4. The impact radius check does not apply — there is no change set to trace back from.
5. Call out confidence limits for any subsystem not inspected.

## Code Change Review

Review changes between two branches, a PR, a commit range, or a patch.

1. Obtain the diff: run `git diff <base>...<feature>` for branch comparison, or use the PR diff directly.
2. Start from the changed files, then trace the affected execution paths, state transitions, and external contracts.
3. **Impact logic check (mandatory):** For every changed function, method, type, schema, event, or config key — use grep, LSP, or file reads to find all call sites and dependents in the codebase. Read each one and verify its logic still holds under the new behavior. Check specifically:
   - Return value assumptions: shape, range, or nullability the caller expects.
   - Side effect assumptions: writes, events, or cache updates the caller relies on.
   - Error condition assumptions: error types or handling paths the caller expects.
   - Data shape assumptions: fields the caller destructures, iterates, or indexes into.
   A change can silently break caller logic even when no compile error appears. Do not rely on the diff alone.
4. Evaluate the 12 dimensions. For each: does the change touch this surface? If yes, load the reference and inspect. If no, mark it N/A in the checklist table. See [When To Mark N/A](references/review-process.md#when-to-mark-na) — do not mark N/A simply because no bug was found.
5. Calibrate depth to scope: a small change warrants spot checks; a large change warrants the Large Diff Strategy from [Review Process](references/review-process.md).

## General Rules

- Review for concrete risk. Do not raise speculative findings unless there is a plausible trigger, impact, and path to failure.
- Prioritize findings by severity and user impact, not by how easy they are to describe.
- Treat missing tests, missing observability, and unsafe migrations as real review concerns when they increase deployment risk.

## Load Order

Always read these first:

- [Review Process](references/review-process.md)
- [Severity Model](references/severity-model.md)

For **Codebase Review**: all 12 dimensions are potentially relevant — load each reference file in turn and evaluate it against the full scope. Mark N/A only where the codebase has no surface for that concern.

For **Code Change Review**: for each dimension below, ask whether the change touches that surface. If yes, load the reference file and inspect. If no, mark it N/A without loading the file. Never skip the mental check — only skip loading the file.

- [Correctness](references/correctness.md): Always relevant for behavior-changing code
- [Security](references/security.md): Auth, input handling, file access, network access, secrets, crypto, multi-tenant boundaries
- [Performance](references/performance.md): Hot paths, loops, queries, serialization, caching, large payloads, batch jobs
- [Architecture](references/architecture.md): Layering, module boundaries, coupling, domain design, extensibility
- [Database](references/database.md): Migrations, queries, transactions, indexes, integrity, data lifecycle
- [API](references/api.md): External or internal service contracts, schemas, status codes, pagination, idempotency
- [Testing](references/testing.md): Unit, integration, contract, regression, load, failure-path coverage
- [Maintainability](references/maintainability.md): Complexity, duplication, naming, hidden assumptions, dead code
- [Observability](references/observability.md): Logging, metrics, tracing, auditability, alertability
- [Concurrency](references/concurrency.md): Async work, retries, locks, queues, shared state, race conditions
- [Infrastructure](references/infrastructure.md): Config, rollout, secrets, deployment safety, IaC, runtime assumptions
- [Backward Compatibility](references/backward-compatibility.md): Schema evolution, API compatibility, event formats, stored data

For **Code Change Review**: Correctness, Architecture, and Testing are almost always relevant for backend or service changes. Add domain-specific references based on what the change actually touches.

## Review Output Contract

Write all output in Vietnamese. Keep technical terms in English (severity levels, dimension codes, field labels `Why` / `Path` / `Fix`, library names, file paths, protocol names, etc.).

### Checklist table

One fixed row per dimension. Status reflects the worst severity found in that dimension.

| Code   | Hạng mục              | Trạng thái |
|--------|-----------------------|------------|
| CORR   | Correctness           |            |
| SEC    | Security              |            |
| PERF   | Performance           |            |
| ARCH   | Architecture          |            |
| DB     | Database              |            |
| API    | API                   |            |
| TEST   | Testing               |            |
| MAINT  | Maintainability       |            |
| OBS    | Observability         |            |
| CONC   | Concurrency           |            |
| INFRA  | Infrastructure        |            |
| COMPAT | Backward Compatibility|            |

Status convention: 🔴 Critical · 🟠 High · 🟡 Medium · 🔵 Low · ✅ Đạt · — N/A

Never omit a row. Use — N/A when the dimension does not apply, ✅ Đạt when no issues were found.

### Findings

One bullet per finding, ordered by severity descending. A code location may appear multiple times across different dimensions.

```
- [CODE] Severity — short description.

  Path: path/to/file.ext:line

  Why: reason this is a problem.

  Fix: practical remediation direction.
```

`[CODE]` links the finding to its checklist row. `Severity` determines the row's status (worst severity wins when a dimension has multiple findings).

The `Why` field covers what the reference files call "Evidence". The `Fix` field covers "Remediation Direction". Do not add other fields.

### Summary

1. Open questions or assumptions that affect confidence.
2. Brief summary of major risk areas reviewed.
3. Testing gaps or residual risk.

If no findings, state it explicitly and describe what was covered.

## Review Posture

- Prefer behavioral reasoning over local line-by-line commentary.
- Prefer precise findings over exhaustive commentary.
- Prefer evidence tied to changed code over broad architecture opinions.
- Escalate only when the risk is defensible and meaningful.
