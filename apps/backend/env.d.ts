declare namespace NodeJS {
  interface ProcessEnv {
    PORT?: string;
    JWT_SECRET: string;
    SMTP_PASSWORD: string;
    SUPABASE_URL: string;
    SUPABASE_SERVICE_KEY: string;
    GOOGLE_CLIENT_ID: string;
    EMAIL_FROM: string;
    SMTP_HOST: string;
    SMTP_PORT: string;
    SMTP_USER: string;
    SMTP_PASS: string;
    REDIS_URL: string;
    UPSTASH_REDIS_REST_URL: string;
    UPSTASH_REDIS_REST_TOKEN: string;
    ALERT_EMAIL_TO: string;
  }
}
