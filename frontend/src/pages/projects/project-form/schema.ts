import { z } from "zod";

import { Campus, ProjectStatus } from "@/common/enums";

export const projectSchema = z.object({
  title: z.string().min(1, "Please enter a project title"),
  description: z.string().min(1, "Please provide a project description"),
  positions: z.preprocess(
    (val) => (val === "" || isNaN(Number(val)) ? undefined : Number(val)),
    z
      .number({
        required_error: "Please enter the number of positions",
        invalid_type_error: "Please enter a valid number of positions",
      })
      .min(1, "Please specify at least 1 position")
  ),
  applicationDeadline: z.preprocess(
    (val) => (val ? new Date(val as string) : undefined),
    z
      .date({
        required_error: "Please select an application deadline",
        invalid_type_error: "Please enter a valid date",
      })
      .min(
        new Date(),
        "Please select a future date for the application deadline"
      )
  ),
  researchCategories: z
    .array(z.string())
    .min(1, "Please add at least one research category")
    .refine((cats) => cats.every((cat) => cat.trim() !== ""), {
      message: "Research categories cannot be empty",
    }),
  campus: z.nativeEnum(Campus, {
    errorMap: () => ({ message: "Please select a campus location" }),
  }),

  // Optional Fields
  requirements: z
    .array(z.string())
    .optional()
    .default([])
    .transform((reqs) => reqs.filter((req) => req.trim() !== "")),
  status: z
    .nativeEnum(ProjectStatus, {
      errorMap: () => ({ message: "Please select a valid project status" }),
    })
    .default(ProjectStatus.DRAFT),
});

export type ProjectFormData = z.infer<typeof projectSchema>;

export const initialFormData: ProjectFormData = {
  title: "",
  description: "",
  researchCategories: [""],
  requirements: [""],
  positions: 1,
  applicationDeadline: new Date(),
  status: ProjectStatus.DRAFT,
  campus: "" as Campus,
};
