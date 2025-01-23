export interface ApplicationSchema {
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
    major1College: College;
    major1: string;
    hasAdditionalMajor: boolean;
    major2College?: College;
    major2?: string;
    isPreHealth: boolean;
    preHealthTrack?: string;
    gpa: number;
    graduationDate: string;
    resume: File;
  };
  availability: {
    mondayAvailability: string;
    tuesdayAvailability: string;
    wednesdayAvailability: string;
    thursdayAvailability: string;
    fridayAvailability: string;
    weeklyHours: WeeklyAvailability;
    desiredProjectLength: ProjectLength;
  };
  additionalInfo: {
    hasPrevResearchExperience: boolean;
    prevResearchExperience?: string;
    hasFederalWorkStudy: boolean;
    comfortableWithAnimals: boolean;
    researchInterestDescription: string;
    speaksOtherLanguages: boolean;
    additionalLanguages?: string[];
  };
}

export type DayAvailability =
  | "mondayAvailability"
  | "tuesdayAvailability"
  | "wednesdayAvailability"
  | "thursdayAvailability"
  | "fridayAvailability";
