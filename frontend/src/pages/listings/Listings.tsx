import { type Campus, type ProjectStatus } from "@/common/enums";
import { ProjectCard } from "@/components/projects/project-card/ProjectCard";
import { ProjectDetails } from "@/components/projects/project-details/ProjectDetails";
import { ProjectFilters } from "@/components/projects/project-filters/ProjectFilters";
import type { AppDispatch, RootState } from "@/store";
import {
  fetchProjects,
  setCurrentProject,
  setFilters,
} from "@/store/features/projects/projectsSlice";
import type { Project } from "@/types/api";
import { ChevronLeft } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./Listings.scss";

export default function Listings(): JSX.Element {
  const dispatch = useDispatch<AppDispatch>();
  const {
    items: projects,
    currentProject,
    isLoading,
    error,
    filters,
    totalProjects,
  } = useSelector((state: RootState) => state.projects);

  const [isMobileDetailView, setIsMobileDetailView] = useState(false);

  // Fetch projects when filters change
  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch, filters]);

  // Auto-select first project when projects are loaded
  useEffect(() => {
    if (projects.length > 0 && !currentProject) {
      dispatch(setCurrentProject(projects[0]));
    }
  }, [projects, currentProject, dispatch]);

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
  if (isLoading && !projects.length) {
    return (
      <div className="listings-page">
        <div className="loading-spinner">Loading...</div>
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
              projects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={{
                    ...project,
                    status: project.status as ProjectStatus,
                    campus: project.campus as Campus,
                  }}
                  isSelected={currentProject?.id === project.id}
                  onClick={() => handleProjectSelect(project)}
                />
              ))
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
