/**
 * Settings Manager - مدير الإعدادات
 *
 * يدير جميع إعدادات التطبيق باستخدام ENV_CONFIG كمصدر وحيد للحقيقة.
 */

import { SettingsSchema, type Settings } from "./schemas/settings.schema.js";
import { ConfigurationError } from "../../domain/exceptions/index.js";
import { ENV_CONFIG } from "../../infrastructure/config/env.config.js";

let cachedSettings: Settings | null = null;

/**
 * Get application settings
 * @returns Settings object
 */
export function getSettings(): Settings {
  if (cachedSettings) return cachedSettings;

  // Build settings from ENV_CONFIG (Sovereign Engine)
  const rawSettings = {
    app: {
      name: ENV_CONFIG.APP_NAME,
      version: ENV_CONFIG.APP_VERSION,
      port: ENV_CONFIG.PORT,
      env: ENV_CONFIG.NODE_ENV as "development" | "production" | "test",
      secretKey: ENV_CONFIG.SECRET_KEY || "dev-secret-key-change-in-production",
    },
    database: {
      url: ENV_CONFIG.DATABASE_URL || undefined,
      poolSize: ENV_CONFIG.DATABASE_POOL_SIZE,
      timeout: ENV_CONFIG.DATABASE_TIMEOUT,
    },
    databaseCore: {
      url: ENV_CONFIG.DATABASE_CORE_URL,
      timeout: 30000,
    },
    redis: {
      host: ENV_CONFIG.REDIS_HOST,
      port: ENV_CONFIG.REDIS_PORT,
      password: ENV_CONFIG.REDIS_PASSWORD,
      db: 0,
    },
    jwt: {
      secret: ENV_CONFIG.JWT_SECRET || "dev-jwt-secret-change-in-production",
      supabaseSecret: "",
      expiresIn: 3600,
      refreshExpiresIn: 2592000,
    },
    security: {
      corsOrigin: ENV_CONFIG.CORS_ORIGIN,
      rateLimitEnabled: ENV_CONFIG.RATE_LIMIT_ENABLED,
      rateLimitPerMinute: 60,
    },
    ai: {
      openaiApiKey: ENV_CONFIG.OPENAI_API_KEY,
      anthropicApiKey: "",
      defaultProvider: (ENV_CONFIG.AI_DEFAULT_PROVIDER || "openai") as
        | "openai"
        | "anthropic",
    },
    logging: {
      level: "info" as "debug" | "info" | "warn" | "error",
      maxBytes: 10485760,
      backupCount: 5,
    },
    email: {
      provider: (ENV_CONFIG.EMAIL_PROVIDER || "console") as
        | "sendgrid"
        | "ses"
        | "console"
        | "smtp",
      sendgridApiKey: "",
      sesRegion: "",
      sesAccessKeyId: "",
      sesSecretAccessKey: "",
      fromEmail: ENV_CONFIG.EMAIL_FROM,
      fromName: "نظام التعليم الذكي العماني",
      frontendUrl: ENV_CONFIG.FRONTEND_URL,
    },
  };

  const result = SettingsSchema.safeParse(rawSettings);

  if (!result.success) {
    throw new ConfigurationError(
      `Invalid settings configuration: ${result.error.errors.map((e) => e.message).join(", ")}`,
    );
  }

  cachedSettings = result.data;
  return cachedSettings;
}

export function clearSettingsCache(): void {
  cachedSettings = null;
}
