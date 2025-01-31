import { Campus, ProjectLength, ProjectStatus } from "../enums";

export const PROJECT_STATUS_OPTIONS = [
  { value: ProjectStatus.DRAFT, label: "Draft" },
  { value: ProjectStatus.PUBLISHED, label: "Active" },
  { value: ProjectStatus.CLOSED, label: "Closed" },
  // Special display-only status for expired projects
  { value: ProjectStatus.PUBLISHED, label: "Expired", isExpired: true },
] as const;

export const PROJECT_LENGTH_OPTIONS = [
  { value: ProjectLength.ONE, label: "1 semester" },
  { value: ProjectLength.TWO, label: "2 semesters" },
  { value: ProjectLength.THREE, label: "3 semesters" },
  { value: ProjectLength.FOUR_PLUS, label: "4+ semesters" },
] as const;

export const CAMPUS_OPTIONS = [
  { value: Campus.CORAL_GABLES, label: "Coral Gables Campus" },
  { value: Campus.MEDICAL, label: "Miller Medical Campus" },
  { value: Campus.MARINE, label: "Rosenstiel Marine Campus" },
] as const;

// Helper function to get a user-friendly status label that considers project expiration
export const getProjectStatusLabel = (
  status: ProjectStatus,
  isExpired: boolean
): string => {
  if (status === ProjectStatus.PUBLISHED && isExpired) {
    return "Expired";
  }

  switch (status) {
    case ProjectStatus.DRAFT:
      return "Draft";
    case ProjectStatus.PUBLISHED:
      return "Active";
    case ProjectStatus.CLOSED:
      return "Closed";
    default:
      return status;
  }
};
