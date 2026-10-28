# React

Load for components, hooks, effects, and state. Use the installed React version and lint rules. Add [Frontend](frontend.md) for interaction/accessibility changes and [Next.js](nextjs.md) only for Next-specific behavior.

## Components and ownership

- Keep render pure: do not mutate props/state, perform writes, subscribe, or start requests during ordinary client rendering. Use framework-supported data fetching, event handlers, or effects as appropriate.
- Use function components and hooks for new code unless existing constraints require another approach. Keep a component focused on a coherent UI responsibility; extract components/hooks when they give meaningful ownership or reuse, not to meet line limits.
- Keep state close to its owner; derive filtered lists, totals, and other computable values during render instead of duplicating them in synchronized state. Lift state only to the closest common owner; use existing server-state/form tools before adding a global store.
- Update state immutably and use functional updates when the next value depends on the previous value. Avoid reading a just-set value as if setters updated the current render's snapshot.
- Use stable keys from domain identity. Avoid random keys or array indices for reorderable/stateful items; a key change intentionally resets subtree state.
- Use precise props and deliberate controlled/uncontrolled form contracts. Keep callback and event names consistent; do not forward arbitrary internal props onto DOM nodes.

## Hooks and effects

- Call ordinary hooks at the top level of components/custom hooks, not conditionally or inside callbacks/loops. Respect documented exceptions of the installed React APIs (such as `use`) rather than generalizing them to other hooks.
- Use effects to synchronize with external systems. Put user-triggered business actions in event handlers; compute derived state during render. Do not use an effect merely to copy one prop/state value into another.
- Include actual reactive dependencies and follow the hook linter; do not suppress dependency checks to force a desired lifecycle. Restructure ownership or callback logic to resolve stale closures.
- Clean up subscriptions, timers, listeners, and in-flight work. Prevent older search/request responses from overwriting newer results; abort where supported and use a freshness/ignore guard when needed. Cleanup must tolerate setup/cleanup repetition in development.
- Use refs for mutable non-rendering state and DOM access; do not use ref mutation to bypass state/render semantics. Extract a custom hook around a meaningful reusable lifecycle, not as a generic `useMount` escape hatch.
- Profile before adding manual memoization; choose memoization compatible with the project's React Compiler/toolchain policy. `useMemo` is an optimization, not a guarantee of correctness or persistent state.

## Verification

Test observable interactions, accessible queries, loading/error/empty states, and state ownership with the project's tools (for example React Testing Library). When affected, cover rapid input, stale responses, unmount cleanup, reordered items, and repeated submission. Avoid asserting internal hook calls or snapshots as a substitute for user behavior.
