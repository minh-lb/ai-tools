# Task App — Illustrative Test Conditions (Not Approved Product Requirements)

> These hypothetical conditions exist only to demonstrate testcase-to-source traceability. No user-approved product requirements were supplied. Do not treat them as approved acceptance criteria or evidence of a working application.

## Example conditions

- **EX-01 — Create a task:** Submitting a non-empty title from `/tasks/new` leads to `/tasks`, where the sample app shows that title with status `Open`.
- **EX-02 — Read back the task:** Reloading `/tasks` still displays the title and `Open` status.

## Use boundary

This file describes example behavior, not an executable fixture or verified product. The linked [testcase](../docs/testcases/task-create.md) illustrates a document structure only. Replace these conditions with approved, versioned requirements and UI evidence for a real project; mark unresolved behavior `pending-spec`.
