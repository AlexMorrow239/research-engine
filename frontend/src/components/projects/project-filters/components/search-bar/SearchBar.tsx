import type { AppDispatch } from "@/store";
import { setFilters } from "@/store/features/projects/projectsSlice";
import { Search, X } from "lucide-react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import "./SearchBar.scss";

export const SearchBar: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [searchText, setSearchText] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSearch = (e: React.FormEvent): void => {
    e.preventDefault();
    dispatch(setFilters({ search: searchText || undefined }));
  };

  const handleReset = (): void => {
    setSearchText("");
    dispatch(setFilters({ search: undefined }));
  };

  const toggleSearch = (): void => {
    setIsExpanded(!isExpanded);
    if (!isExpanded) {
      // Focus the input when expanding
      setTimeout(() => {
        document
          .querySelector<HTMLInputElement>(".project-filters__search input")
          ?.focus();
      }, 100);
    }
  };

  return (
    <form
      onSubmit={handleSearch}
      className={`project-filters__search ${isExpanded ? "expanded" : ""}`}
    >
      <button
        type="button"
        className="mobile-search-toggle"
        onClick={toggleSearch}
        aria-label="Toggle search"
      >
        <Search size={16} />
      </button>

      <div className="search-container">
        <Search size={16} className="search-icon" />
        <input
          type="text"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          placeholder="Search by title or description..."
          aria-label="Search projects"
        />
        {searchText && (
          <button
            type="button"
            className="reset-button"
            onClick={handleReset}
            aria-label="Clear search"
          >
            <X size={16} />
          </button>
        )}
        <button type="submit" className="search-button">
          Search
        </button>
      </div>
    </form>
  );
};
