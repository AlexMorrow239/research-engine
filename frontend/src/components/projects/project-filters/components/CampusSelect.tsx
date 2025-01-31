import { useDispatch, useSelector } from "react-redux";

import { setFilters } from "@/store/features/projects/projectsSlice";

import { Campus } from "@/common/enums";

import type { RootState } from "@/store";

const CAMPUS_OPTIONS = [
  { value: "", label: "All Campuses" },
  { value: Campus.CORAL_GABLES, label: "Coral Gables Campus" },
  { value: Campus.MEDICAL, label: "Miller Med Campus" },
  { value: Campus.MARINE, label: "Rosenstiel Marine Campus" },
];

export const CampusSelect: React.FC = () => {
  const dispatch = useDispatch();
  const selectedCampus = useSelector(
    (state: RootState) => state.projects.filters.campus
  );

  const handleCampusChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(setFilters({ campus: event.target.value }));
  };

  return (
    <div className="project-filters__select-group">
      <label htmlFor="campus-select">Campus</label>
      <select
        id="campus-select"
        value={selectedCampus}
        onChange={handleCampusChange}
      >
        {CAMPUS_OPTIONS.map(({ value, label }) => (
          <option key={value || "all"} value={value}>
            {label}
          </option>
        ))}
      </select>
    </div>
  );
};
