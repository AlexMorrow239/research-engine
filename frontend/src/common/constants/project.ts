import {
  ApplicationStatus,
  Campus,
  ProjectLength,
  ProjectStatus,
  WeeklyAvailability,
} from "../enums";

export const PROJECT_STATUS_LABELS: Record<ProjectStatus, string> = {
  [ProjectStatus.DRAFT]: "Draft",
  [ProjectStatus.PUBLISHED]: "Published",
  [ProjectStatus.CLOSED]: "Closed",
} as const;

export const APPLICATION_STATUS_LABELS: Record<ApplicationStatus, string> = {
  [ApplicationStatus.PENDING]: "Pending",
  [ApplicationStatus.CLOSED]: "Closed",
} as const;

export const WEEKLY_AVAILABILITY_OPTIONS = [
  {
    value: WeeklyAvailability.ZERO_TO_FIVE,
    label: WeeklyAvailability.ZERO_TO_FIVE,
  },
  // ... rest of availability options ...
] as const;

export const CAMPUS_OPTIONS = [
  { value: Campus.CORAL_GABLES, label: Campus.CORAL_GABLES },
  // ... rest of campus options ...
] as const;

export const PROJECT_LENGTH_OPTIONS = [
  { value: ProjectLength.ONE, label: `${ProjectLength.ONE} semester` },
  // ... rest of project length options ...
] as const;
