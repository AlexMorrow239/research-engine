import { useDebounce } from "@/hooks/useDebounce";
import { setFilters } from "@/store/features/projects/projectsSlice";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

export const SearchBar: React.FC = () => {
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 300);

  useEffect(() => {
    dispatch(setFilters({ search: debouncedSearch }));
  }, [debouncedSearch, dispatch]);

  return (
    <div className="project-filters__search">
      <Search size={16} />
      <input
        type="text"
        placeholder="Search by title, professor, or description..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        aria-label="Search projects"
      />
    </div>
  );
};
