import { ApplicationStatus } from "../enums";

export const APPLICATION_STATUS_OPTIONS = [
  { value: ApplicationStatus.PENDING, label: "Under Review" },
  { value: ApplicationStatus.CLOSED, label: "Completed" },
] as const;
