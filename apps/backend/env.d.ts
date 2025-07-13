declare namespace NodeJS {
  interface ProcessEnv {
    PORT?: string;
    JWT_SECRET: string;
    SMTP_PASSWORD: string;
    SUPABASE_URL: string;
    SUPABASE_SERVICE_KEY: string;
  }
}
