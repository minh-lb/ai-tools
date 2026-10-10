# Accessibility (A11Y)

## Scope and Baseline

Use this reference for browser-based user interfaces. Follow the project's stated accessibility target and applicable legal/contractual requirements. When none is stated, use WCAG 2.2 Level AA as a practical review baseline—not as a claim that source inspection or automated scans can certify conformance. Evaluate applicable criteria and record exceptions and verification limits.

## Focus

Review whether people can perceive, understand, navigate, and operate the interface with different sensory, motor, and cognitive abilities, including keyboard-only and assistive-technology use. Check semantic HTML and native controls before custom ARIA widgets. A passing automated scan does not establish accessibility.

## Inspect

- **Semantics and names**: headings/landmarks, native links/buttons/inputs, accessible name/role/value, labels and instructions, meaningful alt text, and whether ARIA matches the actual interaction/state.
- **Keyboard operation**: all interactive functionality reachable and operable without a pointer; logical focus order; visible focus; no unintended keyboard traps; skip navigation where useful; expected Enter/Space/Escape behavior.
- **Focus management**: dialogs/menus/popovers move focus appropriately, constrain it only when modal, close predictably, and restore focus; route changes and dynamic content do not strand focus; sticky headers/overlays do not obscure the focused control.
- **Forms and errors**: persistent programmatic labels, required formats/instructions, errors identified in text (not color alone), errors associated with fields, focus or summary behavior after failed submit, and status updates announced when needed.
- **Contrast and visual encoding**: text contrast and non-text UI/focus contrast meet the applicable criteria; color is not the sole way to communicate status, required state, or errors; content remains legible in supported themes/high-contrast modes.
- **Resize, reflow, and responsive access**: text resize/zoom and narrow viewports do not hide functionality or require two-dimensional scrolling for ordinary content; content order remains understandable when CSS/layout changes.
- **Touch and pointer alternatives**: target size/spacing, alternatives to dragging or complex gestures, and no essential hover-only information. Apply WCAG 2.2 target-size exceptions only when they actually fit.
- **Motion and media**: respect reduced-motion preferences where animation is nonessential; avoid seizure-triggering flashes; provide captions/transcripts or controls where required by the content and target.
- **Dynamic UI**: live/status messages, async results, loading/errors, expanded/selected/disabled state, and accessible names remain accurate as the UI changes.
- **Framework and custom widgets**: verify the rendered accessibility tree, not just JSX/template source. Custom widgets must implement the expected roles, states, focus movement, and keyboard pattern; prefer native controls when they satisfy the requirement.

### WCAG 2.2 AA checkpoints

Use the project's declared target if it differs. These common checkpoints are review prompts, not a substitute for checking the full criterion text, applicability, and exceptions in the [W3C Quick Reference](https://www.w3.org/WAI/WCAG22/quickref/).

| Concern | Common criterion | Review prompt |
|---|---|---|
| Keyboard operation | 2.1.1 Keyboard (A); 2.1.2 No Keyboard Trap (A) | Can every action be reached/operated by keyboard without trapping focus? |
| Focus visibility | 2.4.7 Focus Visible (AA); 2.4.11 Focus Not Obscured (Minimum) (AA) | Is focus visible and at least partly unobscured during navigation? |
| Text contrast | 1.4.3 Contrast (Minimum) (AA) | Check at least 4.5:1 for normal text and 3:1 for large text, subject to criterion exceptions. |
| Non-text contrast | 1.4.11 Non-text Contrast (AA) | Check 3:1 for visual information needed to identify controls/states and relevant graphical objects, subject to exceptions. |
| Resize and reflow | 1.4.4 Resize Text (AA); 1.4.10 Reflow (AA) | Verify text can resize to 200% and ordinary content reflows at the applicable narrow viewport without loss of content/function. |
| Target size and dragging | 2.5.7 Dragging Movements (AA); 2.5.8 Target Size (Minimum) (AA) | Check a non-drag alternative and the 24 × 24 CSS px minimum or a valid criterion exception. |
| Forms and errors | 3.3.1 Error Identification (A); 3.3.2 Labels or Instructions (A) | Identify input errors in text and provide labels/instructions when input is required. |
| Names, roles, states | 4.1.2 Name, Role, Value (A); 4.1.3 Status Messages (AA) | Expose control semantics and announce status updates without unnecessarily moving focus. |

