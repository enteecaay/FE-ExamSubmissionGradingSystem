interface ImportMetaEnv {
  readonly VITE_APP_NAME: string;
  readonly VITE_APP_VERSION: string;
  readonly VITE_API_GATEWAY_URL: string;
  readonly VITE_API_IAM_PATH: string;
  readonly VITE_API_COURSE_PATH: string;
  readonly VITE_API_DIRECT_COURSE_URL?: string;
  readonly VITE_TOKEN_STORAGE_KEY: string;
  readonly VITE_REFRESH_TOKEN_STORAGE_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
