/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL?: string;
  readonly VITE_SUPABASE_ANON_KEY?: string;
  readonly VITE_RESEND_API_KEY?: string;
  readonly VITE_DEMO_MODE?: string;
  readonly RESEND_API_KEY?: string;
  readonly DOCTOR_EMAIL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
