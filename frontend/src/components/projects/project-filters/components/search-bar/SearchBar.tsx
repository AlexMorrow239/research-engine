import { useEffect, useState } from "react";

import { useDispatch } from "react-redux";

import { Search } from "lucide-react";

import { setFilters } from "@/store/features/projects/projectsSlice";

import { useDebounce } from "@/hooks/useDebounce";
import type { AppDispatch } from "@/store";

import "./SearchBar.scss";

export const SearchBar: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [searchTerm, setSearchTerm] = useState("");

  // Debounce search term to avoid too many API calls
  const debouncedSearch = useDebounce(searchTerm, 250);

  // Update filters when debounced search changes
  useEffect(() => {
    dispatch(
      setFilters({
        search: debouncedSearch.trim() || undefined,
      })
    );
  }, [debouncedSearch, dispatch]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="project-filters__search">
      <Search size={16} className="search-icon" />
      <input
        type="text"
        className="search-input"
        placeholder="Search projects..."
        value={searchTerm}
        onChange={handleInputChange}
        aria-label="Search projects"
      />
    </div>
  );
};
