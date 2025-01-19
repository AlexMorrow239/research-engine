import type { ProjectStatus } from "@/common/enums";
import { Building2, FileText, Mail, User } from "lucide-react";
import React from "react";
import "./ProjectDetails.scss";

interface ProjectDetailsProps {
  project: {
    title: string;
    description: string;
    professor: {
      name: {
        firstName: string;
        lastName: string;
      };
      department: string;
      email: string;
    };
    researchCategories: string[];
    requirements: string[];
    positions: number;
    status: ProjectStatus;
    applicationDeadline?: Date;
    files: Array<{
      fileName: string;
      originalName: string;
    }>;
  } | null;
}

export const ProjectDetails: React.FC<ProjectDetailsProps> = ({
  project,
}): JSX.Element => {
  if (!project) {
    return (
      <div className="project-details project-details--empty">
        <p>Select a project to view details</p>
      </div>
    );
  }

  const isDeadlineSoon = (deadline: Date): boolean => {
    if (!deadline) return false;
    const daysUntilDeadline = Math.ceil(
      (new Date(deadline).getTime() - new Date().getTime()) / (1000 * 3600 * 24)
    );
    return daysUntilDeadline <= 7 && daysUntilDeadline > 0;
  };

  const isDeadlineExpired = (deadline: Date): boolean => {
    if (!deadline) return false;
    return new Date(deadline) < new Date();
  };

  const getDeadlineStatus = (deadline?: Date): string | null => {
    if (!deadline) return null;
    if (isDeadlineExpired(deadline)) return "urgent";
    if (isDeadlineSoon(deadline)) return "warning";
    return "normal";
  };

  const formatDeadline = (deadline: Date): string => {
    if (isDeadlineExpired(deadline)) return "Deadline passed";
    if (isDeadlineSoon(deadline)) return "Deadline soon";
    return new Date(deadline).toLocaleDateString(undefined, {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <article className="project-details">
      <div className="project-details__content">
        <header className="project-details__header">
          <h2 className="project-details__title">{project.title}</h2>

          <div className="project-details__meta-grid">
            <div className="project-details__meta-item">
              <span className="label">Available Positions</span>
              <span className="value">
                {project.positions} position{project.positions !== 1 ? "s" : ""}
              </span>
            </div>

            {project.applicationDeadline && (
              <div className="project-details__meta-item project-details__meta-item--deadline">
                <span className="label">Application Deadline</span>
                <span
                  className={`value ${getDeadlineStatus(
                    project.applicationDeadline
                  )}`}
                >
                  {formatDeadline(project.applicationDeadline)}
                </span>
              </div>
            )}
          </div>
        </header>

        <section className="project-details__professor">
          <h3>Faculty Mentor</h3>
          <div className="info">
            <User size={18} className="icon" aria-hidden="true" />
            <span className="text">
              {project.professor.name.firstName}{" "}
              {project.professor.name.lastName}
            </span>

            <Building2 size={18} className="icon" aria-hidden="true" />
            <span className="text">{project.professor.department}</span>

            <Mail size={18} className="icon" aria-hidden="true" />
            <a
              href={`mailto:${project.professor.email}`}
              className="email"
              aria-label={`Email ${project.professor.name.firstName} ${project.professor.name.lastName}`}
            >
              {project.professor.email}
            </a>
          </div>
        </section>

        <section className="project-details__section">
          <h3>Project Description</h3>
          <p>{project.description}</p>
        </section>

        <section className="project-details__section">
          <h3>Requirements</h3>
          <ul
            className="project-details__requirements"
            aria-label="Project requirements"
          >
            {project.requirements.map((req, index) => (
              <li key={index}>{req}</li>
            ))}
          </ul>
        </section>

        <section className="project-details__section">
          <h3>Research Categories</h3>
          <div
            className="project-details__categories"
            role="list"
            aria-label="Research categories"
          >
            {project.researchCategories.map((category) => (
              <span key={category} className="category" role="listitem">
                {category}
              </span>
            ))}
          </div>
        </section>

        {project.files.length > 0 && (
          <section className="project-details__section">
            <h3>Additional Documents</h3>
            <ul className="project-details__files">
              {project.files.map((file) => (
                <li key={file.fileName}>
                  <a
                    href={`/api/projects/files/${file.fileName}`}
                    className="file-link"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Download ${file.originalName}`}
                  >
                    <FileText size={18} className="icon" aria-hidden="true" />
                    <span>{file.originalName}</span>
                  </a>
                </li>
              ))}
            </ul>
          </section>
        )}

        <footer className="project-details__apply">
          <button className="btn btn--primary">Apply Now</button>
        </footer>
      </div>
    </article>
  );
};
