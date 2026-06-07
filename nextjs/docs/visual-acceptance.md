# Visual Acceptance

Acceptance contract for user-facing UI work.

## Purpose

- Turn "looks good" into explicit review criteria for AI-generated UI.
- Force user-facing UI changes to be checked against a defined reference before sign-off.
- Make intentional deviations visible instead of implicit.

## When To Use

- Use for every user-facing UI change.
- If a screen-level design source exists (Figma, screenshot, mockup, wireframe, URL reference), use it as the primary acceptance reference for that screen.
- If no screen-level design source exists, use `docs/design.md` plus the existing application UI as the acceptance reference. Load `docs/design-extended.md` only when detailed density/spacing/component-default guidance is required.

## Source Precedence

1. Screen-level design source for the current screen or state.
2. `docs/design.md` for shared product-wide tokens, defaults, and patterns not explicitly defined by the screen-level source. Use `docs/design-extended.md` only for unresolved detailed visual constraints.
3. Existing application patterns when neither source defines the decision.
4. Generic library defaults only when all higher-precedence sources are silent.

## Required Acceptance Matrix

Define and verify, at minimum:

- Viewports:
  - Mobile: `390x844`
  - Tablet: `1024x768`
  - Desktop: `1440x900`
- States:
  - default
  - loading if applicable
  - empty if applicable
  - error if applicable
  - disabled if applicable
  - success/confirmed if applicable

If the workflow does not meaningfully have one of these states, record `N/A` instead of inventing it.

## What Must Match

- Information hierarchy and action emphasis.
- Major layout structure and region ordering.
- Component choice and component density.
- Typography role mapping: page title, section title, labels, body, helper text, table text.
- Spacing rhythm and alignment consistency.
- Color role mapping: primary, secondary, muted, surface, border, semantic states.
- Text fit: no overlap, clipping, or unstable resizing at the required viewports.
- Interactive state clarity: hover, focus, disabled, loading, error, success.

Exact pixel matching is not required unless the user explicitly asks for it. However, visible hierarchy, emphasis, and component intent must not drift.

## Verification Method

- When browser or screenshot verification is available:
  - compare against the design source or `docs/design.md` (plus `docs/design-extended.md` when loaded) at the required viewports
  - check all applicable states
  - record any intentional deviations with reason
- When browser or screenshot verification is not available:
  - perform a code-level checklist review against this file
  - report the unverified viewport and state risk explicitly

## Required Report Output

For user-facing UI work, include a `Visual Acceptance` section in the final report containing:

- design reference used
- screen type and chosen density tokens
- viewports checked
- states checked
- matched aspects
- intentional deviations
- unverified risks, if any

## Deviation Rule

- Do not silently "improve" or reinterpret a provided screen-level design source.
- If implementation constraints require deviation, keep the smallest possible deviation and document it in both the spec and final report.
