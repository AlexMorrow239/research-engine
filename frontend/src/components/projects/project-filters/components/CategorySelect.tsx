import { useState } from "react";

import { useDispatch, useSelector } from "react-redux";

import { setFilters } from "@/store/features/projects/projectsSlice";

import type { RootState } from "@/store";

import { FilterDropdown } from "./FilterDropdown";

export const CategorySelect: React.FC = () => {
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const selectedCategories = useSelector(
    (state: RootState) => state.projects.filters.researchCategories
  );
  const availableCategories = useSelector(
    (state: RootState) => state.projects.availableResearchCategories
  );

  const handleToggle = (): void => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setSearchValue("");
    }
  };

  const handleSelect = (category: string): void => {
    const newCategories = selectedCategories?.includes(category)
      ? selectedCategories?.filter((c) => c !== category)
      : [...(selectedCategories ?? []), category];

    dispatch(setFilters({ researchCategories: newCategories }));
  };

  const filteredCategories = availableCategories.filter((category) =>
    category.toLowerCase().includes(searchValue.toLowerCase())
  );

  const selectedItems = filteredCategories.filter((category) =>
    selectedCategories?.includes(category)
  );

  const unselectedItems = filteredCategories.filter(
    (category) => !selectedCategories?.includes(category)
  );

  return (
    <div className="project-filters__select-group">
      <label>Research Categories</label>
      <FilterDropdown
        isOpen={isOpen}
        selected={selectedCategories ?? []}
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        onToggle={handleToggle}
        onSelect={handleSelect}
        selectedItems={selectedItems}
        unselectedItems={unselectedItems}
        placeholder="Select categories"
        searchPlaceholder="Search categories..."
      />
    </div>
  );
};
