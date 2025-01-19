import {
  AcademicStanding,
  ApplicationStatus,
  BannerType,
  Citizenship,
  College,
  ProjectLength,
  ProjectStatus,
  RacialEthnicGroup,
  WeeklyAvailability,
} from "./enums";

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
  [ProjectStatus.CLOSED]: "Closed",
} as const;

export const APPLICATION_STATUS_LABELS: Record<ApplicationStatus, string> = {
  [ApplicationStatus.PENDING]: "Pending",
  [ApplicationStatus.CLOSED]: "Closed",
} as const;

// Academic & Demographic Options
export const COLLEGE_OPTIONS = [
  { value: College.ARTS_AND_SCIENCES, label: College.ARTS_AND_SCIENCES },
  { value: College.ARCHITECTURE, label: College.ARCHITECTURE },
  { value: College.BUSINESS, label: College.BUSINESS },
  { value: College.COMMUNICATION, label: College.COMMUNICATION },
  { value: College.EDUCATION, label: College.EDUCATION },
  { value: College.ENGINEERING, label: College.ENGINEERING },
  { value: College.LAW, label: College.LAW },
  { value: College.MARINE_SCIENCE, label: College.MARINE_SCIENCE },
  { value: College.MEDICINE, label: College.MEDICINE },
  { value: College.MUSIC, label: College.MUSIC },
  { value: College.NURSING, label: College.NURSING },
  { value: College.GRAD, label: College.GRAD },
] as const;

export const ACADEMIC_STANDING_OPTIONS = [
  { value: AcademicStanding.FRESHMAN, label: "Freshman" },
  { value: AcademicStanding.SOPHOMORE, label: "Sophomore" },
  { value: AcademicStanding.JUNIOR, label: "Junior" },
  { value: AcademicStanding.SENIOR, label: "Senior" },
  { value: AcademicStanding.GRAD, label: "Graduate" },
] as const;

export const CITIZENSHIP_OPTIONS = [
  { value: Citizenship.US_CITIZEN, label: Citizenship.US_CITIZEN },
  {
    value: Citizenship.PERMANENT_RESIDENT,
    label: Citizenship.PERMANENT_RESIDENT,
  },
  { value: Citizenship.FOREIGN_STUDENT, label: Citizenship.FOREIGN_STUDENT },
] as const;

export const RACIAL_ETHNIC_OPTIONS = [
  {
    value: RacialEthnicGroup.AMERICAN_INDIAN,
    label: RacialEthnicGroup.AMERICAN_INDIAN,
  },
  { value: RacialEthnicGroup.BLACK, label: RacialEthnicGroup.BLACK },
  { value: RacialEthnicGroup.HISPANIC, label: RacialEthnicGroup.HISPANIC },
  {
    value: RacialEthnicGroup.NATIVE_HAWAIIAN,
    label: RacialEthnicGroup.NATIVE_HAWAIIAN,
  },
  { value: RacialEthnicGroup.WHITE, label: RacialEthnicGroup.WHITE },
  { value: RacialEthnicGroup.OTHER, label: RacialEthnicGroup.OTHER },
] as const;

// Project Related Options
export const WEEKLY_AVAILABILITY_OPTIONS = [
  {
    value: WeeklyAvailability.ZERO_TO_FIVE,
    label: WeeklyAvailability.ZERO_TO_FIVE,
  },
  {
    value: WeeklyAvailability.SIX_TO_EIGHT,
    label: WeeklyAvailability.SIX_TO_EIGHT,
  },
  {
    value: WeeklyAvailability.NINE_TO_ELEVEN,
    label: WeeklyAvailability.NINE_TO_ELEVEN,
  },
  {
    value: WeeklyAvailability.TWELVE_PLUS,
    label: WeeklyAvailability.TWELVE_PLUS,
  },
] as const;

export const PROJECT_LENGTH_OPTIONS = [
  { value: ProjectLength.ONE, label: `${ProjectLength.ONE} semester` },
  { value: ProjectLength.TWO, label: `${ProjectLength.TWO} semesters` },
  { value: ProjectLength.THREE, label: `${ProjectLength.THREE} semesters` },
  {
    value: ProjectLength.FOUR_PLUS,
    label: `${ProjectLength.FOUR_PLUS} semesters`,
  },
] as const;

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
