export const APP_CONFIG = {
  name: import.meta.env.VITE_APP_NAME,
  description: import.meta.env.VITE_APP_DESCRIPTION,
  apiUrl: import.meta.env.VITE_API_URL,
} as const;
