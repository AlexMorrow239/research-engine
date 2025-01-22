import { CAMPUS_OPTIONS } from "@/common/constants";
import { Department } from "@/common/enums";
import type { AppDispatch, RootState } from "@/store";
import { setFilters } from "@/store/features/projects/projectsSlice";
import { ChevronDown, RotateCcw, Search, X } from "lucide-react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./ProjectFilters.scss";

const SORT_OPTIONS = [
  { value: "createdAt-desc", label: "Newest First" },
  { value: "createdAt-asc", label: "Oldest First" },
  { value: "applicationDeadline-asc", label: "Deadline (Soonest)" },
  { value: "applicationDeadline-desc", label: "Deadline (Latest)" },
];

export const ProjectFilters: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const filters = useSelector((state: RootState) => state.projects.filters);
  const availableCategories = useSelector(
    (state: RootState) => state.projects.availableResearchCategories
  );
  const [searchTerm, setSearchTerm] = useState(filters.search || "");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [categorySearch, setCategorySearch] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout>();
  const [isDepartmentDropdownOpen, setIsDepartmentDropdownOpen] =
    useState(false);
  const [departmentSearch, setDepartmentSearch] = useState("");
  const departmentDropdownRef = useRef<HTMLDivElement>(null);

  // Get departments from enum
  const allDepartments = Object.values(Department);

  // Separate selected and unselected departments
  const selectedDepartments = allDepartments.filter((dept) =>
    filters.departments?.includes(dept)
  );
  const unselectedDepartments = allDepartments.filter(
    (dept) => !filters.departments?.includes(dept)
  );

  // Filter departments based on search
  const filteredSelectedDepartments = selectedDepartments.filter((dept) =>
    dept.toLowerCase().includes(departmentSearch.toLowerCase())
  );
  const filteredUnselectedDepartments = unselectedDepartments.filter((dept) =>
    dept.toLowerCase().includes(departmentSearch.toLowerCase())
  );

  // Add this new handler function
  const handleDepartmentChange = (dept: string) => {
    const currentDepartments = filters.departments || [];
    const updatedDepartments = currentDepartments.includes(dept)
      ? currentDepartments.filter((d) => d !== dept)
      : [...currentDepartments, dept];

    debouncedDispatch({ departments: updatedDepartments });
  };

  // Separate selected and unselected categories
  const selectedCategories = availableCategories.filter((category) =>
    filters.researchCategories?.includes(category)
  );

  const unselectedCategories = availableCategories.filter(
    (category) => !filters.researchCategories?.includes(category)
  );

  // Filter both selected and unselected categories based on search
  const filteredSelectedCategories = selectedCategories.filter((category) =>
    category.toLowerCase().includes(categorySearch.toLowerCase())
  );

  const filteredUnselectedCategories = unselectedCategories.filter((category) =>
    category.toLowerCase().includes(categorySearch.toLowerCase())
  );

  // Debounced dispatch function for all filter changes
  const debouncedDispatch = useCallback(
    (filterChanges: Partial<typeof filters>) => {
      // Clear any existing timeout
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      // Set new timeout
      debounceTimerRef.current = setTimeout(() => {
        dispatch(setFilters(filterChanges));
      }, 300);
    },
    [dispatch]
  );

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  // Update search term handler with proper cleanup
  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      dispatch(setFilters({ search: searchTerm }));
    }, 300);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [searchTerm, dispatch]);

  // Handle click outside dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleFilterChange = (key: string, value: string | string[]) => {
    if (key === "campus" && value === "") {
      // When "All Campuses" is selected, explicitly set campus to undefined
      debouncedDispatch({ campus: undefined });
    } else {
      debouncedDispatch({ [key]: value });
    }
  };

  const handleCategoryChange = (category: string) => {
    const currentCategories = filters.researchCategories || [];
    const updatedCategories = currentCategories.includes(category)
      ? currentCategories.filter((c) => c !== category)
      : [...currentCategories, category];

    debouncedDispatch({ researchCategories: updatedCategories });
  };

  const handleSortChange = (combinedValue: string) => {
    const [sortBy, sortOrder] = combinedValue.split("-");
    debouncedDispatch({
      sortBy: sortBy as "createdAt" | "applicationDeadline",
      sortOrder: sortOrder as "asc" | "desc",
    });
  };

  const handleReset = () => {
    dispatch(
      setFilters({
        search: "",
        campus: "",
        departments: [],
        researchCategories: [],
        sortBy: "createdAt",
        sortOrder: "desc",
      })
    );
    setSearchTerm("");
    setCategorySearch("");
  };

  return (
    <div className="project-filters">
      <div className="project-filters__search">
        <Search size={16} />
        <input
          type="text"
          placeholder="Search by title, professor, or description..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="project-filters__controls">
        <div className="project-filters__select-group">
          <label>Campus</label>
          <select
            value={filters.campus || ""}
            onChange={(e) => handleFilterChange("campus", e.target.value)}
          >
            <option value="">All Campuses</option>
            {CAMPUS_OPTIONS.map((campus) => (
              <option key={campus.value} value={campus.value}>
                {campus.value}
              </option>
            ))}
          </select>
        </div>

        <div
          className="project-filters__select-group"
          ref={departmentDropdownRef}
        >
          <label>Department</label>
          <div
            className={`categories-dropdown ${isDepartmentDropdownOpen ? "categories-dropdown--open" : ""}`}
            onClick={() =>
              setIsDepartmentDropdownOpen(!isDepartmentDropdownOpen)
            }
          >
            <div className="categories-dropdown__selected">
              {filters.departments?.length
                ? `${filters.departments.length} selected`
                : "Select departments"}
              <ChevronDown size={16} className="select-icon" />
            </div>

            {isDepartmentDropdownOpen && (
              <div className="categories-dropdown__menu">
                <div className="categories-dropdown__search">
                  <Search size={14} />
                  <input
                    type="text"
                    placeholder="Search departments..."
                    value={departmentSearch}
                    onChange={(e) => setDepartmentSearch(e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
                <div className="categories-dropdown__options">
                  {filteredSelectedDepartments.length > 0 && (
                    <>
                      <div className="categories-dropdown__section-label">
                        Selected Departments
                      </div>
                      {filteredSelectedDepartments.map((dept) => (
                        <label
                          key={dept}
                          className="categories-dropdown__option categories-dropdown__option--selected"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <input
                            type="checkbox"
                            checked={true}
                            onChange={() => handleDepartmentChange(dept)}
                          />
                          {dept}
                        </label>
                      ))}
                    </>
                  )}

                  {filteredSelectedDepartments.length > 0 &&
                    filteredUnselectedDepartments.length > 0 && (
                      <div className="categories-dropdown__divider" />
                    )}

                  {filteredUnselectedDepartments.length > 0 && (
                    <>
                      {filteredSelectedDepartments.length > 0 && (
                        <div className="categories-dropdown__section-label">
                          Available Departments
                        </div>
                      )}
                      {filteredUnselectedDepartments.map((dept) => (
                        <label
                          key={dept}
                          className="categories-dropdown__option"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <input
                            type="checkbox"
                            checked={false}
                            onChange={() => handleDepartmentChange(dept)}
                          />
                          {dept}
                        </label>
                      ))}
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="project-filters__select-group" ref={dropdownRef}>
          <label>Research Categories</label>
          <div
            className={`categories-dropdown ${isDropdownOpen ? "categories-dropdown--open" : ""}`}
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <div className="categories-dropdown__selected">
              {filters.researchCategories?.length
                ? `${filters.researchCategories.length} selected`
                : availableCategories.length
                  ? "Select categories"
                  : "No categories available"}
              <ChevronDown size={16} className="select-icon" />
            </div>

            {isDropdownOpen && availableCategories.length > 0 && (
              <div className="categories-dropdown__menu">
                <div className="categories-dropdown__search">
                  <Search size={14} />
                  <input
                    type="text"
                    placeholder="Search categories..."
                    value={categorySearch}
                    onChange={(e) => setCategorySearch(e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
                <div className="categories-dropdown__options">
                  {/* Selected categories section */}
                  {filteredSelectedCategories.length > 0 && (
                    <>
                      <div className="categories-dropdown__section-label">
                        Selected Categories
                      </div>
                      {filteredSelectedCategories.map((category) => (
                        <label
                          key={category}
                          className="categories-dropdown__option categories-dropdown__option--selected"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <input
                            type="checkbox"
                            checked={true}
                            onChange={() => handleCategoryChange(category)}
                          />
                          {category}
                        </label>
                      ))}
                    </>
                  )}

                  {/* Divider if both sections have items */}
                  {filteredSelectedCategories.length > 0 &&
                    filteredUnselectedCategories.length > 0 && (
                      <div className="categories-dropdown__divider" />
                    )}

                  {/* Unselected categories section */}
                  {filteredUnselectedCategories.length > 0 && (
                    <>
                      {filteredSelectedCategories.length > 0 && (
                        <div className="categories-dropdown__section-label">
                          Available Categories
                        </div>
                      )}
                      {filteredUnselectedCategories.map((category) => (
                        <label
                          key={category}
                          className="categories-dropdown__option"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <input
                            type="checkbox"
                            checked={false}
                            onChange={() => handleCategoryChange(category)}
                          />
                          {category}
                        </label>
                      ))}
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="project-filters__select-group">
          <label>Sort By</label>
          <select
            value={`${filters.sortBy}-${filters.sortOrder}`}
            onChange={(e) => handleSortChange(e.target.value)}
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <button
          className="project-filters__reset"
          onClick={handleReset}
          type="button"
        >
          <RotateCcw size={16} />
          Reset
        </button>
      </div>

      <div className="active-filters">
        {filters.researchCategories?.map((category) => (
          <div key={category} className="filter-tag">
            {category}
            <button
              className="filter-tag__remove"
              onClick={() => handleCategoryChange(category)}
            >
              <X size={14} />
            </button>
          </div>
        ))}
        {filters.departments?.map((dept) => (
          <div key={dept} className="filter-tag">
            {dept}
            <button
              className="filter-tag__remove"
              onClick={() => handleDepartmentChange(dept)}
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
