import type { Citizenship } from "@/common/enums";

export interface ApplicationFormData {
  studentInfo: {
    name: {
      firstName: string;
      lastName: string;
    };
    cNumber: string;
    email: string;
    phoneNumber: string;
    racialEthnicGroups: string[];
    citizenship: Citizenship;
    academicStanding: "FRESHMAN" | "SOPHOMORE" | "JUNIOR" | "SENIOR";
    graduationDate: string;
    major1College: string;
    major1: string;
    hasAdditionalMajor: boolean;
    major2College?: string;
    major2?: string;
    isPreHealth: boolean;
    preHealthTrack?: string;
    gpa: number;
  };
  availability: {
    mondayAvailability: string;
    tuesdayAvailability: string;
    wednesdayAvailability: string;
    thursdayAvailability: string;
    fridayAvailability: string;
    weeklyHours: string;
    desiredProjectLength: string;
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
