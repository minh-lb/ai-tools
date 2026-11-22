---
title: "Task creation — E2E Test Cases (Example)"
type: testcase
feature_id: EX-TASK-CREATE
display_language: en
status: draft
updated: 2026-10-09
sources: [EX-AC-01, EX-API-01, EX-SEC-01, EX-UI-01]
---

> **Illustrative only.** All `EX-*` sources and rules below are fictional. The `https://tasks.example.test` host is a reserved example domain; replace it with the approved test environment URL in real testcases.

# Task creation — E2E Test Cases

## Scope and sources
- **User goal / E2E boundary:** A workspace member signs in, creates a task from the form, and sees the saved task after reloading the task list.
- **Fictional sources:** `EX-AC-01` defines form validation, UI copy, and the 1–80 Unicode-code-point title range; `EX-API-01` defines `POST /api/tasks`, response, persistence, and the approved test-only harness helper `resetTasks(workspaceId)`; `EX-SEC-01` defines the synthetic member account and successful sign-in flow; `EX-UI-01` defines the example URLs, navigation labels, form field, and buttons.
- **Actor / environment:** Synthetic member `U-TEST` in isolated workspace `W-TEST`; browser test harness can observe whether the UI sent a create request. The approved `EX-API-01` helper `resetTasks("W-TEST")` clears only test tasks in `W-TEST` without ending the browser session. Test base URL: `https://tasks.example.test` (fictional).
- **Starting state:** `U-TEST` starts signed out; the workspace has zero tasks before the first variant and is reset to zero between variants.
- **Cleanup / safety:** Delete created tasks after each run; never use production data.
- **Out of scope:** Direct API authorization-bypass and endpoint-only tests belong to a separate API suite. This suite covers successful sign-in and task creation, not failed login, other roles, edit/delete, retries, concurrency, or NFR targets.

## E2E scenarios

### TC-001 — Create a task at valid title-length boundaries
- **Preconditions:** `U-TEST` exists, has workspace-member access, and starts signed out. `W-TEST` contains zero tasks; the approved `EX-API-01` test-only helper `resetTasks("W-TEST")` is available and preserves the signed-in browser session.
- **Test data:** Approved QA credential-store alias for `U-TEST` (do not copy the credential); titles `A` (1 code point), `AB` (2), 79 × `A` (79), and 79 × `A` + `😀` (80).
- **User actions:**
  1. Launch the test browser and navigate to `https://tasks.example.test/sign-in`; enter `U-TEST` in **Account ID**, retrieve its password through the approved credential-store alias and enter it in **Password**, then select **Sign in**. Verify the landing page is `/workspaces/W-TEST` and the signed-in account is `U-TEST`.
  2. From the workspace navigation, select **Tasks** and then **New task**; verify the browser is at `/workspaces/W-TEST/tasks/new` and the **Task title** field is visible.
  3. On `/workspaces/W-TEST/tasks/new`, focus **Task title**, enter the first exact value, and select **Create task** once.
  4. Select **Tasks** to open `/workspaces/W-TEST/tasks`; reload the URL and verify exactly one row with the submitted title and `Open` status. For each of the first three variants only, invoke the approved `EX-API-01` test-only harness helper `resetTasks("W-TEST")` to clear `W-TEST`, reload `/workspaces/W-TEST/tasks` and verify it is empty, then select **Tasks** → **New task** and verify `/workspaces/W-TEST/tasks/new` before continuing.
  5. Repeat steps 3–4 with the next title in Test data; after the fourth/final title, do not reset, so the final task remains available for the postcondition.
- **Expected outcome / postcondition (oracle):** Sign-in reaches `W-TEST`. For each variant, before reset (where applicable), the reloaded task list shows exactly one task with that exact title and `Open` status; no duplicate is created. After the final variant, exactly its task remains in the list.
- **Trace:** EX-AC-01, EX-API-01, EX-SEC-01, EX-UI-01.
- **Risk / priority rationale:** Medium — primary user flow and valid lower/upper boundaries.

### TC-002 — Reject an empty or whitespace-only title
- **Preconditions:** `U-TEST` exists, has workspace-member access, starts signed out, and `W-TEST` contains zero tasks.
- **Test data:** Approved QA credential-store alias for `U-TEST` (do not copy the credential); variants: leave the title untouched, then enter three spaces.
- **User actions:**
  1. Launch the test browser and navigate to `https://tasks.example.test/sign-in`; enter `U-TEST` in **Account ID**, retrieve the password through the approved credential-store alias and enter it in **Password**, then select **Sign in**. Verify the `/workspaces/W-TEST` landing page and signed-in account.
  2. Select **Tasks** → **New task**; verify `/workspaces/W-TEST/tasks/new` and the **Task title** field.
  3. For each variant, leave **Task title** empty or enter exactly three spaces, then select **Create task**.
  4. Navigate to `/workspaces/W-TEST/tasks` using **Tasks**, reload the page, and inspect the list.
- **Expected outcome / postcondition (oracle):** Sign-in succeeds. For both variants, `Enter a title.` is shown on the form; no task appears in the reloaded list and the UI sends no create request.
- **Trace:** EX-AC-01, EX-API-01, EX-SEC-01, EX-UI-01.
- **Risk / priority rationale:** Medium — prevents invalid task creation through the user flow.

### TC-003 — Reject the first title length above the limit
- **Preconditions:** `U-TEST` exists, has workspace-member access, starts signed out, and `W-TEST` contains zero tasks.
- **Test data:** Approved QA credential-store alias for `U-TEST` (do not copy the credential); title is 80 × `A` + `😀` (81 Unicode code points).
- **User actions:**
  1. Launch the test browser and navigate to `https://tasks.example.test/sign-in`; enter `U-TEST` in **Account ID**, retrieve the password through the approved credential-store alias and enter it in **Password**, then select **Sign in**. Verify the `/workspaces/W-TEST` landing page and signed-in account.
  2. Select **Tasks** → **New task**; verify `/workspaces/W-TEST/tasks/new` and the **Task title** field.
  3. Enter the 81-code-point value in **Task title** and select **Create task**.
  4. Navigate to `/workspaces/W-TEST/tasks` using **Tasks**, reload the page, and inspect the list.
- **Expected outcome / postcondition (oracle):** Sign-in succeeds. `Title must be 80 characters or fewer.` is shown on the form; no task appears in the reloaded list and the UI sends no create request.
- **Trace:** EX-AC-01, EX-API-01, EX-SEC-01, EX-UI-01.
- **Risk / priority rationale:** Medium — verifies the upper invalid boundary.
