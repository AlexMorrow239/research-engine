import { ProjectStatus } from "@/common/enums";
import { ProjectSection } from "@/components/projects/project-section/ProjectSection";
import { useAppDispatch, useAppSelector } from "@/store";
import { fetchProfessorProjects } from "@/store/features/projects/projectsSlice";
import { Plus } from "lucide-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./ProjectDashboard.scss";

export default function ProjectDashboard(): JSX.Element {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);
  const { professorProjects = [], isLoading } = useAppSelector(
    (state) => state.projects
  );

  const draftProjects =
    professorProjects?.filter(
      (project) => project?.status === ProjectStatus.DRAFT
    ) || [];
  const activeProjects =
    professorProjects?.filter(
      (project) => project?.status === ProjectStatus.PUBLISHED
    ) || [];
  const closedProjects =
    professorProjects?.filter(
      (project) => project?.status === ProjectStatus.CLOSED
    ) || [];

  useEffect(() => {
    if (!user) {
      navigate("/faculty/login");
      return;
    }

    dispatch(fetchProfessorProjects({})).unwrap();
  }, [dispatch, user, navigate]);

  if (isLoading) {
    return (
      <div className="project-dashboard project-dashboard--loading">
        <div className="loading">Loading projects...</div>
      </div>
    );
  }

  return (
    <div className="project-dashboard">
      <div className="project-dashboard__header">
        <div className="project-dashboard__title-group">
          <h1>My Projects</h1>
          <p className="project-dashboard__subtitle">
            Manage and create research opportunities for students
          </p>
        </div>
        <button
          className="btn btn--primary btn--large"
          onClick={() => navigate("/faculty/projects/new")}
        >
          <Plus size={24} />
          <span>Create New Project</span>
        </button>
      </div>

      <div className="project-dashboard__content">
        <ProjectSection
          title="Draft Projects"
          projects={draftProjects}
          status={ProjectStatus.DRAFT}
        />
        <ProjectSection
          title="Active Projects"
          projects={activeProjects}
          status={ProjectStatus.PUBLISHED}
        />
        <ProjectSection
          title="Closed Projects"
          projects={closedProjects}
          status={ProjectStatus.CLOSED}
        />
      </div>
    </div>
  );
}
