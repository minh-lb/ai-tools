# Props + Controller Pattern

Use this reference only when the target repository already uses a controller hook or the requested component benefits from one. Do not introduce the pattern solely to satisfy a template. Replace sample names, fields, and error copy with the real component contract and project conventions.

The example intentionally forwards the complete props object to `useController(props)`. That is a pattern choice, not a prop-count rule; destructuring or narrower arguments may be clearer in another repository.

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
  const { derivedValue, isLoading, errorMessage, handleAction } = useController(props);

  // errorMessage is mapped to approved, user-safe copy in the controller/localization layer.
  if (errorMessage) return <span role="alert">{errorMessage}</span>;

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
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const derivedValue = props.value.toUpperCase();

  const handleAction = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      // Add real async behavior here.
    } catch (err) {
      // Map the error through the repository's approved user-facing messages.
      // Keep raw details in the existing safe logging/telemetry path, if appropriate.
      setErrorMessage(/* approved localized message */);
    } finally {
      setIsLoading(false);
    }
  };

  return { derivedValue, isLoading, errorMessage, handleAction };
};
```
