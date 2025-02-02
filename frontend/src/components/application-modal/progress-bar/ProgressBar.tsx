import React from "react";

import "./ProgressBar.scss";

interface ProgressBarProps {
  currentStep: number;
}

const STEPS = [
  { step: 1, label: "Personal Info" },
  { step: 2, label: "Availability" },
  { step: 3, label: "Additional Info" },
] as const;

export const ProgressBar: React.FC<ProgressBarProps> = ({ currentStep }) => {
  return (
    <div className="progress">
      <div className="progress__labels">
        {STEPS.map(({ step, label }) => (
          <div
            key={step}
            className={`progress__label ${
              currentStep === step ? "active" : ""
            }`}
          >
            {label}
          </div>
        ))}
      </div>
      <div className="progress__bar">
        <div
          className="progress__bar-fill"
          style={{
            width: `${((currentStep - 1) / (STEPS.length - 1)) * 100}%`,
          }}
        />
      </div>
    </div>
  );
};
