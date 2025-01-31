import { Citizenship, RacialEthnicGroup } from "../enums";

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
  // ... rest of racial/ethnic options ...
] as const;
