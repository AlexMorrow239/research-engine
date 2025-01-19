import { ProjectStatus } from "@/common/enums";
import { useAppDispatch } from "@/store";
import {
  deleteProject,
  delistProject,
} from "@/store/features/projects/projectsSlice";
import { Edit2, Trash2 } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleDelete = async (
    projectId: string,
    status: ProjectStatus
  ): Promise<void> => {
    if (status === ProjectStatus.PUBLISHED) {
      if (!window.confirm("Are you sure you want to delist this project?")) {
        return;
      }
      await dispatch(delistProject(projectId)).unwrap();
    } else {
      if (
        !window.confirm("Are you sure you want to delete this project forever?")
      ) {
        return;
      }
      await dispatch(deleteProject(projectId)).unwrap();
    }
  };

  if (!projects.length) {
    return null;
  }

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
              <button
                className="btn btn--icon"
                onClick={() => navigate(`/faculty/projects/${project.id}/edit`)}
              >
                <Edit2 size={18} />
              </button>
              <button
                className="btn btn--icon btn--danger"
                onClick={() => handleDelete(project.id, project.status)}
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
