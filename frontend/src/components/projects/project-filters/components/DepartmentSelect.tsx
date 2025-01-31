import { useState } from "react";

import { useDispatch, useSelector } from "react-redux";

import { setFilters } from "@/store/features/projects/projectsSlice";

import { Department } from "@/common/enums";

import { type RootState } from "@/store";

import { FilterDropdown } from "./FilterDropdown";

export const DepartmentSelect: React.FC = () => {
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const selectedDepartments = useSelector(
    (state: RootState) => state.projects.filters.departments
  );

  const handleToggle = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setSearchValue("");
    }
  };

  const handleSelect = (department: string) => {
    const newDepartments = selectedDepartments?.includes(department)
      ? selectedDepartments?.filter((d) => d !== department)
      : [...(selectedDepartments ?? []), department];

    dispatch(setFilters({ departments: newDepartments }));
  };

  const departmentValues = Object.values(Department);
  const filteredDepartments = departmentValues.filter((department) =>
    department.toLowerCase().includes(searchValue.toLowerCase())
  );

  const selectedItems = filteredDepartments.filter((department) =>
    selectedDepartments?.includes(department)
  );

  const unselectedItems = filteredDepartments.filter(
    (department) => !selectedDepartments?.includes(department)
  );

  return (
    <div className="project-filters__select-group">
      <label>Departments</label>
      <FilterDropdown
        isOpen={isOpen}
        selected={selectedDepartments ?? []}
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        onToggle={handleToggle}
        onSelect={handleSelect}
        selectedItems={selectedItems}
        unselectedItems={unselectedItems}
        placeholder="Select departments"
        searchPlaceholder="Search departments..."
      />
    </div>
  );
};
