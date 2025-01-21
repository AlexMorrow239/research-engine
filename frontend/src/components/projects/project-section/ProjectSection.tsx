import { ProjectStatus } from "@/common/enums";
import { ProjectCard } from "@/components/projects/project-card/ProjectCard";
import { useAppDispatch } from "@/store";
import {
  deleteProject,
  delistProject,
} from "@/store/features/projects/projectsSlice";
import { type Project } from "@/types";
import { useNavigate } from "react-router-dom";
import "./ProjectSection.scss";

interface ProjectSectionProps {
  title: string;
  projects: Project[];
  status: ProjectStatus;
}

export function ProjectSection({
  title,
  projects,
  status,
}: ProjectSectionProps): JSX.Element {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleEdit = (projectId: string) => {
    navigate(`/faculty/projects/${projectId}/edit`);
  };

  const handleDelete = async (projectId: string) => {
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

  const handleCardClick = (projectId: string) => {
    navigate(`/faculty/projects/${projectId}`);
  };

  return (
    <section className="project-section">
      <h2 className="project-section__title">
        {title} ({projects.length})
      </h2>
      <div className="project-section__content">
        {projects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            layout="horizontal"
            onClick={() => handleCardClick(project.id)}
            onEdit={() => handleEdit(project.id)}
            onDelete={() => handleDelete(project.id)}
          />
        ))}
        {projects.length === 0 && (
          <p className="project-section__empty">
            No {status.toLowerCase()} projects
          </p>
        )}
      </div>
    </section>
  );
}
