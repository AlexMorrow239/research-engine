/// <reference types="vite/client" />

interface ImportMetaEnv {
  // API Configuration
  readonly VITE_API_URL: string;

  // Application Configuration
  readonly VITE_APP_NAME: string;
  readonly VITE_APP_DESCRIPTION: string;

  // Feature Flags
  readonly VITE_ENABLE_DEBUG: boolean;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
