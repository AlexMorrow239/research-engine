export interface Job {
  id: number;
  title: string;
  faculty: string;
  snippet: string;
  imgUrl: string;
  labFocus: string;
  researchProjects: string;
  openPositions: string;
  researchCategory: string[];
  officeLocation: string;
  hoursPerWeek: string;
  projectLength: string;
  requiredCourses: string;
  publications: {
    title: string;
    link: string;
  }[];
  applicationDeadline: string;
}

export interface Publication {
  title: string;
  link: string;
}

export interface StudentInfo {
  name: {
    firstName: string;
    lastName: string;
  };
  email: string;
  cNumber: string;
  phoneNumber: string;
  racialEthnicGroups: string[];
  citizenship: string;
  academicStanding: string;
  graduationDate: string;
  major1College: string;
  major1: string;
  hasAdditionalMajor: boolean;
  major2College: string;
  major2: string;
  isPreHealth: boolean;
  gpa: string;
}

export interface Availability {
  mondayAvailability: string;
  tuesdayAvailability: string;
  wednesdayAvailability: string;
  thursdayAvailability: string;
  fridayAvailability: string;
  weeklyHours: string;
  desiredProjectLength: string;
}

export interface AdditionalInfo {
  hasPrevResearchExperience: boolean;
  prevResearchExperience: string;
  researchInterestDescription: string;
  hasFederalWorkStudy: boolean;
  speaksOtherLanguages: boolean;
  additionalLanguages: string[];
  comfortableWithAnimals: boolean;
}

export interface FormData {
  studentInfo: StudentInfo;
  availability: Availability;
  additionalInfo: AdditionalInfo;
  resumeFile: File | null;
}
