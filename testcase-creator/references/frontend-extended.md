# Frontend — Library Gaps and Rare Scenarios

These are proposed extensions, not part of the 87 common component checks. Add them to a feature suite only when the surface exists and expected behavior is specified.

- **Accessibility:** Tab/Shift+Tab, visible/ordered focus, Enter/Space/Escape, modal focus trap/return, accessible labels/names, errors announced by screen readers, contrast, 200% zoom, disabled state; test without a mouse.
- **Responsive & compatibility:** desktop/tablet/mobile; breakpoint boundaries ±1; portrait/landscape; long text; zoom; approved Chrome/Edge/Safari versions and operating systems; overflow/scroll, sticky elements, touch targets. Define a browser/device matrix; do not invent resolutions or thresholds.
- **i18n & locale:** switch languages; long Vietnamese/Japanese strings; full-width/half-width characters; RTL if supported; number/currency/date/time-zone formats; missing translations; text overflow.
- **UI states:** loading/skeleton, empty/zero results, error and retry, offline/lost connection during submit, out-of-order responses, refresh/unmount while loading, stale form, permission revoked mid-flow. If the request may already have been processed, verify BE state too.
- **Components missing from the common library:** Button (disabled while loading, double click); Modal/Dialog (Escape, backdrop, focus trap); Toast (success/error, dismiss); Tabs (state after switching); Tooltip; Table/Data grid (stable sort, filters, bulk selection, sticky header, row permissions); WYSIWYG (sanitization); OTP/PIN (expiry/retry); slider/stepper/wizard (back/forward, save/restore draft).
- **Domain-specific fields:** password (show/hide, strength, paste); phone/currency/address/postal code (format/locale); avatar/upload preview.
- **Browser lifecycle:** dark mode if supported, copy/paste, autofill, Back/Forward, deep links, refresh mid-flow, multiple tabs, browser cache, stale session.

Separate “the UI prevents a second click” from “two concurrent requests produce only one backend side effect.” For complex flows, model states and transitions (start/end state, guard, transition, retry/cancel), then derive cases for each edge and invalid transition. Avoid an unbounded Cartesian product; prioritize risk and use pairwise combinations.
