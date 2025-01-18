import { ProjectStatus, ApplicationStatus } from "@/common/enums";

export interface ApiResponse<T> {
  data: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T> {
  total: number;
  page: number;
  limit: number;
}

export interface PaginationParams {
  page: number;
  limit: number;
}

// Auth types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface FacultyRegistrationForm {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  department: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

// User types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

// Project types
export interface Project {
  id: string;
  title: string;
  description: string;
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

// Application types
export interface Application {
  id: string;
  project: string;
  studentInfo: {
    name: {
      firstName: string;
      lastName: string;
    };
    email: string;
  };
  status: ApplicationStatus;
  resumeFile: string;
  createdAt: Date;
  updatedAt: Date;
}
