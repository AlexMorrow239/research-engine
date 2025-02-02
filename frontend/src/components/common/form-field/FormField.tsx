import type {
  FieldError,
  Path,
  PathValue,
  UseFormReturn,
} from "react-hook-form";

import type { ApplicationFormData } from "@/types";

import "./FormField.scss";

type ApplicationFormPaths =
  | `studentInfo.${keyof ApplicationFormData["studentInfo"]}`
  | `studentInfo.name.${"firstName" | "lastName"}`
  | `availability.${keyof ApplicationFormData["availability"]}`
  | `additionalInfo.${keyof ApplicationFormData["additionalInfo"]}`;

interface BaseFormFieldProps<T> {
  label: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  options?: readonly { readonly value: string; readonly label: string }[];
  help?: string;
  min?: string;
  max?: string;
  disabled?: boolean;
  rows?: number;
  defaultValue?: T;
  value?: string | number | readonly string[];
  autocomplete?: string;
  onChange?: (
    event: React.ChangeEvent<
      HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement
    >
  ) => void;
}

interface ApplicationFormFieldProps extends BaseFormFieldProps<string> {
  formType: "application";
  name: ApplicationFormPaths;
  form: UseFormReturn<ApplicationFormData>;
}

interface GenericFormFieldProps<T extends Record<string, unknown>>
  extends BaseFormFieldProps<PathValue<T, Path<T>>> {
  formType: "generic";
  name: Path<T>;
  form?: UseFormReturn<T>;
}

type FormFieldProps<T extends Record<string, unknown>> =
  | ApplicationFormFieldProps
  | GenericFormFieldProps<T>;

export function FormField<T extends Record<string, unknown>>({
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
  disabled = false,
  rows,
  formType,
  defaultValue,
  value,
  autocomplete,
  onChange,
}: FormFieldProps<T>): JSX.Element {
  const errors = form?.formState?.errors;

  const registerField = form
    ? formType === "application"
      ? form.register(name)
      : form.register(name, { value: defaultValue })
    : { onChange, name };

  const getError = (): Record<string, unknown> | FieldError | undefined => {
    if (!errors) return undefined;

    const parts = name.split(".");
    let currentErrors: Record<string, unknown> | FieldError | undefined =
      errors;

    for (const part of parts) {
      if (!currentErrors || typeof currentErrors !== "object") return undefined;
      if (!("message" in currentErrors)) {
        currentErrors = (currentErrors as Record<string, unknown>)[part] as
          | Record<string, unknown>
          | FieldError
          | undefined;
      }
    }

    return currentErrors;
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
        <select
          {...registerField}
          className={inputClassName}
          disabled={disabled}
          value={value}
        >
          <option value="">Select {label.toLowerCase()}</option>
          {options.map(({ value, label }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      ) : type === "textarea" ? (
        <textarea
          {...registerField}
          className={inputClassName}
          placeholder={placeholder}
          disabled={disabled}
          rows={rows}
        />
      ) : (
        <input
          {...registerField}
          type={type}
          className={inputClassName}
          placeholder={placeholder}
          min={min}
          max={max}
          disabled={disabled}
          autoComplete={autocomplete}
        />
      )}
      {help && <span className="form-field__help">{help}</span>}
      {error && (
        <span className="form-field__error">
          {typeof error === "object" && error !== null && "message" in error
            ? String(error.message)
            : String(error)}
        </span>
      )}
    </div>
  );
}
