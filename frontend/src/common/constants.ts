import { ApplicationStatus, BannerType, ProjectStatus } from "./enums";

// Application Configuration
export const APP_CONFIG = {
  name: import.meta.env.VITE_APP_NAME,
  description: import.meta.env.VITE_APP_DESCRIPTION,
  apiUrl: import.meta.env.VITE_API_URL,
} as const;

// Date & Time Constants
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

// Status Labels
export const PROJECT_STATUS_LABELS: Record<ProjectStatus, string> = {
  [ProjectStatus.DRAFT]: "Draft",
  [ProjectStatus.PUBLISHED]: "Published",
  [ProjectStatus.ARCHIVED]: "Archived",
  [ProjectStatus.CLOSED]: "Closed",
} as const;

export const APPLICATION_STATUS_LABELS: Record<ApplicationStatus, string> = {
  [ApplicationStatus.PENDING]: "Pending",
  [ApplicationStatus.CLOSED]: "Closed",
} as const;

// UI Constants
export const UI_CONSTANTS = {
  MAX_VISIBLE_CATEGORIES: 3,
  MOBILE_BREAKPOINT: 767,
} as const;

// Banner Content
export const BANNER_CONTENT: Record<
  BannerType,
  {
    title: string;
    subtitle: string;
    image: string;
  }
> = {
  [BannerType.ABOUT]: {
    title: "About Our Research Platform",
    subtitle: "Learn about our mission and the team behind the platform",
    image: "/images/banners/about-banner.jpg",
  },
  [BannerType.RESEARCH]: {
    title: "Research Opportunities",
    subtitle: "Explore and apply to research positions across campus",
    image: "/images/banners/research-banner.jpg",
  },
} as const;
