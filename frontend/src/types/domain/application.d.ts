import type {
  AcademicStanding,
  ApplicationStatus,
  Citizenship,
  College,
  ProjectLength,
  RacialEthnicGroup,
  WeeklyAvailability,
} from "@/common/enums";

export interface Application {
  id: string;
  projectId: string;
  studentInfo: StudentInfo;
  availability: Availability;
  additionalInfo: AdditionalInfo;
  status: ApplicationStatus;
  resumeFile: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface StudentInfo {
  name: {
    firstName: string;
    lastName: string;
  };
  email: string;
  cNumber: string;
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
}

export interface Availability {
  mondayAvailability: string;
  tuesdayAvailability: string;
  wednesdayAvailability: string;
  thursdayAvailability: string;
  fridayAvailability: string;
  saturdayAvailability: string;
  sundayAvailability: string;
  weeklyHours: WeeklyAvailability;
  desiredProjectLength: ProjectLength;
}

export interface AdditionalInfo {
  hasPrevResearchExperience: boolean;
  prevResearchExperience?: string;
  hasFederalWorkStudy: boolean;
  comfortableWithAnimals: boolean;
  researchInterestDescription: string;
  speaksOtherLanguages: boolean;
  additionalLanguages?: string[];
}
