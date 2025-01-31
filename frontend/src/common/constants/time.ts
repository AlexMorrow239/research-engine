import { WeeklyAvailability } from "../enums";

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

export const WEEKLY_AVAILABILITY_OPTIONS = [
  { value: WeeklyAvailability.ZERO_TO_FIVE, label: "0-5 hours per week" },
  { value: WeeklyAvailability.SIX_TO_EIGHT, label: "6-8 hours per week" },
  { value: WeeklyAvailability.NINE_TO_ELEVEN, label: "9-11 hours per week" },
  { value: WeeklyAvailability.TWELVE_PLUS, label: "12+ hours per week" },
] as const;
