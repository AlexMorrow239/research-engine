import { useEffect, useRef } from "react";

import classNames from "classnames";
import { ChevronDown, Search } from "lucide-react";

import "./FilterDropDown.scss";

interface FilterDropdownProps {
  isOpen: boolean;
  selected: string[];
  searchValue: string;
  onSearchChange: (value: string) => void;
  onToggle: () => void;
  onSelect: (value: string) => void;
  selectedItems: string[];
  unselectedItems: string[];
  placeholder: string;
  searchPlaceholder: string;
}

export const FilterDropdown: React.FC<FilterDropdownProps> = ({
  isOpen,
  selected,
  searchValue,
  onSearchChange,
  onToggle,
  onSelect,
  selectedItems,
  unselectedItems,
  placeholder,
  searchPlaceholder,
}) => {
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent): void => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        if (isOpen) onToggle();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return (): void =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onToggle]);

  return (
    <div
      ref={dropdownRef}
      className={classNames("categories-dropdown", {
        "categories-dropdown--open": isOpen,
      })}
    >
      <div className="categories-dropdown__selected" onClick={onToggle}>
        <span>
          {selected.length ? `${selected.length} selected` : placeholder}
        </span>
        <ChevronDown className="select-icon" size={16} />
      </div>

      {isOpen && (
        <div className="categories-dropdown__menu">
          <div className="categories-dropdown__search">
            <Search size={16} />
            <input
              type="text"
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={searchPlaceholder}
              onClick={(e) => e.stopPropagation()}
            />
          </div>

          <div className="categories-dropdown__options">
            {selectedItems.length > 0 && (
              <>
                <div className="categories-dropdown__section-label">
                  Selected
                </div>
                {selectedItems.map((item) => (
                  <div
                    key={item}
                    className="categories-dropdown__option"
                    onClick={() => onSelect(item)}
                  >
                    <input type="checkbox" checked={true} onChange={() => {}} />
                    <span>{item}</span>
                  </div>
                ))}
                <div className="categories-dropdown__divider" />
              </>
            )}

            {unselectedItems.map((item) => (
              <div
                key={item}
                className="categories-dropdown__option"
                onClick={() => onSelect(item)}
              >
                <input type="checkbox" checked={false} onChange={() => {}} />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
