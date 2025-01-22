import {
  PROJECT_LENGTH_OPTIONS,
  WEEKLY_AVAILABILITY_OPTIONS,
} from "@/common/constants";
import { FormField } from "@/components/common/form-field/FormField";
import { type ApplicationFormData } from "@/types";
import React from "react";
import { type UseFormReturn } from "react-hook-form";
import "./Availability.scss";

interface AvailabilityStepProps {
  form: UseFormReturn<ApplicationFormData>;
}

type DayAvailability =
  | "mondayAvailability"
  | "tuesdayAvailability"
  | "wednesdayAvailability"
  | "thursdayAvailability"
  | "fridayAvailability";

const getDayAvailabilityField = (day: string): DayAvailability => {
  return `${day.toLowerCase()}Availability` as DayAvailability;
};

export const AvailabilityStep: React.FC<AvailabilityStepProps> = ({ form }) => {
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

  return (
    <div className="modal__step">
      <h3>Availability</h3>
      <div className="form-grid">
        {days.map((day) => (
          <FormField
            key={day}
            form={form}
            label={`${day} Availability`}
            name={`availability.${getDayAvailabilityField(day)}`}
            placeholder="e.g., 9AM-5PM"
            required
          />
        ))}

        <FormField
          form={form}
          label="Weekly Hours Commitment"
          name="availability.weeklyHours"
          options={WEEKLY_AVAILABILITY_OPTIONS}
          required
        />

        <FormField
          form={form}
          label="Desired Project Commitment"
          name="availability.desiredProjectLength"
          options={PROJECT_LENGTH_OPTIONS}
          required
        />
      </div>
    </div>
  );
};
