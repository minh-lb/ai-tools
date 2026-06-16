---
name: bugfix
description: Trace, isolate, and fix bugs in an active project or codebase. Use when Codex needs to investigate failing behavior, regressions, runtime errors, incorrect outputs, broken integrations, flaky/intermittent issues, performance regressions, concurrency defects, or unclear defects; follow a user-provided starting point when present, otherwise discover the likely fault from symptoms, logs, tests, and code search, then perform full-path tracing, impact analysis, and a post-fix logic summary.
---

# Bugfix

Use this skill to debug and fix a defect end-to-end. Do not jump straight to code edits.

## Operating Rules

1. Reproduce or approximate the bug first. If exact reproduction is impossible, gather the closest artifact available: failing test, logs, stack trace, screenshot, payload, command history, or user steps.
2. If the user provides a starting point, begin tracing there. Treat it as the first node of the investigation, not proof of root cause.
3. If the user does not provide a starting point, identify one yourself from the most concrete signal available: failing entry point, recent regression area, error site, suspicious dependency, or mismatched data boundary.
4. Trace the full path before editing code. Cover both upstream producers and downstream consumers until the effect is fully explained. If the bug description names N services in the call chain, read the relevant handler in **every** service before proposing any fix. A suspicious finding at hop 1 is a hypothesis, not a root cause — keep tracing downstream until the chain is exhausted.
5. Draw `Data Flow` and `Logic Flow` before proposing or applying a fix.
6. Rank hypotheses before fixing. If more than one root cause is plausible, state the leading hypothesis and why it wins.
7. Classify the risk before editing: `Low`, `Medium`, `High`, or `Critical`. Also list the invariants that must remain true after the fix.
8. For regressions, compare `forward-fix` against at least one containment option: revert the culprit change, disable via flag/config, or apply a temporary operational safeguard. Do not assume "write more code" is the best first move.
9. Prefer the smallest fix that addresses the root cause without changing unrelated behavior.
10. For `High`/`Critical` work, or any fix touching auth, money, destructive operations, data repair/migration, multi-tenant boundaries, or compatibility-sensitive contracts, stop at the pre-fix summary and wait for explicit user confirmation before editing.
11. After editing, inspect impact radius and warn about any behavior that may have changed outside the target bug.
12. End with a concise summary of the corrected logic.
13. Do not claim a bug is fixed unless you validated the relevant path or explicitly state what remains unverified.
14. Do not commit, amend, or create git tags after fixing the bug unless the user explicitly asks for it.
15. Verify the contract at every service boundary before fixing. When a call crosses a service boundary (HTTP, gRPC, queue), read both the sender (what it sends) and the receiver (how it interprets the input) before forming a root cause hypothesis. A bug that looks like "wrong data sent" at the caller may actually be "wrong interpretation" at the callee, or both. For gRPC: always read the `.proto` definition — missing or mismatched fields in message types are a common root cause that is invisible at the call site.
16. When tracing reveals a second independent root cause, stop and surface it before fixing anything. Do not silently absorb it into the current fix. State clearly: "Found additional root cause N." Wait for user confirmation before proceeding with that additional root cause or any scope expansion beyond the original bug report.

## Investigation Workflow

### 1. Frame the defect

Capture these items when available:

- Symptom: what is broken, where, and for whom.
- Expected behavior: what should happen instead.
- Evidence: logs, stack traces, screenshots, payloads, failing tests, recent commits.
- Scope hints: route, screen, API, worker, cron, CLI command, or module.

If a required detail is missing but the codebase can answer it, inspect the code and continue. Ask the user only when the missing detail blocks safe progress.

### 1.5. Establish the evidence ladder

Use the strongest available signal in this order:

1. Deterministic failing test
2. Reliable local reproduction
3. Stack trace or runtime exception
4. Logs with clear request or job correlation
5. Concrete wrong output with known input
6. Code inspection only

If working below level 3, explicitly say confidence is lower and avoid broad edits.

### 1.6. Create a minimal reproducer when feasible

If the project has a reasonable test or script surface and no deterministic reproducer exists yet:

