import type { BaseState } from "../state/common";
import type { Professor } from "./professor";

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
  role: "STUDENT" | "FACULTY" | "ADMIN";
}
