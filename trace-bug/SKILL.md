---
name: trace-bug
description: Investigate code defects without applying a fix. Use only when the user explicitly asks to trace a bug, isolate a root cause, analyze a stack trace, map execution flow, or prepare a debugging handoff.
---

# Trace Bug

Investigate a defect, explain the failure path, and write the investigation report to a project file before any fix is attempted.

## Use / Skip

**Use** when the task is to:
- trace a runtime error, wrong output, regression, or flaky behavior
- trace concurrent or async bugs: race conditions, deadlocks, ordering issues, or timing-dependent failures
- map request, data, or logic flow across modules or services
- isolate the most likely root cause before editing code
- inspect logs, stack traces, failing tests, or payloads to explain a defect
- prepare a debugging handoff for a later fix

**Skip** for: code fixes end-to-end, formal code reviews, or non-defect documentation. If the user wants the defect fixed after tracing, switch to `bugfix` or continue only with explicit instruction to edit code. Do not auto-apply.

## Output Rules

1. Write investigation reports under `docs/trace-bug/` relative to the current working directory.
2. Maintain `docs/trace-bug/main.md` as the index of traced defects.
3. Write each traced defect to `docs/trace-bug/reports/<slug>.md`.
4. Use short English `kebab-case` slugs for report filenames.
5. Link every report file from `docs/trace-bug/main.md` with a one-line summary of the symptom or root cause.
6. If `docs/trace-bug/` or its subdirectories do not exist, create them.
7. Keep generated reports in the project `docs/` tree only. Do not place generated reports inside `trace-bug/`.
8. Write report prose in Vietnamese by default. Keep technical terms, code identifiers, API fields, protocol names, and section keys such as `Data Flow` / `Logic Flow` in English.
9. Write a concise user-facing summary in the conversation after the report file is written.
10. Use [references/report-template.md](references/report-template.md) as the authoritative report structure. Do not omit: `Symptom`, `Evidence Level`, `Trace Entry`, `Data Flow`, `Data Mapping Analysis`, Mermaid `Logic Flow`, `Likely Root Cause`, `Impact Radius`, `Unknowns`, `Confidence`, and `Recommended Next Step`.

## Investigation Workflow

1. **Frame the defect**: symptom, expected behavior, affected surface, environment (dev/staging/prod, version or branch), available evidence.

2. **Pick evidence level**: use the strongest available artifact (see `Evidence Level` in the report template for the ranked list).

3. **Pick the trace entry**: use the user-provided node if given; otherwise start from the nearest executable entry or strongest failure artifact.

4. **Trace the full path**:
   - entry point → validation/parsing → domain/service logic → persistence/cache/queue/external boundary → output or observable side effect → error and fallback path
   - For concurrent or async bugs, trace timing, goroutine/thread ownership, lock acquisition order, and event ordering alongside the data path.

5. **Check git blame on the critical path** *(if regression is suspected or no obvious defect is visible in code)*: run `git log -p` or `git blame` on files covering the failure. If a recent commit changed the behavior, name the commit and explain the delta.

6. **Verify every contract boundary**: inputs, return values, schemas, DTOs, events, HTTP payloads, queue messages, and `.proto` definitions when relevant. Read both sides of cross-service contracts.

7. **Build a mapping ledger**: source field → intermediate transformations by layer → outbound shape at each boundary → receiver interpretation. Name the first point where value, meaning, or presence diverges from expectation.

8. **Produce `Data Flow` and Mermaid `Logic Flow`** before concluding root cause. Prefer `flowchart TD` with entry, guards, branches, error/fallback paths, and terminal outcomes.

9. **Rank hypotheses**: a fact is `Confirmed` when backed by a test, trace, log, or direct code evidence; `Likely` when supported only by circumstantial evidence; `Unknown` when not yet verifiable. Reject weaker hypotheses with explicit reasons.

10. **State root cause**: `Because <condition>, <component> produces <wrong behavior>, which leads to <visible symptom>.`

11. **Check impact radius**: direct callers, downstream consumers, shared schemas or types, adjacent flows that may fail for the same reason.

12. **Recommend next action**: trace deeper / fix now / contain temporarily / gather missing evidence first.

**Constraints** (apply throughout):
- If tracing reveals a second independent issue or broader scope, surface it and stop unless the user approves expansion.
- Do not edit code, config, infrastructure, data, or git history unless the user explicitly expands scope.

## Completion Checklist

- A report file is written to `docs/trace-bug/reports/<slug>.md`.
- `docs/trace-bug/main.md` links to the report file.
- A concise user-facing summary is written in the conversation.
- The full failure path is traced from entry to visible symptom or to the last known unknown boundary.
- Data mapping is checked at each critical layer or service boundary.
- If mapping is wrong, the first incorrect transformation or interpretation point is named explicitly.
- Root cause is evidence-backed or clearly marked as provisional.
- Adjacent impact is inspected with code search or direct references, not guesswork.