## Review Questions

- Can all important tasks be completed with keyboard alone, and is focus always visible and not lost or hidden?
- Does each control expose the correct name, role, value, and state in the accessibility tree?
- Are labels, validation errors, and asynchronous status changes programmatically associated and perceivable?
- Is meaning conveyed by more than color, and is text/UI contrast adequate for the target?
- Does the UI remain operable when zoomed, at narrow widths, and with reduced motion enabled?
- Can a screen-reader user understand the page structure, form errors, dialog entry/exit, and route/content changes?
- Does custom ARIA add a needed semantic layer, or would native HTML provide more reliable behavior?
- If a UI simplification removes labels, keyboard/focus behavior, contrast, status announcements, or another applicable control, is there an equivalent accessible interaction that has been verified?
- Which claims were checked by static analysis, automated tooling, keyboard use, screen-reader use, and real-browser inspection? What was not checked?

## Red Flags

- Clickable `div`/`span` controls without keyboard behavior, role, name, and state where native controls would work.
- Inputs without a programmatic label, icon-only controls without an accessible name, or duplicate/conflicting names.
- Focus indicator removed; focus order contradicts the visible order; modal focus escapes into the background or is not restored on close.
- Keyboard trap, inaccessible custom dropdown/menu/dialog, or drag-only interaction without an alternative.
- Errors/status are communicated only by color, visual position, or a toast that is not announced; invalid fields are not identified or associated with their errors.
- Content, controls, or focus are obscured by sticky headers, dialogs, banners, or responsive overlays.
- Text, focus, or control boundaries fail relevant contrast requirements; text cannot reflow/resize without loss of content or function.
- Motion ignores a reduced-motion preference when the movement is nonessential, or rapid flashing creates a safety risk.
- ARIA role/state contradicts the real behavior, or `aria-hidden`/inert state hides active controls from assistive technology.
- Accessibility is declared complete solely because an automated scanner or static source check reports no violations.
- Markup, CSS, or interaction is shortened by removing an applicable label, keyboard/focus behavior, status announcement, or other accessibility control without a verified equivalent.

## Verification Limits

Static review can identify missing semantics, labels, state wiring, and focus logic, but cannot prove the rendered accessibility tree or the experience with assistive technology. Automated tools catch only a subset of issues. When the change affects a critical journey or custom widget, prefer safe, focused checks that include keyboard-only interaction and an appropriate screen reader/browser combination; also use automated accessibility checks where available. State the exact tools, browser, and assistive technology used. Do not claim WCAG conformance unless the project's full verification process supports that claim.

## Evidence

An accessibility finding should identify the affected control or journey, the barrier and affected interaction/modality, the relevant project criterion or WCAG criterion when known, and a concrete user impact. Do not raise a finding solely because code differs from a preferred markup or styling pattern.

## Remediation Direction

- Prefer native semantic HTML and built-in browser interaction.
- Add visible labels, instructions, error associations, and correct accessible state.
- Implement keyboard and focus behavior as part of the widget, not as a separate patch that only adds ARIA attributes.
- Preserve focus visibility and ensure overlays/dialogs do not obscure or lose focus.
- Verify contrast, reflow, target size, and reduced-motion behavior against the project's target.
- Add focused keyboard, accessible-name/state, and component/browser tests; combine automated checks with manual assistive-technology testing for important journeys.

## External Guidance

- [W3C — WCAG 2.2 Quick Reference](https://www.w3.org/WAI/WCAG22/quickref/)
- [W3C — WCAG 2.2 Recommendation](https://www.w3.org/TR/WCAG22/)
