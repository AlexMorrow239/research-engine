import type { AuthState } from "../domain/auth";
import type { ProjectsState } from "../domain/project";
import type { ApplicationsState } from "../domain/student";
import type { UIState } from "./ui";

export interface RootState {
  auth: AuthState;
  projects: ProjectsState;
  applications: ApplicationsState;
  ui: UIState;
}
