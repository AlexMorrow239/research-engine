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
import { CheckCircle, X } from "lucide-react";
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
    gpa: z.coerce
      .number()
      .min(0, "GPA must be at least 0")
      .max(4, "GPA must be no more than 4"),
    resume: z
      .instanceof(File, { message: "Resume is required" })
      .refine(
        (file) => file.size <= 5 * 1024 * 1024, // 5MB limit
        "File size must be less than 5MB"
      )
      .refine(
        (file) => ["application/pdf"].includes(file.type),
        "Only PDF files are allowed"
      ),
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
    researchInterestDescription: z.string(),
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

  const handleNextStep = async (): Promise<void> => {
    const fieldsToValidate: (keyof ApplicationFormData)[] =
      currentStep === 1
        ? ["studentInfo"]
        : currentStep === 2
          ? ["availability"]
          : ["additionalInfo"];

    const isStepValid = await form.trigger(fieldsToValidate);

    if (isStepValid) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePreviousStep = (): void => {
    setCurrentStep((prev) => prev - 1);
  };

  const onSubmit = async (data: ApplicationFormData): Promise<void> => {
    if (!projectId) {
      console.error("Project ID is missing");
      return;
    }

    setIsSubmitting(true);
    try {
      // Create FormData object
      const formData = new FormData();

      // Prepare the application data
      const applicationData = {
        studentInfo: {
          name: {
            firstName: data.studentInfo.name.firstName,
            lastName: data.studentInfo.name.lastName,
          },
          email: data.studentInfo.email,
          phoneNumber: data.studentInfo.phoneNumber,
          cNumber: data.studentInfo.cNumber,
          major1: data.studentInfo.major1,
          major1College: data.studentInfo.major1College,
          academicStanding: data.studentInfo.academicStanding,
          gpa: data.studentInfo.gpa,
          graduationDate: data.studentInfo.graduationDate,
          citizenship: data.studentInfo.citizenship,
          isPreHealth: data.studentInfo.isPreHealth,
          hasAdditionalMajor: data.studentInfo.hasAdditionalMajor,
          racialEthnicGroups: data.studentInfo.racialEthnicGroups,
        },
        availability: {
          weeklyHours: data.availability.weeklyHours,
          desiredProjectLength: data.availability.desiredProjectLength,
          mondayAvailability: data.availability.mondayAvailability,
          tuesdayAvailability: data.availability.tuesdayAvailability,
          wednesdayAvailability: data.availability.wednesdayAvailability,
          thursdayAvailability: data.availability.thursdayAvailability,
          fridayAvailability: data.availability.fridayAvailability,
        },
        additionalInfo: {
          hasPrevResearchExperience:
            data.additionalInfo.hasPrevResearchExperience,
          prevResearchExperience: data.additionalInfo.prevResearchExperience,
          hasFederalWorkStudy: data.additionalInfo.hasFederalWorkStudy,
          speaksOtherLanguages: data.additionalInfo.speaksOtherLanguages,
          additionalLanguages: data.additionalInfo.additionalLanguages,
          comfortableWithAnimals: data.additionalInfo.comfortableWithAnimals,
          researchInterestDescription:
            data.additionalInfo.researchInterestDescription,
        },
      };

      // Add the application data as a JSON string
      formData.append("application", JSON.stringify(applicationData));

      // Add the resume file
      formData.append("resume", data.studentInfo.resume);

      await dispatch(
        createApplication({
          projectId,
          formData,
        })
      ).unwrap();

      onClose();
      alert("Application submitted successfully");
    } catch (error) {
      console.error("Failed to submit application:", error);
      alert(
        "Failed to submit application: " +
          (error instanceof Error ? error.message : "An error occurred")
      );
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
            <div>
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

          <div className="modal__progress">
            {[
              { number: 1, label: "Personal Info" },
              { number: 2, label: "Availability" },
              { number: 3, label: "Additional Info" },
            ].map(({ number, label }) => (
              <div
                key={number}
                className={`modal__progress-step ${
                  currentStep === number
                    ? "active"
                    : currentStep > number
                      ? "completed"
                      : ""
                }`}
              >
                <div className="modal__progress-step-number">
                  {currentStep > number ? <CheckCircle size={24} /> : number}
                </div>
                <div className="modal__progress-step-label">{label}</div>
              </div>
            ))}
          </div>

          <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
            {currentStep === 1 && <PersonalInfoStep form={form} />}
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
            </div>
          </form>
        </DialogPanel>
      </div>
    </Dialog>
  );
};

export default ApplicationModal;
