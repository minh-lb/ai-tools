# Frontend accessibility and responsive

## Choose a practical matrix

Use supported browsers/devices and documented breakpoints. Inspect a representative narrow and wide layout for affected journeys; test around a breakpoint when behavior changes there. Add orientation, touch, zoom, locale, theme, or reduced-motion modes when required or relevant to the changed surface. Record exact viewport and mode; browser emulation does not prove real-device behavior.

## Reflow and touch

- Check wrapping, content order, spacing, visible actions, and intended scrolling with realistic long content. Navigation, tables, sticky elements, dialogs, and popovers must remain reachable and usable.
- Exercise the journey at the selected narrow width and, when zoom/reflow is in scope, at 200% browser zoom and other required levels. Verify text, controls, error messages, and focus indicators remain usable; one zoom check does not establish accessibility conformance.
- Open the mobile keyboard for affected forms. Verify focused fields, validation feedback, and submit actions can be reached by scrolling; inspect fixed footers and viewport changes. If tooling cannot emulate the software keyboard, report that part as unverified.
- Test touch alternatives for hover-only actions, outside-tap dismissal where supported, and conflicting scroll/drag gestures. Assess target sizes against the project's accessibility target rather than inventing a threshold.

## Keyboard and focus

Walk the critical journey using keyboard input. Verify logical tab order, visible focus, reachable controls, and no unintended keyboard trap. Use Enter/Space and arrow keys according to native control or established widget semantics; do not impose identical keys on every control.

For a modal dialog, verify focus enters meaningfully, remains within the modal while open, and returns to the invoking control or a sensible successor when closed. Check background interaction/scroll behavior against the modal contract. Test Escape and backdrop dismissal only where supported; record missing behavior against the applicable design/accessibility requirement.

After navigation, validation errors, and dynamic updates, inspect focus and feedback. A visible toast alone may not communicate a result to assistive technology. Do not rely solely on DOM presence or a successful role locator to prove accessibility.

## Semantics and assistive technology

Check accessible names, labels, roles, state (expanded/selected/checked/invalid), headings, error associations, image alternatives, and status announcements for affected controls. Check text/non-text contrast and non-color cues against the project's accessibility requirements. Inspect reduced-motion behavior when animation is affected.

Use existing automated accessibility tooling for detectable issues, plus keyboard checks and targeted screen-reader checks when required and available. Clearly separate automated findings, manual observations, and unverified assistive-technology behavior. Report the tested scope rather than claiming WCAG conformance from a scan or screenshot.
