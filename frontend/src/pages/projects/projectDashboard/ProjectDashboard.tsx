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
  const { items: projects = [], isLoading } = useAppSelector(
    (state) => state.projects
  );

  const draftProjects =
    projects?.filter((project) => project?.status === ProjectStatus.DRAFT) ||
    [];
  const activeProjects =
    projects?.filter(
      (project) => project?.status === ProjectStatus.PUBLISHED
    ) || [];
  const closedProjects =
    projects?.filter((project) => project?.status === ProjectStatus.CLOSED) ||
    [];

  useEffect(() => {
    // Redirect if not logged in
    if (!user) {
      navigate("/faculty/login");
      return;
    }

    // Fetch projects on component mount
    dispatch(fetchProfessorProjects({}));
  }, [dispatch, user, navigate]);

  if (isLoading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="project-dashboard">
      <div className="project-dashboard__header">
        <h1>My Projects</h1>
        <button
          className="btn btn--primary"
          onClick={() => navigate("/faculty/projects/new")}
        >
          <Plus size={20} />
          Create Project
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
