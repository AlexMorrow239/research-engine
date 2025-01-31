import type { ApplicationFormData } from "@/types";

export const submitApplication = async (
  projectId: string,
  data: ApplicationFormData
): Promise<FormData> => {
  if (!projectId) {
    throw new Error("Project ID is missing");
  }

  const formData = new FormData();
  const applicationData = {
    studentInfo: {
      name: {
        firstName: data.studentInfo.name.firstName,
        lastName: data.studentInfo.name.lastName,
      },
      cNumber: data.studentInfo.cNumber,
      email: data.studentInfo.email,
      phoneNumber: data.studentInfo.phoneNumber,
      racialEthnicGroups: data.studentInfo.racialEthnicGroups,
      citizenship: data.studentInfo.citizenship,
      academicStanding: data.studentInfo.academicStanding,
      major1College: data.studentInfo.major1College,
      major1: data.studentInfo.major1,
      hasAdditionalMajor: data.studentInfo.hasAdditionalMajor,
      isPreHealth: data.studentInfo.isPreHealth,
      gpa: data.studentInfo.gpa,
      graduationDate: data.studentInfo.graduationDate,
      ...(data.studentInfo.major2College && {
        major2College: data.studentInfo.major2College,
      }),
      ...(data.studentInfo.major2 && { major2: data.studentInfo.major2 }),
      ...(data.studentInfo.preHealthTrack && {
        preHealthTrack: data.studentInfo.preHealthTrack,
      }),
    },
    availability: data.availability,
    additionalInfo: {
      ...data.additionalInfo,
      ...(data.additionalInfo.prevResearchExperience && {
        prevResearchExperience: data.additionalInfo.prevResearchExperience,
      }),
      ...(data.additionalInfo.additionalLanguages?.length && {
        additionalLanguages: data.additionalInfo.additionalLanguages,
      }),
    },
  };

  formData.append("application", JSON.stringify(applicationData));
  formData.append("resume", data.studentInfo.resume);

  return formData;
};
