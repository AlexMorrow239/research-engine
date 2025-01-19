/**
 * Core application enums that represent fundamental types and states
 */

export enum ApplicationStatus {
  PENDING = "PENDING",
  CLOSED = "CLOSED",
}

export enum ProjectStatus {
  DRAFT = "DRAFT",
  PUBLISHED = "PUBLISHED",
  CLOSED = "CLOSED",
  ARCHIVED = "ARCHIVED",
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
