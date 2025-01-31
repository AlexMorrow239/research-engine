import type { ApplicationStatus } from "@/common/enums";

import type { BaseState } from "./common";

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

export interface ApplicationsState extends BaseState {
  items: Application[];
  currentApplication: Application | null;
  filters: {
    status?: ApplicationStatus;
  };
}
