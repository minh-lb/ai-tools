# React Component Authoring

Build or refactor a component that meets the requested behavior and fits the target repository. Templates and references are examples; adapt them to the codebase rather than treating their file layout or libraries as mandatory.

## Scope

Use for component-level React work. Do not use it to redesign route architecture, bootstrap a repository, or add a UI framework. If the repository's component architecture is unclear and the choice would materially affect other code, ask before expanding scope.

## References

Load only the reference that answers a current question:

| File | Load when |
|---|---|
| [component-authoring-reference](component-authoring-reference.md) | Local React/TypeScript, naming, import, state, or test conventions need clarification. |
| [props-design](props-design.md) | The component API is difficult to understand, combines unrelated concerns, or repeats correlated prop groups. |
| [props-controller-pattern](props-controller-pattern.md) | The repository uses a controller hook and this component has both props and controller logic. |
| [form-component-pattern](form-component-pattern.md) | A form needs validation/submission guidance; adapt to the installed form stack and approved field rules. |
| [server-client-boundary-pattern](server-client-boundary-pattern.md) | An RSC-enabled component needs both server-only data access and client interaction. |
| [component-delivery-checklist](component-delivery-checklist.md) | Final self-check or delivery reporting needs more detail. |

## Workflow

1. **Inspect the local pattern.** Read project instructions and a nearby component. Check the supported React version, rendering model (including whether RSC is actually used), styling approach, test runner, and installed component/form/testing packages. Infer from repository files; do not ask about facts available locally.
2. **Clarify only material behavior.** Identify the component's responsibility, inputs, user actions, owned states, error/recovery behavior, accessibility needs, and data boundaries. Use stated product/API rules; do not invent validation limits, user-facing messages, or authorization behavior.
3. **Choose placement and files from the repository.** Preserve a component's current location in a refactor unless a move is requested. For a new component, match neighboring components. A folder such as `components/<name>/index.tsx` is only a fallback when no project convention is evident. Use the [React component templates](../../templates/react-components/) only where they fit the target structure.
4. **Keep the design proportional.** Keep a component cohesive and its public API understandable. Derive values where appropriate; group props only when they form a meaningful unit. Split by responsibility, ownership, or rendering boundary when that improves comprehension or reuse—not by an arbitrary prop or line count. A controller/custom hook is optional and should follow established project practice; do not move every hook or calculation into a separate file by default.
5. **Respect rendering and styling boundaries.** In an RSC project, add `'use client'` only to a module that needs client capabilities. Keep server-only access and secrets out of the client module graph. Split server data access from client interaction when necessary to preserve that boundary, while avoiding components created solely to satisfy a template. Use the existing styling system. If none exists, prefer an available native/minimal approach; do not add Tailwind, CSS-in-JS, or another styling dependency without a user/project decision.
6. **Handle forms safely.** Use the project's installed form and schema libraries when they fit. If none exists, use the repository's established native approach or ask before adding dependencies. Derive client validation and messages from approved requirements/contracts; retain server-side validation and authorization. Label controls, associate errors, preserve user input on recoverable errors, and represent pending/success/failure states accurately.
7. **Test with the existing setup.** Use the repository's runner and match nearby test patterns. Cover relevant visible behavior, interactions, accessible controls, and owned loading/error/empty states. Do not install test packages or bootstrap a new test stack without approval. If the project has no applicable test setup, use the checks available and report the gap.
8. **Verify component behavior.** Follow the shared verification workflow. Check accessible names, keyboard interaction, feedback, and recovery for the states the component owns. Report browser and assistive-technology checks according to what actually ran.

Consider memoization or dynamic imports when measurements or existing code support the need.
