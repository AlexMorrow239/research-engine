import {
  AcademicStanding,
  Citizenship,
  College,
  ProjectLength,
  RacialEthnicGroup,
  WeeklyAvailability,
} from "@/common/enums";
import { useAppDispatch } from "@/store";
import { createApplication } from "@/store/features/applications/applicationsSlice";
import { type ApplicationFormData } from "@/types";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { AdditionalInfoStep } from "./additional-info-step/AdditionalInfo";
import "./ApplicationModal.scss";
import { AvailabilityStep } from "./availability-step/AvailabilityStep";
import { PersonalInfoStep } from "./personal-info-step/PersonalInfo";

interface ApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectTitle: string;
  projectId: string;
}

// Form schema based on CreateApplicationDto
const applicationSchema = z.object({
  studentInfo: z.object({
    name: z.object({
      firstName: z.string().min(2, "First name is required"),
      lastName: z.string().min(2, "Last name is required"),
    }),
    cNumber: z.string().regex(/^C[0-9]{8}$/, "Must be in format C12345678"),
    email: z.string().email("Must be a valid email address"),
    phoneNumber: z.string(),
    racialEthnicGroups: z.array(z.nativeEnum(RacialEthnicGroup)).min(1),
    citizenship: z.nativeEnum(Citizenship),
    academicStanding: z.nativeEnum(AcademicStanding),
    graduationDate: z.string(),
    major1College: z.nativeEnum(College),
    major1: z.string(),
    hasAdditionalMajor: z.boolean(),
    major2College: z.nativeEnum(College).optional(),
    major2: z.string().optional(),
    isPreHealth: z.boolean(),
    preHealthTrack: z.string().optional(),
    gpa: z.number().min(0).max(4),
  }),
  availability: z.object({
    mondayAvailability: z.string(),
    tuesdayAvailability: z.string(),
    wednesdayAvailability: z.string(),
    thursdayAvailability: z.string(),
    fridayAvailability: z.string(),
    weeklyHours: z.nativeEnum(WeeklyAvailability),
    desiredProjectLength: z.nativeEnum(ProjectLength),
  }),
  additionalInfo: z.object({
    hasPrevResearchExperience: z.boolean(),
    hasFederalWorkStudy: z.boolean(),
    speaksOtherLanguages: z.boolean(),
    comfortableWithAnimals: z.boolean(),
    prevResearchExperience: z.string().optional(),
    researchInterestDescription: z
      .string()
      .min(10, "Please provide a detailed description"),
    additionalLanguages: z.array(z.string()).optional().default([]),
  }),
}) satisfies z.ZodType<ApplicationFormData>;

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
        hasPrevResearchExperience: false,
        hasFederalWorkStudy: false,
        speaksOtherLanguages: false,
        comfortableWithAnimals: false,
        additionalLanguages: [],
        researchInterestDescription: "",
        prevResearchExperience: "",
      },
    },
  });

  const handleNextStep = async () => {
    let fieldsToValidate: (keyof ApplicationFormData)[] = [];

    switch (currentStep) {
      case 1:
        fieldsToValidate = ["studentInfo"];
        break;
      case 2:
        fieldsToValidate = ["availability"];
        break;
      case 3:
        fieldsToValidate = ["additionalInfo"];
        break;
    }

    const isStepValid = await form.trigger(fieldsToValidate);

    if (isStepValid) {
      setCurrentStep(currentStep + 1);
    } else {
      // Optionally show an error message
      alert("Please fill out all required fields correctly before proceeding.");
    }
  };

  const onSubmit = async (data: ApplicationFormData): Promise<void> => {
    if (!projectId) {
      console.error("Project ID is missing");
      return;
    }

    try {
      setIsSubmitting(true);
      console.log("Submitting application data...", data);

      const applicationData = {
        projectId,
        firstName: data.studentInfo.name.firstName,
        lastName: data.studentInfo.name.lastName,
        cNumber: data.studentInfo.cNumber,
        email: data.studentInfo.email,
        phoneNumber: data.studentInfo.phoneNumber,
        racialEthnicGroups: data.studentInfo.racialEthnicGroups,
        citizenship: data.studentInfo.citizenship,
        academicStanding: data.studentInfo.academicStanding,
        graduationDate: data.studentInfo.graduationDate,
        major1College: data.studentInfo.major1College,
        major1: data.studentInfo.major1,
        hasAdditionalMajor: data.studentInfo.hasAdditionalMajor,
        major2College: data.studentInfo.major2College,
        major2: data.studentInfo.major2,
        isPreHealth: data.studentInfo.isPreHealth,
        preHealthTrack: data.studentInfo.preHealthTrack,
        gpa: data.studentInfo.gpa,
        ...data.availability,
        ...data.additionalInfo,
      };

      const formData = new FormData();
      Object.entries(applicationData).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          value.forEach((item) => formData.append(key, item));
        } else if (value !== undefined) {
          formData.append(key, String(value));
        }
      });

      await dispatch(
        createApplication({
          projectId,
          formData,
        })
      ).unwrap();

      alert("Application submitted successfully!");
      onClose();
    } catch (error) {
      console.error("Failed to submit application:", error);
      alert("Failed to submit application. Please try again.");
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
            <DialogTitle className="modal__title">
              Apply for {projectTitle}
            </DialogTitle>
            <button
              className="modal__close"
              onClick={onClose}
              aria-label="Close"
              disabled={isSubmitting}
            >
              <X size={24} />
            </button>
          </div>

          <div className="modal__progress">
            <div
              className={`modal__progress-step ${currentStep >= 1 ? "active" : ""}`}
            >
              Personal Info
            </div>
            <div
              className={`modal__progress-step ${currentStep >= 2 ? "active" : ""}`}
            >
              Availability
            </div>
            <div
              className={`modal__progress-step ${currentStep >= 3 ? "active" : ""}`}
            >
              Additional Info
            </div>
          </div>

          <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
            {currentStep === 1 && <PersonalInfoStep form={form} />}
            {currentStep === 2 && <AvailabilityStep form={form} />}
            {currentStep === 3 && <AdditionalInfoStep form={form} />}

            <div className="modal__footer">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={() => setCurrentStep(currentStep - 1)}
                  className="button button--secondary"
                  disabled={isSubmitting}
                >
                  Previous
                </button>
              )}

              {currentStep < 3 && (
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="button button--primary"
                  disabled={isSubmitting}
                >
                  Next
                </button>
              )}

              {currentStep === 3 && (
                <button
                  type="submit"
                  className="button button--primary"
                  disabled={isSubmitting}
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
          </form>
        </DialogPanel>
      </div>
    </Dialog>
  );
};

export default ApplicationModal;
