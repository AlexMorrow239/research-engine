import { useEffect } from "react";

import { useNavigate } from "react-router-dom";

import { LogOut, Plus, UserCog } from "lucide-react";

import { logout } from "@/store/features/auth/authSlice";
import { fetchProfessorProjects } from "@/store/features/projects/projectsSlice";

import { Loader } from "@/components/common/loader/Loader";
import { ProjectSection } from "@/components/projects/project-section/ProjectSection";

import { ProjectStatus } from "@/common/enums";

import { useAppDispatch, useAppSelector } from "@/store";

import "./ProjectDashboard.scss";

export default function ProjectDashboard(): JSX.Element {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);
  const { professorProjects = [], isLoading } = useAppSelector(
    (state) => state.projects
  );

  const handleLogout = async (): Promise<void> => {
    await dispatch(logout());
    navigate("/");
  };

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

  const refreshProjects = (): void => {
    dispatch(fetchProfessorProjects({}))
      .unwrap()
      .catch((error) => {
        console.error("Error fetching professor projects:", error);
      });
  };

  useEffect(() => {
    if (!user) {
      navigate("/faculty/login");
      return;
    }

    dispatch(fetchProfessorProjects({}))
      .unwrap()
      .catch((error) => {
        console.error("Error fetching professor projects:", error);
      });
  }, [dispatch, user, navigate]);

  if (isLoading) {
    return (
      <div className="project-dashboard project-dashboard--loading">
        <Loader size={48} center />
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
        <div className="project-dashboard__actions">
          <button
            className="btn btn--secondary btn--large"
            onClick={() => navigate("/faculty/account")}
          >
            <UserCog size={24} />
            <span>Edit Profile</span>
          </button>
          <button
            className="btn btn--secondary btn--large"
            onClick={handleLogout}
          >
            <LogOut size={24} />
            <span>Logout</span>
          </button>
          <button
            className="btn btn--primary btn--large"
            onClick={() => navigate("/faculty/projects/new")}
          >
            <Plus size={24} />
            <span>Create New Project</span>
          </button>
        </div>
      </div>

      <div className="project-dashboard__content">
        <ProjectSection
          title="Draft Projects"
          projects={draftProjects}
          status={ProjectStatus.DRAFT}
          onProjectUpdate={refreshProjects}
        />
        <ProjectSection
          title="Active Projects"
          projects={activeProjects}
          status={ProjectStatus.PUBLISHED}
          onProjectUpdate={refreshProjects}
        />
        <ProjectSection
          title="Closed Projects"
          projects={closedProjects}
          status={ProjectStatus.CLOSED}
          onProjectUpdate={refreshProjects}
        />
      </div>
    </div>
  );
}
