// Substitution required: replace "ComponentName" with the actual component name (PascalCase).
// Checklist: destructure return values from useController(), fill in JSX, delete this comment block.
// If the component receives props, see references/props-controller-pattern.md for the Props + useController(props) wiring.
// In an RSC project, add 'use client' only if the real controller uses client-only hooks or browser behavior.
// Omit it in non-RSC projects or when no client-only behavior remains.

import { useController } from "./controller";

const ComponentName = () => {
  const { value } = useController();

  return <div>{value}</div>;
};

export default ComponentName;
