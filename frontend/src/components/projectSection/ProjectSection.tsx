import React from "react";
import { Edit2, Trash2 } from "lucide-react";
import { ProjectStatus } from "@/common/enums";
import "./ProjectSection.scss";

interface ProjectSectionProps {
  title: string;
  projects: Array<{
    id: string;
    title: string;
    status: ProjectStatus;
    createdAt: Date;
  }>;
  status: ProjectStatus;
}

export const ProjectSection: React.FC<ProjectSectionProps> = ({
  title,
  projects,
}) => {
  if (!projects.length) {
    return null;
  }

  return (
    <div className="project-section">
      <h2 className="project-section__title">{title}</h2>
      <div className="project-section__list">
        {projects.map((project) => (
          <div key={project.id} className="project-card">
            <div className="project-card__content">
              <h3>{project.title}</h3>
              <span className="project-card__date">
                Created: {new Date(project.createdAt).toLocaleDateString()}
              </span>
            </div>
            <div className="project-card__actions">
              <button className="btn btn--icon" onClick={() => {}}>
                <Edit2 size={18} />
              </button>
              <button className="btn btn--icon btn--danger" onClick={() => {}}>
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
