---
id: fca2b8cc-05c6-48fb-b7a3-afd4240177cb
title: Review findings — Cancel-order Spec (fictional example)
type: example
status: draft
created: 2026-10-16
updated: 2026-10-16
tags: [document-rule, review, en]
---
# Review Findings — Cancel-order Spec (Fictional Example)

> This only demonstrates a review. The quoted content is intentionally flawed fictional material, not the [canonical example Spec](../spec/order-cancellation-spec.en.md).
>
> **Review scope:** Specification content and acceptance testability. **Sources/conventions:** fictional draft in this example. **Limitations:** no real code/API was inspected and no tests were run.

## Findings

### FIND-001 — Missing no-mutation condition

- **Severity:** P0
- **Location:** BR-002
- **Evidence (fictional draft):** "If status is SHIPPED, return error."
- **Impact:** it is unclear whether the order was partially changed before the error was returned.
- **Fix:** identify the error code from the contract and require "state/data unchanged."

### FIND-002 — Non-testable acceptance criterion

- **Severity:** P1
- **Location:** AC-004
- **Evidence (fictional draft):** "Concurrent requests are handled correctly."
- **Impact:** there is no expected result to determine pass/fail.
- **Fix:** Given two simultaneous cancellation requests for one PENDING order, then at most one state transition succeeds.

## Review Status and Disposition

`Findings only`; the source text was not replaced/rewritten, and no tests or code inspection were performed.

**Disposition:** `Changes requested` — the two illustrative findings remain. This conclusion applies only to the fictional Spec and stated scope.
