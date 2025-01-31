import { AcademicStanding, College, Department } from "../enums";

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

export const DEPARTMENT_OPTIONS = [
  { value: Department.AEROSPACE, label: Department.AEROSPACE },
  { value: Department.ANTHROPOLOGY, label: Department.ANTHROPOLOGY },
  { value: Department.ART_HISTORY, label: Department.ART_HISTORY },
  { value: Department.BIOLOGY, label: Department.BIOLOGY },
  { value: Department.CHEMISTRY, label: Department.CHEMISTRY },
  { value: Department.CLASSICS, label: Department.CLASSICS },
  { value: Department.COMPUTER_SCIENCE, label: Department.COMPUTER_SCIENCE },
  { value: Department.ENGLISH, label: Department.ENGLISH },
  { value: Department.GEOGRAPHY, label: Department.GEOGRAPHY },
  { value: Department.HISTORY, label: Department.HISTORY },
  {
    value: Department.INTERNATIONAL_STUDIES,
    label: Department.INTERNATIONAL_STUDIES,
  },
  { value: Department.MATHEMATICS, label: Department.MATHEMATICS },
  { value: Department.MODERN_LANGUAGES, label: Department.MODERN_LANGUAGES },
  { value: Department.PHILOSOPHY, label: Department.PHILOSOPHY },
  { value: Department.PHYSICS, label: Department.PHYSICS },
  { value: Department.POLITICAL_SCIENCE, label: Department.POLITICAL_SCIENCE },
  { value: Department.PSYCHOLOGY, label: Department.PSYCHOLOGY },
  { value: Department.RELIGIOUS_STUDIES, label: Department.RELIGIOUS_STUDIES },
  { value: Department.SOCIOLOGY, label: Department.SOCIOLOGY },
  { value: Department.THEATRE, label: Department.THEATRE },
  { value: Department.WRITING, label: Department.WRITING },
] as const;
