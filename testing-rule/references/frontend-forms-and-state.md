# Frontend forms and state

## Input and validation

Derive expected values and messages from approved validation rules. Select valid, empty, invalid, and relevant boundary inputs; include whitespace, Unicode, multiline text, paste, or input-method composition when the affected field warrants them.

Verify:

- Labels, required/optional indicators, default values, and editability match the field contract. Placeholder text alone is not a label.
- Validation occurs at the intended time (change, blur, or submit); errors identify the right field and explain correction. Correcting input clears or updates the error appropriately.
- Invalid submission produces no forbidden mutation. Client validation does not prove server validation; observe server-rejected input through a supported safe path when in scope.
- Server field errors and general errors appear in the correct place. Recovery preserves entered values except fields intentionally cleared for security or product reasons.
- Submit by button and keyboard where supported; check pending/disabled state and the outcome of rapid repeat submission. Do not assume every action is idempotent.
- Successful submission reaches the right record/destination and persists when required. Cancel/reset/unsaved-change prompts follow the approved behavior.

## Async transitions and races

For affected data-loading or mutation flows, cover the relevant transitions rather than checking only the settled screen:

| Condition | Observe |
|---|---|
| Slow response | Loading feedback, usable/correctly disabled controls, no false empty or success state. |
| Empty response | Appropriate empty state and available recovery/navigation. |
| Network/server failure | Actionable error, no false success, preserved state, and safe retry. |
| Mutation response lost or timed out | Reconcile server outcome before retry; use [failure diagnosis](failure-diagnosis.md#mutation-with-an-unknown-outcome) when commit status is unknown. |
| Expired session or denied access | Intended sign-in/permission state without exposing another user's data. |
| Rapid search/filter/route change | The final view corresponds to the current input/route; older responses do not silently replace it. |
| Optimistic mutation rejected | Specified rollback/reconciliation and clear feedback; no unsupported success claim. |
| Navigate away while pending | No mutation of an unrelated screen or stale notification that misidentifies the result. |

Use existing sandbox mechanisms, test interception, or controllable fixtures for deterministic failure and timing scenarios; label simulated boundaries. Do not disrupt shared services or throttle unrelated user traffic.

Example race probe: start search A, start B before A completes, resolve B then A, and inspect query text, result identity, and loading state. Apply the approved search contract as the oracle; if it is unclear, record the mismatch as an observation requiring a decision.

Test reload/back navigation and cached state when relevant to the change. Preserve meaningful state intentionally; do not treat all caching or all retained form values as defects. Observe outcomes with bounded waits; fixed sleeps do not establish correct transition handling.

For profile, ownership, or session changes, check fresh navigation and account switching with distinct owned records when in scope. Distinguish tabs sharing authentication from independently authenticated browser contexts: signing in as B in an isolated context does not invalidate A's separate session. For a shared-session switch, check cached identity/content and subsequent reads/writes against the approved session-switch contract. Distinguish stale display from demonstrated unauthorized access; record an essential missing synchronization rule as `pending-spec`.

If concurrent editing is supported, exercise a stale tab's save against the approved conflict policy; record an unspecified merge/overwrite rule as `pending-spec`, rather than inventing one.
