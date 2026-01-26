/**
 * Environment Configuration Schema
 *
 * @law Law-5 (Config Law)
 * @law Law-9 (Documentation)
 */

import { z } from "zod";

export const ConfigSchema = z.object({
  // Server Coordinator
  PORT: z.number().default(3000),
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  APP_NAME: z.string().default("Oman Education AI Backend"),
  APP_VERSION: z.string().default("1.0.0"),
  SECRET_KEY: z
    .string()
    .min(32, "SECRET_KEY must be 32 chars")
    .default("dev-secret-key-at-least-32-chars-long"),
  APP_URL: z.string().url().default("http://localhost:3000"),

  // Storage & Persistence
  DATABASE_URL: z.string().optional(),
  DATABASE_CORE_URL: z.string().url().default("http://localhost:3001"),
  DATABASE_POOL_SIZE: z.number().default(20),
  DATABASE_TIMEOUT: z.number().default(30000),
  REDIS_HOST: z.string().default("localhost"),
  REDIS_PORT: z.number().default(6379),
  REDIS_PASSWORD: z.string().optional(),

  // Unified Authentication (Sovereign Passport)
  JWT_SECRET: z.string().default("dev-jwt-secret-change-in-production"),
  SESSION_SECRET: z.string().default("dev-session-secret-change-in-production"),
  FRONTEND_URL: z.string().url().default("http://localhost:5173"),
  CORS_ORIGIN: z.string().url().default("http://localhost:5173"),
  OAUTH_STATE_EXPIRY: z.number().default(3600),
  OAUTH_STATE_STORAGE: z.enum(["redis", "memory"]).default("memory"),

  // Security
  RATE_LIMIT_ENABLED: z.boolean().default(false),

  // AI Provider Governance
  OPENAI_API_KEY: z.string().optional(),
  AI_DEFAULT_PROVIDER: z.enum(["openai", "anthropic"]).default("openai"),

  // Email Service
  EMAIL_PROVIDER: z.enum(["sendgrid", "ses", "console"]).default("console"),
  EMAIL_FROM: z.string().email().default("no-reply@oman-edu.om"),

  // Google OAuth Governance
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
  GOOGLE_CALLBACK_URL: z
    .string()
    .url()
    .default("http://localhost:3000/api/v1/auth/oauth/google/callback"),
  DEV_WHITELIST: z.array(z.string()).default(["127.0.0.1", "::1"]),
});

export type EnvConfig = z.infer<typeof ConfigSchema>;
