import { AppError, ErrorContext } from "./AppError";

export class ErrorFactory {
  // Predefined Standard Errors
  static internal(message: string, context?: ErrorContext): AppError {
    return this.createError(message, "INTERNAL_SERVER_ERROR", 500, context);
  }

  static badRequest(message: string, context?: ErrorContext): AppError {
    return this.createError(message, "BAD_REQUEST", 400, context);
  }

  static unauthorized(
    message: string = "Unauthorized access",
    context?: ErrorContext,
  ): AppError {
    return this.createError(message, "UNAUTHORIZED", 401, context);
  }

  static forbidden(
    message: string = "Access denied",
    context?: ErrorContext,
  ): AppError {
    return this.createError(message, "FORBIDDEN", 403, context);
  }

  static notFound(message: string, context?: ErrorContext): AppError {
    return this.createError(message, "NOT_FOUND", 404, context);
  }

  static validation(message: string, context?: ErrorContext): AppError {
    return this.createError(message, "VALIDATION_ERROR", 422, context);
  }

  /**
   * Core Helper: Creates an AppError with automatic context capture (File/Line).
   */
  private static createError(
    message: string,
    code: string,
    statusCode: number,
    context?: ErrorContext,
  ): AppError {
    const callerInfo = this.captureCallerInfo();

    return new AppError(message, code, statusCode, {
      ...callerInfo,
      context,
      service: "Backend", // Default, can be overridden if needed
    });
  }

  /**
   * Captures the details of the function calling the factory.
   * Parses the V8 stack trace line.
   */
  private static captureCallerInfo(): {
    file?: string;
    line?: number;
    functionName?: string;
  } {
    const stack = new Error().stack;
    if (!stack) return {};

    // Stack structure:
    // Error
    //    at ErrorFactory.captureCallerInfo (...)
    //    at ErrorFactory.createError (...)
    //    at ErrorFactory.unauthorized (...)  <-- We want the caller of this
    //    at Authenticator.validate (...)     <-- The actual source

    const lines = stack.split("\n");
    // Index 0: Error
    // Index 1: captureCallerInfo
    // Index 2: createError
    // Index 3: Factory Method (e.g. unauthorized)
    // Index 4: The Actual Caller
    const callerLine = lines[4];

    if (!callerLine) return {};

    // Regex to extract info: at FunctionName (FilePath:Line:Col) or at FilePath:Line:Col
    const match = callerLine.match(
      /at\s+(?:(.+?)\s+\()?(?:(.+?):(\d+):(\d+))\)?/,
    );

    if (match) {
      return {
        functionName: match[1] || "anonymous",
        file: match[2],
        line: parseInt(match[3], 10),
      };
    }

    return {};
  }
}
