// Substitution required: replace "ComponentName" with the actual component name (PascalCase).
// Checklist: destructure return values from useController(), update styles.container class, fill in JSX, delete this comment block.
// If the component receives props, see references/props-controller-pattern.md for the Props + useController(props) wiring.
// controller.ts always uses client-only hooks, so this needs "use client" in RSC-enabled repos (Next.js App
// Router etc.). In non-RSC repos (Vite, CRA, plain SPA), delete this directive line — it's a no-op there.
"use client";

import { useController } from "./controller";
import styles from "./style.module.css";

const ComponentName = () => {
  const { value } = useController();

  return <div className={styles.container}>{value}</div>;
};

export default ComponentName;
