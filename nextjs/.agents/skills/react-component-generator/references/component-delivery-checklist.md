# Component Delivery Checklist

Load this file only when you need full detail during implementation or review.

## Execution Checklist

1. Input
- confirm component name and responsibility
- collect props only if relevant

2. Placement
- resolve folder through `nextjs-coding`
- keep existing folder on refactor unless move is requested
- new folder names use `kebab-case`

3. Nearby conventions
- inspect 1-2 nearby components for imports, exports, and state handling style

4. File decisions
- required: `index.tsx`
- required for new component: `index.test.tsx`
- optional: `controller.ts` when logic separation is needed
- optional: `style.module.css` only when Tailwind is insufficient

5. Primitive gate
- use Tailwind CSS for all styling by default
- use CSS Module only when Tailwind cannot express the required style

6. Generation quality
- remove placeholders/TODOs
- use `'use client'` only when needed
- avoid empty props interfaces
- ensure controller outputs are consumed by view when controller exists

## Self-check

- [ ] No unused imports/variables/hooks.
- [ ] Tests assert behavior (not implementation details).
- [ ] UI states owned by component are covered where relevant.
- [ ] Styling approach matches priority (`Tailwind -> CSS Module`).
- [ ] Accessibility expectations are met for controls.
