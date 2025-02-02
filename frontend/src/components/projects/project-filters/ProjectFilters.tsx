import { useDispatch } from "react-redux";

import { RotateCcw } from "lucide-react";

import { setFilters } from "@/store/features/projects/projectsSlice";

import type { AppDispatch } from "@/store";

import { ActiveFilters } from "./components/ActiveFilters";
import { CampusSelect } from "./components/CampusSelect";
import { CategorySelect } from "./components/CategorySelect";
import { DepartmentSelect } from "./components/DepartmentSelect";
import { SearchBar } from "./components/search-bar/SearchBar";
import { SortSelect } from "./components/SortSelect";
import "./ProjectFilters.scss";

export const ProjectFilters: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  const handleReset = (): void => {
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
  };

  return (
    <div className="project-filters">
      <SearchBar />
      <div className="project-filters__controls">
        <div className="project-filters__select-group">
          <CampusSelect />
        </div>
        <div className="project-filters__select-group">
          <DepartmentSelect />
        </div>
        <div className="project-filters__select-group">
          <CategorySelect />
        </div>
        <div className="project-filters__select-group">
          <SortSelect />
        </div>
        <button
          className="project-filters__reset"
          onClick={handleReset}
          type="button"
          aria-label="Reset all filters"
        >
          <RotateCcw size={16} />
          <span>Reset</span>
        </button>
      </div>
      <ActiveFilters />
    </div>
  );
};
