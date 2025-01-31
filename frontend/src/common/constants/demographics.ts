import { Citizenship, RacialEthnicGroup } from "../enums";

export const CITIZENSHIP_OPTIONS = [
  { value: Citizenship.US_CITIZEN, label: "U.S. Citizen" },
  { value: Citizenship.PERMANENT_RESIDENT, label: "Permanent Resident" },
  { value: Citizenship.FOREIGN_STUDENT, label: "International Student" },
] as const;

export const RACIAL_ETHNIC_OPTIONS = [
  {
    value: RacialEthnicGroup.AMERICAN_INDIAN,
    label: "American Indian or Alaska Native",
  },
  { value: RacialEthnicGroup.BLACK, label: "Black or African American" },
  { value: RacialEthnicGroup.HISPANIC, label: "Hispanic/Latino" },
  {
    value: RacialEthnicGroup.NATIVE_HAWAIIAN,
    label: "Native Hawaiian or Pacific Islander",
  },
  { value: RacialEthnicGroup.WHITE, label: "White" },
  { value: RacialEthnicGroup.OTHER, label: "Other" },
] as const;
