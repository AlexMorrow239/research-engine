import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setFilters,
  resetFilters,
} from "@/store/features/projects/projectsSlice";
import { RootState, AppDispatch } from "@/store";
import "./ProjectFilters.scss";

// You might want to move these to a constants file
const DEPARTMENTS = [
  "Computer Science",
  "Biology",
  "Chemistry",
  "Physics",
  "Psychology",
  "Engineering",
  // Add more departments as needed
];

const RESEARCH_CATEGORIES = [
  "Data Science",
  "Machine Learning",
  "Artificial Intelligence",
  "Bioinformatics",
  "Climate Science",
  "Neuroscience",
  // Add more categories as needed
];

export const ProjectFilters: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const filters = useSelector((state: RootState) => state.projects.filters);

  // Local state for search input debouncing
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

  const handleReset = () => {
    setSearchTerm("");
    dispatch(resetFilters());
  };

  return (
    <div className="project-filters">
      <div className="project-filters__search">
        <input
          type="text"
          placeholder="Search projects..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      <div className="project-filters__controls">
        <div className="filter-group">
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
        </div>

        <div className="filter-group">
          <label>Sort By</label>
          <select
            value={`${filters.sortBy}-${filters.sortOrder}`}
            onChange={handleSortChange}
          >
            <option value="createdAt-desc">Newest First</option>
            <option value="createdAt-asc">Oldest First</option>
            <option value="applicationDeadline-asc">Deadline (Soonest)</option>
            <option value="applicationDeadline-desc">Deadline (Latest)</option>
          </select>
        </div>

        <button className="btn btn--secondary" onClick={handleReset}>
          Reset Filters
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
  );
};
