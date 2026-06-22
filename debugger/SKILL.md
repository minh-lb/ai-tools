---
name: debugger
description: Investigate a defect by tracing data flow and logic flow from the input source. Use when the user wants to understand how data moves through layers or services, map transformation mismatches, or identify where behavior diverges — without applying any fix.
---

# Debugger

Trace a defect end-to-end: follow the data from its source through every layer, map transformations at each boundary, render the logic flow, and write an investigation report. **Does not edit code.**

## Use / Skip

**Use** when the task is to:
- trace how data flows from an input source and where it diverges from expectation
- map field transformations across layers or service boundaries
- identify the first boundary where a value, meaning, or shape is wrong
- understand a runtime error, wrong output, or unexpected behavior without fixing it yet
- trace concurrent, async, or flaky issues: race conditions, deadlocks, ordering problems, timing-dependent failures
- inspect logs, stack traces, failing tests, or payloads to explain a defect
- prepare a clear investigation handoff before a fix is attempted

**Skip** for: applying fixes, formal code reviews, or non-defect documentation. If the user wants the defect fixed, switch to `bugfix`. **Do not auto-apply.**

## Investigation Workflow

1. **Frame the defect**: symptom, expected behavior, affected surface, environment (dev/staging/prod, version or branch), available evidence.

2. **Pick evidence level**: use the strongest available artifact and record it as the first line of `Evidence`. Paste raw stack traces, wrong output, and logs directly — do not paraphrase.

3. **Pick the trace entry**: use the user-provided node if given; otherwise start from the nearest executable entry or strongest failure artifact.

4. **Trace the full data path from source**:
   - Follow the input from where it enters: HTTP request / event payload / job argument / CLI argument
   - Through each layer: validation/parsing → domain/service logic → persistence/cache/queue/external boundary → response or observable side effect
   - For concurrent or async bugs: trace timing, thread/goroutine ownership, lock acquisition order, and event ordering. For flaky bugs (< 100% reproduction): note the race window, identify all possible event orderings, and state what instrumentation (timestamps, correlation IDs, distributed traces) would be needed to confirm.

5. **Check git blame on the critical path** *(regression)*: run `git log -p` or `git blame`. If no code changed, check: lock file diffs (`composer.lock`, `package-lock.json`, `go.sum`), env var or secrets changes, deployment config diffs, infra changes (image tags, DB migrations run, cache flush). Name the first external change that aligns with the regression timeline.

6. **Verify every contract boundary**: inputs, return values, schemas, DTOs, events, HTTP payloads, queue messages, `.proto` definitions. Read both sides of cross-service contracts.

7. **Build a mapping ledger**: source field → intermediate transformations by layer → outbound shape at each boundary → receiver interpretation. Name the **first point** where value, meaning, or presence diverges from expectation.

8. **Produce `Data Flow` and `Logic Flow`** before writing the report — both as Mermaid diagrams:
   - `Data Flow`: use `sequenceDiagram`. Each layer is a separate participant (Browser, Controller, Validator, Service, Repository, DB, ExternalAPI — include all that are relevant). Each arrow must show: method/endpoint name + full payload with field names, types, and actual values. Show return values at every step, not just the final response. Use `Note over X` to show transformations happening inside a participant. Show every field rename, drop, type change, or shape change at each boundary. Mark the suspected mismatch with `Note over X,Y: ⚠ <description>`. Never use generic labels like "request", "DTO", or "result".
   - `Logic Flow`: use `flowchart TD` with all relevant guards, branches, error paths, and terminal outcomes.

9. **Assess risk**: rate severity (Critical / High / Medium / Low), state the trigger conditions that activate the bug, and describe the consequences (data loss, service outage, financial impact, user impact, silent failure).

## Output Rules

1. Write reports under `docs/debugger/` relative to the current working directory.
2. Maintain `docs/debugger/main.md` as the index of investigations.
3. Write each report to `docs/debugger/reports/<slug>.md`.
4. Use short English `kebab-case` slugs for report filenames.
5. Link every report from `docs/debugger/main.md` with a one-line summary of the symptom or root cause.
6. If `docs/debugger/` or its subdirectories do not exist, create them.
7. Keep generated reports in the project `docs/` tree only. Do not place them inside `debugger/`.
8. Write report prose in Vietnamese by default. Keep technical terms, code identifiers, API fields, protocol names, and section keys in English.
9. Write a concise user-facing summary in the conversation after the report file is written.
10. Use [references/report-template.md](references/report-template.md) as the authoritative report structure. Do not omit: `Symptom`, `Evidence`, `Trace Entry`, `Data Flow`, `Data Mapping Analysis`, `Logic Flow`, `Confirmed Facts`, `Rủi ro`. See [references/examples/](references/examples/) for complete report samples.

## Constraints

- Do not edit code, config, infrastructure, data, or git history at any point.
- If investigation reveals a second independent issue or broader scope, surface it and stop unless the user approves expansion.
