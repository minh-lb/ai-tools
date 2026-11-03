---
title: "Create a task — Illustrative E2E Test Case"
type: testcase
feature_id: "DEMO-TASK-APP"
display_language: en
status: draft
updated: 2026-10-16
evidence_status: illustrative-only-not-approved
sources: ["../../specs/task-create.md"]
---

> **Illustrative-only testcase example.** No user-approved product requirements were supplied. `EX-01` and `EX-02` describe hypothetical application behavior solely to demonstrate case traceability; they are not approved acceptance criteria or product coverage evidence.

# Create a task — E2E Test Case

## Scope and sources
- **E2E boundary:** Demonstrate task creation and read-back in the local sample app.
- **Approved product requirements:** None supplied; no product coverage claim is made.
- **Illustrative example contract:** [EX-01 and EX-02](../../specs/task-create.md) describe hypothetical behavior, not approved requirements.
- **Actor / environment:** Hypothetical signed-in user in a sample task-management app; replace base URL and route with product-approved evidence before using on a real system.
- **Cleanup / safety:** Use only synthetic task data in an approved test environment; the document itself does not perform actions.

## E2E scenarios

### TC-001 — Create a task and verify local read-back
- **Preconditions:** A sample task-management application is available, the user has permission to create a task, and the task list starts in a known state. `pending-spec` until supported by real product evidence.
- **Test data:** Task title `E2E task sample 001` (illustrative only).
- **User actions:**
  1. Open the approved sample application base URL plus `/tasks/new`; verify the **New task** heading and **Task title** field are visible.
  2. Enter `E2E task sample 001` in **Task title**, select **Create task**, and verify navigation to `/tasks`.
  3. Open `/tasks`; verify the task list contains `E2E task sample 001` with `Open` status, then reload and verify the row remains visible.
- **Expected outcome / postcondition:** The hypothetical task list shows the sample title and `Open` status before and after reload (not an approved product oracle).
- **Trace:** [EX-01](../../specs/task-create.md#ex-01) and [EX-02](../../specs/task-create.md#ex-02) — illustrative fixture behaviors only; not approved product criteria.

## Evidence gap / use limit
- No approved product requirement source was supplied. This example demonstrates testcase structure and link traceability only; it cannot establish coverage for a real feature. Replace `EX-*` with approved requirement IDs and confirm the route, UI controls, and expected outcome before using the case.
