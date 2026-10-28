# Frontend checks

## Select the affected surface

Use this reference for screen, navigation, component, and visual checks. Read only sections relevant to the journey. For forms or request races, use [forms and state](frontend-forms-and-state.md); for keyboard, touch, zoom, or reflow, use [accessibility and responsive](frontend-accessibility-and-responsive.md).

Inspect approved designs, acceptance criteria, supported clients, and existing UI conventions. Map each affected screen/control to an action and observable result. Functional defects and violations of established accessibility requirements can be reported without a pixel-perfect design; label subjective visual suggestions separately.

## Screen and content

- Verify the expected heading, content, record identity, actions, and active navigation state. A route returning 200 does not prove the correct screen rendered.
- Inspect loading, populated, empty, error, and permission states that the journey can reach. Confirm placeholders resolve and do not leave invisible controls or stale content.
- Check clipped/overlapping text, missing images/icons, broken fonts, sticky headers hiding content, scroll containers, and overlays intercepting actions. Exercise long labels, long user content, and large/empty lists where relevant.
- For specified themes/locales, check contrast-sensitive content, translated labels, date/number formatting, and text expansion. Do not infer support for every theme or locale.

## Navigation and components

| Surface | Actions and outcomes to verify when applicable |
|---|---|
| Routing | Follow links, enter a deep link directly, refresh, and use back/forward; check destination, parameters, selected state, and specified state restoration. |
| Menus, tabs, accordions | Open/select/close; verify active state and associated content, including keyboard behavior defined by the widget pattern. |
| Dialogs and drawers | Open, confirm, cancel, and use supported dismissal; check resulting state, layering, scroll behavior, and restored focus. Destructive confirmation must preserve data on cancel. |
| Search, filters, sorting | Change and clear controls; check result identities, ordering, counts, and supported URL/state persistence together. |
| Pagination and lists | Navigate pages/load more, change filters, and revisit; check page reset rules, duplicate/missing rows, selected records, and empty results. |
| Upload/download | Use safe fixtures; verify applicable type/size validation, progress/error/retry/cancel, and resulting file name/content where permitted. |

Test only behavior the component actually supports. For unspecified dismissal or state restoration rules, record observations and the oracle gap rather than declaring a product failure.

## Visual evidence

Compare against the approved design or maintained baseline at a known viewport, theme, locale, and deterministic data state. Inspect screenshot differences before accepting them; do not update baselines just to clear failures. Stabilize volatile content using project conventions and disclose meaningful masks. Screenshots complement functional assertions and cannot replace them.
