import { type RootState } from "@/store";
import { setFilters } from "@/store/features/projects/projectsSlice";
import { X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";

interface FilterTag {
  type: "campus" | "department" | "category";
  value: string;
}

export const ActiveFilters: React.FC = () => {
  const dispatch = useDispatch();
  const filters = useSelector((state: RootState) => state.projects.filters);

  const getActiveTags = (): FilterTag[] => {
    const tags: FilterTag[] = [];
    if (filters.campus) {
      tags.push({ type: "campus", value: filters.campus });
    }
    filters.departments?.forEach((dept) => {
      tags.push({ type: "department", value: dept });
    });
    filters.researchCategories?.forEach((category) => {
      tags.push({ type: "category", value: category });
    });

    return tags;
  };

  const handleRemoveTag = (tag: FilterTag) => {
    switch (tag.type) {
      case "campus":
        dispatch(setFilters({ ...filters, campus: "" }));
        break;
      case "department":
        dispatch(
          setFilters({
            ...filters,
            departments: filters.departments?.filter(
              (dept) => dept !== tag.value
            ),
          })
        );
        break;
      case "category":
        dispatch(
          setFilters({
            ...filters,
            researchCategories: filters.researchCategories?.filter(
              (cat) => cat !== tag.value
            ),
          })
        );
        break;
    }
  };

  const activeTags = getActiveTags();

  if (activeTags.length === 0) return null;

  return (
    <div className="active-filters">
      {activeTags.map((tag, index) => (
        <div key={`${tag.type}-${tag.value}-${index}`} className="filter-tag">
          <span>{tag.value}</span>
          <button
            className="filter-tag__remove"
            onClick={() => handleRemoveTag(tag)}
            aria-label={`Remove ${tag.value} filter`}
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
};
