// Substitution required: replace "ComponentName" with the actual component name (PascalCase).
// Checklist: rename Props, update props to match actual shape, remove unused props, delete this comment block.
// In an RSC project, add 'use client' only if retaining this event handler; omit it in non-RSC projects.
// Remove the handler and directive if the final component has no client-only behavior.

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
