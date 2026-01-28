/**
 * Central Environment Configuration Engine
 *
 * @law Law-5 (Config Law) - ONLY file allowed to touch process.env
 * @law Law-10 (Modularity) - Kept under 100 lines
 */

// CRITICAL: Load .env before anything else
import { config } from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
config({ path: join(__dirname, "../../../.env") });

import { ConfigSchema, EnvConfig } from "./schema.js";

/**
 * Loads and validates environment variables.
 * @returns {EnvConfig} The validated configuration object.
 * @throws {Error} If validation fails.
 */
const loadConfig = (): EnvConfig => {
  const rawData = {
    PORT: process.env.PORT ? Number(process.env.PORT) : undefined,
    NODE_ENV: process.env.NODE_ENV,
    APP_NAME: process.env.APP_NAME,
    APP_VERSION: process.env.APP_VERSION,
    SECRET_KEY: process.env.SECRET_KEY,
    APP_URL: process.env.APP_URL,
    DATABASE_URL: process.env.DATABASE_URL,
    DATABASE_CORE_URL: process.env.DATABASE_CORE_URL,
    DATABASE_POOL_SIZE: process.env.DATABASE_POOL_SIZE
      ? Number(process.env.DATABASE_POOL_SIZE)
      : undefined,
    DATABASE_TIMEOUT: process.env.DATABASE_TIMEOUT
      ? Number(process.env.DATABASE_TIMEOUT)
      : undefined,
    REDIS_HOST: process.env.REDIS_HOST,
    REDIS_PORT: process.env.REDIS_PORT
      ? Number(process.env.REDIS_PORT)
      : undefined,
    REDIS_PASSWORD: process.env.REDIS_PASSWORD,
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_ACCESS_EXPIRY: process.env.JWT_ACCESS_EXPIRY,
    JWT_REFRESH_EXPIRY: process.env.JWT_REFRESH_EXPIRY,
    SESSION_SECRET: process.env.SESSION_SECRET,
    FRONTEND_URL: process.env.FRONTEND_URL,
    CORS_ORIGIN: process.env.CORS_ORIGIN,
    OAUTH_STATE_EXPIRY: process.env.OAUTH_STATE_EXPIRY
      ? Number(process.env.OAUTH_STATE_EXPIRY)
      : undefined,
    OAUTH_STATE_STORAGE: process.env.OAUTH_STATE_STORAGE,
    RATE_LIMIT_ENABLED: process.env.RATE_LIMIT_ENABLED === "true",
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    AI_DEFAULT_PROVIDER: process.env.AI_DEFAULT_PROVIDER,
    EMAIL_PROVIDER: process.env.EMAIL_PROVIDER,
    EMAIL_FROM: process.env.EMAIL_FROM,
    SMTP_HOST: process.env.SMTP_HOST,
    SMTP_PORT: process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : undefined,
    SMTP_USER: process.env.SMTP_USER,
    SMTP_PASS: process.env.SMTP_PASS,
    SMTP_SECURE: process.env.SMTP_SECURE === "true",
    GOOGLE_CLIENT_ID:
      process.env.GOOGLE_OAUTH_CLIENT_ID || process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET:
      process.env.GOOGLE_OAUTH_CLIENT_SECRET ||
      process.env.GOOGLE_CLIENT_SECRET,
    GOOGLE_CALLBACK_URL:
      process.env.GOOGLE_OAUTH_REDIRECT_URI || process.env.GOOGLE_CALLBACK_URL,
    DEV_WHITELIST: process.env.DEV_WHITELIST
      ? process.env.DEV_WHITELIST.split(",").map((ip) => ip.trim())
      : undefined,
  };

  const result = ConfigSchema.safeParse(rawData);

  if (!result.success) {
    console.error("🔴 ENV_INTEGRITY_COMPROMISED", {
      errors: result.error.format(),
      timestamp: new Date().toISOString(),
    });
    throw new Error("Environment validation failed. See logs for details.");
  }

  return result.data;
};

export const ENV_CONFIG = loadConfig();

console.log("🛡️ Sovereign Configuration Verified & Locked");
