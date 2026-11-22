# Browser execution

## Choose the available path

Prefer the project's existing runner for repeatable regression tests. Use a connected browser tool for an interactive request or targeted investigation. Follow that tool's current documentation; do not assume a specific browser, locator API, or session is available.

Inspect the current page, URL, account, and environment before acting. Reuse an authorized authenticated session when appropriate, preserving unrelated tabs and user work. Obtain current page structure or a screenshot before choosing controls; do not invent selectors or coordinates.

## Execute and observe

1. Confirm the journey's initial state and actor. Navigate to the approved entry point.
2. Locate controls by role, accessible name, label, or stable product identifiers. Disambiguate repeated controls within their relevant region.
3. Perform the action, then wait for its expected visible or domain state with a bounded timeout. Inspect fresh UI state after navigation or a significant transition.
4. Assert specific content, identity, state, and destination. A page loading or a button being clickable is only intermediate evidence.
5. If persistence is required, reload or reopen the resource through the product and verify the saved values. If a background action is required, observe its correlated completion with bounded polling.

Use console and network evidence to explain failed user behavior. Absence of console errors does not prove success; an unrelated console warning does not automatically fail the journey. Relate diagnostics to an acceptance criterion or record them separately.

For detailed frontend verification, select only the affected sections of [frontend checks](frontend-checks.md), [forms and state](frontend-forms-and-state.md), or [accessibility and responsive](frontend-accessibility-and-responsive.md). Screenshots support visual findings but do not prove interaction or persistence behavior.

## Capture useful evidence

Record the failed step, expected/actual result, route, environment, and a minimal relevant screenshot or trace. Avoid capturing credentials or unrelated user content. Keep evidence tied to a journey ID.

Interactive execution can establish that a particular journey worked in that session. It does not create automated regression coverage or prove other browser/device combinations. State whether the run used an existing session or actually exercised sign-in.
