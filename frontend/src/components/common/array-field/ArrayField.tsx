import { useEffect } from "react";

import type { Path, PathValue, UseFormReturn } from "react-hook-form";

import type { ApplicationFormData } from "@/types";

import "./ArrayField.scss";

type ApplicationFormPaths =
  | `studentInfo.${keyof ApplicationFormData["studentInfo"]}`
  | `studentInfo.name.${"firstName" | "lastName"}`
  | `availability.${keyof ApplicationFormData["availability"]}`
  | `additionalInfo.${keyof ApplicationFormData["additionalInfo"]}`;

interface BaseArrayFieldProps {
  label: string;
  placeholder?: string;
  required?: boolean;
  help?: string;
  minItems?: number;
  addButtonText?: string;
  defaultValue?: string[];
}

interface ApplicationArrayFieldProps extends BaseArrayFieldProps {
  formType: "application";
  name: ApplicationFormPaths;
  form: UseFormReturn<ApplicationFormData>;
  value: string[];
  setValue: (values: string[]) => void;
}

interface GenericArrayFieldProps<T extends Record<string, unknown>>
  extends BaseArrayFieldProps {
  formType: "generic";
  name: Path<T>;
  form: UseFormReturn<T>;
  value: string[];
  setValue: (values: string[]) => void;
}

type ArrayFieldProps<T extends Record<string, unknown>> =
  | ApplicationArrayFieldProps
  | GenericArrayFieldProps<T>;

export function ArrayField<T extends Record<string, unknown>>({
  label,
  name,
  form,
  value,
  setValue,
  placeholder,
  required = true,
  help,
  minItems = 1,
  addButtonText = "Add Item",
  defaultValue,
  formType,
}: ArrayFieldProps<T>): JSX.Element {
  const {
    formState: { errors },
    setValue: setFormValue,
    trigger,
  } = form;

  useEffect(() => {
    if (defaultValue) {
      setValue(defaultValue);
      if (formType === "application") {
        (setFormValue as UseFormReturn<ApplicationFormData>["setValue"])(
          name,
          defaultValue as PathValue<ApplicationFormData, ApplicationFormPaths>,
          { shouldValidate: true }
        );
      } else {
        (setFormValue as UseFormReturn<T>["setValue"])(
          name as Path<T>,
          defaultValue as PathValue<T, Path<T>>,
          { shouldValidate: true }
        );
      }
    }
  }, [defaultValue, name, setValue, setFormValue, formType]);

  const handleChange = async (
    index: number,
    newValue: string
  ): Promise<void> => {
    const newValues = [...value];
    newValues[index] = newValue;
    setValue(newValues);
    if (formType === "application") {
      (setFormValue as UseFormReturn<ApplicationFormData>["setValue"])(
        name,
        newValues as PathValue<ApplicationFormData, ApplicationFormPaths>,
        { shouldValidate: true }
      );
    } else {
      (setFormValue as UseFormReturn<T>["setValue"])(
        name as Path<T>,
        newValues as PathValue<T, Path<T>>,
        { shouldValidate: true }
      );
    }

    // Trigger validation after value update
    if (formType === "application") {
      await (trigger as UseFormReturn<ApplicationFormData>["trigger"])(name);
    } else {
      await (trigger as UseFormReturn<T>["trigger"])(name as Path<T>);
    }
  };

  const handleRemove = async (index: number): Promise<void> => {
    const newValues = [...value];
    newValues.splice(index, 1);
    setValue(newValues);
    if (formType === "application") {
      (setFormValue as UseFormReturn<ApplicationFormData>["setValue"])(
        name,
        newValues as PathValue<ApplicationFormData, ApplicationFormPaths>,
        { shouldValidate: true }
      );
    } else {
      (setFormValue as UseFormReturn<T>["setValue"])(
        name as Path<T>,
        newValues as PathValue<T, Path<T>>,
        { shouldValidate: true }
      );
    }

    // Trigger validation after value update
    if (formType === "application") {
      await (trigger as UseFormReturn<ApplicationFormData>["trigger"])(name);
    } else {
      await (trigger as UseFormReturn<T>["trigger"])(name as Path<T>);
    }
  };

  const handleAdd = async (): Promise<void> => {
    const newValues = [...value, ""];
    setValue(newValues);
    if (formType === "application") {
      (setFormValue as UseFormReturn<ApplicationFormData>["setValue"])(
        name,
        newValues as PathValue<ApplicationFormData, ApplicationFormPaths>,
        { shouldValidate: true }
      );
    } else {
      (setFormValue as UseFormReturn<T>["setValue"])(
        name as Path<T>,
        newValues as PathValue<T, Path<T>>,
        { shouldValidate: true }
      );
    }
    // Trigger validation after value update
    if (formType === "application") {
      await (trigger as UseFormReturn<ApplicationFormData>["trigger"])(name);
    } else {
      await (trigger as UseFormReturn<T>["trigger"])(name as Path<T>);
    }
  };

  const getError = (): Record<string, unknown> | undefined => {
    const parts = name.split(".");
    let currentErrors: Record<string, unknown> | undefined = errors;

    for (const part of parts) {
      if (!currentErrors || typeof currentErrors !== "object") return undefined;
      currentErrors = (currentErrors as Record<string, unknown>)[part] as
        | Record<string, unknown>
        | undefined;
    }

    return currentErrors;
  };

  const error = getError();

  return (
    <div className="array-field">
      <label className="array-field__label">
        {label}
        {required && <span className="array-field__required">*</span>}
      </label>

      <div className="array-field__items">
        {value.map((item, index) => (
          <div key={index} className="array-field__item">
            <input
              type="text"
              value={item}
              onChange={(e) => handleChange(index, e.target.value)}
              className="array-field__input"
              placeholder={placeholder}
            />
            <button
              type="button"
              className="array-field__remove"
              onClick={() => handleRemove(index)}
              disabled={value.length <= minItems}
            >
              <span className="array-field__remove-icon">×</span>
            </button>
          </div>
        ))}
      </div>

      <button type="button" onClick={handleAdd} className="array-field__add">
        {addButtonText}
      </button>

      {help && <span className="array-field__help">{help}</span>}
      {error && (
        <span className="array-field__error">{error.message as string}</span>
      )}
    </div>
  );
}
