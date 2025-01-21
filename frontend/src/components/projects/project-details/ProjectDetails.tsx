import { type Campus, type ProjectStatus } from "@/common/enums";
import { ApplicationModal } from "@/components/application-modal/ApplicationModal";
import { isDeadlineExpired, isDeadlineSoon } from "@/utils/dateUtils";
import { Building2, FileText, Mail, User } from "lucide-react";
import { memo, useMemo, useState } from "react";
import "./ProjectDetails.scss";

interface ProjectDetailsProps {
  project: {
    id: string;
    title: string;
    description: string;
    campus: Campus;
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

export const ProjectDetails = memo(function ProjectDetails({
  project,
}: ProjectDetailsProps): JSX.Element {
  const [isApplicationModalOpen, setIsApplicationModalOpen] = useState(false);

  const deadlineInfo = useMemo(() => {
    if (!project) return { status: null, text: "" };
    if (!project.applicationDeadline) return { status: null, text: "" };

    if (isDeadlineExpired(project.applicationDeadline)) {
      return { status: "urgent", text: "Deadline passed" };
    }

    if (isDeadlineSoon(project.applicationDeadline)) {
      return { status: "warning", text: "Deadline soon" };
    }

    return {
      status: "normal",
      text: new Date(project.applicationDeadline).toLocaleDateString(
        undefined,
        {
          month: "long",
          day: "numeric",
          year: "numeric",
        }
      ),
    };
  }, [project]);

  if (!project) {
    return (
      <div className="project-details project-details--empty">
        <p>Select a project to view details</p>
      </div>
    );
  }

  const professorName = `${project.professor.name.firstName} ${project.professor.name.lastName}`;

  return (
    <article className="project-details">
      <header className="project-details__header">
        <h2 className="project-details__title">{project.title}</h2>

        <div className="project-details__meta-grid">
          <div className="project-details__meta-item">
            <span className="label">Campus</span>
            <span className="value">
              {project.campus?.toString().replace("_", " ")}
            </span>
          </div>
          <div className="project-details__meta-item">
            <span className="label">Positions</span>
            <span className="value">
              {project.positions}{" "}
              {project.positions === 1 ? "position" : "positions"}
            </span>
          </div>

          {project.applicationDeadline && (
            <div className="project-details__meta-item">
              <span className="label">Application Deadline</span>
              <span className={`value ${deadlineInfo.status}`}>
                {deadlineInfo.text}
              </span>
            </div>
          )}
        </div>
      </header>

      <section className="project-details__professor">
        <h3>Faculty Mentor</h3>
        <div className="info">
          <User className="icon" aria-hidden="true" />
          <span className="text">{professorName}</span>

          <Building2 className="icon" aria-hidden="true" />
          <span className="text">{project.professor.department}</span>

          <Mail className="icon" aria-hidden="true" />
          <a
            href={`mailto:${project.professor.email}`}
            className="email"
            aria-label={`Email ${professorName}`}
          >
            {project.professor.email}
          </a>
        </div>
      </section>

      <section className="card__section">
        <h3>Project Description</h3>
        <p>{project.description}</p>
      </section>

      {project.requirements.length > 0 && (
        <section className="card__section">
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
      )}

      {project.researchCategories.length > 0 && (
        <section className="card__section">
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
      )}

      {project.files.length > 0 && (
        <section className="card__section">
          <h3>Additional Documents</h3>
          <ul className="project-details__files">
            {project.files.map((file) => (
              <li key={file.fileName}>
                <a
                  href={`/api/projects/files/${file.fileName}`}
                  className="file-link"
                  download
                  aria-label={`Download ${file.originalName}`}
                >
                  <FileText className="icon" aria-hidden="true" />
                  <span>{file.originalName}</span>
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}

      <footer className="project-details__apply">
        <button
          onClick={() => setIsApplicationModalOpen(true)}
          className="button button--primary"
        >
          Apply Now
        </button>
      </footer>

      <ApplicationModal
        isOpen={isApplicationModalOpen}
        onClose={() => setIsApplicationModalOpen(false)}
        projectTitle={project.title}
        projectId={project.id}
      />
    </article>
  );
});