- Create the smallest failing test, script, fixture, or command that demonstrates the bug.
- Prefer a focused reproducer over broad end-to-end setup when both prove the same behavior.
- Keep the reproducer if it adds regression coverage; otherwise remove temporary debug artifacts before finishing.
- If you cannot build a deterministic reproducer, say so and continue with the strongest available evidence.

### 1.7. Classify risk and invariants

Before choosing a fix, classify the work:

- `Low`: localized, reversible, clear validation path
- `Medium`: multi-file or shared behavior change
- `High`: shared abstraction, data correctness, money, auth, deployment, or compatibility risk
- `Critical`: destructive, production-sensitive, or unclear-but-high-impact work

Also list the invariants that must not break, such as:

- authorization or tenant isolation
- money totals or accounting correctness
- idempotency or deduplication
- API or event contract compatibility
- state machine terminal-state guarantees
- migration or data-integrity assumptions

### 2. Pick the trace entry

When a starting point is given:

- Start there immediately.
- Trace backward to inputs and forward to outputs, side effects, and dependents.
- Do not stop at the first suspicious line.

When no starting point is given:

- Search for the nearest executable entry or failure artifact.
- Prioritize this order: failing test, stack trace location, log marker, user-facing entry point, recent changed code, shared abstraction.
- If multiple candidates exist, state which one you are choosing and why.

If the bug looks like a regression, inspect recent commits, config changes, dependency updates, and schema changes near the affected path. Use `git bisect` when the regression window is unclear (see Section 2.5).

### 2.5. Regression investigation with git

When a regression is suspected but the introducing commit is unknown:

- Use `git bisect` only on a clean worktree or a disposable `git worktree`. Do not stash, reset, or overwrite user changes just to make bisect possible.
- Prefer a dedicated repro script or deterministic test so bisect can be repeated safely.

```bash
# Identify the last known-good ref
git log --oneline --since="2 weeks ago" -- <affected file or dir>

# Optional: create a disposable worktree if the current one is dirty
git worktree add ../bugfix-bisect <branch-or-commit>

# Binary search the regression in the clean worktree
git bisect start
git bisect bad                  # current commit is broken
git bisect good <known-good-sha>
# Run your repro/test at each step; mark good/bad until git bisect identifies the culprit commit
git bisect good   # or: git bisect bad
# Or automate it when possible
git bisect run <repro-script>
git bisect reset  # when done

# Inspect the culprit
git show <culprit-sha>
git diff <culprit-sha>^ <culprit-sha> -- <affected path>
```

Also check at the culprit commit:
- Dependency version bumps (`package.json`, `composer.lock`, `go.mod`, `requirements.txt`, `Gemfile.lock`)
- Config or environment variable changes
- Schema migrations or event format changes
- Feature flag changes
- Infrastructure/CI pipeline changes

### 3. Build the trace before editing

Produce both artifacts in plain text. Use ASCII arrows by default.

#### Data Flow

```text
Data Flow
Input/Trigger
  -> validation / parsing
  -> service / domain logic
  -> persistence / cache / queue / external API
  -> response / UI state / observable side effect
```

#### Logic Flow

```text
Logic Flow
1. Entry condition
2. Branches and guards
3. State transitions
4. Error handling and fallback paths
5. Exit condition
```

Trace until the trace explains both why the current behavior happens and why the expected behavior does not.

### 3.5. Trace coverage checklist

Before fixing, make sure the trace covers:

- Entry point
- Input shape and validation
- Domain/service layer
- Persistence, cache, queue, or external API boundary
- Returned output or user-visible side effect
- Error path
- Caller or downstream consumer assumptions
- Last known good behavior or last known safe point
- Ownership boundary: which layer actually owns the invariant being violated

If any item is unknown, mark it as unknown instead of guessing.

### 4. Form the root-cause hypothesis

State the defect as a cause-and-effect statement:

`Because <condition>, <component> produces <wrong behavior>, which leads to <visible symptom>.`

Do not edit code until the hypothesis matches the trace.

If there are multiple plausible causes, list them briefly and reject the weaker ones with evidence.

### 5. Compare repair options before editing

Before touching code, compare 1-3 realistic repair options when the fix is not obvious.

For each option, assess:

- Whether it fixes the root cause or only masks the symptom
- Blast radius: local module, shared abstraction, schema, cache, API contract, or UI flow
- Logic risk: invariants, branch behavior, state transitions, and error handling that might change
- Validation cost: how confidently it can be tested with available checks

