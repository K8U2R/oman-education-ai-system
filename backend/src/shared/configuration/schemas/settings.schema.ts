/**
 * Settings Schema - مخطط الإعدادات
 *
 * Zod schemas للتحقق من صحة الإعدادات
 */

import { z } from "zod";

export const AppSettingsSchema = z.object({
  name: z.string().default("Oman Education AI Backend"),
  version: z.string().default("1.0.0"),
  port: z.number().int().min(1).max(65535).default(3000),
  env: z.enum(["development", "production", "test"]).default("development"),
  secretKey: z.string().min(32).default("dev-secret-key-change-in-production"),
});

export const DatabaseSettingsSchema = z.object({
  url: z
    .union([z.string().url(), z.literal("")])
    .optional()
    .nullable(),
  poolSize: z.number().int().min(1).default(10),
  timeout: z.number().int().min(1000).default(30000),
});

export const DatabaseCoreSettingsSchema = z.object({
  url: z.string().url().default("http://localhost:3001"),
  timeout: z.number().int().min(1000).default(30000),
});

export const RedisSettingsSchema = z.object({
  host: z.string().default("localhost"),
  port: z.number().int().min(1).max(65535).default(6379),
  password: z.string().optional(),
  db: z.number().int().min(0).default(0),
});

export const JWTSettingsSchema = z.object({
  secret: z.string().min(32).default("dev-jwt-secret-change-in-production"),
  supabaseSecret: z.string().optional(),
  expiresIn: z.number().int().min(60).default(3600), // 1 hour
  refreshExpiresIn: z.number().int().min(3600).default(2592000), // 30 days
});

export const SecuritySettingsSchema = z.object({
  corsOrigin: z.string().default("http://localhost:5173"),
  rateLimitEnabled: z.boolean().default(true),
  rateLimitPerMinute: z.number().int().min(1).default(60),
});

export const AISettingsSchema = z.object({
  openaiApiKey: z.string().optional(),
  anthropicApiKey: z.string().optional(),
  defaultProvider: z.enum(["openai", "anthropic"]).catch("openai"),
  defaultModel: z.string().default("gpt-4-turbo-preview"),
});

export const LoggingSettingsSchema = z.object({
  level: z.enum(["error", "warn", "info", "debug"]).default("info"),
  maxBytes: z
    .number()
    .int()
    .min(1024)
    .default(10 * 1024 * 1024), // 10MB
  backupCount: z.number().int().min(1).default(5),
});

export const EmailSettingsSchema = z.object({
  provider: z.enum(["sendgrid", "ses", "console", "smtp"]).catch("console"),
  sendgridApiKey: z.string().optional(),
  sesRegion: z.string().optional(),
  sesAccessKeyId: z.string().optional(),
  sesSecretAccessKey: z.string().optional(),
  fromEmail: z.string().email().default("noreply@oman-education.ai"),
  fromName: z.string().default("نظام التعليم الذكي العماني"),
  frontendUrl: z.string().url().default("http://localhost:5173"),
});

export const SettingsSchema = z.object({
  app: AppSettingsSchema,
  database: DatabaseSettingsSchema,
  databaseCore: DatabaseCoreSettingsSchema,
  redis: RedisSettingsSchema,
  jwt: JWTSettingsSchema,
  security: SecuritySettingsSchema,
  ai: AISettingsSchema,
  logging: LoggingSettingsSchema,
  email: EmailSettingsSchema,
});

export type Settings = z.infer<typeof SettingsSchema>;
