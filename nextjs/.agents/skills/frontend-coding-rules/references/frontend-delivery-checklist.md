# Frontend Delivery Checklist

Use this file only when implementing or validating user-facing UI.

## Product Fit

- Match the existing app before inventing new style (density, spacing, typography, navigation, feedback).
- Build the requested workflow first; do not substitute with landing/marketing pages unless requested.
- Include loading, empty, error, disabled, and success states where the workflow needs them.
- Avoid unnecessary nested cards and unstable floating sections.

## Image-Based UI Work

- Treat images/mockups as implementation evidence.
- Preserve visible hierarchy, layout rhythm, component intent, and key copy.
- Use screen-level design source first; use `docs/design.md` for unresolved shared decisions and load `docs/design-extended.md` only when detailed density/spacing/component-default decisions are required.
- Separate visible facts from assumptions in spec and report.
- If only one viewport is shown, define safe behavior for mobile and desktop before implementing.

## Styling Priority

- Tailwind CSS: use for all UI primitives; keep class lists minimal and stable.
- CSS Module: use only for selectors/effects Tailwind cannot express cleanly (e.g. complex keyframe animations, pseudo-element hacks); keep `style.module.css` small.

## Interaction and Accessibility

- Prefer semantic controls over custom div interactions.
- Icon-only controls require accessible labels.
- Keep keyboard access and visible focus styles.
- Ensure text/layout does not overlap or clip on mobile and desktop.

## Required Reporting

Include these sections in final output for user-facing UI work:

1. `Visual Acceptance`
- design source used
- chosen screen type and density tokens
- justification for any density escalation
- viewports and states checked
- matched aspects, intentional deviations, unverified risks

## Final Checklist

- [ ] Tailwind CSS used for all styling by default.
- [ ] CSS Module used only when Tailwind cannot express the required style.
- [ ] New components created via `react-component-generator`.
- [ ] User-facing states implemented where needed.
- [ ] Responsive behavior validated (or risk documented).
