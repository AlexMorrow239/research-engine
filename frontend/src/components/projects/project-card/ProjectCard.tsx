import { memo } from "react";

import { useSelector } from "react-redux";

import {
  Archive,
  Building2,
  Calendar,
  Pencil,
  Trash2,
  Users,
} from "lucide-react";

import { UI_CONSTANTS } from "@/common/constants";
import { type Campus, ProjectStatus } from "@/common/enums";

import { RootState } from "@/types";
import {
  formatDeadline,
  isDeadlineExpired,
  isDeadlineSoon,
} from "@/utils/dateUtils";

import "./ProjectCard.scss";

interface ProjectCardProps {
  project: {
    id: string;
    title: string;
    professor: {
      name: {
        firstName: string;
        lastName: string;
      };
      department: string;
    };
    campus: Campus;
    researchCategories: string[];
    positions: number;
    applicationDeadline?: Date;
    status: ProjectStatus;
  };
  isSelected?: boolean;
  onClick?: () => void;
  layout?: "vertical" | "horizontal";
  onEdit?: () => void;
  onDelete?: () => void;
}

export const ProjectCard = memo(function ProjectCard({
  project,
  isSelected = false,
  onClick,
  layout = "vertical",
  onEdit,
  onDelete,
}: ProjectCardProps): JSX.Element {
  const loadingProjectId = useSelector(
    (state: RootState) => state.projects.loadingProjectId
  );
  const isLoading = loadingProjectId === project.id;
  // Helper function to get deadline status
  const getDeadlineInfo = (
    deadline?: Date
  ): { className: string; text: string } => {
    if (!deadline) return { className: "", text: "" };

    if (isDeadlineExpired(deadline)) {
      return {
        className: "project-card__deadline--expired",
        text: "Deadline passed",
      };
    }

    if (isDeadlineSoon(deadline)) {
      return {
        className: "project-card__deadline--soon",
        text: "Deadline soon",
      };
    }

    return {
      className: "",
      text: formatDeadline(deadline),
    };
  };

  const deadlineInfo = getDeadlineInfo(project.applicationDeadline);
  const visibleCategories = project.researchCategories.slice(
    0,
    UI_CONSTANTS.MAX_VISIBLE_CATEGORIES
  );
  const remainingCategories =
    project.researchCategories.length - UI_CONSTANTS.MAX_VISIBLE_CATEGORIES;

  const handleKeyDown = (e: React.KeyboardEvent): void => {
    if (layout === "horizontal") return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onClick?.();
    }
  };

  const cardClassName = `project-card ${isSelected ? "card--selected" : ""} ${
    layout === "horizontal" ? "project-card--horizontal" : ""
  }`;

  return (
    <div
      className={cardClassName}
      onClick={layout === "horizontal" ? undefined : onClick}
      role={
        layout === "horizontal" ? "article" : onClick ? "button" : "article"
      }
      tabIndex={layout === "horizontal" ? undefined : onClick ? 0 : undefined}
      onKeyDown={
        layout === "horizontal"
          ? undefined
          : onClick
            ? handleKeyDown
            : undefined
      }
      aria-selected={isSelected}
    >
      <div className="project-card__content">
        <div className="project-card__title">{project.title}</div>

        <div className="project-card__professor">
          {project.professor.name.firstName} {project.professor.name.lastName}
        </div>

        <div className="project-card__department">
          {project.professor.department}
        </div>

        <div className="project-card__meta">
          <span className="project-card__campus">
            <Building2 aria-hidden="true" />
            {project.campus?.toString().replace("_", " ")}
          </span>

          <span
            className="project-card__positions"
            aria-label="Available positions"
          >
            <Users aria-hidden="true" />
            {project.positions}
          </span>

          {project.applicationDeadline && (
            <span
              className={`project-card__deadline ${deadlineInfo.className}`}
              aria-label="Application deadline"
            >
              <Calendar aria-hidden="true" />
              {deadlineInfo.text}
            </span>
          )}
        </div>

        {visibleCategories.length > 0 && (
          <div
            className="project-card__categories"
            aria-label="Research categories"
          >
            {visibleCategories.map((category) => (
              <span key={category} className="project-card__category">
                {category}
              </span>
            ))}
            {remainingCategories > 0 && (
              <span
                className="project-card__category"
                title={`${remainingCategories} more categories`}
              >
                +{remainingCategories}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Management actions for horizontal layout */}
      {layout === "horizontal" && (onEdit || onDelete) && (
        <div className="project-card__actions">
          {onEdit && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
              title="Edit project"
              className="project-card__action-btn"
              disabled={isLoading}
            >
              <Pencil aria-hidden="true" />
              <span className="sr-only">Edit project</span>
            </button>
          )}
          {onDelete && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              className="project-card__action-btn delete-btn"
              disabled={isLoading}
              title={
                project.status === ProjectStatus.PUBLISHED
                  ? "Close project"
                  : "Delete project"
              }
            >
              {isLoading ? (
                <span className="loading-spinner" aria-hidden="true" />
              ) : project.status === ProjectStatus.PUBLISHED ? (
                <Archive aria-hidden="true" />
              ) : (
                <Trash2 aria-hidden="true" />
              )}
              <span className="sr-only">
                {project.status === ProjectStatus.PUBLISHED
                  ? "Close project"
                  : "Delete project"}
              </span>
            </button>
          )}
        </div>
      )}
    </div>
  );
});
