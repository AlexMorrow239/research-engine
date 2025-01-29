import { type Campus } from "@/common/enums";
import { ProjectCard } from "@/components/projects/project-card/ProjectCard";
import { ProjectDetails } from "@/components/projects/project-details/ProjectDetails";
import { ProjectFilters } from "@/components/projects/project-filters/ProjectFilters";
import type { AppDispatch, RootState } from "@/store";
import {
  fetchProjects,
  setCurrentProject,
  setFilters,
} from "@/store/features/projects/projectsSlice";
import type { Project, ProjectsState } from "@/types";
import { isEqual } from "lodash";
import { ChevronLeft } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import "./Listings.scss";

export default function Listings(): JSX.Element {
  const dispatch = useDispatch<AppDispatch>();
  const location = useLocation();
  const navigate = useNavigate();
  const {
    allProjects: projects,
    isLoading,
    isInitialLoad,
    filters,
    error,
    totalProjects,
    currentProject,
  } = useSelector((state: RootState) => state.projects);

  const [isMobileDetailView, setIsMobileDetailView] = useState(false);

  // Combine URL params handling and fetching into a single effect
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const newFilters: Partial<ProjectsState["filters"]> = {
      search: queryParams.get("search") || undefined,
      page: parseInt(queryParams.get("page") || "1"),
    };

    // Add additional filter params
    const campusParam = queryParams.get("campus");
    if (campusParam !== null) {
      newFilters.campus = campusParam || undefined;
    }
    if (queryParams.get("departments")) {
      newFilters.departments = queryParams.get("departments")?.split(",");
    }
    if (queryParams.get("researchCategories")) {
      newFilters.researchCategories = queryParams
        .get("researchCategories")
        ?.split(",");
    }
    if (queryParams.get("sort")) {
      const [sortBy, sortOrder] = (queryParams.get("sort") || "").split("-");
      newFilters.sortBy = sortBy as "createdAt" | "applicationDeadline";
      newFilters.sortOrder = sortOrder as "asc" | "desc";
    }

    // Only dispatch if filters have actually changed
    if (!isEqual(newFilters, filters)) {
      dispatch(setFilters(newFilters));
      dispatch(fetchProjects());
    }
  }, [location.search]);

  // Effect for updating URL when filters change
  useEffect(() => {
    // Skip initial render
    if (isInitialLoad) return;

    const queryParams = new URLSearchParams();

    // Helper function to add param if it exists
    const addParamIfExists = (
      key: string,
      value: string | number | undefined
    ): void => {
      if (value !== undefined && value !== "") {
        queryParams.set(key, value.toString());
      }
    };

    // Add search parameter if it exists
    if (filters.search) {
      addParamIfExists("search", filters.search);
    }

    // Add sorting parameters
    if (filters.sortBy !== "createdAt" || filters.sortOrder !== "desc") {
      queryParams.set("sort", `${filters.sortBy}-${filters.sortOrder}`);
    }

    // Add pagination
    if (filters.page !== 1) {
      addParamIfExists("page", filters.page);
    }

    // Add campus only if it exists and isn't empty
    if (filters.campus) {
      addParamIfExists("campus", filters.campus);
    }

    // Add departments if they exist
    if (filters.departments?.length) {
      queryParams.set("departments", filters.departments.join(","));
    }

    // Add research categories if they exist
    if (filters.researchCategories?.length) {
      queryParams.set(
        "researchCategories",
        filters.researchCategories.join(",")
      );
    }

    const queryString = queryParams.toString();
    const newUrl = queryString ? `?${queryString}` : "";

    // Only update URL if it's different
    if (location.search !== newUrl) {
      navigate(newUrl, { replace: true });
    }
  }, [filters, navigate, isInitialLoad]);

  // Optimize project selection handler
  const handleProjectSelect = useCallback(
    (project: Project): void => {
      dispatch(setCurrentProject(project));
      if (window.innerWidth <= 768) {
        setIsMobileDetailView(true);
      }
    },
    [dispatch]
  );

  // Handle back to list view
  const handleBackToList = useCallback((): void => {
    setIsMobileDetailView(false);
  }, []);

  // Handle pagination
  const handlePageChange = useCallback(
    (page: number): void => {
      dispatch(setFilters({ page }));
    },
    [dispatch]
  );

  // Early return for loading state
  if (isInitialLoad || (isLoading && projects.length === 0)) {
    return (
      <div className="listings-page">
        <div className="loading">Loading projects...</div>
      </div>
    );
  }

  // Early return for error state
  if (error) {
    return (
      <div className="listings-page">
        <div className="error-message">{error}</div>
      </div>
    );
  }

  const totalPages = Math.ceil(totalProjects / filters.limit);

  return (
    <div className="listings-page">
      <ProjectFilters />

      <div className="listings-layout">
        {/* Projects List */}
        <div
          className={`listings-list ${isMobileDetailView ? "listings-list--hidden" : ""}`}
        >
          <div className="listings-list__header">
            <h2>Positions ({totalProjects})</h2>
          </div>

          <div className="listings-list__content">
            {projects.length === 0 ? (
              <div className="no-results">No matching positions found</div>
            ) : (
              projects.map((project) => {
                if (!project || !project.id) {
                  console.warn("Invalid project object:", project);
                  return null;
                }

                // Ensure campus exists
                if (!project.campus) {
                  console.warn("Project missing campus:", project);
                  return null;
                }

                return (
                  <ProjectCard
                    key={project.id}
                    project={{
                      ...project,
                      campus: project.campus as Campus,
                    }}
                    isSelected={currentProject?.id === project.id}
                    onClick={() => handleProjectSelect(project)}
                  />
                );
              })
            )}
          </div>

          {/* Pagination - only show if needed */}
          {totalPages > 1 && (
            <div className="pagination">
              <button
                disabled={filters.page === 1}
                onClick={() => handlePageChange(filters.page - 1)}
              >
                Previous
              </button>
              <span>
                {filters.page} / {totalPages}
              </span>
              <button
                disabled={filters.page === totalPages}
                onClick={() => handlePageChange(filters.page + 1)}
              >
                Next
              </button>
            </div>
          )}
        </div>

        {/* Project Details */}
        <div
          className={`listings-detail ${isMobileDetailView ? "listings-detail--active" : ""}`}
        >
          {isMobileDetailView && (
            <button className="back-to-list" onClick={handleBackToList}>
              <ChevronLeft size={18} />
              Back to List
            </button>
          )}
          <ProjectDetails
            project={
              currentProject
                ? {
                    ...currentProject,
                    campus: currentProject.campus as Campus,
                    files: currentProject.files.map((file) => ({
                      fileName: file,
                      originalName: file,
                    })),
                  }
                : null
            }
          />
        </div>
      </div>
    </div>
  );
}
