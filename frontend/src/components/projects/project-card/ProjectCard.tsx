import { PROJECT_STATUS_LABELS, UI_CONSTANTS } from "@/common/constants";
import { type Campus, ProjectStatus } from "@/common/enums";
import {
  formatDeadline,
  isDeadlineExpired,
  isDeadlineSoon,
} from "@/utils/dateUtils";
import { Building2, Calendar, Users } from "lucide-react";
import { memo } from "react";
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
  isSelected: boolean;
  onClick: () => void;
}

export const ProjectCard = memo(function ProjectCard({
  project,
  isSelected,
  onClick,
}: ProjectCardProps): JSX.Element {
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
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <div
      className={`project-card ${isSelected ? "card--selected" : ""}`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      aria-selected={isSelected}
    >
      <div className="project-card__header">
        <h3 className="project-card__title">{project.title}</h3>
        {project.status !== ProjectStatus.PUBLISHED && (
          <span
            className={`project-card__status project-card__status--${project.status.toLowerCase()}`}
          >
            {PROJECT_STATUS_LABELS[project.status]}
          </span>
        )}
      </div>

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
  );
});
