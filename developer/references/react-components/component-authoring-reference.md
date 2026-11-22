# Component Authoring Reference

Load only when local component conventions need clarification. The target repository's established React, TypeScript, styling, state, accessibility, and testing practices take precedence unless they conflict with an explicit requirement or safety rule.

## Names, types, and exports

- Match neighboring component, folder, hook, prop-type, class-name, and export conventions. Examples such as `PascalCase`, `kebab-case`, `Props`, and `useController` are common patterns, not mandates.
- Use `type` or `interface` according to the project. Avoid empty types and unnecessary exports; export a prop type only when an actual consumer needs it.
- Use the repository's component typing style. Do not reject `React.FC` or a local naming convention solely as a matter of preference.
- Add `children` only when rendered. Keep the public API limited to inputs the component actually needs.

## State and hooks

- Follow the repository's state ownership pattern. Hooks may stay in the component or move to a custom hook/controller when that improves reuse, testability, or separation of concerns.
- Never split a hook away from the component only to satisfy this skill's template. Do not add memoization by default; use it when the project/compiler or measured behavior calls for it.
- Handle async loading, error, empty, and success states that the component owns. Use user-facing copy from the project's product/localization source; do not expose raw internal errors or invent final copy.
- A component cannot catch its own render-time exception with an Error Boundary. Use the existing boundary or identify where a boundary must be placed; do not add one automatically for every hook.
- Follow React's rules for hooks and clean up subscriptions, timers, and event listeners when their lifecycle requires it.

## Rendering and imports

- Match the project's import aliases and grouping; use type-only imports where supported and consistent with local practice.
- Check the supported React version before choosing ref forwarding or ref-as-prop patterns.
- In a repository that uses React Server Components, keep server-only modules and secrets out of client modules. Add `'use client'` only when the module needs client capabilities. Do not add that directive to non-RSC projects.
- Use native semantic elements where they fit the behavior. An interactive action should have the appropriate keyboard behavior, name, and state.

## Testing

- Use the existing runner, assertion libraries, and nearby test style. Prefer tests of rendered/user-visible behavior over implementation details.
- Cover meaningful behavior and states owned by the component. Use established mocks for network boundaries; do not introduce a second test or mocking framework for one component.
- Do not add test dependencies or a new test setup without approval. If no suitable test infrastructure exists, explain the gap instead of generating a test file that cannot run.

## Examples

The supplied templates are starters, not a fixed API or required directory layout. Replace all sample props, behavior, styles, and assertions with the requested component and project conventions before reporting completion.
