import { useDispatch, useSelector } from "react-redux";

import { setFilters } from "@/store/features/projects/projectsSlice";

import { FormField } from "@/components/common/form-field/FormField";

import { SORT_OPTIONS } from "@/common/constants";

import type { RootState } from "@/store";

export const SortSelect: React.FC = () => {
  const dispatch = useDispatch();
  const { sortBy, sortOrder } = useSelector(
    (state: RootState) => state.projects.filters
  );

  const handleSortChange = (
    event: React.ChangeEvent<
      HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement
    >
  ): void => {
    const [value, order] = event.target.value.split("-");
    dispatch(
      setFilters({
        sortBy: value as "createdAt" | "applicationDeadline",
        sortOrder: order as "asc" | "desc",
      })
    );
  };

  const currentValue = `${sortBy}-${sortOrder}`;

  return (
    <>
      <FormField
        formType="generic"
        name="sort"
        label="Sort By"
        options={SORT_OPTIONS.map((option) => ({
          value: `${option.value}-${option.order}`,
          label: option.label,
        }))}
        required={false}
        onChange={handleSortChange}
        value={currentValue}
      />
    </>
  );
};
