import { AppError } from "./AppError.js";
import { ENV_CONFIG } from "../../infrastructure/config/env.config.js";

/**
 * Security Gate: The final checkpoint for all errors leaving the system.
 * Enforces the "Scope Protection" rule.
 */
export class SecurityGate {
  static processError(error: Error | AppError) {
    const isDev = ENV_CONFIG.NODE_ENV !== "production";

    if (error instanceof AppError) {
      return error.toResponse(isDev);
    }

    // Handle unexpected/raw system errors
    const response: Record<string, unknown> = {
      success: false,
      error: {
        code: "INTERNAL_SERVER_ERROR",
        message: isDev ? error.message : "An unexpected error occurred",
      },
    };

    // Security Gate: Only reveal raw stack in DEV
    if (isDev) {
      (response.error as Record<string, unknown>).technicalDetails = {
        message: error.message,
        stack: error.stack,
        type: "RawSystemError",
      };
    }

    return response;
  }
}
