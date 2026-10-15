---
title: "Create a task — Illustrative E2E Test Case"
type: testcase
feature_id: "DEMO-TASK-APP"
display_language: en
status: draft
updated: 2026-10-16
evidence_status: illustrative-only-not-approved
sources: ["../../specs/task-create.md", "../../fixtures/task-server.mjs"]
playwright_automation: "../autotests/task-create.spec.ts"
---

> **Illustrative-only paired example.** No user-approved product requirements were supplied. `EX-01` and `EX-02` below are local fixture behaviors authored only to demonstrate testcase-to-automation traceability; they are not approved acceptance criteria or product coverage evidence.

# Create a task — E2E Test Case

## Scope and sources
- **Playwright automation:** [task-create.spec.ts](../autotests/task-create.spec.ts) (this pair demonstrates the default paths and `.spec.ts` fallback).
- **E2E boundary:** Demonstrate task creation and read-back in the local sample app.
- **Approved product requirements:** None supplied; no product coverage claim is made.
- **Illustrative fixture contract:** [EX-01 and EX-02](../../specs/task-create.md) describe only the sample app behavior, not approved product requirements.
- **UI evidence:** The [local sample app](../../fixtures/task-server.mjs) implements the route, accessible labels, button, and task-list rows used here; implementation is not evidence of product approval.
- **Actor / environment:** Local sample app served by the paired test on an ephemeral `127.0.0.1` port; the harness provides its base URL.
- **Cleanup / safety:** The test stops the local server after the run; its in-memory task state resets on the next run. This example does not target a real or live system.

## E2E scenarios

### TC-001 — Create a task and verify local read-back
- **Preconditions:** The paired test has started the local sample app; the host project has `@playwright/test` and its browser installed.
- **Test data:** A title formed from `E2E task ` followed by the current UTC ISO timestamp.
- **User actions:**
  1. Open the test server's base URL followed by `/tasks/new`; verify the **New task** heading and **Task title** field are visible.
  2. Enter the test title in **Task title**, select **Create task**, and verify the browser navigates to `/tasks`.
  3. Open `/tasks`; verify a task-list row contains the exact title and `Open` status, then reload `/tasks` and verify the row remains visible in this sample server process.
- **Expected outcome / postcondition:** The local fixture renders a task-list row with the generated title and `Open` status before and after reload.
- **Trace:** [EX-01](../../specs/task-create.md#ex-01) and [EX-02](../../specs/task-create.md#ex-02) — illustrative fixture behaviors only; not approved product criteria.

## Evidence gap / use limit
- No approved product requirement source was supplied. This case demonstrates source links and case-to-test mapping against an explicitly unapproved local fixture contract; it cannot establish coverage for a real feature. Replace the EX IDs with approved, versioned requirements before adapting it to a product testcase.
