import { ENV_CONFIG } from "../../infrastructure/config/env.config.js";

export interface ErrorContext {
  [key: string]: unknown;
}

export interface ErrorDetails {
  service?: string;
  file?: string;
  line?: number;
  functionName?: string;
  stack?: string;
  context?: ErrorContext;
}

export class AppError extends Error {
  public readonly code: string;
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly details: ErrorDetails;

  constructor(
    message: string,
    code: string = "INTERNAL_ERROR",
    statusCode: number = 500,
    details: ErrorDetails = {},
    isOperational: boolean = true,
  ) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);

    this.code = code;
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.details = details;

    // Capture stack trace
    Error.captureStackTrace(this, this.constructor);

    // Auto-capture context if not provided (basic)
    if (!this.details.stack) {
      this.details.stack = this.stack;
    }
  }

  /**
   * Serializes the error for response, complying with Security Gate rules.
   * @param isDevMode - Whether the environment is development.
   */
  public toResponse(isDevMode: boolean = ENV_CONFIG.NODE_ENV !== "production") {
    const response: Record<string, unknown> = {
      success: false,
      error: {
        code: this.code,
        message: this.message,
      },
      requestId: this.details.context?.requestId,
    };

    // Security Gate: Only attach technical details in DEV_MODE
    if (isDevMode) {
      (response.error as Record<string, unknown>).technicalDetails = {
        service: this.details.service,
        file: this.details.file,
        line: this.details.line,
        functionName: this.details.functionName,
        stack: this.details.stack,
        context: this.details.context,
      };
    }

    return response;
  }
}
