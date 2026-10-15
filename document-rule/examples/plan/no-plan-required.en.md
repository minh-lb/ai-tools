---
id: d8f41c20-3179-4c78-beb9-6dd2034d6eb4
title: Simple Bug Fix — No Implementation Plan File (fictional example)
type: example
status: draft
created: 2026-10-16
updated: 2026-10-16
tags: [document-rule, plan, en]
---
# Simple Bug Fix — No Implementation Plan File (Fictional Example)

## Request

> "Fix the validation message on the login page: when the email format is invalid, display `Invalid email`."

## Illustrative conditions after source inspection

- Only one message-mapping branch and an existing test need to change.
- No API contract, schema, authorization, or other business behavior changes.
- The issue is reproducible and has a clear verification method.

## Decision

**Do not create** `implementation-plan.md`, `plan.md`, or a Specification/Plan file. Do not ask the user to approve a Plan first. Make the requested change directly and run the targeted test.

## Post-execution report (fill only from observed evidence)

- **Change:** `<describe only the change actually made; state if no change was made>`.
- **Verification:** `<exact command and observed result>`; if no test was run, state `Not run`.
- **Scope changes/blockers:** `<report any discovered contract impact, shared usage, or blocker; otherwise state none>`.

> This is a **fictional decision example**, not a completed-work claim. Do not fill these fields until inspection and execution actually happen.

## Contrast

- User asks only for a **small bug fix** → no Plan file.
- User asks **"Write a Plan to fix this bug"** → provide a concise Plan, for example [Small Change Plan](small-change-plan.en.md).
