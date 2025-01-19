import {
  PROJECT_LENGTH_OPTIONS,
  WEEKLY_AVAILABILITY_OPTIONS,
} from "@/common/constants";
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
  const field = `${day.toLowerCase()}Availability` as DayAvailability;
  return field;
};

export const AvailabilityStep: React.FC<AvailabilityStepProps> = ({ form }) => {
  const {
    register,
    formState: { errors },
  } = form;
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

  const getInputClassName = (baseClass = "form-group__input") => {
    return `${baseClass} ${errors.availability ? "form-group__input--error" : ""}`;
  };

  return (
    <div className="modal__step">
      <h3>Availability</h3>
      <div className="form-grid">
        {days.map((day) => (
          <div key={day} className="form-group">
            <label className="form-group__label">
              {day} Availability <span className="required">*</span>
            </label>
            <input
              {...register(`availability.${getDayAvailabilityField(day)}`, {
                required: `${day} availability is required`,
              })}
              className={getInputClassName()}
              placeholder="e.g., 9AM-5PM"
            />
            {errors.availability?.[getDayAvailabilityField(day)] && (
              <span className="form-group__error">
                {errors.availability[getDayAvailabilityField(day)]?.message}
              </span>
            )}
          </div>
        ))}

        <div className="form-group">
          <label className="form-group__label">
            Weekly Hours Commitment <span className="required">*</span>
          </label>
          <select
            {...register("availability.weeklyHours", {
              required: "Please select weekly hours commitment",
            })}
            className={getInputClassName()}
          >
            <option value="">Select weekly hours</option>
            {WEEKLY_AVAILABILITY_OPTIONS.map(({ value, label }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
          {errors.availability?.weeklyHours && (
            <span className="form-group__error">
              {errors.availability.weeklyHours.message}
            </span>
          )}
        </div>

        <div className="form-group">
          <label className="form-group__label">
            Desired Project Length <span className="required">*</span>
          </label>
          <select
            {...register("availability.desiredProjectLength", {
              required: "Please select desired project length",
            })}
            className={getInputClassName()}
          >
            <option value="">Select project length</option>
            {PROJECT_LENGTH_OPTIONS.map(({ value, label }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
          {errors.availability?.desiredProjectLength && (
            <span className="form-group__error">
              {errors.availability.desiredProjectLength.message}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
