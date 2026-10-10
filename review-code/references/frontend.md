# Frontend UI

## Scope

Use this reference for browser-based web interfaces: traditional multi-page apps, SPAs, SSR/SSG, server components, and hybrid rendering. It applies across UI frameworks; inspect the conventions and runtime behavior of the framework present in the repository. Native mobile and desktop application UI are outside this reference.

## Focus

Review whether the browser UI lets the intended user complete the stated task correctly and reliably across meaningful routes, states, input methods, viewport sizes, and network conditions. Assess concrete interaction and layout failures, not aesthetic preference. Use [Accessibility](accessibility.md) for WCAG-oriented accessibility checks and [Performance](performance.md) for load/render performance.

## Inspect

- **Routes and navigation**: direct/deep links, refresh, back/forward, query/hash state, redirects, not-found routes, route guards, and unsaved-change behavior.
- **User journeys and state transitions**: initial/loading, success, empty, validation error, server error, forbidden/unauthenticated, stale data, offline/slow network, retry, and recovery states.
- **Async data and race behavior**: duplicate submissions, stale responses overwriting newer state, cancellation on unmount/navigation, request ordering, optimistic updates and rollback, and consistency between URL, server state, and visible state.
- **Forms and actions**: field constraints, client/server validation agreement, preservation of user input after errors, pending/disabled state, duplicate-submit prevention, destructive-action confirmation, and whether success UI reflects a confirmed result rather than an uncommitted request.
- **Component and state ownership**: props/events/public component contracts, controlled versus uncontrolled state, derived state, global-store boundaries, cleanup of subscriptions/timers, and whether UI components duplicate domain rules that belong on the server.
- **Rendering boundaries**: SSR/CSR/server-client boundaries, hydration mismatches, browser-only APIs used during server rendering, error boundaries, suspense/loading fallbacks, and differences between server and client data or locale/time rendering.
- **Responsive behavior**: content clipping/overlap, horizontal overflow, fixed/sticky elements covering content, long text/localization, orientation, zoom/reflow, and whether primary tasks remain available at supported viewport sizes.
- **Browser/runtime compatibility**: check the project's declared browser support; verify new browser APIs, CSS features, polyfills, and graceful fallbacks against that support matrix.
- **Interaction semantics**: use links for navigation and buttons for actions; preserve expected focus, disabled, pending, and error behavior. Keyboard and assistive-technology conformance is evaluated in [Accessibility](accessibility.md).
- **Visual regression risk**: inspect styles/layout when the change affects visible output. Raise a finding only for reproducible breakage or a concrete usability/product requirement—not personal taste about colors, spacing, or preferred component structure.

## Frontend Scenario Checklist

For each changed route or interaction, consider only materially distinct scenarios, but include the relevant cases below:

| Area | Scenarios |
|---|---|
| Entry/navigation | Direct URL, internal navigation, refresh, back/forward, invalid route, expired session |
| Data state | Loading, empty, success, validation error, server error, forbidden, stale, retry |
| Network/async | Slow response, offline/timeout, response arrives after navigation, rapid repeated action, overlapping requests |
| Form/action | Valid/invalid submission, server rejection, double submit, partial success, destructive action cancelled |
| Viewport/content | Narrow and wide viewport, zoom/reflow, long/localized text, dynamic content or sticky overlays |
| Rendering | First server render, client hydration, client-only API absent, navigation/unmount during pending work |

When the framework or browser test environment is available and safe, verify critical journeys in a real browser. Static inspection cannot establish that a route renders, layout fits, hydration succeeds, or an interaction works in every supported browser. Record the exact environment and checks performed; do not claim visual/browser verification if none ran.

## Review Questions

- Can a user complete the stated task from a direct link as well as through the happy-path navigation?
- Does every meaningful state have truthful, recoverable UI, including empty, loading, invalid, denied, offline, and failed states?
- Can an older async response overwrite newer user intent or state? Can repeated actions create duplicate writes?
- Does optimistic UI roll back or reconcile when the server rejects or changes the result?
- Are browser-only APIs isolated from server rendering, and do server/client renders agree during hydration?
- Do route changes, back/forward navigation, refresh, and URL state preserve the expected behavior?
- Does the layout remain usable on supported browsers and viewport sizes, including long text and zoom?
- Are browser-side checks treated as usability aids rather than the source of authorization or data-integrity guarantees?
- Is the reported UI issue observable and tied to a real user or product impact rather than a subjective styling preference?

## Red Flags

- A route works only after navigating from the home page but fails on direct load or refresh.
- Loading, empty, error, or permission-denied states leave a blank/stuck screen or imply success incorrectly.
- A stale response overwrites newer state, an optimistic update never rolls back, or repeated activation causes duplicate writes.
- Client-side validation disagrees with the server and loses user-entered data after a server-side rejection.
- An async callback updates unmounted/stale UI state or leaves a subscription, timer, or event listener active after navigation.
- A client/server boundary reads `window`, `document`, storage, or layout during server rendering and crashes or hydrates inconsistently.
- A sticky element obscures the active content or primary action; responsive layout clips required information or controls.
- A UI component silently performs unrelated persistence, navigation, and policy work, creating a concrete test or change-safety risk.
- A new API/CSS feature breaks a browser in the declared support matrix without a fallback.
- A visual difference is reported without a reproducible failure, product requirement, or user impact.

## Evidence

A UI finding should state the triggering route/action/state or viewport, the owning component/route and line range, what the user sees or cannot do, and the impact. For runtime-only behavior, mark **[Cannot verify statically]** and state the browser, viewport, network condition, or test needed to confirm it.

## Remediation Direction

- Model the user journey as explicit states and give each state a clear, recoverable outcome.
- Cancel or disregard stale requests; serialize or deduplicate writes where repeated actions are unsafe.
- Reconcile optimistic state on both success and failure; keep server validation authoritative.
- Keep rendering, state ownership, and domain rules in their intended layers; make server/client boundaries explicit.
- Preserve route and browser support contracts, and add graceful fallback where supported environments lack a feature.
- Add focused component or browser tests for the concrete regression; use [Testing](testing.md) and [Accessibility](accessibility.md) for their respective coverage requirements.
