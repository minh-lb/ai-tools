---
title: "Support request form — E2E Test Cases (Example)"
type: testcase
feature_id: EX-SUPPORT-REQUEST
display_language: en
status: draft
updated: 2026-10-09
sources: [EX-FORM-AC-01, EX-FORM-AC-02, EX-FORM-UI-01, EX-FORM-API-01, EX-FORM-SEC-01]
---

> **Illustrative only.** All `EX-FORM-*` sources, fields, rules, UI copy, and routes below are fictional. `https://support.example.test` is a reserved example domain; replace it with the approved test environment URL in real testcases.

# Support request form — E2E Test Cases

## Scope and sources
- **User goal / E2E boundary:** A member signs in, submits a support request through a multi-step form, and finds the saved request in **My Requests** after reload.
- **Fictional sources:** `EX-FORM-AC-01` defines required fields and the conditional affected-product field; `EX-FORM-AC-02` defines inline validation, value retention, and the no-create-before-submit rule; `EX-FORM-UI-01` defines the example URLs/routes, navigation/control labels, Request type → Details → Review → Confirmation → My Requests flow, and localized copy; `EX-FORM-API-01` defines single creation, persistence, and a read-after-reload **My Requests** list; `EX-FORM-SEC-01` defines the synthetic member account and successful sign-in flow.
- **Actor / environment:** Synthetic member `U-TEST` in isolated workspace `WS-TEST`; no real personal data. Example base URL: `https://support.example.test`.
- **Starting state:** `U-TEST` starts signed out with no support requests.
- **Cleanup / safety:** Delete a created request after capturing evidence; use synthetic data only.
- **Out of scope:** File attachments, other request categories, admin triage, notifications, direct API validation, and alternate access roles.

## E2E scenarios

### TC-001 — Submit a valid technical support request across the wizard
- **Preconditions:** `U-TEST` exists with member access, starts signed out, and has no prior support requests.
- **Test data:** Approved QA credential-store alias for `U-TEST` (do not copy the credential). Title: `Export report unavailable`. Description: `Export button returns an error for monthly reports.` Category: `Technical issue`; affected product: `Reports`.
- **User actions:**
  1. Launch the test browser and navigate to `https://support.example.test/sign-in`; enter `U-TEST` in **Account ID**, retrieve its password through the approved credential-store alias and enter it in **Password**, then select **Sign in**. Verify `/workspaces/WS-TEST/home` and signed-in account `U-TEST`.
  2. Select **Help** in the navigation, then **New request**; verify `/workspaces/WS-TEST/help/requests/new/type`.
  3. On **Request type**, select **Technical issue**, select **Continue**, and verify `/workspaces/WS-TEST/help/requests/new/details`.
  4. On **Details**, enter the title in **Request title**, enter the description in **Description**, select **Reports** in **Affected product**, select **Continue**, and verify `/workspaces/WS-TEST/help/requests/new/review`.
  5. On **Review**, verify all entered values and select **Submit request** once.
  6. On **Confirmation**, note the request ID; select **My Requests**, verify `/workspaces/WS-TEST/requests`, open the matching request, and reload `/workspaces/WS-TEST/requests/<request-id>`.
- **Expected outcome / postcondition (oracle):** Sign-in reaches `WS-TEST`. Confirmation and reloaded request details show the same request ID and exact category, title, description, and affected product. **My Requests** contains exactly one matching request.
- **Trace:** EX-FORM-AC-01, EX-FORM-UI-01, EX-FORM-API-01, EX-FORM-SEC-01.
- **Risk / priority rationale:** Medium — primary form-to-persistence user journey.

### TC-002 — Recover from a missing conditional field without losing form values
- **Preconditions:** `U-TEST` exists with member access, starts signed out, and has no prior support requests.
- **Test data:** Approved QA credential-store alias for `U-TEST` (do not copy the credential). Category: `Technical issue`; title: `Export report unavailable`; description: `Export button returns an error for monthly reports.` Leave affected product unset.
- **User actions:**
  1. Launch the test browser and navigate to `https://support.example.test/sign-in`; enter `U-TEST` in **Account ID**, retrieve its password through the approved credential-store alias and enter it in **Password**, then select **Sign in**. Verify `/workspaces/WS-TEST/home` and signed-in account `U-TEST`.
  2. Select **Help** → **New request**; verify `/workspaces/WS-TEST/help/requests/new/type`. Select **Technical issue**, select **Continue**, and verify `/workspaces/WS-TEST/help/requests/new/details`.
  3. On **Details**, enter the title and description in their labeled fields, leave **Affected product** unset, and select **Continue**.
  4. Verify the wizard remains at `/workspaces/WS-TEST/help/requests/new/details` with the validation message. In a second tab, navigate to `https://support.example.test/workspaces/WS-TEST/requests`, reload, and confirm the list is empty; return to the form tab.
  5. Select **Reports** in **Affected product**, select **Continue**, and verify `/workspaces/WS-TEST/help/requests/new/review`.
  6. On **Review**, verify the original title and description remain, then select **Submit request** once.
  7. On **Confirmation**, select **My Requests**, open the new request, and reload `/workspaces/WS-TEST/requests/<request-id>`.
- **Expected outcome / postcondition (oracle):** Sign-in reaches `WS-TEST`. On the first Continue, the wizard stays on **Details** and shows `Select an affected product.` while retaining the entered title and description. Reloading **My Requests** in the second tab shows no request before correction. After selecting **Reports**, Review retains the values; after submission, exactly one matching request appears in **My Requests** after reload.
- **Trace:** EX-FORM-AC-01, EX-FORM-AC-02, EX-FORM-UI-01, EX-FORM-API-01, EX-FORM-SEC-01.
- **Risk / priority rationale:** Medium — conditional validation and state retention across wizard screens.
