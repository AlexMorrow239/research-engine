import type { ProjectFiltersType } from "../domain/project";
import type { ApplicationFormData } from "../forms/application";
import type { FacultyRegistrationForm, LoginCredentials } from "../forms/auth";

export interface ProjectsRequestParams extends PaginationParams {
  filters: ProjectFiltersType;
}

export interface ApplicationSubmitRequest {
  projectId: string;
  formData: ApplicationFormData;
}

export interface AuthRequests {
  login: LoginCredentials;
  register: FacultyRegistrationForm;
}