For regressions, include at least one of these when realistic:

- Revert the culprit change
- Disable the broken path with feature flag or config
- Add a temporary operational safeguard while preparing the root-cause fix

Prefer the option that fixes the root cause with the smallest blast radius and the clearest validation path.

If the safest option still touches a broad shared abstraction, say so explicitly before editing.

### 5.5. Choose fix vs containment explicitly

Decide and say which strategy you are taking:

- `Forward fix`: change code now because the root cause is understood and validation is credible
- `Revert`: restore last known-good behavior because the regression is recent and rollback is safer
- `Contain first`: disable, guard, or operationally isolate the broken path before the full fix

If you choose `Forward fix` over a safer `Revert` or `Contain first` option, explain why.

### 6. Implement the fix

- Change the narrowest layer that can correct the root cause cleanly.
- Preserve surrounding contracts unless the bug is the contract.
- Add or update tests when the project already has a suitable test surface.
- If no test exists, validate with the strongest available local check.
- Prefer fixing invariant violations close to the source rather than masking bad state downstream.
- Avoid mixing refactors with bug fixes unless the refactor is required to make the fix safe.
- Remove temporary probes or debug-only code before finishing unless they are intentionally kept as observability improvements.

### 7. Check impact radius after the fix

Inspect all affected callers, consumers, and adjacent contracts. At minimum, review:

- Call sites of changed functions or exported symbols
- Shared types, schemas, DTOs, and events
- State transitions or side effects that other modules rely on
- Error handling, retry behavior, caching, and persistence assumptions
- User-visible flows adjacent to the fixed path

Warn explicitly when the fix changes behavior outside the reported bug, when coupled areas need follow-up, or when validation is incomplete. Also inspect: signature/return-shape changes, nullability changes, query/pagination behavior, cache key/TTL changes, retry/idempotency behavior, schema/event/API contract changes.

Use code search or references, not guesswork, to enumerate affected callers and consumers.

### 8. Validate

Run the strongest relevant checks available, such as:

- Targeted tests
- Build or typecheck
- Lint
- Reproduction steps before and after
- Manual smoke checks on nearby flows

If you cannot run a check, say exactly what was not verified.

Validation must cover both:

- The reported bug path
- At least one adjacent path that could regress because of the fix

When feasible, expand this into a minimal validation matrix:

- Reproducer before/after or failing test before/passing test after
- Boundary case closest to the bug trigger
- Failure path or invalid input path
- One adjacent success path that should remain unchanged
- Any contract or schema compatibility check affected by the fix

If the bug was hard to locate due to missing logs or metrics, add targeted logging or a metric at the failure site as part of the fix — so the same class of bug is faster to diagnose next time.

### 9. Review the fix before finalizing

After validation, review the change again with a code-review mindset. Do not treat "tests pass" as sufficient by itself.
Review it as if another engineer authored the fix and you are trying to disprove that it is safe to merge.

Review at minimum:

- Does the fix actually address the traced root cause, not just the visible symptom?
- Did the change preserve the stated invariants?
- Did the change introduce regression risk in callers, consumers, contracts, or adjacent flows?
- Is the validation strong enough for the risk level?
- Is the diff as narrow as claimed, or did accidental refactor/noise slip in?
- Are temporary guards, logs, or containment steps still appropriate after the final fix?

Write findings before any summary. Use this severity model:

- `Critical`: likely data loss, security break, severe incorrect behavior, or unsafe rollout
- `Major`: likely bug, regression, broken contract, weak root-cause fit, or missing important validation
- `Minor`: real issue with narrower impact or a preventive correction worth making
- `Suggestion`: optional improvement that is not required for acceptance

Tag findings by review cycle:

- First review: `[new]`
- Re-review: `[new]` or `[unresolved from cycle N]`

Produce a review verdict with these rules:

- `Pass`: the fix is coherent and ready to report
- `Revise`: one or more `Critical` or `Major` findings remain, or the evidence/validation is too weak to support `Pass`

Minimum review checklist:

