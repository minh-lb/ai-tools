# Props Design

Load this reference when deciding what props a new component should expose, or when an existing component's prop list grows large enough that the design needs re-evaluation.

There is no hard cap on prop count. The goal is a clear, minimal, single-responsibility API — not a lower number for its own sake. Do not mechanically collapse props into one object just to shrink the count.

## Before adding a prop

Check:

1. Can this value be derived from another prop?
2. Should this be computed inside the component instead of passed in?
3. Does this prop belong to this component's responsibility?
4. Is this prop always passed together with another group of props?
5. Does adding it make the component's API harder to understand?

## Prop count signals

Use these as review signals, not hard rules:

- 1-5 props: usually fine.
- 6-7 props: check how related the props actually are.
- More than 7: re-examine the component's responsibility and API.
- More than 10: usually a sign the component is doing too much.

## Grouping props into an object

Only group props into an object when:

- They describe the same entity.
- They are always passed and used together.
- The resulting object has a clear, obvious meaning in the domain.

Good — `user` is a real entity used as a unit:

```tsx
type User = {
  id: string;
  name: string;
  avatarUrl?: string;
};

type UserCardProps = {
  user: User;
  onSelect: (userId: string) => void;
};
```

Bad — unrelated props forced into one object:

```tsx
type ComponentProps = {
  config: {
    title: string;
    loading: boolean;
    user: User;
    onClick: () => void;
    variant: string;
  };
};
```

## Derivable props

Don't add multiple props that represent the same underlying state.

Avoid:

```tsx
type ButtonProps = {
  loading: boolean;
  disabled: boolean;
  loadingText: string;
  showSpinner: boolean;
};
```

Prefer:

```tsx
type ButtonProps = {
  loading?: boolean;
  disabled?: boolean;
};
```

Let the component decide spinner visibility from `loading` instead of taking it as a separate prop.

## Boolean props

Avoid stacking many boolean props — they create invalid combinations of state.

Avoid:

```tsx
<Card compact bordered elevated clickable selected horizontal />
```

When the booleans represent mutually exclusive variants, prefer a union type:

```tsx
type CardProps = {
  variant?: "default" | "compact" | "elevated";
};
```

Don't convert independent booleans into a union — only variants that are actually mutually exclusive.

## Event props

Callback names should describe the event or intent, not the mechanism:

```
onSelect
onSubmit
onClose
onValueChange
```

Avoid generic names: `handler`, `callback`, `onAction`.

Don't pass several small callbacks that all belong to one flow if they can be expressed as a single, clearer API.

## Avoid passing whole objects unnecessarily

Don't pass an entire object when the component only needs one or two of its fields.

Prefer:

```tsx
<Avatar src={user.avatarUrl} alt={user.name} />
```

Over:

```tsx
<Avatar user={user} />
```

Only pass the full `user` object when the component genuinely works with the user entity and needs several of its fields.

## Composition over content props

Use `children` or composition when content has many variants and adding more props would make the API harder to use.

Avoid:

```tsx
<Modal
  title="Delete item"
  description="This action cannot be undone"
  confirmText="Delete"
  cancelText="Cancel"
  footerMessage="Please confirm"
/>
```

Prefer:

```tsx
<Modal title="Delete item">
  <p>This action cannot be undone.</p>
  <Modal.Footer>
    <Button>Cancel</Button>
    <Button>Delete</Button>
  </Modal.Footer>
</Modal>
```

## When to split the component

Consider splitting when:

- Props belong to multiple unrelated responsibilities.
- The component mixes data-fetching, layout, form, and modal concerns.
- Several props are only used by one small part of the component.
- The component has multiple unrelated operating modes.
- The props type has too many optional fields.

## Context and custom hooks

Don't reach for Context just to avoid passing props one level down.

Only consider Context when:

- The data is consumed by many components deep in the same tree.
- Props would otherwise pass through several intermediate components that don't use them.
- The data has a clear scope: form, theme, auth, or feature state.

Use custom hooks to extract logic, not to hide a large prop count behind an internal hook. In this skill, that logic belongs in `controller.ts`/`useController` (see `references/component-authoring-reference.md` §Controller conventions) — don't create a separate ad-hoc hook file alongside it just to shrink what `index.tsx` looks like it depends on.

## Required checks before finishing a component

1. Count the props.
2. Check for duplicate or derivable props.
3. Check the number of boolean props.
4. Check whether props share the same domain.
5. Check whether the component has too many responsibilities.
6. Check whether an oversized/unrelated object is being passed.
7. Confirm prop names describe their meaning accurately.
8. Only propose grouping, composition, a union type, or a component split when it genuinely improves the API — not as a default reflex.

## Priority order

When these trade off against each other, prioritize in this order:

1. Clear API.
2. Type safety.
3. Single component responsibility.
4. Easy to use and read at the call site.
5. Reasonable prop count.

Do not reduce prop count at the cost of the priorities above it.
