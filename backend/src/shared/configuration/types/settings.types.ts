/**
 * Settings Types - أنواع الإعدادات
 *
 * TypeScript types للإعدادات
 */

export interface AppSettings {
  name: string;
  version: string;
  port: number;
  env: "development" | "production" | "test";
  secretKey: string;
}

export interface DatabaseSettings {
  url: string;
  poolSize: number;
  timeout: number;
}

export interface DatabaseCoreSettings {
  url: string;
  timeout: number;
}

export interface RedisSettings {
  host: string;
  port: number;
  password?: string;
  db: number;
}

export interface JWTSettings {
  secret: string;
  supabaseSecret?: string;
  expiresIn: number;
  refreshExpiresIn: number;
}

export interface SecuritySettings {
  corsOrigin: string;
  rateLimitEnabled: boolean;
  rateLimitPerMinute: number;
}

export interface AISettings {
  openaiApiKey?: string;
  anthropicApiKey?: string;
  defaultProvider: "openai" | "anthropic";
  defaultModel: string;
}

export interface LoggingSettings {
  level: "error" | "warn" | "info" | "debug";
  maxBytes: number;
  backupCount: number;
}

export interface Settings {
  app: AppSettings;
  database: DatabaseSettings;
  databaseCore: DatabaseCoreSettings;
  redis: RedisSettings;
  jwt: JWTSettings;
  security: SecuritySettings;
  ai: AISettings;
  logging: LoggingSettings;
}
