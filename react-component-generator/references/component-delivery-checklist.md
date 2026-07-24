# Component Delivery Checklist

Load this file only when you need full detail during implementation or review.
For placement/template/file decisions, see `SKILL.md`'s Execution workflow — this file adds what that workflow doesn't already cover, plus the final self-check gate.

## Beyond the Execution workflow

- Inspect 1-2 nearby components for folder naming, test-file suffix (`.test.tsx` vs `.spec.tsx`), imports, exports, and state handling style before finalizing folder/test names.
- On refactor, keep the existing folder unless a move was requested.

## Self-check

- [ ] `'use client'` handled correctly for this repo: absent entirely in non-RSC repos (Vite/CRA/plain SPA); in RSC-enabled repos (Next.js App Router etc.), present iff the file needs state, effects, refs, browser APIs, or event handlers.
- [ ] No placeholders/TODOs, unused imports/variables/hooks left in the output.
- [ ] No `React.FC` and no empty `Props` type left in the output.
- [ ] Props destructured in the signature, except the documented props-controller exception.
- [ ] Loading/error/empty states use early returns, not nested ternaries; `count && <X/>` guarded as `count > 0 && <X/>`.
- [ ] Tests assert behavior (not implementation details).
- [ ] UI states owned by component are covered where relevant.
- [ ] Styling approach matches the repo's established convention detected in `SKILL.md` step 1 (not overridden by a default); only greenfield repos with no established approach fall back to `Tailwind -> CSS Module`. For CSS-in-JS repos, the style file follows nearby components by hand — `templates/style.module.css` was not used.
- [ ] Accessibility expectations are met for controls (semantic elements, labels, keyboard support).
- [ ] Test mock syntax (`vi.*` vs `jest.*`) and ref style (`ref` prop vs `forwardRef`) match the repo's actual test runner and React version.
- [ ] One component per file; oversized `index.tsx` split per `SKILL.md` step 5 (sibling folder, not nested, not flat `PascalCase.tsx`).
- [ ] No hooks/business logic living directly in `index.tsx` when `controller.ts` exists — all of it is in the controller, and every controller output it returns is actually consumed by the view.
- [ ] Props are the minimal set the component actually needs (no derivable/redundant props, no unrelated props forced into one object); if the component has more than ~7 props, its responsibility and API were re-evaluated per `references/props-design.md` rather than adding props by reflex.
