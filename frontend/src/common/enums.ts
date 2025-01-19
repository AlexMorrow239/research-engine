/**
 * Core application enums that represent fundamental types and states
 */

export enum ApplicationStatus {
  /** Initial state when application is submitted */
  PENDING = "PENDING",
  /** Final state when application process is complete */
  CLOSED = "CLOSED",
}

export enum ProjectStatus {
  /** Initial state when project is being created */
  DRAFT = "DRAFT",
  /** Project is visible and accepting applications */
  PUBLISHED = "PUBLISHED",
  /** Project is no longer accepting applications */
  CLOSED = "CLOSED",
}

// ... existing code ...

/**
 * Racial and ethnic group categories
 * Based on standard demographic classifications
 */
export enum RacialEthnicGroup {
  AMERICAN_INDIAN = "American Indian or Indian Alaskan",
  BLACK = "Black or African American",
  HISPANIC = "Hispanic/Latino",
  NATIVE_HAWAIIAN = "Native Hawaiian or Pacific Islander",
  WHITE = "White",
  OTHER = "Other",
}

/**
 * Citizenship status categories
 * Used for determining eligibility and requirements
 */
export enum Citizenship {
  US_CITIZEN = "US Citizen",
  PERMANENT_RESIDENT = "Permanent Resident",
  FOREIGN_STUDENT = "Foreign Student",
}

/**
 * University of Miami colleges and schools
 */
export enum College {
  ARTS_AND_SCIENCES = "College of Arts and Sciences",
  ARCHITECTURE = "School of Architecture",
  BUSINESS = "Miami Herbert Business School",
  COMMUNICATION = "School of Communication",
  EDUCATION = "School of Education & Human Development",
  ENGINEERING = "College of Engineering",
  LAW = "School of Law",
  MARINE_SCIENCE = "Rosenstiel School of Marine, Atmospheric, and Earth Science",
  MEDICINE = "Miller School of Medicine",
  MUSIC = "Frost School of Music",
  NURSING = "School of Nursing and Health Studies",
  GRAD = "The Graduate School",
}

/**
 * Weekly time commitment ranges in hours
 */
export enum WeeklyAvailability {
  ZERO_TO_FIVE = "0-5",
  SIX_TO_EIGHT = "6-8",
  NINE_TO_ELEVEN = "9-11",
  TWELVE_PLUS = "12+",
}

/**
 * Project duration in semesters
 */
export enum ProjectLength {
  ONE = "1",
  TWO = "2",
  THREE = "3",
  FOUR_PLUS = "4+",
}

/**
 * Student academic standing categories
 */
export enum AcademicStanding {
  FRESHMAN = "freshman",
  SOPHOMORE = "sophomore",
  JUNIOR = "junior",
  SENIOR = "senior",
  GRAD = "graduate",
}

export enum BannerType {
  ABOUT = "about",
  RESEARCH = "research",
}

export enum UserRole {
  STUDENT = "STUDENT",
  FACULTY = "FACULTY",
  ADMIN = "ADMIN",
}
