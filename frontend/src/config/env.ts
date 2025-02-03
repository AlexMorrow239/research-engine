import { z } from "zod";

const envSchema = z.object({
  // API Configuration
  VITE_API_URL: z.string().url(),

  // Application Configuration
  VITE_APP_NAME: z.string().min(1),
  VITE_APP_DESCRIPTION: z.string().min(1),

  // Feature Flags
  VITE_ENABLE_DEBUG: z.preprocess(
    (val) => val === "true" || val === "1",
    z.boolean()
  ),
});

function validateEnv() {
  try {
    return envSchema.parse(import.meta.env);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = error.issues.map((issue) => issue.path.join("."));
      throw new Error(
        `Invalid environment variables: ${missingVars.join(
          ", "
        )}. Please check your .env file.`
      );
    }
    throw error;
  }
}

export const env = validateEnv();

// Type assertion to ensure all env variables are validated
type EnvType = z.infer<typeof envSchema>;
declare global {
  interface ImportMetaEnv extends EnvType {}
}