- Root cause vs symptom: does the fix repair the traced cause, not just hide the symptom?
- Caller and consumer compatibility: do direct callers and downstream dependents still make sense?
- Contract safety: did return shapes, DTOs, schemas, events, or error semantics change?
- Failure-path safety: do error paths, retries, nullability, cleanup, and rollback still hold?
- Validation strength: does the evidence justify the confidence and risk level claimed?
- Diff discipline: did unrelated cleanup, refactor, or debug leftovers slip in?
- Security/invariant preservation: are auth, tenant, money, idempotency, and state-machine invariants still true when relevant?

If the verdict is `Revise`:

- State the concrete review findings
- Decide whether the findings only require a local code correction, or whether they invalidate the current plan
- If review findings change the root-cause hypothesis, risk level, invariants, fix-vs-containment decision, or blast radius, jump back to Sections `1.7`, `4`, `5`, and `5.5`, then issue an updated pre-fix summary before editing again
- If the revised plan now qualifies for an approval gate, stop and wait for explicit user confirmation before continuing
- Otherwise return to implementation
- Re-run impact check and validation
- Re-review the updated fix before finalizing

Maximum review-rework loops: 2. If the second review still returns `Revise`, stop and surface the unresolved findings and residual risk to the user instead of looping again.

---

## Bug Taxonomy & Specialized Strategies

Classify once there is enough signal. Treat the category as a working hypothesis — reclassify if the trace contradicts it. Apply the checklist alongside the general workflow.

### Null / Undefined Reference

**Signals**: `TypeError: Cannot read property`, `NullPointerException`, `nil dereference`, `undefined is not a function`.

**Investigation checklist**:
- Find every code path that produces the value; check which paths skip initialization.
- Check optional chaining gaps, missing default values, or wrong assumptions about API response shape.
- Verify whether the value is nullable at the type level but treated as non-null at the call site.
- Check deserialization and DTO mapping for fields that may be absent in older data.

**Fix heuristic**: guard at the boundary where the value enters the system, not at every consumer.

---

### Off-by-One / Boundary Error

**Signals**: fencepost errors, last item missing, one extra iteration, index out of range, wrong page size.

**Investigation checklist**:
- Write out the concrete values for the boundary case (length, index, limit, offset).
- Verify whether loops use `<` vs `<=`, `0-indexed` vs `1-indexed`.
- Check pagination math: `page * size` vs `(page - 1) * size`, `skip`/`take` vs `offset`/`limit`.
- Test with input size = 0, 1, and max.

---

### Logic / Conditional Error

**Signals**: wrong branch taken, incorrect result for specific input, boolean inversion.

**Investigation checklist**:
- Map every branch in the affected function with concrete input/output pairs.
- Check operator precedence (`&&` vs `||`, bitwise vs logical).
- Verify negation correctness (`!`, `NOT`, `!=`, `!==`).
- Look for implicit type coercion in comparisons (`==` vs `===`, truthy/falsy).
- **PHP loose comparison pitfalls**: PHP's `==` does type juggling that produces surprising results — `0 == "foo"` → `true`, `"1" == true` → `true`, `null == false` → `true`, `"0" == false` → `true`, `100 == "1e2"` → `true`. Always use `===` unless type coercion is intentional. When in doubt, `var_dump()` both sides.

---

### Race Condition / Concurrency Bug

**Signals**: non-deterministic failures, works under low load / breaks under high load, passes locally / fails in CI, data corruption when concurrent requests hit same resource, deadlock.

**Investigation checklist**:
- Identify all shared mutable state touched by the failing path.
- Check whether locks, mutexes, or transactions are held for the full critical section.
- Look for time-of-check vs time-of-use (TOCTOU) gaps.
- Check async/await chains: identify any `await` where another write could interleave.
- Look for missing `await` causing fire-and-forget writes that race with reads.
- For databases: check transaction isolation level and whether SELECT..FOR UPDATE or optimistic locking is needed.
- Check event emitter / pub-sub ordering assumptions.

**Fix heuristic**: make the critical section atomic; prefer optimistic locking over broad locks when contention is low.

