export const DATE_CONSTANTS = {
  DEADLINE_WARNING_DAYS: 7,
  DATE_DISPLAY_FORMAT: {
    month: "short",
    day: "numeric",
    year: "numeric",
  } as const,
  THRESHOLDS: {
    WARNING_DAYS: 7,
    URGENT_DAYS: 3,
    DISPLAY_FORMAT: {
      month: "short",
      day: "numeric",
      year: "numeric",
    } as const,
  } as const,
} as const;
