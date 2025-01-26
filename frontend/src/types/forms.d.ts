import type {
  AcademicStanding,
  Citizenship,
  College,
  ProjectLength,
  RacialEthnicGroup,
  WeeklyAvailability,
} from "@/common/enums";

export interface ApplicationFormData {
  studentInfo: {
    name: {
      firstName: string;
      lastName: string;
    };
    cNumber: string;
    email: string;
    phoneNumber: string;
    racialEthnicGroups: RacialEthnicGroup[];
    citizenship: Citizenship;
    academicStanding: AcademicStanding;
    graduationDate: string;
    major1College: College;
    major1: string;
    hasAdditionalMajor: boolean;
    major2College?: College;
    major2?: string;
    isPreHealth: boolean;
    preHealthTrack?: string;
    resume: File;
    gpa: number;
  };
  availability: {
    mondayAvailability: string;
    tuesdayAvailability: string;
    wednesdayAvailability: string;
    thursdayAvailability: string;
    fridayAvailability: string;
    saturdayAvailability: string;
    sundayAvailability: string;
    weeklyHours: WeeklyAvailability;
    desiredProjectLength: ProjectLength;
  };
  additionalInfo: {
    hasPrevResearchExperience: boolean;
    prevResearchExperience?: string;
    researchInterestDescription: string;
    hasFederalWorkStudy: boolean;
    speaksOtherLanguages: boolean;
    additionalLanguages?: string[];
    comfortableWithAnimals: boolean;
  };
}
