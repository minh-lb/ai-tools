# Error Handling Patterns

Load this file when the task involves API errors, form errors, or error UI states.

## Error Categories

| Category | Source | Display Pattern |
|---|---|---|
| Network / HTTP | `api-client.ts` normalizes to `ApiClientError` | Toast for transient, inline alert for blocking |
| Business / Domain | Service throws descriptive Error | Inline alert near the affected section |
| Validation (client) | Zod / react-hook-form | Inline field message below the input |
| Validation (server) | Server Action returns `{ errors }` | Inline field message rendered from form state |

## Propagation Chain

```
api-client.ts
  normalizes AxiosError → ApiClientError with status + message
    ↓
service.ts
  lets errors propagate — do NOT catch and return null
    ↓
controller.ts
  useQuery:    { isError, error } → return both to view
  useMutation: onError callback   → trigger toast or set local error state
    ↓
index.tsx
  renders error UI based on { isError, error }
```

## Rules

- **Never swallow errors in services** — throw or propagate; let the caller decide.
- **useQuery**: always return `{ isError, error }` from controller; always render an error state in the view.
- **useMutation**: use `onError` for side effects (toast); use `isError`/`error` from the mutation result for inline blocking errors.
- **Server Actions**: return `{ errors }` from the action; render field errors inline via `useActionState`.
- **error.tsx**: route-level boundary only. Handle: uncaught server component exceptions, `notFound()`, `redirect()`. Do NOT handle: `useQuery` fetch failures, mutation errors, form validation errors — those belong in the controller/view layer.
- **error.tsx minimal implementation**: show a generic "Something went wrong" message with a retry button (`reset()` prop from Next.js). Never expose raw server error details in production.
- **Do not expose raw server error messages** to end users in production UI; use a safe user-facing message.

## Data Normalization Defaults

- List responses: always default to `[]` — `data ?? []`
- Single object responses: always default to `null` — `data ?? null`
- Error objects always have `.message`; TypeScript's `Error` type guarantees this.

## TanStack Query — Read Error

```ts
// controller.ts
const { data, isLoading, isError, error } = useQuery({ ... });
return { data, isLoading, isError, error };

// index.tsx
if (isError) return <Alert variant="destructive">{error.message}</Alert>;
```

## TanStack Query — Mutation Error

```ts
useMutation({
  mutationFn: updateItem,
  onError: (err) => toast.error(err.message),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["items"] });
    toast.success("Saved.");
  },
});
```

## Server Action — Field Validation Error

Full flow from action definition through controller wiring to view rendering:

```ts
// actions.ts — "use server"; validate with Zod, return { errors } on failure
"use server";
import { z } from "zod";

const schema = z.object({ name: z.string().min(1) });

export type FeatureFormState = { errors?: { name?: string[] }; success?: boolean };

export async function featureAction(
  _prev: FeatureFormState,
  formData: FormData
): Promise<FeatureFormState> {
  const parsed = schema.safeParse({ name: formData.get("name") });
  if (!parsed.success) return { errors: parsed.error.flatten().fieldErrors };
  // …perform mutation…
  return { success: true };
}
```

```ts
// controller.ts — wire form state; return state + action to the view
// React 18 / Next.js 14: import { useFormState } from "react-dom";
// React 19 / Next.js 15: import { useActionState } from "react";
import { useFormState } from "react-dom"; // default (React 18); swap to useActionState for React 19+
import { featureAction, type FeatureFormState } from "./actions";

export const useController = () => {
  const [state, formAction] = useFormState<FeatureFormState, FormData>(featureAction, {});
  return { state, formAction };
};
```

```tsx
// index.tsx — render inline field errors from state
const { state, formAction } = useController();
return (
  <form action={formAction}>
    <input name="name" aria-describedby="name-error" />
    {state.errors?.name && (
      <p id="name-error" role="alert">{state.errors.name[0]}</p>
    )}
    <button type="submit">Submit</button>
    {state.success && <p>Saved successfully.</p>}
  </form>
);
```
