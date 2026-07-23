# Component Delivery Checklist

Load this file only when you need full detail during implementation or review.

## Execution Checklist

1. Input
- confirm component name and responsibility
- collect props only if relevant
- detect React major version, whether the React Compiler is enabled, and the test runner (Vitest/Jest) from repo config — these decide ref-forwarding style, memoization, and test mock syntax below

2. Nearby conventions
- inspect 1-2 nearby components for folder naming, test-file suffix (`.test.tsx` vs `.spec.tsx`), imports, exports, and state handling style — this decides the folder-naming and test-file-naming calls below

3. Placement
- place under `components/**`
- keep existing folder on refactor unless move is requested
- new folder names use `kebab-case` by default, unless nearby components already use a different case

4. File decisions
- required: `index.tsx`
- required for new component: a test file (`index.test.tsx` by default, `index.spec.tsx` if that's the nearby-component convention)
- optional: `controller.ts` when logic separation is needed
- optional: `style.module.css` only when Tailwind is insufficient

5. Primitive gate
- use Tailwind CSS for all styling by default
- use CSS Module only when Tailwind cannot express the required style

6. Generation quality
- remove placeholders/TODOs
- use `'use client'` only when needed
- avoid empty `Props` types — either fill them in or delete the type and drop the parameter entirely
- ensure controller outputs are consumed by view when controller exists
- when `controller.ts` exists, `index.tsx` contains only the `useController()` call, JSX, and guard-clause early returns — no hooks or business logic added directly in `index.tsx`
- no `React.FC`; no `IProps` naming; props destructured in the signature (except the props-controller forwarding exception — see `references/props-controller-pattern.md`)
- `index.tsx` not oversized (>~200-300 lines or complex render logic) — split a sub-component to its own sibling `components/<kebab-case-name>/index.tsx`, not a nested folder or a flat `PascalCase.tsx` file

## Self-check

- [ ] No unused imports/variables/hooks.
- [ ] No `React.FC` and no empty `Props` type left in the output.
- [ ] Props destructured in the signature, except the documented props-controller exception.
- [ ] Loading/error/empty states use early returns, not nested ternaries; `count && <X/>` guarded as `count > 0 && <X/>`.
- [ ] Tests assert behavior (not implementation details).
- [ ] UI states owned by component are covered where relevant.
- [ ] Styling approach matches priority (`Tailwind -> CSS Module`).
- [ ] Accessibility expectations are met for controls (semantic elements, labels, keyboard support).
- [ ] Test mock syntax (`vi.*` vs `jest.*`) and ref style (`ref` prop vs `forwardRef`) match the repo's actual test runner and React version.
- [ ] One component per file; oversized `index.tsx` split into a sibling `components/<kebab-case-name>/index.tsx`, not a nested folder or flat `PascalCase.tsx` file.
- [ ] No hooks/business logic living directly in `index.tsx` when `controller.ts` exists — all of it is in the controller.
