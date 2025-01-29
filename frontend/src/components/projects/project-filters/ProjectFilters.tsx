import type { AppDispatch } from "@/store";
import { setFilters } from "@/store/features/projects/projectsSlice";
import { useDispatch } from "react-redux";
import { ActiveFilters } from "./components/ActiveFilters";
import { CampusSelect } from "./components/CampusSelect";
import { CategorySelect } from "./components/CategorySelect";
import { DepartmentSelect } from "./components/DepartmentSelect";
import { ResetButton } from "./components/ResetButton";
import { SearchBar } from "./components/search-bar/SearchBar";
import { SortSelect } from "./components/sort-select/SortSelect";
import "./ProjectFilters.scss";

export const ProjectFilters: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

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
  };

  return (
    <div className="project-filters">
      <SearchBar />

      <div className="project-filters__controls">
        <CampusSelect />
        <DepartmentSelect />
        <CategorySelect />
        <SortSelect />
        <ResetButton onReset={handleReset} />
      </div>

      <ActiveFilters />
    </div>
  );
};
