import type { RootState } from "@/store";
import { setFilters } from "@/store/features/projects/projectsSlice";
import type { SortOption } from "@/types";
import { useDispatch, useSelector } from "react-redux";

const SORT_OPTIONS: SortOption[] = [
  { value: "createdAt", label: "Newest First", order: "desc" },
  { value: "createdAt", label: "Oldest First", order: "asc" },
  { value: "applicationDeadline", label: "Deadline (Soonest)", order: "asc" },
  { value: "applicationDeadline", label: "Deadline (Latest)", order: "desc" },
];

export const SortSelect: React.FC = () => {
  const dispatch = useDispatch();
  const { sortBy, sortOrder } = useSelector(
    (state: RootState) => state.projects.filters
  );

  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOption = SORT_OPTIONS[event.target.selectedIndex];
    dispatch(
      setFilters({
        sortBy: selectedOption.value,
        sortOrder: selectedOption.order,
      })
    );
  };

  const currentValue = `${sortBy}-${sortOrder}`;

  return (
    <div className="project-filters__select-group">
      <label htmlFor="sort-select">Sort By</label>
      <select id="sort-select" value={currentValue} onChange={handleSortChange}>
        {SORT_OPTIONS.map((option) => (
          <option
            key={`${option.value}-${option.order}`}
            value={`${option.value}-${option.order}`}
          >
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};
