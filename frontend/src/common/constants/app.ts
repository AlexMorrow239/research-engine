import { env } from "@/config/env";

export const APP_CONFIG = {
  name: env.VITE_APP_NAME,
  description: env.VITE_APP_DESCRIPTION,
  apiUrl: env.VITE_API_URL,
} as const;
