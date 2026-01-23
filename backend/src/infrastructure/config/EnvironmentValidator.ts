/**
 * Environment Validator - مدقق البيئة
 *
 * يتحقق من صحة متغيرات البيئة المطلوبة
 */

import { z } from "zod";
import { ConfigurationError } from "@/domain/exceptions";
import { logger } from "@/shared/utils/logger";

/**
 * Environment validation schema
 */
// Custom validator for CORS_ORIGIN (supports comma-separated URLs)
const corsOriginValidator = z.string().refine(
  (value) => {
    // Split by comma and validate each URL
    const origins = value
      .split(",")
      .map((origin) => origin.trim())
      .filter((origin) => origin.length > 0);
    return origins.every((origin) => {
      try {
        new URL(origin);
        return true;
      } catch {
        return false;
      }
    });
  },
  {
    message:
      "CORS_ORIGIN must be a valid URL or comma-separated list of valid URLs",
  },
);

const EnvironmentSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  PORT: z.string().regex(/^\d+$/).transform(Number).default("3000"),
  JWT_SECRET: z.string().min(32, "JWT_SECRET must be at least 32 characters"),
  SECRET_KEY: z.string().min(32, "SECRET_KEY must be at least 32 characters"),
  DATABASE_CORE_URL: z.string().url("DATABASE_CORE_URL must be a valid URL"),
  CORS_ORIGIN: corsOriginValidator,
  FRONTEND_URL: z.string().url("FRONTEND_URL must be a valid URL"),
});

/**
 * Optional environment variables (for specific features)
 */
const OptionalEnvironmentSchema = z.object({
  REDIS_HOST: z.string().optional(),
  REDIS_PORT: z.string().regex(/^\d+$/).transform(Number).optional(),
  REDIS_PASSWORD: z.string().optional(),
  GOOGLE_OAUTH_CLIENT_ID: z.string().optional(),
  GOOGLE_OAUTH_CLIENT_SECRET: z.string().optional(),
  SUPABASE_JWT_SECRET: z.string().optional(),
  EMAIL_PROVIDER: z.enum(["sendgrid", "ses", "console"]).optional(),
  SENDGRID_API_KEY: z.string().optional(),
  AWS_SES_REGION: z.string().optional(),
  AWS_SES_ACCESS_KEY_ID: z.string().optional(),
  AWS_SES_SECRET_ACCESS_KEY: z.string().optional(),
});

export interface EnvironmentValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * Validate environment variables
 *
 * @param strict - If true, validates all required variables. If false, only validates critical ones.
 * @returns Validation result
 */
export function validateEnvironment(
  strict: boolean = false,
): EnvironmentValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Validate required environment variables
  try {
    EnvironmentSchema.parse(process.env);
  } catch (error) {
    if (error instanceof z.ZodError) {
      errors.push(
        ...error.errors.map((e) => `${e.path.join(".")}: ${e.message}`),
      );
    }
  }

  // Validate optional environment variables
  try {
    OptionalEnvironmentSchema.parse(process.env);
  } catch (error) {
    if (error instanceof z.ZodError && strict) {
      warnings.push(
        ...error.errors.map((e) => `${e.path.join(".")}: ${e.message}`),
      );
    }
  }

  // Production-specific validations
  if (process.env.NODE_ENV === "production") {
    if (process.env.JWT_SECRET === "dev-jwt-secret-change-in-production") {
      errors.push("JWT_SECRET must be changed in production");
    }

    if (process.env.SECRET_KEY === "dev-secret-key-change-in-production") {
      errors.push("SECRET_KEY must be changed in production");
    }

    // Check for required services in production
    if (
      !process.env.EMAIL_PROVIDER ||
      process.env.EMAIL_PROVIDER === "console"
    ) {
      warnings.push('EMAIL_PROVIDER should not be "console" in production');
    }
  }

  // Feature-specific validations
  if (
    process.env.EMAIL_PROVIDER === "sendgrid" &&
    !process.env.SENDGRID_API_KEY
  ) {
    warnings.push(
      'SENDGRID_API_KEY is required when EMAIL_PROVIDER is "sendgrid"',
    );
  }

  if (process.env.EMAIL_PROVIDER === "ses") {
    if (!process.env.AWS_SES_REGION) {
      warnings.push('AWS_SES_REGION is required when EMAIL_PROVIDER is "ses"');
    }
    if (!process.env.AWS_SES_ACCESS_KEY_ID) {
      warnings.push(
        'AWS_SES_ACCESS_KEY_ID is required when EMAIL_PROVIDER is "ses"',
      );
    }
    if (!process.env.AWS_SES_SECRET_ACCESS_KEY) {
      warnings.push(
        'AWS_SES_SECRET_ACCESS_KEY is required when EMAIL_PROVIDER is "ses"',
      );
    }
  }

  if (
    process.env.GOOGLE_OAUTH_CLIENT_ID &&
    !process.env.GOOGLE_OAUTH_CLIENT_SECRET
  ) {
    warnings.push(
      "GOOGLE_OAUTH_CLIENT_SECRET is required when GOOGLE_OAUTH_CLIENT_ID is set",
    );
  }

  const result: EnvironmentValidationResult = {
    valid: errors.length === 0,
    errors,
    warnings,
  };

  if (errors.length > 0) {
    logger.error("Environment validation failed", { errors });
  }

  if (warnings.length > 0) {
    logger.warn("Environment validation warnings", { warnings });
  }

  return result;
}

/**
 * Validate and throw if invalid
 */
export function validateEnvironmentOrThrow(strict: boolean = false): void {
  const result = validateEnvironment(strict);

  if (!result.valid) {
    throw new ConfigurationError(
      `Environment validation failed: ${result.errors.join(", ")}`,
    );
  }

  if (result.warnings.length > 0 && strict) {
    logger.warn("Environment validation warnings", {
      warnings: result.warnings,
    });
  }
}
