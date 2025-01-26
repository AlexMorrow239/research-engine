import { ProjectStatus } from "@/common/enums";

/**
 * Checks if a project should be considered closed based on its deadline
 */
export const isProjectExpired = (deadline: string): boolean => {
  const deadlineDate = new Date(deadline);
  const currentDate = new Date();

  // Set both dates to start of day for consistent comparison
  deadlineDate.setHours(0, 0, 0, 0);
  currentDate.setHours(0, 0, 0, 0);

  return deadlineDate < currentDate;
};

/**
 * Gets the effective status of a project, taking into account its deadline
 */
export const getEffectiveProjectStatus = (
  status: ProjectStatus,
  deadline: string
): ProjectStatus => {
  if (status === ProjectStatus.PUBLISHED && isProjectExpired(deadline)) {
    return ProjectStatus.CLOSED;
  }
  return status;
};
