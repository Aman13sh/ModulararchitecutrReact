/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_CHAT_URL: string;
  readonly VITE_EMAIL_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
