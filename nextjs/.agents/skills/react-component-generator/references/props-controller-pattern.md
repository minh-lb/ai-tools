# Props + Controller Pattern

Use this reference only when a component needs both props and separated controller logic. Do not copy names or fields verbatim; replace them with the real component API.

## index.tsx

```tsx
"use client";

import { type FC } from "react";
import { useController } from "./controller";

export interface IProps {
  value: string;
}

const ComponentName: FC<IProps> = (props) => {
  const { derivedValue, isLoading, handleAction } = useController(props);

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
import type { IProps } from ".";

export const useController = (props: IProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const derivedValue = props.value.toUpperCase();

  const handleAction = async () => {
    setIsLoading(true);
    try {
      // Add real async behavior here.
    } finally {
      setIsLoading(false);
    }
  };

  return { derivedValue, isLoading, handleAction };
};
```
