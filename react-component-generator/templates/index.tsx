// Substitution required: replace "ComponentName" with the actual component name (PascalCase).
// Checklist: rename Props, update props to match actual shape, remove unused props, delete this comment block.
// This template has an event handler (onClick). In RSC-enabled repos (Next.js App Router etc.), that requires
// "use client" — keep the directive below. In non-RSC repos (Vite, CRA, plain SPA), delete the directive line;
// it's a no-op there. Either way, remove it entirely if the final component ends up with no state, effects,
// refs, browser APIs, or event handlers.
"use client";

type Props = {
  label: string;
  onConfirm?: () => void;
};

const ComponentName = ({ label, onConfirm }: Props) => {
  return (
    <div>
      <span>{label}</span>
      {onConfirm && <button type="button" onClick={onConfirm}>Confirm</button>}
    </div>
  );
};

export default ComponentName;
