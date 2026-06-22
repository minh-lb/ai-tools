---
name: debugger
description: Full-cycle debugging skill — investigate root cause, apply a targeted fix, then verify. Use when the user asks to debug, fix a bug, trace an error, or resolve a defect end-to-end.
---

# Debugger

Investigate a defect, apply a targeted fix, write a report, and verify the fix before handing back.

## Use / Skip

**Use** when the task is to:
- debug a runtime error, wrong output, regression, or flaky behavior
- trace and fix concurrent or async bugs: race conditions, deadlocks, ordering issues, timing-dependent failures
- map and repair data flow across modules or services
- fix a defect identified from logs, stack traces, failing tests, or payloads
- full-cycle: root cause → fix → verify in one pass

**Skip** for: formal code reviews, non-defect documentation, or when the user explicitly wants investigation only (stop after Phase 1 and ask before editing code).

## Phases

### Phase 1 — Investigate

1. **Frame the defect**: symptom, expected behavior, affected surface, environment (dev/staging/prod, version or branch), available evidence.

2. **Pick evidence level**: use the strongest available artifact (see `Evidence Level` in the report template).

3. **Pick the trace entry**: use the user-provided node if given; otherwise start from the nearest executable entry or strongest failure artifact.

4. **Trace the full path**:
   - entry point → validation/parsing → domain/service logic → persistence/cache/queue/external boundary → output or observable side effect → error and fallback path
   - For concurrent or async bugs, trace timing, goroutine/thread ownership, lock acquisition order, and event ordering alongside the data path.

5. **Check git blame on the critical path** *(if regression is suspected)*: run `git log -p` or `git blame` on files covering the failure. If a recent commit changed the behavior, name the commit and explain the delta.

6. **Verify every contract boundary**: inputs, return values, schemas, DTOs, events, HTTP payloads, queue messages, and `.proto` definitions when relevant.

7. **Build a mapping ledger**: source field → intermediate transformations by layer → outbound shape at each boundary → receiver interpretation. Name the first point where value, meaning, or presence diverges from expectation.

8. **Produce `Data Flow` and Mermaid `Logic Flow`** before concluding root cause. Prefer `flowchart TD` with entry, guards, branches, error/fallback paths, and terminal outcomes.

9. **Rank hypotheses**: `Confirmed` when backed by test/trace/log/code; `Likely` when circumstantial; `Unknown` when not yet verifiable. Reject weaker hypotheses with explicit reasons.

10. **State root cause**: `Because <condition>, <component> produces <wrong behavior>, which leads to <visible symptom>.`

11. **Check impact radius**: direct callers, downstream consumers, shared schemas or types, adjacent flows that may fail for the same reason.

### Phase 2 — Fix

12. **Plan the fix**: state the minimal change that eliminates the root cause without side effects. If multiple fix options exist, pick the simplest and least invasive. If the fix has wide blast radius or requires breaking changes, surface the risk to the user before editing.

13. **Apply the fix**: edit only the code on the root-cause path identified in Phase 1. Do not refactor unrelated code.

14. **Update or add tests**: if a failing test exists, confirm it passes after the fix; otherwise add a targeted regression test for the defect.

### Phase 3 — Verify

15. **Run the affected tests**: confirm the fix passes all relevant tests and does not break adjacent ones.

16. **Spot-check the impact radius**: verify that callers and downstream consumers identified in Phase 1 are not broken.

17. **Write the report**: record Phase 1 investigation findings plus the fix summary and verification result to `docs/debugger/reports/<slug>.md`. Update `docs/debugger/main.md`.

18. **Write a concise user-facing summary** in the conversation after the report is written.

## Output Rules

1. Write reports under `docs/debugger/` relative to the current working directory.
2. Maintain `docs/debugger/main.md` as the index of debugged defects.
3. Write each report to `docs/debugger/reports/<slug>.md`.
4. Use short English `kebab-case` slugs for report filenames.
5. Link every report from `docs/debugger/main.md` with a one-line summary of the symptom or root cause.
6. If `docs/debugger/` or its subdirectories do not exist, create them.
7. Keep generated reports in the project `docs/` tree only. Do not place them inside `debugger/`.
8. Write report prose in Vietnamese by default. Keep technical terms, code identifiers, API fields, protocol names, and section keys in English.
9. Use [references/report-template.md](references/report-template.md) as the authoritative report structure.

## Constraints

- If investigation reveals a second independent issue or broader scope, surface it and stop unless the user approves expansion.
- Do not edit config, infrastructure, data, or git history unless the user explicitly expands scope.
- If the fix requires changes beyond the root-cause path (schema migration, breaking API change), surface the risk to the user before proceeding.

## Completion Checklist

- [ ] Root cause identified and evidence-backed (or clearly marked provisional).
- [ ] Fix applied only to the root-cause path.
- [ ] Regression test added or existing failing test now passes.
- [ ] Affected tests run and pass; adjacent tests not broken.
- [ ] Report written to `docs/debugger/reports/<slug>.md`.
- [ ] `docs/debugger/main.md` links to the report.
- [ ] Concise user-facing summary written in the conversation.
