import { z } from "zod";

import { Campus, ProjectStatus } from "@/common/enums";

import type { Project } from "@/types";

// Base schemas for reusable patterns
const titleSchema = z
  .string()
  .min(10, "Title must be at least 10 characters")
  .max(100, "Title must not exceed 100 characters");

const descriptionSchema = z
  .string()
  .min(50, "Description must be at least 50 characters")
  .max(2000, "Description must not exceed 2000 characters");

const positionsSchema = z
  .number()
  .int("Must be a whole number")
  .min(1, "Must have at least 1 position")
  .max(10, "Cannot exceed 10 positions");

const dateSchema = z.coerce.string().refine((date) => {
  const selectedDate = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return selectedDate >= today;
}, "Application deadline must be today or a future date");

const researchCategoriesSchema = z
  .array(z.string())
  .min(1, "At least one research category is required")
  .refine((categories) => categories.every((cat) => cat.trim() !== ""), {
    message: "Research categories cannot be empty",
  });

const requirementsSchema = z
  .array(z.string())
  .optional()
  .default([])
  .transform((requirements) =>
    // If there's only one empty string, treat it as empty array
    requirements.length === 1 && requirements[0].trim() === ""
      ? []
      : requirements
  )
  .refine((requirements) => requirements.every((req) => req.trim() !== ""), {
    message: "Requirements cannot be empty",
  });

// Project form schema
export const projectSchema = z.object({
  title: titleSchema,
  description: descriptionSchema,
  positions: positionsSchema,
  applicationDeadline: dateSchema,
  campus: z.nativeEnum(Campus), // Changed to use Campus enum
  status: z.nativeEnum(ProjectStatus),
  researchCategories: researchCategoriesSchema,
  requirements: requirementsSchema,
});

// Initial form data
export const initialFormData = {
  title: "",
  description: "",
  positions: 1,
  applicationDeadline: "",
  campus: "" as Campus, // Type assertion to Campus
  status: ProjectStatus.DRAFT,
  researchCategories: [""],
  requirements: [""],
};

// Type exports
export type ProjectFormData = z.infer<typeof projectSchema>;

// Helper type for API requests - using the Project type from domain
export type ProjectApiData = Omit<
  Project,
  "id" | "professor" | "files" | "createdAt" | "updatedAt"
>;

// Helper type for form submission
export type ProjectSubmitData = {
  title: string;
  description: string;
  positions: number;
  applicationDeadline: string;
  campus: Campus;
  status: ProjectStatus;
  researchCategories: string[];
  requirements: string[];
};
