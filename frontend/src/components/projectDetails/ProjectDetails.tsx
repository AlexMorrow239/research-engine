import React from "react";
import { User, Building2, Mail, FileText } from "lucide-react";
import { ProjectStatus } from "@/common/enums";
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

export const ProjectDetails: React.FC<ProjectDetailsProps> = ({ project }) => {
  if (!project) {
    return (
      <div className="project-details project-details--empty">
        <p>Select a project to view details</p>
      </div>
    );
  }

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

  const getDeadlineStatus = (deadline?: Date) => {
    if (!deadline) return null;
    if (isDeadlineExpired(deadline)) return "urgent";
    if (isDeadlineSoon(deadline)) return "warning";
    return "normal";
  };

  return (
    <div className="project-details">
      <div className="project-details__content">
        <div className="project-details__header">
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
                  {isDeadlineExpired(project.applicationDeadline)
                    ? "Deadline passed"
                    : isDeadlineSoon(project.applicationDeadline)
                    ? "Deadline soon"
                    : new Date(
                        project.applicationDeadline
                      ).toLocaleDateString()}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="project-details__professor">
          <h3>Faculty Mentor</h3>
          <div className="info">
            <User size={18} className="icon" />
            <span className="text">
              {project.professor.name.firstName}{" "}
              {project.professor.name.lastName}
            </span>

            <Building2 size={18} className="icon" />
            <span className="text">{project.professor.department}</span>

            <Mail size={18} className="icon" />
            <a href={`mailto:${project.professor.email}`} className="email">
              {project.professor.email}
            </a>
          </div>
        </div>

        <div className="project-details__section">
          <h3>Project Description</h3>
          <p>{project.description}</p>
        </div>

        <div className="project-details__section">
          <h3>Requirements</h3>
          <ul className="project-details__requirements">
            {project.requirements.map((req, index) => (
              <li key={index}>{req}</li>
            ))}
          </ul>
        </div>

        <div className="project-details__section">
          <h3>Research Categories</h3>
          <div className="project-details__categories">
            {project.researchCategories.map((category) => (
              <span key={category} className="category">
                {category}
              </span>
            ))}
          </div>
        </div>

        {project.files.length > 0 && (
          <div className="project-details__section">
            <h3>Additional Documents</h3>
            <ul className="project-details__files">
              {project.files.map((file) => (
                <li key={file.fileName}>
                  <a
                    href={`/api/projects/files/${file.fileName}`}
                    className="file-link"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FileText size={18} className="icon" />
                    {file.originalName}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

        <button className="btn btn--primary project-details__apply">
          Apply Now
        </button>
      </div>
    </div>
  );
};
