# Props Design

Use this reference when a component API is hard to understand, responsibilities appear mixed, or related prop groups are repeatedly passed together. There is no universal prop-count limit; count alone is not a reason to group or split an API.

## Design checks

Before adding or changing a prop, ask:

- Is the value already derivable from other inputs or owned state?
- Does it belong to this component's responsibility?
- Does the caller need to control it, or can the component own the behavior?
- Are several values always passed and used together as one meaningful domain concept?
- Are optional values creating invalid or confusing combinations?
- Does the API communicate intent clearly at the call site?

Group props only when the group has a meaningful shape in the domain and is genuinely consumed as a unit. Do not create a generic `config` object to hide unrelated fields, and do not pass a large object when only a small subset is needed.

## State and variants

Avoid duplicate props that represent the same underlying state. Derive presentation from the smallest complete state when the relationship is stable and clear. Use a discriminated union for mutually exclusive modes when it makes invalid combinations unrepresentable; keep independent options independent.

Name callbacks for the user or domain intent (for example, `onSelect` or `onValueChange`) and follow local naming conventions. Prefer one clear interaction contract over several callbacks that fragment the same operation.

Use `children` or composition when callers need to supply structurally different content. Keep composition aligned with the project's component-library patterns rather than introducing a new compound-component convention for one use.

## When to split

Consider a separate component when its behavior has a distinct responsibility, lifecycle, reuse boundary, or accessibility/rendering contract. Also reconsider the API when props belong to unrelated concepts, unrelated modes change the component's behavior, or a small region owns a separate set of state and callbacks.

Do not split solely to reduce prop count, make a file shorter, or move logic behind a hook. Context is useful when data is shared through a deep tree or has a clear scope; it is not a generic escape hatch for ordinary parent-child props.

## Final review

Check that props are necessary, names reflect behavior, related values have a coherent shape, optional states are understandable, and the component has one clear user-facing responsibility. Preserve the target repository's type and naming conventions. Prefer a simple API that is easy to use and test over a mechanically small API.
