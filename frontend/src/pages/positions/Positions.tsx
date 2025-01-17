import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ChevronLeft } from "lucide-react";
import { Banner } from "@/common/banner/Banner";
import {
  fetchProjects,
  setCurrentProject,
  setFilters,
} from "@/store/features/projects/projectsSlice";
import { RootState, AppDispatch } from "@/store";
import "./Positions.scss";
import { ProjectCard } from "@/components/projectCard/ProjectCard";
import { ProjectDetails } from "@/components/projectDetails/ProjectDetails";
import { ProjectFilters } from "@/components/projectFilters/projectFilters";
import { Project } from "@/types/api";

export default function Positions() {
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

  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch, filters]);

  const handleProjectSelect = (project: Project) => {
    dispatch(setCurrentProject(project));
    if (window.innerWidth <= 768) {
      setIsMobileDetailView(true);
    }
  };

  const handleBackToList = () => {
    setIsMobileDetailView(false);
  };

  const handlePageChange = (page: number) => {
    dispatch(setFilters({ page }));
  };

  if (isLoading && !projects.length) {
    return (
      <div className="positions-page">
        <Banner />
        <div className="positions-content">
          <div className="loading-spinner">Loading projects...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="positions-page">
        <Banner />
        <div className="positions-content">
          <div className="error-message">Error loading projects: {error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="positions-page">
      <Banner />
      <div className="positions-content">
        <ProjectFilters />

        <div className="positions-layout">
          <div
            className={`positions-list ${
              isMobileDetailView ? "positions-list--hidden" : ""
            }`}
          >
            <div className="positions-list__header">
              <h2>Available Positions ({totalProjects})</h2>
            </div>

            <div className="positions-list__content">
              {projects.length === 0 ? (
                <div className="no-results">
                  No research positions found matching your criteria
                </div>
              ) : (
                projects.map((project) => (
                  <ProjectCard
                    key={project.id}
                    project={{
                      ...project,
                      status: project.status as
                        | "DRAFT"
                        | "PUBLISHED"
                        | "ARCHIVED",
                    }}
                    isSelected={currentProject?.id === project.id}
                    onClick={() => handleProjectSelect(project)}
                  />
                ))
              )}
            </div>

            {totalProjects > filters.limit && (
              <div className="pagination">
                <button
                  disabled={filters.page === 1}
                  onClick={() => handlePageChange(filters.page - 1)}
                >
                  Previous
                </button>
                <span>
                  Page {filters.page} of{" "}
                  {Math.ceil(totalProjects / filters.limit)}
                </span>
                <button
                  disabled={
                    filters.page === Math.ceil(totalProjects / filters.limit)
                  }
                  onClick={() => handlePageChange(filters.page + 1)}
                >
                  Next
                </button>
              </div>
            )}
          </div>

          <div
            className={`positions-detail ${
              isMobileDetailView ? "positions-detail--active" : ""
            }`}
          >
            {isMobileDetailView && (
              <button className="back-to-list" onClick={handleBackToList}>
                <ChevronLeft size={20} />
                Back to List
              </button>
            )}
            <ProjectDetails
              project={
                currentProject
                  ? {
                      ...currentProject,
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
    </div>
  );
}
