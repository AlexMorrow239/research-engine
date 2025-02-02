import { useDispatch, useSelector } from "react-redux";

import { setFilters } from "@/store/features/projects/projectsSlice";

import { FormField } from "@/components/common/form-field/FormField";

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

  const handleCampusChange = (
    event: React.ChangeEvent<
      HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement
    >
  ): void => {
    dispatch(setFilters({ campus: event.target.value }));
  };

  return (
    <>
      <FormField
        formType="generic"
        name="campus"
        label="Campus"
        options={CAMPUS_OPTIONS}
        required={false}
        onChange={handleCampusChange}
        value={selectedCampus}
      />
    </>
  );
};
