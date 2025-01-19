import React, { useEffect, useState } from "react";
import { ChevronDown, RotateCcw, Search, X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  resetFilters,
  setFilters,
} from "@/store/features/projects/projectsSlice";
import type { AppDispatch, RootState } from "@/store";
import "./ProjectFilters.scss";

// Constants
const DEPARTMENTS = [
  "Computer Science",
  "Biology",
  "Chemistry",
  "Physics",
  "Psychology",
  "Engineering",
];

const RESEARCH_CATEGORIES = [
  "Data Science",
  "Machine Learning",
  "Artificial Intelligence",
  "Bioinformatics",
  "Climate Science",
  "Neuroscience",
];

const SORT_OPTIONS = [
  { value: "createdAt-desc", label: "Newest First" },
  { value: "createdAt-asc", label: "Oldest First" },
  { value: "applicationDeadline-asc", label: "Deadline (Soonest)" },
  { value: "applicationDeadline-desc", label: "Deadline (Latest)" },
];

export const ProjectFilters: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const filters = useSelector((state: RootState) => state.projects.filters);
  const [searchTerm, setSearchTerm] = useState(filters.search || "");

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm !== filters.search) {
        dispatch(setFilters({ search: searchTerm }));
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm, dispatch, filters.search]);

  const handleDepartmentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const department = e.target.value || undefined;
    dispatch(setFilters({ department }));
  };

  const handleCategoryChange = (category: string) => {
    const currentCategories = filters.researchCategories || [];
    const updatedCategories = currentCategories.includes(category)
      ? currentCategories.filter((c) => c !== category)
      : [...currentCategories, category];

    dispatch(setFilters({ researchCategories: updatedCategories }));
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const [sortBy, sortOrder] = e.target.value.split("-");
    dispatch(
      setFilters({
        sortBy: sortBy as "createdAt" | "applicationDeadline",
        sortOrder: sortOrder as "asc" | "desc",
      })
    );
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    dispatch(setFilters({ search: "" }));
  };

  const handleReset = () => {
    setSearchTerm("");
    dispatch(resetFilters());
  };

  return (
    <div className="project-filters">
      <div className="project-filters__header">
        <h2>Filter Research Positions</h2>
      </div>

      <div className="project-filters__content">
        <div className="project-filters__search">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Search by title, professor, or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button className="clear-button" onClick={handleClearSearch}>
              <X size={16} />
            </button>
          )}
        </div>

        <div className="project-filters__controls">
          <div className="project-filters__select-group">
            <label>Department</label>
            <select
              value={filters.department || ""}
              onChange={handleDepartmentChange}
            >
              <option value="">All Departments</option>
              {DEPARTMENTS.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
            <ChevronDown size={16} className="select-icon" />
          </div>

          <div className="project-filters__select-group">
            <label>Sort By</label>
            <select
              value={`${filters.sortBy}-${filters.sortOrder}`}
              onChange={handleSortChange}
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <ChevronDown size={16} className="select-icon" />
          </div>

          <button className="project-filters__reset" onClick={handleReset}>
            <RotateCcw size={16} className="reset-icon" />
            Reset
          </button>
        </div>

        <div className="project-filters__categories">
          <label>Research Categories</label>
          <div className="category-tags">
            {RESEARCH_CATEGORIES.map((category) => (
              <label
                key={category}
                className={`category-tag ${
                  filters.researchCategories?.includes(category)
                    ? "category-tag--selected"
                    : ""
                }`}
              >
                <input
                  type="checkbox"
                  checked={filters.researchCategories?.includes(category)}
                  onChange={() => handleCategoryChange(category)}
                />
                {category}
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
