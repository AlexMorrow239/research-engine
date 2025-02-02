import { useState } from "react";

import type {
  FieldError,
  FieldErrors,
  Path,
  PathValue,
  UseFormReturn,
} from "react-hook-form";

import "./PasswordField.scss";

interface BasePasswordFieldProps<T> {
  label: string;
  required?: boolean;
  placeholder?: string;
  help?: string;
  disabled?: boolean;
  defaultValue?: T;
}

interface GenericPasswordFieldProps<T extends Record<string, unknown>>
  extends BasePasswordFieldProps<PathValue<T, Path<T>>> {
  name: Path<T>;
  form: UseFormReturn<T>;
}

export function PasswordField<T extends Record<string, unknown>>({
  label,
  name,
  required = true,
  placeholder,
  help,
  form,
  disabled = false,
  defaultValue,
}: GenericPasswordFieldProps<T>): JSX.Element {
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    formState: { errors },
  } = form;

  const getError = (): string | undefined => {
    const parts = name.split(".");
    let currentErrors: FieldErrors<T> | undefined = errors;

    for (const part of parts) {
      if (!currentErrors) return undefined;
      currentErrors = currentErrors[part] as typeof currentErrors;
    }

    return (currentErrors as FieldError)?.message;
  };

  const error = getError();
  const inputClassName = `password-field__input ${
    error ? "password-field__input--error" : ""
  }`;

  return (
    <div className="password-field">
      <label className="password-field__label">
        {label}
        {required && <span className="password-field__required">*</span>}
      </label>
      <div className="password-field__input-wrapper">
        <input
          {...register(name, { value: defaultValue })}
          type={showPassword ? "text" : "password"}
          className={inputClassName}
          placeholder={placeholder}
          disabled={disabled}
          autoComplete="current-password"
        />
        <button
          type="button"
          className="password-field__toggle"
          onClick={() => setShowPassword(!showPassword)}
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? "Hide" : "Show"}
        </button>
      </div>
      {help && <span className="password-field__help">{help}</span>}
      {error && <span className="password-field__error">{error}</span>}
    </div>
  );
}
