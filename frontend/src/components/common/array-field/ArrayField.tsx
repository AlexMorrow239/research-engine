import { useEffect } from "react";
import type { Path, PathValue, UseFormReturn } from "react-hook-form";
import "./ArrayField.scss";

interface ArrayFieldProps<T extends Record<string, unknown>> {
  label: string;
  name: Path<T>;
  form: UseFormReturn<T>;
  value: string[];
  setValue: (values: string[]) => void;
  placeholder?: string;
  required?: boolean;
  help?: string;
  minItems?: number;
  addButtonText?: string;
  defaultValue?: string[];
}

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
}: ArrayFieldProps<T>): JSX.Element {
  const {
    formState: { errors },
    setValue: setFormValue,
  } = form;

  useEffect(() => {
    if (defaultValue) {
      setValue(defaultValue);
      setFormValue(name, defaultValue as PathValue<T, Path<T>>);
    }
  }, [defaultValue, name, setValue, setFormValue]);

  const handleChange = (index: number, newValue: string): void => {
    const newValues = [...value];
    newValues[index] = newValue;
    setValue(newValues);
    setFormValue(name, newValues as PathValue<T, Path<T>>);
  };

  const handleRemove = (index: number): void => {
    const newValues = [...value];
    newValues.splice(index, 1);
    setValue(newValues);
    setFormValue(name, newValues as PathValue<T, Path<T>>);
  };

  const handleAdd = (): void => {
    setValue([...value, ""]);
  };

  // Get nested error using the name path
  const error = name
    .split(".")
    .reduce<
      Record<string, unknown>
    >((obj, key) => (obj?.[key] || {}) as Record<string, unknown>, errors as Record<string, unknown>);

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
