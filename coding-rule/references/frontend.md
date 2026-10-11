# Frontend and User Interface Rules

Apply these checks to browser, mobile, desktop, and other user-facing interfaces as relevant to the platform. Use platform-native semantics and controls; do not assume web-specific markup or behavior applies elsewhere. For browser load/render performance, also read [Frontend Performance](frontend-performance.md); for client-side trust boundaries, read [Secure Coding Rules](security.md).

## Semantics and accessibility

- Use controls that express the user's actual action and expose a clear accessible name, role, state, and instructions through the platform's accessibility model.
- Ensure all essential interactions work with supported input methods, including keyboard or equivalent assistive input. Keep focus visible, ordered, and managed when views, dialogs, or navigation change.
- Associate validation errors and status updates with the relevant control or region. Do not communicate state using color, position, or sound alone.
- Respect text resizing, zoom, contrast, motion preferences, localization, and reflow requirements applicable to the target platform and product. Meet the project's declared accessibility target; do not claim conformance from source inspection or an automated scan alone.
- Prefer semantic/native controls over custom controls. If a custom control is necessary, implement and test its interaction, focus, and accessibility behavior.

## Interaction and state

- Represent meaningful states explicitly: initial, loading, success, empty, validation failure, recoverable error, and unavailable/offline states when applicable. Prevent accidental duplicate actions where they could create duplicate side effects.
- Keep user input and context when validation or recoverable network errors occur, unless the product contract says otherwise. Make recovery actions clear and ensure they can actually recover.
- Ensure navigation, browser/platform back, refresh, deep links, and interrupted flows behave consistently with the product's state model.
- Handle asynchronous results safely: account for cancellation, stale responses, component/view teardown, concurrent edits, and optimistic updates that may need rollback.
- Make interactive targets usable at supported viewport sizes and input modes. Test meaningful narrow and large layouts rather than assuming desktop is representative.

## Forms and data rendering

- Validate locally for immediate feedback, but enforce authoritative rules at the trusted server or data boundary as well.
- State constraints and required fields clearly. Connect error messages to fields and avoid clearing unrelated valid input after a failed submission.
- Render untrusted values safely for their output context. Treat rich text, URLs, file metadata, and user-provided labels as untrusted until safely validated/encoded by an appropriate platform mechanism.
- Do not rely on hidden controls, client-side role checks, or client-supplied identity/state for authorization.

## Performance and maintainability

The bullets here are the baseline; use [Frontend Performance](frontend-performance.md) for profiling, Core Web Vitals, network/assets, runtime rendering, and optimization workflow.

- Fetch, render, and retain only the data needed for the current view. Bound large lists and expensive work; use pagination, virtualization, or deferred loading when justified by actual scale and user experience.
- Measure a real performance issue before adding caching, preloading, memoization, or complex rendering machinery. Check the user-visible loading and interaction cost, not only synthetic microbenchmarks.
- Keep UI state ownership clear and avoid maintaining multiple unsynchronized copies of the same state. Reuse project components and design tokens when they satisfy the requirement.
- Follow established project and platform conventions; do not rewrite unrelated styling or components as part of a focused behavior change.

## Frontend verification prompts

For changed interactions, test the relevant success, validation, empty, loading, and error/recovery states; keyboard/focus and assistive semantics; supported responsive layouts; and persistence/read-back when state should survive navigation or reload. Select only checks relevant to the feature and declared support matrix.
