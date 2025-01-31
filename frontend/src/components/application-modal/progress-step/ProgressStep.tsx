import React from "react";

import "./ProgressStep.scss";

interface ProgressStepProps {
  currentStep: number;
}

const STEPS = [
  { step: 1, label: "Personal Info" },
  { step: 2, label: "Availability" },
  { step: 3, label: "Additional Info" },
] as const;

export const ProgressStep: React.FC<ProgressStepProps> = ({ currentStep }) => {
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
