import { type ApplicationFormData } from "@/types";
import React from "react";
import { type FieldError, type UseFormReturn } from "react-hook-form";
import "./FormField.scss";

type FormPaths =
  | `studentInfo.${keyof ApplicationFormData["studentInfo"]}`
  | `studentInfo.name.${"firstName" | "lastName"}`
  | `availability.${keyof ApplicationFormData["availability"]}`
  | `additionalInfo.${keyof ApplicationFormData["additionalInfo"]}`;

interface FormFieldProps {
  label: string;
  name: FormPaths;
  type?: string;
  required?: boolean;
  placeholder?: string;
  options?: readonly { readonly value: string; readonly label: string }[];
  help?: string;
  min?: string;
  max?: string;
  form: UseFormReturn<ApplicationFormData>;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  name,
  type = "text",
  required = true,
  placeholder,
  options,
  help,
  min,
  max,
  form,
}) => {
  const {
    register,
    formState: { errors },
  } = form;

  const getError = () => {
    const [section, ...parts] = name.split(".");
    const sectionErrors = errors[section as keyof typeof errors];

    if (!sectionErrors) return undefined;

    if (parts.length === 1) {
      return sectionErrors[parts[0] as keyof typeof sectionErrors];
    }

    if (parts.length === 2) {
      const [parent, child] = parts;
      const parentErrors = sectionErrors[parent as keyof typeof sectionErrors];
      return parentErrors && typeof parentErrors === "object"
        ? (parentErrors as Record<string, FieldError>)[child]
        : undefined;
    }

    return undefined;
  };

  const error = getError();
  const inputClassName = `form-field__input ${error ? "form-field__input--error" : ""}`;

  return (
    <div className="form-field">
      <label className="form-field__label">
        {label}
        {required && <span className="form-field__required">*</span>}
      </label>
      {options ? (
        <select {...register(name)} className={inputClassName}>
          <option value="">Select {label.toLowerCase()}</option>
          {options.map(({ value, label }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      ) : (
        <input
          {...register(name)}
          type={type}
          className={inputClassName}
          placeholder={placeholder}
          min={min}
          max={max}
        />
      )}
      {help && <span className="form-field__help">{help}</span>}
      {error && (
        <span className="form-field__error">
          {typeof error === "object" && "message" in error
            ? error.message
            : String(error)}
        </span>
      )}
    </div>
  );
};
