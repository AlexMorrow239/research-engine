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

export interface ProjectFiltersType {
  search: string;
  status: ProjectStatus | "all";
  sort: SortOption;
  page: number;
  // campus: string;
  // departments: string[];
  // researchCategories: string[];
  // sortBy: "createdAt" | "applicationDeadline";
  // sortOrder: "asc" | "desc";
}

export type ProjectSortOption = "newest" | "oldest" | string;

export interface ProjectFiltersState extends ProjectFiltersType {
  page: number;
}

export interface ProjectsState extends BaseState {
  items: Project[];
  currentProject: Project | null;
  totalProjects: number;
  filters: {
    page: number;
    limit: number;
    departments?: string[];
    campus?: string;
    status?: ProjectStatus;
    search?: string;
    researchCategories?: string[];
    sortBy?: "createdAt" | "applicationDeadline";
    sortOrder?: "asc" | "desc";
  };
}
