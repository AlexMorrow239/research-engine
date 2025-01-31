import { useCallback, useState } from "react";

import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import { useForm } from "react-hook-form";

import { createApplication } from "@/store/features/applications/applicationsSlice";

import { useAppDispatch } from "@/store";
import type { ApplicationFormData } from "@/types";

import { AdditionalInfoStep } from "./additional-info-step/AdditionalInfo";
import "./ApplicationModal.scss";
import { AvailabilityStep } from "./availability-step/AvailabilityStep";
import { ProgressStep } from "./progress-step/ProgressStep";
import { applicationSchema } from "./schema";
import { StudentInfoStep } from "./student-info-step/StudentInfo";

interface ApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectTitle: string;
  projectId: string;
}

export const ApplicationModal: React.FC<ApplicationModalProps> = ({
  isOpen,
  onClose,
  projectTitle,
  projectId,
}) => {
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

  type NestedPaths =
    | keyof ApplicationFormData
    | `studentInfo.${keyof ApplicationFormData["studentInfo"]}`
    | `studentInfo.name.${"firstName" | "lastName"}`
    | `availability.${keyof ApplicationFormData["availability"]}`
    | `additionalInfo.${keyof ApplicationFormData["additionalInfo"]}`;

  const handleNextStep = async (): Promise<boolean> => {
    let fieldsToValidate: NestedPaths[] = [];

    // Determine which fields to validate based on current step
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
    if (!projectId) {
      console.error("Project ID is missing");
      return;
    }

    try {
      setIsSubmitting(true);
      const formData = new FormData();

      // Create the application object that matches the backend's expected structure
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
        availability: {
          mondayAvailability: data.availability.mondayAvailability,
          tuesdayAvailability: data.availability.tuesdayAvailability,
          wednesdayAvailability: data.availability.wednesdayAvailability,
          thursdayAvailability: data.availability.thursdayAvailability,
          fridayAvailability: data.availability.fridayAvailability,
          saturdayAvailability: data.availability.saturdayAvailability,
          sundayAvailability: data.availability.sundayAvailability,
          weeklyHours: data.availability.weeklyHours,
          desiredProjectLength: data.availability.desiredProjectLength,
        },
        additionalInfo: {
          hasPrevResearchExperience:
            data.additionalInfo.hasPrevResearchExperience,
          hasFederalWorkStudy: data.additionalInfo.hasFederalWorkStudy,
          comfortableWithAnimals: data.additionalInfo.comfortableWithAnimals,
          speaksOtherLanguages: data.additionalInfo.speaksOtherLanguages,
          researchInterestDescription:
            data.additionalInfo.researchInterestDescription,
          ...(data.additionalInfo.prevResearchExperience && {
            prevResearchExperience: data.additionalInfo.prevResearchExperience,
          }),
          ...(data.additionalInfo.additionalLanguages?.length && {
            additionalLanguages: data.additionalInfo.additionalLanguages,
          }),
        },
      };

      // Add the application data as a single JSON string under the 'application' key
      formData.append("application", JSON.stringify(applicationData));

      // Add the resume file
      formData.append("resume", data.studentInfo.resume);

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
        console.error("Submission failed:", resultAction.error);
        throw new Error(resultAction.error?.message || "Submission failed");
      }
    } catch (error) {
      console.error("Error in submission:", error);
      // Error toast will be handled by error middleware
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="modal">
      <div className="modal__backdrop" aria-hidden="true" />

      <div className="modal__container">
        <DialogPanel className="modal__content">
          <div className="modal__header">
            <div className="modal__title-container">
              <DialogTitle className="modal__title">
                Research Position Application
                <span className="modal__title-project">{projectTitle}</span>
              </DialogTitle>
            </div>
            <button
              className="modal__close"
              onClick={onClose}
              aria-label="Close"
              disabled={isSubmitting}
            >
              <X size={24} />
            </button>
          </div>

          <ProgressStep currentStep={currentStep} />

          <form
            onSubmit={(e) => {
              e.preventDefault();

              return form.handleSubmit((data) => {
                return onSubmit(data);
              })(e);
            }}
            noValidate
            encType="multipart/form-data"
          >
            {currentStep === 1 && <StudentInfoStep form={form} />}
            {currentStep === 2 && <AvailabilityStep form={form} />}
            {currentStep === 3 && <AdditionalInfoStep form={form} />}

            <div className="modal__footer">
              <div>
                {currentStep > 1 && (
                  <button
                    type="button"
                    onClick={handlePreviousStep}
                    className="button button--secondary"
                    disabled={isSubmitting}
                  >
                    Previous
                  </button>
                )}
              </div>
              <div>
                {currentStep < 3 ? (
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="button button--primary"
                    disabled={isSubmitting}
                  >
                    Continue
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="button button--primary"
                    disabled={isSubmitting || !form.formState.isValid}
                  >
                    {isSubmitting ? (
                      <span className="button__content">
                        <span className="spinner" />
                        Submitting...
                      </span>
                    ) : (
                      "Submit Application"
                    )}
                  </button>
                )}
              </div>
            </div>
          </form>
        </DialogPanel>
      </div>
    </Dialog>
  );
};

export default ApplicationModal;
