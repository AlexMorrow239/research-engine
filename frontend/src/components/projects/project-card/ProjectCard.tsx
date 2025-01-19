import React from "react";
import { Calendar, Users } from "lucide-react";
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
    status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  };
  isSelected: boolean;
  onClick: () => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  isSelected,
  onClick,
}) => {
  const isDeadlineSoon = (deadline: Date) => {
    if (!deadline) return false;
    const daysUntilDeadline = Math.ceil(
      (new Date(deadline).getTime() - new Date().getTime()) / (1000 * 3600 * 24)
    );
    return daysUntilDeadline <= 7 && daysUntilDeadline > 0;
  };

  const isDeadlineExpired = (deadline: Date) => {
    if (!deadline) return false;
    return new Date(deadline) < new Date();
  };

  const getDeadlineClass = (deadline?: Date) => {
    if (!deadline) return "";
    if (isDeadlineExpired(deadline)) return "project-card__deadline--expired";
    if (isDeadlineSoon(deadline)) return "project-card__deadline--soon";
    return "";
  };

  const getDeadlineText = (deadline?: Date) => {
    if (!deadline) return "";
    if (isDeadlineExpired(deadline)) return "Deadline passed";
    if (isDeadlineSoon(deadline)) return "Deadline soon";
    return new Date(deadline).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div
      className={`project-card ${isSelected ? "project-card--selected" : ""}`}
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
      {project.status !== "PUBLISHED" && (
        <span
          className={`project-card__status project-card__status--${project.status.toLowerCase()}`}
        >
          {project.status.charAt(0) + project.status.slice(1).toLowerCase()}
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
          {project.researchCategories.slice(0, 3).map((category) => (
            <span key={category} className="project-card__category">
              {category}
            </span>
          ))}
          {project.researchCategories.length > 3 && (
            <span
              className="project-card__category"
              title="Additional categories"
            >
              +{project.researchCategories.length - 3}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
