import type { ApplicationStatus, ProjectStatus } from "@/common/enums";

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

export interface Publication {
  title: string;
  link: string;
}

export interface Professor {
  _id: string;
  email: string;
  name: {
    firstName: string;
    lastName: string;
    _id?: string; // Optional nested _id from MongoDB subdocument
  };
  department: string;
  title?: string;
  researchAreas?: string[];
  office: string;
  publications?: Publication[];
  bio?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthResponse {
  accessToken: string;
  professor: Professor;
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
