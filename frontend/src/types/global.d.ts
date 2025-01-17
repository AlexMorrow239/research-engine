import { User, Project, Application } from "./api";

export interface BaseState {
  isLoading: boolean;
  error: string | null;
}

export interface AuthState extends BaseState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

export interface ProjectsState extends BaseState {
  items: Project[];
  currentProject: Project | null;
  totalProjects: number;
  filters: {
    page: number;
    limit: number;
    department?: string;
    status?: ProjectStatus;
    search?: string;
    researchCategories?: string[];
  };
}

export interface ApplicationsState extends BaseState {
  items: Application[];
  currentApplication: Application | null;
  filters: {
    status?: ApplicationStatus;
  };
}

export interface UIState {
  modals: {
    active: ModalData | null;
  };
  toasts: Toast[];
  sidebar: {
    isOpen: boolean;
  };
  theme: "light" | "dark";
  globalLoading: boolean;
}
