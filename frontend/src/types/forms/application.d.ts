import type {
  AdditionalInfo,
  Availability,
  StudentInfo,
} from "../domain/application";

export interface ApplicationFormData {
  studentInfo: Omit<StudentInfo, "id"> & {
    resume: File;
  };
  availability: Availability & {
    saturdayAvailability: string;
    sundayAvailability: string;
  };
  additionalInfo: AdditionalInfo;
}
