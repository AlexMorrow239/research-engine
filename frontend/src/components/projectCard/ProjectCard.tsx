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
  };
  isSelected: boolean;
  onClick: () => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  isSelected,
  onClick,
}) => {
  return (
    <div
      className={`project-card ${isSelected ? "project-card--selected" : ""}`}
      onClick={onClick}
    >
      <h3 className="project-card__title">{project.title}</h3>
      <div className="project-card__professor">
        {project.professor.name.firstName} {project.professor.name.lastName}
      </div>
      <div className="project-card__department">
        {project.professor.department}
      </div>
      <div className="project-card__meta">
        <span className="project-card__positions">
          {project.positions} position{project.positions > 1 ? "s" : ""}
        </span>
        {project.applicationDeadline && (
          <span className="project-card__deadline">
            Deadline:{" "}
            {new Date(project.applicationDeadline).toLocaleDateString()}
          </span>
        )}
      </div>
      <div className="project-card__categories">
        {project.researchCategories.map((category) => (
          <span key={category} className="project-card__category">
            {category}
          </span>
        ))}
      </div>
    </div>
  );
};
