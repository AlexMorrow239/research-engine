import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ChevronLeft } from "lucide-react";
import { Banner } from "@/components/common/banner/Banner";
import {
  fetchProjects,
  setCurrentProject,
  setFilters,
} from "@/store/features/projects/projectsSlice";
import type { AppDispatch, RootState } from "@/store";
import "./Listings.scss";
import { ProjectCard } from "@/components/projects/project-card/ProjectCard";
import { ProjectDetails } from "@/components/projects/project-details/ProjectDetails";
import { ProjectFilters } from "@/components/projects/project-filters/ProjectFilters";
import type { Project } from "@/types/api";
import { BannerType } from "@/common/enums";

export default function Listings() {
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
      <div className="listings-page">
        <Banner type={BannerType.RESEARCH} />{" "}
        <div className="listings-content">
          <div className="loading-spinner">Loading projects...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="listings-page">
        <Banner type={BannerType.RESEARCH} />{" "}
        <div className="listings-content">
          <div className="error-message">Error loading projects: {error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="listings-page">
      <Banner type={BannerType.RESEARCH} />
      <div className="listings-content">
        <ProjectFilters />

        <div className="listings-layout">
          <div
            className={`listings-list ${
              isMobileDetailView ? "listings-list--hidden" : ""
            }`}
          >
            <div className="listings-list__header">
              <h2>Available Positions ({totalProjects})</h2>
            </div>

            <div className="listings-list__content">
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
            className={`listings-detail ${
              isMobileDetailView ? "listings-detail--active" : ""
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
