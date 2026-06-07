// Substitution required: replace "ComponentName" with the actual component name (PascalCase).
// Checklist: rename IProps, update props to match actual interface, remove unused props.
import { type FC } from "react";

interface IProps {
  label: string;
  onAction?: () => void;
}

const ComponentName: FC<IProps> = ({ label, onAction }) => {
  return (
    <div>
      <span>{label}</span>
      {onAction && <button type="button" onClick={onAction}>Action</button>}
    </div>
  );
};

export default ComponentName;
