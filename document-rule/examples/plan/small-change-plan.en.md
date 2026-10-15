---
id: 0315d52d-ddb0-4cf8-96b2-af8294cf2328
title: Fix Incorrect Validation Message — Small Change Plan (fictional example)
type: example
status: draft
created: 2026-10-16
updated: 2026-10-16
tags: [document-rule, plan, en]
---
# Fix Incorrect Validation Message — Small Change Plan (Fictional Example)

> **Document status: `draft`.** The codebase or bug has not been verified. **Use this template only if the user requests a Plan for a small change or repository/project policy requires it.** If only a simple bug fix is requested, see [No Plan Required](no-plan-required.en.md).
>
> **Execution gate:** before changing code, verify the affected code path, the exact approved wording (or obtain it), and the repository's test command. Revise this Plan if inspection finds shared or contract impact; do not proceed on an unresolved wording decision.

## Goal

**Goal (once the approved copy is confirmed):** For an invalid-format email on the login screen, display `Invalid email` instead of the generic message, while preserving all other validation behavior. Success is observable when the targeted UI test asserts the exact message and existing regression tests confirm other validation behavior is unchanged.

## Steps

1. **Inspect:** verify existing input validation, error mapping, tests, and the authoritative source of the exact message.  
   **Expected:** identify the code path, regression test, approved wording, and repository test command; if wording is not approved, stop and resolve it.  
   **Verify:** cite the source/code path; not yet performed.
2. **Change:** update the mapping to the approved wording; preserve other status/error contracts.  
   **Expected:** invalid email shows the correct message; other errors are unchanged.  
   **Verify:** unit test/error-presentation test (planned).
3. **Validate:** run the regression test using a command from the repository.  
   **Expected:** targeted tests pass and no contract drift occurs.  
   **Verify:** test output after execution.

## Done

- [ ] Product approved the wording.
- [ ] Targeted/regression test actually Passed.
