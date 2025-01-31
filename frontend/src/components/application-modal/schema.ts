import { z } from "zod";

import {
  AcademicStanding,
  Citizenship,
  College,
  ProjectLength,
  RacialEthnicGroup,
  WeeklyAvailability,
} from "@/common/enums";

import type { ApplicationFormData } from "@/types";

export const applicationSchema = z.object({
  studentInfo: z.object({
    name: z.object({
      firstName: z.string().min(2, "First name is required"),
      lastName: z.string().min(2, "Last name is required"),
    }),
    cNumber: z.string().regex(/^[0-9]{8}$/, "Must be in format C12345678"),
    email: z.string().email("Must be a valid email address"),
    phoneNumber: z
      .string()
      .min(10, "Phone number must have at least 10 digits")
      .refine((val) => {
        const digitsOnly = val.replace(/\D/g, "");
        return digitsOnly.length >= 10 && digitsOnly.length <= 15;
      }, "Please enter a valid phone number with at least 10 digits"),
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
        (file) => file.size <= 5 * 1024 * 1024,
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
    saturdayAvailability: z
      .string()
      .min(1, "Saturday availability is required"),
    sundayAvailability: z.string().min(1, "Sunday availability is required"),
    weeklyHours: z.nativeEnum(WeeklyAvailability, {
      errorMap: () => ({ message: "Please select your weekly availability" }),
    }),
    desiredProjectLength: z.nativeEnum(ProjectLength, {
      errorMap: () => ({
        message: "Please select your desired project length",
      }),
    }),
  }),
  additionalInfo: z
    .object({
      hasPrevResearchExperience: z.boolean(),
      prevResearchExperience: z.string().optional(),
      hasFederalWorkStudy: z.boolean(),
      comfortableWithAnimals: z.boolean(),
      researchInterestDescription: z
        .string()
        .min(1, "Research interests are required"),
      speaksOtherLanguages: z.boolean(),
      additionalLanguages: z.array(z.string()).optional(),
    })
    .superRefine((data, ctx) => {
      if (
        data.hasPrevResearchExperience &&
        (!data.prevResearchExperience ||
          data.prevResearchExperience.trim() === "")
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Required when you have previous research experience",
          path: ["prevResearchExperience"],
        });
      }

      if (
        data.speaksOtherLanguages &&
        (!data.additionalLanguages || data.additionalLanguages.length === 0)
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Required when you speak other languages",
          path: ["additionalLanguages"],
        });
      }
    }),
}) satisfies z.ZodType<ApplicationFormData>;
