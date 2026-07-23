// Substitution required: replace "ComponentName" with the actual component name (PascalCase).
// Checklist: rename Props, update props to match actual shape, remove unused props, delete this comment block.
type Props = {
  label: string;
  onAction?: () => void;
};

const ComponentName = ({ label, onAction }: Props) => {
  return (
    <div>
      <span>{label}</span>
      {onAction && <button type="button" onClick={onAction}>Action</button>}
    </div>
  );
};

export default ComponentName;
