import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
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

  // Fetch projects on mount and when filters change
  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch, filters]);

  const handleProjectSelect = (project: Project) => {
    dispatch(setCurrentProject(project));
    // On mobile, show the detail view when a project is selected
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

  // Show loading state
  if (isLoading && !projects.length) {
    return (
      <div className="positions-page">
        <Banner />
        <div className="positions-layout">
          <div className="loading-spinner">Loading projects...</div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="positions-page">
        <Banner />
        <div className="positions-layout">
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

        <div
          className={`positions-layout ${
            isMobileDetailView ? "mobile-detail-view" : ""
          }`}
        >
          <div className="positions-list">
            {projects.length === 0 ? (
              <div className="no-results">
                No research positions found matching your criteria
              </div>
            ) : (
              <>
                {projects.map((project) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    isSelected={currentProject?.id === project.id}
                    onClick={() => handleProjectSelect(project)}
                  />
                ))}

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
                        filters.page ===
                        Math.ceil(totalProjects / filters.limit)
                      }
                      onClick={() => handlePageChange(filters.page + 1)}
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </div>

          <div className="positions-detail">
            {isMobileDetailView && (
              <button className="back-to-list" onClick={handleBackToList}>
                ← Back to List
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
