# Props + Controller Pattern

Use this reference only when a component needs both props and separated controller logic. Do not copy names or fields verbatim; replace them with the real component API.

Follow `coding-rules/references/reactjs.md` for the underlying React/TS conventions (no `React.FC`, no `IProps` Hungarian-prefix naming, guard-clause early returns for loading/error, `count > 0 && ...` instead of bare `count && ...`). This pattern only adds the controller-forwarding wiring on top.

## index.tsx

```tsx
// controller.ts always uses client-only hooks, so this needs "use client" in RSC-enabled repos (Next.js App
// Router etc.). In non-RSC repos (Vite, CRA, plain SPA), delete this directive line — it's a no-op there.
"use client";

import { useController } from "./controller";

export type Props = {
  value: string;
};

// Intentional exception to "destructure props in the signature": the whole
// props object is forwarded to useController(props) unchanged, so keeping the
// `props` identifier here avoids reconstructing an object one line later.
const ComponentName = (props: Props) => {
  const { derivedValue, isLoading, error, handleAction } = useController(props);

  // Show a user-friendly message, not the raw error — error.message may contain
  // internal/network details. Log the real error where it's caught (or via an
  // error-tracking call) if it needs to be inspected later.
  if (error) return <span role="alert">Something went wrong. Please try again.</span>;

  return (
    <button onClick={handleAction} disabled={isLoading}>
      {derivedValue}
    </button>
  );
};

export default ComponentName;
```

## controller.ts

```ts
import { useState } from "react";
import type { Props } from ".";

export const useController = (props: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const derivedValue = props.value.toUpperCase();

  const handleAction = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Add real async behavior here.
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Action failed"));
    } finally {
      setIsLoading(false);
    }
  };

  return { derivedValue, isLoading, error, handleAction };
};
```
