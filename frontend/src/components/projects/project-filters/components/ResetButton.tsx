import { RotateCcw } from "lucide-react";

interface ResetButtonProps {
  onReset: () => void;
}

export const ResetButton: React.FC<ResetButtonProps> = ({ onReset }) => {
  return (
    <button
      className="project-filters__reset"
      onClick={onReset}
      type="button"
      aria-label="Reset all filters"
    >
      <RotateCcw size={16} />
      <span>Reset</span>
    </button>
  );
};
