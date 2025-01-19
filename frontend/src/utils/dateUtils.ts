import { DATE_CONSTANTS } from "@/common/constants";

export const isDeadlineSoon = (deadline: Date): boolean => {
  if (!deadline) return false;
  const daysUntilDeadline = Math.ceil(
    (new Date(deadline).getTime() - new Date().getTime()) / (1000 * 3600 * 24)
  );
  return (
    daysUntilDeadline <= DATE_CONSTANTS.THRESHOLDS.WARNING_DAYS &&
    daysUntilDeadline > 0
  );
};

export const isDeadlineExpired = (deadline: Date): boolean => {
  if (!deadline) return false;
  return new Date(deadline) < new Date();
};

export const formatDeadline = (deadline: Date): string => {
  if (!deadline) return "";
  return new Date(deadline).toLocaleDateString(
    undefined,
    DATE_CONSTANTS.THRESHOLDS.DISPLAY_FORMAT
  );
};
