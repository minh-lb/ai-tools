---
name: frontend-coding-rules
description: "Enforce frontend implementation rules for the current repository. Use when tasks involve building or refactoring React/Next.js UI, choosing between Tailwind CSS or CSS Module, or creating/updating components. Apply strict priority: Tailwind CSS first, CSS Module last; and require `react-component-generator` whenever creating a component."
---

# Frontend Coding Rules

Apply all `UI.*` and `STYLE.*` rule IDs from `docs/coding-standards.md` (already in context).

## Decision Autonomy

- Make autonomous decisions by default while executing this skill.
- Ask the user only when required context is missing and assumptions could cause incorrect or risky changes.

## Reference Load Trigger

- Load `references/frontend-delivery-checklist.md` when implementing user-facing UI from image/mockup/Figma evidence.
- Load `references/frontend-delivery-checklist.md` when preparing `Visual Acceptance` report sections.

- Read `docs/design.md` only when the task involves visual design decisions and the file exists.
- Load `docs/design-extended.md` only when the task needs detailed density, spacing, component-default, or motion guidance and the file exists.
- Read `docs/visual-acceptance.md` only when the task requires visual acceptance reporting and the file exists.

## Route-Level UI Requirements

- Every `(private)` route must include both `loading.tsx` (Suspense fallback) and `error.tsx` (error boundary) alongside `page.tsx`. This satisfies the delivery checklist item "Loading, error, and empty states are handled in the view layer."

## Stack And Primitive Gate

- Follow `STYLE.STACK_PRIORITY` and `UI.TAILWIND_FIRST` from `docs/coding-standards.md`.
- Default to Tailwind CSS utility classes for all styling; use CSS Modules only when Tailwind cannot express the required style.

## Component Creation Rule

When the task requires creating a new component:
1. Resolve placement first via `nextjs-coding` skill (determines if the component belongs in `components/`, `containers/**/components/`, or elsewhere).
2. Then **always use the `react-component-generator` skill** to generate the component files.

## Required Output Section

- Always include `Visual Acceptance` in the final report for user-facing UI work.

## Detailed Reference

- For image-based UI handling, accessibility checks, and completion checklist, load `references/frontend-delivery-checklist.md`.
- `agents/openai.yaml` — OpenAI agent adapter config for this skill (provider-specific, not loaded by default).
