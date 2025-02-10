import { z } from "zod";

// Base schemas for reusable patterns
const emailSchema = z
  .string()
  .email("Invalid email address")
  .regex(/.+@.*miami\.edu$/i, "Must be a valid Miami.edu email address");

const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
    "Password must contain at least one uppercase letter, one lowercase letter, and one number"
  );

const nameSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
});

const publicationSchema = z.object({
  title: z.string().optional().or(z.literal("")),
  link: z.string().url("Must be a valid URL").optional().or(z.literal("")),
});

// Reusable faculty profile fields
const facultyProfileFields = {
  department: z.string().min(1, "Department is required"),
  office: z.string().min(1, "Office Location is required"),
  researchAreas: z
    .array(z.string())
    .min(1, "At least one research area is required")
    .refine((areas) => areas.every((area) => area.trim() !== ""), {
      message: "Research areas cannot be empty",
    }),
  title: z.string().optional(),
  publications: z.array(publicationSchema).optional().default([]),
  bio: z.string().max(1000, "Bio must not exceed 1000 characters").optional(),
};

// Composed schemas for different forms
export const facultyLoginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Password is required"),
});

export const facultyRegistrationSchema = z
  .object({
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string(),
    adminPassword: z.string().min(1, "Admin password is required"),
    ...nameSchema.shape,
    ...facultyProfileFields,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const passwordResetRequestSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

export const passwordResetSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const facultyAccountSchema = z.object({
  email: emailSchema,
  ...nameSchema.shape,
  ...facultyProfileFields,
});

// Type exports
export type FacultyLoginForm = z.infer<typeof facultyLoginSchema>;
export type FacultyRegistrationForm = z.infer<typeof facultyRegistrationSchema>;
export type PasswordResetRequestForm = z.infer<
  typeof passwordResetRequestSchema
>;
export type PasswordResetForm = z.infer<typeof passwordResetSchema>;
export type FacultyAccountForm = z.infer<typeof facultyAccountSchema>;
