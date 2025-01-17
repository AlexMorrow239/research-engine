import React from "react";
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

  return (
    <div className="project-details">
      <h2 className="project-details__title">{project.title}</h2>

      <div className="project-details__meta">
        <div className="project-details__professor">
          <h3>Faculty Mentor</h3>
          <p>
            {project.professor.name.firstName} {project.professor.name.lastName}
          </p>
          <p>{project.professor.department}</p>
          <a href={`mailto:${project.professor.email}`}>
            {project.professor.email}
          </a>
        </div>

        <div className="project-details__info">
          <div className="info-item">
            <span className="label">Positions Available:</span>
            <span className="value">{project.positions}</span>
          </div>
          {project.applicationDeadline && (
            <div className="info-item">
              <span className="label">Application Deadline:</span>
              <span className="value">
                {new Date(project.applicationDeadline).toLocaleDateString()}
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="project-details__section">
        <h3>Project Description</h3>
        <p>{project.description}</p>
      </div>

      <div className="project-details__section">
        <h3>Requirements</h3>
        <ul>
          {project.requirements.map((req, index) => (
            <li key={index}>{req}</li>
          ))}
        </ul>
      </div>

      <div className="project-details__section">
        <h3>Research Categories</h3>
        <div className="project-details__categories">
          {project.researchCategories.map((category) => (
            <span key={category} className="category-tag">
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
                <a href={`/api/projects/files/${file.fileName}`}>
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
  );
};
