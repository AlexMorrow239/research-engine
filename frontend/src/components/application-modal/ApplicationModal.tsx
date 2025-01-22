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
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { AdditionalInfoStep } from "./additional-info-step/AdditionalInfo";
import "./ApplicationModal.scss";
import { AvailabilityStep } from "./availability-step/AvailabilityStep";
import { PersonalInfoStep } from "./personal-info-step/PersonalInfo";
import { ProgressStep } from "./progress-step/ProgressStep";

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
    phoneNumber: z
      .string()
      .min(1, "Phone number is required")
      .regex(
        /^\(\d{3}\) \d{3}-\d{4}$/,
        "Phone number must be in format (XXX) XXX-XXXX"
      ),
    racialEthnicGroups: z.array(z.nativeEnum(RacialEthnicGroup)).min(1),
    citizenship: z.nativeEnum(Citizenship, {
      errorMap: () => ({ message: "Please select your citizenship status" }),
    }),
    academicStanding: z.nativeEnum(AcademicStanding, {
      errorMap: () => ({ message: "Please select your academic standing" }),
    }),
    major1College: z.nativeEnum(College, {
      errorMap: () => ({ message: "Please select your college" }),
    }),
    major1: z.string().min(1, "Major is required"),
    hasAdditionalMajor: z.boolean(),
    major2College: z.nativeEnum(College).optional(),
    major2: z.string().optional(),
    isPreHealth: z.boolean(),
    preHealthTrack: z.string().optional(),
    gpa: z.coerce
      .number()
      .refine((val) => !isNaN(val), "GPA must be a valid number")
      .refine(
        (val) => val >= 0.1 && val <= 4.0,
        "GPA must be between 0 and 4.0"
      ),
    graduationDate: z
      .string()
      .min(1, "Graduation date is required")
      .refine(
        (date) => new Date(date) > new Date(),
        "Graduation date must be in the future"
      ),
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
    mondayAvailability: z.string().min(1, "Monday availability is required"),
    tuesdayAvailability: z.string().min(1, "Tuesday availability is required"),
    wednesdayAvailability: z
      .string()
      .min(1, "Wednesday availability is required"),
    thursdayAvailability: z
      .string()
      .min(1, "Thursday availability is required"),
    fridayAvailability: z.string().min(1, "Friday availability is required"),
    weeklyHours: z.nativeEnum(WeeklyAvailability, {
      errorMap: () => ({ message: "Please select your weekly availability" }),
    }),
    desiredProjectLength: z.nativeEnum(ProjectLength, {
      errorMap: () => ({
        message: "Please select your desired project length",
      }),
    }),
  }),
  additionalInfo: z.object({
    hasPrevResearchExperience: z.boolean(),
    prevResearchExperience: z
      .string()
      .optional()
      .transform((val) => val?.trim())
      .pipe(
        z
          .string()
          .min(1, "Please describe your previous research experience")
          .optional()
          .default("")
      ),
    hasFederalWorkStudy: z.boolean(),
    comfortableWithAnimals: z.boolean(),
    researchInterestDescription: z
      .string()
      .min(1, "Research interests are required"),
    speaksOtherLanguages: z.boolean(),
    additionalLanguages: z
      .array(z.string())
      .optional()
      .default([])
      .transform((val) => val?.filter((v) => v.trim()))
      .pipe(
        z
          .array(z.string())
          .min(1, "Please list at least one language")
          .optional()
          .default([])
      ),
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

    console.log("Fields to validate:", fieldsToValidate);
    const isStepValid = await form.trigger(fieldsToValidate);
    console.log("Step validation result:", isStepValid);
    console.log("Form errors:", form.formState.errors);

    if (isStepValid && currentStep < 3) {
      setCurrentStep((prev) => prev + 1);
      const modalContent = document.querySelector(".modal__content");
      if (modalContent) {
        modalContent.scrollTop = 0;
      }
    } else if (!isStepValid) {
      console.log("Validation failed, scrolling to first error");
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
    console.log("Starting form submission...");
    console.log("Form data received:", data);

    if (!projectId) {
      console.error("Project ID is missing");
      return;
    }

    try {
      console.log("Setting isSubmitting to true");
      setIsSubmitting(true);

      // Create FormData object
      const formData = new FormData();
      console.log("Created FormData object");

      // Add project ID
      formData.append("projectId", projectId);
      console.log("Project ID added:", projectId);

      // Log each section as it's being added
      console.log("Adding student info to FormData...");
      formData.append(
        "studentInfo.name.firstName",
        data.studentInfo.name.firstName
      );
      formData.append(
        "studentInfo.name.lastName",
        data.studentInfo.name.lastName
      );
      formData.append("studentInfo.cNumber", data.studentInfo.cNumber);
      formData.append("studentInfo.email", data.studentInfo.email);
      formData.append("studentInfo.phoneNumber", data.studentInfo.phoneNumber);
      formData.append(
        "studentInfo.racialEthnicGroups",
        JSON.stringify(data.studentInfo.racialEthnicGroups)
      );
      formData.append("studentInfo.citizenship", data.studentInfo.citizenship);
      formData.append(
        "studentInfo.academicStanding",
        data.studentInfo.academicStanding
      );
      formData.append(
        "studentInfo.major1College",
        data.studentInfo.major1College
      );
      formData.append("studentInfo.major1", data.studentInfo.major1);
      formData.append(
        "studentInfo.hasAdditionalMajor",
        String(data.studentInfo.hasAdditionalMajor)
      );
      formData.append(
        "studentInfo.isPreHealth",
        String(data.studentInfo.isPreHealth)
      );
      formData.append("studentInfo.gpa", String(data.studentInfo.gpa));
      formData.append(
        "studentInfo.graduationDate",
        data.studentInfo.graduationDate
      );
      formData.append("studentInfo.resume", data.studentInfo.resume);
      console.log("Student info added");

      // Add optional student info fields
      console.log("Adding optional student info...");
      if (data.studentInfo.major2College) {
        formData.append(
          "studentInfo.major2College",
          data.studentInfo.major2College
        );
      }
      if (data.studentInfo.major2) {
        formData.append("studentInfo.major2", data.studentInfo.major2);
      }
      if (data.studentInfo.preHealthTrack) {
        formData.append(
          "studentInfo.preHealthTrack",
          data.studentInfo.preHealthTrack
        );
      }
      console.log("Optional student info added");

      // Add availability info
      console.log("Adding availability info...");
      formData.append(
        "availability.mondayAvailability",
        data.availability.mondayAvailability
      );
      formData.append(
        "availability.tuesdayAvailability",
        data.availability.tuesdayAvailability
      );
      formData.append(
        "availability.wednesdayAvailability",
        data.availability.wednesdayAvailability
      );
      formData.append(
        "availability.thursdayAvailability",
        data.availability.thursdayAvailability
      );
      formData.append(
        "availability.fridayAvailability",
        data.availability.fridayAvailability
      );
      formData.append(
        "availability.weeklyHours",
        data.availability.weeklyHours
      );
      formData.append(
        "availability.desiredProjectLength",
        data.availability.desiredProjectLength
      );
      console.log("Availability info added");

      // Add additional info
      console.log("Adding additional info...");
      formData.append(
        "additionalInfo.hasPrevResearchExperience",
        String(data.additionalInfo.hasPrevResearchExperience)
      );
      formData.append(
        "additionalInfo.hasFederalWorkStudy",
        String(data.additionalInfo.hasFederalWorkStudy)
      );
      formData.append(
        "additionalInfo.comfortableWithAnimals",
        String(data.additionalInfo.comfortableWithAnimals)
      );
      formData.append(
        "additionalInfo.speaksOtherLanguages",
        String(data.additionalInfo.speaksOtherLanguages)
      );
      formData.append(
        "additionalInfo.researchInterestDescription",
        data.additionalInfo.researchInterestDescription
      );

      // Add optional additional info fields
      if (data.additionalInfo.prevResearchExperience) {
        formData.append(
          "additionalInfo.prevResearchExperience",
          data.additionalInfo.prevResearchExperience
        );
      }
      if (data.additionalInfo.additionalLanguages?.length) {
        formData.append(
          "additionalInfo.additionalLanguages",
          JSON.stringify(data.additionalInfo.additionalLanguages)
        );
      }
      console.log("Additional info added");

      // Log FormData contents (for debugging)
      console.log("Final FormData contents:");
      for (const pair of formData.entries()) {
        console.log(pair[0], pair[1]);
      }

      console.log("Dispatching createApplication action...");
      const resultAction = await dispatch(
        createApplication({ projectId, formData })
      );
      console.log("Action result:", resultAction);

      if (createApplication.fulfilled.match(resultAction)) {
        console.log("Submission successful!");
        alert("Application submitted successfully!");
        handleReset();
        onClose();
      } else {
        console.error("Submission failed:", resultAction.error);
        throw new Error(resultAction.error?.message || "Submission failed");
      }
    } catch (error) {
      console.error("Error in submission:", error);
      alert(
        "Failed to submit application: " +
          (error instanceof Error ? error.message : "An error occurred")
      );
    } finally {
      console.log("Setting isSubmitting to false");
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

          <ProgressStep currentStep={currentStep} />

          <form
            onSubmit={form.handleSubmit((data) => {
              console.log("Form submitted", data);
              void onSubmit(data);
            })}
            noValidate
          >
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
