import { AcademicStanding, College, Department } from "../enums";

export const COLLEGE_OPTIONS = [
  { value: College.ARTS_AND_SCIENCES, label: College.ARTS_AND_SCIENCES },
  { value: College.ARCHITECTURE, label: College.ARCHITECTURE },
  // ... rest of college options ...
] as const;

export const ACADEMIC_STANDING_OPTIONS = [
  { value: AcademicStanding.FRESHMAN, label: "Freshman" },
  { value: AcademicStanding.SOPHOMORE, label: "Sophomore" },
  // ... rest of academic standing options ...
] as const;

export const DEPARTMENT_OPTIONS = [
  { value: Department.BIOLOGY, label: Department.BIOLOGY },
  { value: Department.CHEMISTRY, label: Department.CHEMISTRY },
  // ... rest of department options ...
] as const;
