/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SETLISTFM_API_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
