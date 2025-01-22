import type { BaseState } from "./common";
import type { Professor } from "./professor";

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
  accessToken: string;
  professor: Professor;
}

export interface AuthState extends BaseState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}