**Tooling**:
- Reproduce with concurrent load: send N parallel requests to the failing endpoint using `ab`, `wrk`, or a simple loop with `curl &`.
- For PHP: check if a mutex/semaphore is needed (`sem_acquire`) or use DB-level locking (`SELECT ... FOR UPDATE`).
- For JS/TS (Node.js): missing `await` is the most common culprit — trace every async boundary; use `--inspect` to step through async call stacks.
- Add structured logs with a shared correlation ID so interleaved calls can be traced in sequence. Do not log request bodies, headers, or payloads without sanitizing — exclude passwords, tokens, and PII.
- Use the language's race detector if available (e.g. ThreadSanitizer for C/Rust, `go test -race` for Go).

---

### Async / Promise Bug

**Signals**: unhandled promise rejection, callback called twice or never, result arrives after component unmounts, stale closure captures wrong value.

**Investigation checklist**:
- Trace every `async`/`await`, `Promise`, callback, or observable in the failing path.
- Look for missing `await` (fire-and-forget side effects, tests that don't wait for async setup).
- Check for swallowed errors: `.catch(() => {})`, `try/catch` with empty body.
- Identify stale closure captures: variables captured at wrong point in time.
- Check for `Promise.all` vs sequential `await` mismatches.
- Verify cleanup on component unmount / cancellation tokens for in-flight requests.
- Look for event listener registration inside loops or without cleanup.

---

### Memory Leak

**Signals**: memory grows unbounded over time, `heap allocation failed`, OOM kill, slow degradation after long uptime.

**Investigation checklist**:
- Identify all long-lived objects (singletons, caches, event emitters, global maps).
- Check for event listeners registered but never removed.
- Look for caches or collections that grow without eviction.
- Check for closures that hold references to large objects longer than needed.
- Look for `setInterval` / `setTimeout` that are never cleared.
- **JS/TS (Node.js)**: `node --inspect` → Chrome DevTools Memory tab → take heap snapshots before and after a suspected leak cycle, diff them to find retained objects.
- **JS/TS (browser)**: Chrome DevTools Memory tab → Allocation instrumentation on timeline to catch leak sources.
- **PHP**: Xdebug memory trace (`xdebug.mode=trace`) or log `memory_get_usage()` at key points; check for static arrays or singleton caches that grow per request.
- For other languages: use the native heap profiler to snapshot and diff before/after a leak cycle.

---

### Performance Regression

**Signals**: slow response times, high CPU, N+1 queries, slow renders, timeout errors that didn't exist before.

**Investigation checklist**:
- First confirm it is a regression and not an existing issue: `git bisect` to find the culprit commit.
- Profile before forming hypotheses; do not guess.
- For database: check `EXPLAIN ANALYZE` on slow queries; look for missing indexes, full table scans, N+1 patterns.
- For API: check if a dependency (DB, cache, external API) latency increased.
- For frontend: check bundle size changes, re-render counts, large list rendering without virtualization.
- Check if a cache was removed, a previously-cached path now hits the DB, or a TTL was shortened.

**Tooling**:
- **JS/TS**: `node --prof` + `node --prof-process isolate-*.log`, or use clinic.js (`clinic flame`) for flame graphs.
- **PHP**: Xdebug profiler (`xdebug.mode=profile`) → analyze with KCacheGrind/Webgrind; or Blackfire for production profiling.
- **MySQL**: `EXPLAIN ANALYZE SELECT ...`; enable slow query log (`slow_query_log=1`, `long_query_time=1`); check `SHOW PROCESSLIST` for blocking queries.
- **PostgreSQL**: `EXPLAIN (ANALYZE, BUFFERS) SELECT ...`; check `pg_stat_statements` for top slow queries; use `auto_explain` in prod.
- **HTTP endpoints**: `curl -w "dns:%{time_namelookup} connect:%{time_connect} ttfb:%{time_starttransfer} total:%{time_total}\n"` to isolate latency by phase.
- **Frontend (JS/TS)**: Chrome DevTools Performance tab — identify long tasks, forced reflows, and unnecessary re-renders.

---

### Intermittent / Flaky Bug

**Signals**: fails in CI but passes locally, fails ~10% of the time, test suite order-dependent, timing-sensitive.

**Investigation checklist**:
- Check for time dependencies: `Date.now()`, sleeps, hardcoded timeouts.
- Check for test isolation: shared DB state, in-memory singletons not reset between tests.
- Check for test ordering dependence: state left by a previous test affecting the next.
- Look for external service calls not mocked — introduce latency variability.
- Check for race conditions in test setup/teardown.
- Add retry logic with logging to surface the failure pattern, not to mask it.
- Run the failing test 50–100 times in a loop to force reproduction; use whatever test runner the project uses and filter output to PASS/FAIL lines.

---

### Environment-Specific Bug (Prod-Only / Config)

**Signals**: works in dev/staging, fails in prod; different behavior across environments; missing feature or broken flow tied to a specific deployment.

**Investigation checklist**:
- Compare environment variables and secrets between working and failing environments.
- Check feature flags: is the flag on in prod but off in dev?
- Check infra differences: different DB replicas, read replicas vs primary, connection pool sizes, TLS versions, DNS resolution.
- Check log levels: prod may suppress warnings that reveal the issue.
- Check timezone: servers in UTC vs local time; date arithmetic that depends on locale.
- Check file system paths, case sensitivity (macOS vs Linux).
- Check memory/CPU limits — resource-constrained behavior only surfaces at scale.
- Check build differences: tree-shaking, minification, or dead code elimination that behaves differently.

---

### External Dependency / Integration Bug

**Signals**: works with mocked dependency, fails with real service; third-party API returns unexpected shape; SDK upgrade broke behavior.

**Investigation checklist**:
- Capture the raw request and response at the boundary (log or intercept).
- Compare the actual response shape with what the code expects.
- Check SDK changelog for breaking changes if a version was recently bumped.
- Verify authentication: expired tokens, wrong scope, rate limiting.
- Check timeout and retry configuration at the integration boundary.
- Isolate by writing a minimal reproducer that calls the external service directly.

---

### Status Transition / State Machine Bug

**Signals**: records stuck in an intermediate state (`in_process`, `pending`), status never advances to terminal state, status reverts unexpectedly, idempotency guard missing so a stale message can overwrite a final state.

**Investigation checklist**:
- Draw the full state machine: every state, every valid transition, every trigger. Mark terminal states explicitly.
- For each intermediate state, identify the code path that is supposed to advance it — confirm the path is reachable and has no silent failure that leaves the record stuck.
- Check idempotency guards: does each transition check the *current* state before writing? Guards that only check one terminal state (e.g. `completed`) and miss others (e.g. `cancelled`) allow stale events to resurrect finalized records.
- For async flows (queue, Kafka, cron): identify the safety net — is there a `resetStuckInProcess` / timeout sweep? What does it transition to, and is that state retryable?
- Check that error paths always land in a retryable state, not a silent dead-end. A record that transitions to an unrecognized state will be ignored by all processors.
- For child rows or related entities that mirror a parent status: verify that row-level transitions remain consistent with the parent, especially on failure or rollback paths.
- Check all consumers of the state (cron, Kafka consumer, API) — do they agree on which states are "actionable"? A mismatch means one processor retries records another has already finalized.

**Fix heuristic**: fix the transition gap closest to where state is written, not at every reader. Add a state machine diagram to the PR description so reviewers can verify completeness.

---

### Cache Invalidation Bug

**Signals**: stale data shown after an update, behavior differs between first request and subsequent requests, data correct after cache flush but wrong otherwise, inconsistency between environments with different cache configurations.

**Investigation checklist**:
- Confirm the bug disappears after manually flushing the cache — this isolates it as a cache issue vs a data issue.
- Identify the cache layer involved: application cache (Laravel Cache, Redis, Memcached), HTTP cache (CDN, Nginx, browser), ORM query cache, or session store.
- Check the cache key: does it include all dimensions that affect the result (user ID, locale, filter params, feature flag state)?
- Check the TTL: is it too long for the update frequency of this data?
- Check cache invalidation on write: is the cache cleared or updated when the underlying data changes? Look for missing `Cache::forget()` / `cache.del()` calls after mutations.
- Check race condition between write and cache invalidation — a stale read between the write and the `forget()` call can re-populate the old value.
- Check whether read replicas are being used: data may be written to primary but read from a replica that hasn't caught up yet (replication lag), causing the cache to be populated with stale replica data.
- For HTTP/CDN cache: check `Cache-Control`, `Vary`, and `ETag` headers; verify that POST/PUT/DELETE responses include `Cache-Control: no-store` or appropriate invalidation headers.

**Fix heuristic**: prefer explicit invalidation on write over TTL-only expiry; for complex invalidation use event-driven cache clearing rather than scattering `forget()` calls.

---

### Database / Query Bug

**Signals**: wrong data returned, missing rows, duplicate rows, constraint violations, migration errors, slow queries.

**Investigation checklist**:
- Run the failing query directly in the DB with the exact parameters.
- Check JOIN conditions and ON clauses for accidental cross joins.
- Check WHERE clauses for off-by-one on dates, inclusive vs exclusive ranges.
- Check NULL handling: `= NULL` vs `IS NULL`.
- Check migration order and whether it was applied on all environments.
- For ORMs (Eloquent, TypeORM, Prisma, Sequelize): enable query logging to capture the generated SQL, then run it directly in the DB client with `EXPLAIN ANALYZE` (PostgreSQL) or `EXPLAIN FORMAT=JSON` (MySQL).
- Check for soft-delete filters (`deleted_at IS NULL`) that may be missing or doubled up.
- Check transaction boundaries: reads outside the transaction may see stale committed data.

---

## Stop Conditions

Pause and raise a warning before editing when any of these apply:

- The trace does not yet explain the symptom
- The fix would require changing a broad shared abstraction without enough validation
- Reproduction is too weak and the planned edit is high risk
- The issue may be caused by missing business requirements rather than broken code
- The workspace contains conflicting user changes in the same area and intent is unclear
- The bug category is race condition or concurrency and no lock/transaction strategy has been identified
- The fix touches auth checks, access control, input validation, or multi-tenant data boundaries — verify security invariants still hold before proceeding
- The bug involves a multi-service call chain and any downstream service has not yet been read — do not fix at an upstream service until all hops are traced
- A recent regression has a clearly safer `Revert` or `Contain first` option, but you are still planning a broader `Forward fix` without a strong reason
- The work is `High`/`Critical`, or touches money, destructive operations, data repair/migration, or compatibility-sensitive contracts, and the user has not yet approved the pre-fix plan
- Post-fix review findings have changed the hypothesis, risk level, invariants, or chosen repair strategy, and you have not yet reissued the pre-fix summary / approval gate
- Post-fix review has already required 2 revise cycles and the fix is still not review-clean
- **Scope has expanded beyond the original bug report**: more than one independent root cause found, or the fix now requires refactors, new abstractions, or changes to unrelated flows — flag to the user and confirm before continuing

## Response Contract

Match the user's language unless they ask otherwise. Keep technical terms, code identifiers, and file paths as-is.

**Before implementing the fix**, output and present to the user:

```text
Evidence Level
Confidence
Risk Level
Bug Category
Root Cause Hypothesis
Data Flow
Logic Flow
Rejected Hypotheses
Invariants to Preserve
Repair Options
Fix vs Containment Decision
Chosen Safe Fix
Pre-fix Impact Preview
Validation Plan
Approval Gate
```

**After implementing the fix**, output:

```text
What Changed
Impact Check
Warnings
Validation
Confidence
Review Verdict
Review Cycle
Review Findings
Rework Performed
Rollback / Containment
Observability
Post-fix Logic Summary
Residual Risk
```

Stop after the code change, validation, and report. Leave version control actions to the user unless they explicitly request them.

## Quality Bar

- Minimal reproducer created when feasible
- Bug category identified early enough to sharpen tracing, and reclassified if evidence changes
- Full-path trace before fix
- Root cause, not symptom patching
- Risk level and invariants stated before editing
- Repair options compared when the fix is not obvious
- Revert/disable/containment considered for regressions
- Safest reasonable fix chosen before editing
- High-risk edits paused at the pre-fix summary for explicit approval
- Impact preview completed before code changes
- Explicit impact analysis
- Honest validation status
- Validation covers bug path, adjacent path, and a boundary or failure path when feasible
- Post-fix review performed before final handoff
- Review findings are severity-based and findings-first
- Review-driven scope/risk changes force a return to the pre-fix planning gate
- Any review-triggered rework is followed by another impact check and validation pass
- Concise final logic summary
- Clear confidence level when evidence is weak
- For regressions: culprit change identified, or `git bisect` used when the culprit commit is unknown and history is relevant
- For fixes touching auth, access control, or input validation: security invariants verified post-fix
