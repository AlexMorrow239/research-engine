import { PROJECT_STATUS_LABELS, UI_CONSTANTS } from "@/common/constants";
import { ProjectStatus } from "@/common/enums";
import {
  formatDeadline,
  isDeadlineExpired,
  isDeadlineSoon,
} from "@/utils/dateUtils";
import { Calendar, Users } from "lucide-react";
import React from "react";
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
    researchCategories: string[];
    positions: number;
    applicationDeadline?: Date;
    status: ProjectStatus;
  };
  isSelected: boolean;
  onClick: () => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  isSelected,
  onClick,
}) => {
  const getDeadlineClass = (deadline?: Date): string => {
    if (!deadline) return "";
    if (isDeadlineExpired(deadline)) return "project-card__deadline--expired";
    if (isDeadlineSoon(deadline)) return "project-card__deadline--soon";
    return "";
  };

  const getDeadlineText = (deadline?: Date): string => {
    if (!deadline) return "";
    if (isDeadlineExpired(deadline)) return "Deadline passed";
    if (isDeadlineSoon(deadline)) return "Deadline soon";
    return formatDeadline(deadline);
  };

  return (
    <div
      className={`card card--hoverable ${
        isSelected ? "card--selected" : ""
      } project-card`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
      aria-selected={isSelected}
    >
      <div className="card__content">
        {project.status !== ProjectStatus.PUBLISHED && (
          <span
            className={`project-card__status project-card__status--${project.status.toLowerCase()}`}
          >
            {PROJECT_STATUS_LABELS[project.status]}
          </span>
        )}

        <h3 className="project-card__title">{project.title}</h3>

        <div className="project-card__professor">
          {project.professor.name.firstName} {project.professor.name.lastName}
        </div>

        <div className="project-card__department">
          {project.professor.department}
        </div>

        <div className="project-card__meta">
          <span className="project-card__positions" title="Available positions">
            <Users size={16} aria-hidden="true" />
            {project.positions} position{project.positions !== 1 ? "s" : ""}
          </span>

          {project.applicationDeadline && (
            <span
              className={`project-card__deadline ${getDeadlineClass(
                project.applicationDeadline
              )}`}
              title="Application deadline"
            >
              <Calendar size={16} aria-hidden="true" />
              {getDeadlineText(project.applicationDeadline)}
            </span>
          )}
        </div>

        {project.researchCategories.length > 0 && (
          <div
            className="project-card__categories"
            aria-label="Research categories"
          >
            {project.researchCategories
              .slice(0, UI_CONSTANTS.MAX_VISIBLE_CATEGORIES)
              .map((category) => (
                <span key={category} className="project-card__category">
                  {category}
                </span>
              ))}
            {project.researchCategories.length >
              UI_CONSTANTS.MAX_VISIBLE_CATEGORIES && (
              <span
                className="project-card__category"
                title="Additional categories"
              >
                +
                {project.researchCategories.length -
                  UI_CONSTANTS.MAX_VISIBLE_CATEGORIES}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
