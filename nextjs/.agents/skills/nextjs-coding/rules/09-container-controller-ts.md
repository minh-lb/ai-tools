# Rule 09 - `containers/<url-path-name-container>/controller.ts`

## Purpose
Hold orchestration logic for one container.

## Must
- Export custom hooks (e.g., `useController`) — this file must be consumed only from client components (`'use client'`). The boundary is enforced by `containers/index.tsx`.
- Own state, effects, event handlers, and service integration.
- Return only data/actions required by `index.tsx`.
- Always return `{ isLoading, isError, error }` when using `useQuery`; the view must render all three states.
- Use `useMutation` with an explicit cache strategy (`invalidateQueries`, `setQueryData`, or optimistic rollback) for every write operation.

## Must Not
- Render JSX.
- Access route file internals.
- Swallow or suppress errors — let `useQuery`/`useMutation` surface them to the view.

## Data Fetching

Use `useQuery` for read operations; always include all queryFn-dependent variables in `queryKey`.

```ts
const { data, isLoading, isError, error } = useQuery({
  queryKey: ["items", filters],
  queryFn: () => getItems(filters),
});
```

For route-driven data (e.g., `/items/[id]`), read route params inside the controller using Next.js hooks:

```ts
import { useParams } from "next/navigation";

export const useController = () => {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["item", id],
    queryFn: () => getItem(id),
    enabled: !!id,
  });
  return { item: data ?? null, isLoading, isError, error };
};
```

Use `useSearchParams()` for filter/pagination state derived from query string parameters.

## Mutation Patterns

Use `useMutation` for write operations; always include an explicit cache strategy in `onSuccess`.

```ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateItem } from "~/services/feature.service";

const queryClient = useQueryClient();

const { mutate: update, isPending: isUpdating } = useMutation({
  mutationFn: updateItem,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["feature-items"] });
  },
  onError: (err) => {
    // toast.error(err.message) — surface transient errors via toast
  },
});
```

Return `{ update, isUpdating }` to the view so the UI can disable the trigger and show a pending indicator.

## Form Patterns

Choose one approach per form and keep it consistent within the container:

- **Server Action** (preferred for simple forms, progressive enhancement): create `actions.ts` in the container folder; consume via `useActionState` in the controller; use `actions.ts.template` as the starting point.
- **react-hook-form + Zod** (for complex client-side forms needing real-time field validation): wire `useForm` and `zodResolver` in the controller; return `{ register, handleSubmit, formState }`.

## State Sharing

- **Server data shared across containers**: use a shared TanStack Query `queryKey`; both containers read from the same cache entry without extra Context.
- **Auth / session state**: read from server in Server Components; pass as props or wire a React Context at `app/layout.tsx` level for client access.
- **Global notifications / toasts**: call a toast utility (e.g., `sonner`) from `onSuccess`/`onError` in `useMutation`; do not pass toast state through props.
- **Local UI state** (modal open, selected row): own it in the controller with `useState`; do not lift to Context unless two unrelated containers share it.
- **New React Context**: only when state is truly shared UI state that is not server data and cannot be covered by the above patterns.
