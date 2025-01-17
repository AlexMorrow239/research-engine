import React from "react";
import { Users, Calendar } from "lucide-react";
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

  return (
    <div
      className={`project-card ${isSelected ? "project-card--selected" : ""}`}
      onClick={onClick}
    >
      {project.status !== "PUBLISHED" && (
        <span
          className={`project-card__status project-card__status--${project.status.toLowerCase()}`}
        >
          {project.status}
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
        <span className="project-card__positions">
          <Users size={16} />
          {project.positions} position{project.positions !== 1 ? "s" : ""}
        </span>

        {project.applicationDeadline && (
          <span
            className={`project-card__deadline ${getDeadlineClass(
              project.applicationDeadline
            )}`}
          >
            <Calendar size={16} />
            {isDeadlineExpired(project.applicationDeadline)
              ? "Deadline passed"
              : isDeadlineSoon(project.applicationDeadline)
              ? "Deadline soon"
              : new Date(project.applicationDeadline).toLocaleDateString()}
          </span>
        )}
      </div>

      {project.researchCategories.length > 0 && (
        <div className="project-card__categories">
          {project.researchCategories.slice(0, 3).map((category) => (
            <span key={category} className="project-card__category">
              {category}
            </span>
          ))}
          {project.researchCategories.length > 3 && (
            <span className="project-card__category">
              +{project.researchCategories.length - 3} more
            </span>
          )}
        </div>
      )}
    </div>
  );
};
