import { useEffect, useState } from "react";
import type { Path, PathValue, UseFormReturn } from "react-hook-form";
import "./SearchableDropdown.scss";

interface SearchableDropdownProps<T extends Record<string, unknown>> {
  label: string;
  name: Path<T>;
  form: UseFormReturn<T>;
  options: string[];
  required?: boolean;
  placeholder?: string;
  help?: string;
  defaultValue?: string;
}

export function SearchableDropdown<T extends Record<string, unknown>>({
  label,
  name,
  form,
  options,
  required = true,
  placeholder,
  help,
  defaultValue,
}: SearchableDropdownProps<T>): JSX.Element {
  const [search, setSearch] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  const {
    setValue,
    formState: { errors, touchedFields, submitCount },
  } = form;

  useEffect(() => {
    if (defaultValue) {
      setValue(name, defaultValue as PathValue<T, Path<T>>);
      setSearch(defaultValue);
    }
  }, [defaultValue, name, setValue]);

  const filteredOptions = options.filter((option) =>
    option.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (option: string): void => {
    setValue(name, option as PathValue<T, Path<T>>);
    setSearch(option);
    setShowDropdown(false);
  };

  // Get nested error using the name path
  const error = name
    .split(".")
    .reduce<
      Record<string, unknown>
    >((obj, key) => (obj?.[key] || {}) as Record<string, unknown>, errors as Record<string, unknown>);

  // Only show error if field was touched or form was submitted
  const touched = name
    .split(".")
    .reduce<
      Record<string, unknown>
    >((obj, key) => (obj?.[key] || {}) as Record<string, unknown>, touchedFields as Record<string, unknown>);

  const showError = error && (touched || submitCount > 0);
  return (
    <div className="searchable-dropdown">
      <label className="searchable-dropdown__label">
        {label}
        {required && <span className="searchable-dropdown__required">*</span>}
      </label>

      <div className="searchable-dropdown__container">
        <input
          type="text"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setShowDropdown(true);
          }}
          onFocus={() => setShowDropdown(true)}
          placeholder={placeholder}
          className={`searchable-dropdown__input ${
            error ? "searchable-dropdown__input--error" : ""
          }`}
        />

        {showDropdown && (
          <div className="searchable-dropdown__options">
            {filteredOptions.map((option) => (
              <div
                key={option}
                className="searchable-dropdown__option"
                onClick={() => handleSelect(option)}
              >
                {option}
              </div>
            ))}
            {filteredOptions.length === 0 && (
              <div className="searchable-dropdown__option searchable-dropdown__option--no-results">
                No options found
              </div>
            )}
          </div>
        )}
      </div>

      {help && <span className="searchable-dropdown__help">{help}</span>}
      {showError && (
        <span className="searchable-dropdown__error">
          {error.message as string}
        </span>
      )}
    </div>
  );
}
