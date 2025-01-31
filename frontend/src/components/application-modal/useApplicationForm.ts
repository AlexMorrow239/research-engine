import { useCallback, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type UseFormReturn } from "react-hook-form";

import { createApplication } from "@/store/features/applications/applicationsSlice";

import { useAppDispatch } from "@/store";
import type { ApplicationFormData } from "@/types";

import { submitApplication } from "./applicationSubmitService";
import { applicationSchema } from "./schema";

type NestedPaths =
  | keyof ApplicationFormData
  | `studentInfo.${keyof ApplicationFormData["studentInfo"]}`
  | `studentInfo.name.${"firstName" | "lastName"}`
  | `availability.${keyof ApplicationFormData["availability"]}`
  | `additionalInfo.${keyof ApplicationFormData["additionalInfo"]}`;

export const useApplicationForm = (
  projectId: string,
  onClose: () => void
): {
  form: UseFormReturn<ApplicationFormData>;
  currentStep: number;
  isSubmitting: boolean;
  handleNextStep: () => Promise<boolean>;
  handlePreviousStep: () => void;
  handleReset: () => void;
  onSubmit: (data: ApplicationFormData) => Promise<void>;
} => {
  const dispatch = useAppDispatch();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ApplicationFormData>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      studentInfo: {
        hasAdditionalMajor: false,
        isPreHealth: false,
      },
      additionalInfo: {
        additionalLanguages: [],
        researchInterestDescription: "",
        prevResearchExperience: "",
      },
    },
  });

  const handleNextStep = async (): Promise<boolean> => {
    let fieldsToValidate: NestedPaths[] = [];

    switch (currentStep) {
      case 1:
        fieldsToValidate = [
          "studentInfo.name.firstName",
          "studentInfo.name.lastName",
          "studentInfo.cNumber",
          "studentInfo.email",
          "studentInfo.phoneNumber",
          "studentInfo.citizenship",
          "studentInfo.academicStanding",
          "studentInfo.graduationDate",
          "studentInfo.major1College",
          "studentInfo.major1",
          "studentInfo.gpa",
          "studentInfo.racialEthnicGroups",
          "studentInfo.resume",
        ];
        break;
      case 2:
        fieldsToValidate = [
          "availability.mondayAvailability",
          "availability.tuesdayAvailability",
          "availability.wednesdayAvailability",
          "availability.thursdayAvailability",
          "availability.fridayAvailability",
          "availability.saturdayAvailability",
          "availability.sundayAvailability",
          "availability.weeklyHours",
          "availability.desiredProjectLength",
        ];
        break;
      case 3:
        fieldsToValidate = [
          "additionalInfo.hasPrevResearchExperience",
          "additionalInfo.hasFederalWorkStudy",
          "additionalInfo.speaksOtherLanguages",
          "additionalInfo.comfortableWithAnimals",
          "additionalInfo.researchInterestDescription",
        ];
        if (form.watch("additionalInfo.hasPrevResearchExperience")) {
          fieldsToValidate.push("additionalInfo.prevResearchExperience");
        }
        if (form.watch("additionalInfo.speaksOtherLanguages")) {
          fieldsToValidate.push("additionalInfo.additionalLanguages");
        }
        break;
    }

    const isStepValid = await form.trigger(fieldsToValidate);

    if (isStepValid && currentStep < 3) {
      setCurrentStep((prev) => prev + 1);
      const modalContent = document.querySelector(".modal__content");
      if (modalContent) {
        modalContent.scrollTop = 0;
      }
    } else if (!isStepValid) {
      const firstError = document.querySelector(".form-field__error");
      if (firstError) {
        firstError.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }

    return isStepValid;
  };

  const handlePreviousStep = (): void => {
    setCurrentStep((prev) => prev - 1);
  };

  const handleReset = useCallback(() => {
    setCurrentStep(1);
    form.reset();
  }, [form]);

  const onSubmit = async (data: ApplicationFormData): Promise<void> => {
    try {
      setIsSubmitting(true);
      const formData = await submitApplication(projectId, data);

      const resultAction = await dispatch(
        createApplication({
          projectId,
          applicationData: formData,
        })
      );

      if (createApplication.fulfilled.match(resultAction)) {
        handleReset();
        onClose();
      } else {
        throw new Error(resultAction.error?.message || "Submission failed");
      }
    } catch (error) {
      console.error("Error in submission:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    form,
    currentStep,
    isSubmitting,
    handleNextStep,
    handlePreviousStep,
    handleReset,
    onSubmit,
  };
};
