# Task App — Illustrative Fixture Contract (Not Approved Product Requirements)

> This locally authored contract exists only to make the paired sample app and Playwright example deterministic. No user-approved product requirements were supplied. These fixture behaviors are not approved acceptance criteria and must not be presented as requirements or coverage evidence for a real product.

## Fixture-defined demonstration behaviors

- **EX-01 — Create in the local fixture:** Submitting a non-empty title from `/tasks/new` makes the sample app render that exact title with status `Open` on `/tasks`.
- **EX-02 — Read back in the same fixture process:** The sample app continues to render the created title and `Open` status after a second GET of `/tasks` in the same server process. This demonstrates read-back only; it does not establish production persistence guarantees.

## UI and test environment

- The local sample target app is implemented in [`fixtures/task-server.mjs`](../fixtures/task-server.mjs). Its GET `/tasks/new` form uses the heading **New task**, the label **Task title**, and the button **Create task**; GET `/tasks` renders task rows with title and status columns.
- The paired Playwright test starts this server on an ephemeral `127.0.0.1` port and uses that address as its base URL. The server is isolated to this example and keeps state for the duration of the test run.
- The test uses the built-in Playwright `page` fixture and accessible roles/labels exposed by the local app. To run it, the host project must already have `@playwright/test` and its browser installed; this example adds neither dependency nor project-wide configuration.

## Use boundary

This source and its testcase/spec demonstrate local file traceability and runnable structure only. Before adapting the pattern to a real feature, replace EX-01/EX-02 with approved, versioned requirements and supported project evidence. If no approved oracle is available, mark the affected real case `pending-spec`; do not copy these illustrative behaviors as product requirements.
