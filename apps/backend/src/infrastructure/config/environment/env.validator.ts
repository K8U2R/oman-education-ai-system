/**
 * Environment Validator - مُتحقق صحة البيئة
 *
 * @description Validates environment variables at startup
 * @law LAW_05 - Environment Governance
 */

import { ENV_CONFIG } from "./env.config.js";
import { logger } from "@/shared/utils/logger.js";

/**
 * Validate environment configuration at startup
 * @throws {Error} if critical environment variables are missing or invalid
 */
export function validateEnvironment(): void {
  const errors: string[] = [];
  const warnings: string[] = [];

  // =================================================================
  // CRITICAL: Required for all environments
  // =================================================================
  const criticalVars = [
    "NODE_ENV",
    "PORT",
    "FRONTEND_URL",
    "CORS_ORIGIN",
    "JWT_SECRET",
    "SESSION_SECRET",
  ];

  for (const varName of criticalVars) {
    const value = ENV_CONFIG[varName as keyof typeof ENV_CONFIG];
    if (!value) {
      errors.push(`Missing critical environment variable: ${varName}`);
    }
  }

  // =================================================================
  // Validate JWT_SECRET and SESSION_SECRET length (min 32 chars)
  // =================================================================
  if (ENV_CONFIG.JWT_SECRET && ENV_CONFIG.JWT_SECRET.length < 32) {
    errors.push("JWT_SECRET must be at least 32 characters long");
  }

  if (ENV_CONFIG.SESSION_SECRET && ENV_CONFIG.SESSION_SECRET.length < 32) {
    errors.push("SESSION_SECRET must be at least 32 characters long");
  }

  // =================================================================
  // Production-specific validation
  // =================================================================
  if (ENV_CONFIG.NODE_ENV === "production") {
    const prodRequired = [
      "REDIS_HOST",
      "GOOGLE_CLIENT_ID",
      "GOOGLE_CLIENT_SECRET",
      "GOOGLE_CALLBACK_URL",
    ];

    for (const varName of prodRequired) {
      const value = ENV_CONFIG[varName as keyof typeof ENV_CONFIG];
      if (!value) {
        errors.push(`Missing production environment variable: ${varName}`);
      }
    }

    // Validate production URLs use HTTPS
    if (
      ENV_CONFIG.FRONTEND_URL &&
      !ENV_CONFIG.FRONTEND_URL.startsWith("https://")
    ) {
      errors.push("FRONTEND_URL must use HTTPS in production");
    }

    if (ENV_CONFIG.APP_URL && !ENV_CONFIG.APP_URL.startsWith("https://")) {
      errors.push("APP_URL must use HTTPS in production");
    }

    // Warn about development secrets in production
    if (ENV_CONFIG.JWT_SECRET?.includes("dev-")) {
      warnings.push("JWT_SECRET appears to be a development secret!");
    }

    if (ENV_CONFIG.SESSION_SECRET?.includes("dev-")) {
      warnings.push("SESSION_SECRET appears to be a development secret!");
    }

    // Warn if DATABASE_URL uses localhost in production
    if (ENV_CONFIG.DATABASE_URL?.includes("localhost")) {
      warnings.push("DATABASE_URL uses localhost in production!");
    }
  }

  // =================================================================
  // Development-specific warnings
  // =================================================================
  if (ENV_CONFIG.NODE_ENV === "development") {
    // Warn if production URLs are used in development
    if (ENV_CONFIG.FRONTEND_URL?.includes("k8u2r.online")) {
      warnings.push(
        "FRONTEND_URL appears to be a production URL in development mode",
      );
    }

    if (ENV_CONFIG.APP_URL?.includes("k8u2r.online")) {
      warnings.push(
        "APP_URL appears to be a production URL in development mode",
      );
    }
  }

  // =================================================================
  // Report results
  // =================================================================
  if (errors.length > 0) {
    logger.error("🔴 Environment Validation FAILED:", {
      errors,
      warnings,
      env: ENV_CONFIG.NODE_ENV,
    });
    throw new Error(
      `Environment validation failed:\n${errors.map((e) => `  - ${e}`).join("\n")}`,
    );
  }

  if (warnings.length > 0) {
    logger.warn("🟡 Environment Validation Warnings:", {
      warnings,
      env: ENV_CONFIG.NODE_ENV,
    });
  }

  logger.info("✅ Environment Validation Passed", {
    env: ENV_CONFIG.NODE_ENV,
    port: ENV_CONFIG.PORT,
    frontendUrl: ENV_CONFIG.FRONTEND_URL,
    warningsCount: warnings.length,
  });
}
