import type { Campus, ProjectStatus } from "@/common/enums";
import type { BaseState } from "./common";

export interface Project {
  id: string;
  title: string;
  description: string;
  campus: Campus;
  professor: {
    id: string;
    name: {
      firstName: string;
      lastName: string;
    };
    department: string;
    email: string;
  };
  researchCategories: string[];
  requirements: string[];
  files: string[];
  status: ProjectStatus;
  positions: number;
  applicationDeadline: Date;
  isVisible: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type SortOption = {
  value: "createdAt" | "applicationDeadline";
  label: string;
  order: "asc" | "desc";
};

export interface ProjectFiltersType {
  page: number;
  limit: number;
  departments?: string[];
  campus?: string;
  status?: ProjectStatus;
  search?: string; // Search filter
  researchCategories?: string[];
  sortBy?: "createdAt" | "applicationDeadline";
  sortOrder?: "asc" | "desc";
}

export type ProjectSortOption = "newest" | "oldest" | string;

export interface ProjectsState extends BaseState {
  allProjects: Project[];
  professorProjects: Project[];
  currentProject: Project | null;
  totalProjects: number;
  filters: ProjectFiltersType;
  availableResearchCategories: string[];
  isInitialLoad?: boolean;
}
