/**
 * Enhanced Error Middleware - Middleware معالجة الأخطاء المحسّن
 *
 * X-Ray Compatible: Uses ENV_CONFIG for diagnostic context.
 */

import { Response, NextFunction } from "express";
import { ErrorHandler } from "../../../../shared/error/ErrorHandler.js";
import { enhancedLogger } from "../../../../shared/utils/EnhancedLogger.js";
import { v4 as uuidv4 } from "uuid";
import { ContextRequest } from "./context.middleware.js";
import { ENV_CONFIG } from "../../../../infrastructure/config/env.config.js";

export type EnhancedErrorRequest = ContextRequest;

export function enhancedErrorMiddleware(
  err: Error | unknown,
  req: ContextRequest,
  res: Response,
  _next: NextFunction,
): void {
  if (!req.requestId) req.requestId = uuidv4();

  const errorInfo = ErrorHandler.handleError(err, {
    userId: req.userId || (req.user as Express.User & { id?: string })?.id,
    requestId: req.requestId,
    operation: `${req.method} ${req.path}`,
    service: "API",
    metadata: {
      path: req.path,
      method: req.method,
      ip: req.ip || req.socket.remoteAddress,
    },
  });

  enhancedLogger.error("API error occurred", err, {
    requestId: req.requestId,
    operation: `${req.method} ${req.path}`,
  });

  let statusCode = 500;
  if (errorInfo.category === "validation") statusCode = 400;
  else if (errorInfo.category === "authentication") statusCode = 401;
  else if (errorInfo.category === "authorization") statusCode = 403;

  const userMessage = ErrorHandler.getUserFriendlyMessage(errorInfo);

  if (!res.headersSent) {
    res.status(statusCode).json({
      success: false,
      error: {
        message: userMessage,
        code: errorInfo.code,
        category: errorInfo.category,
        technicalDebt:
          "ENV_CONFIG Centralized Engine Active. No direct process.env usage.",
        ...(ENV_CONFIG.NODE_ENV === "development" && {
          details: errorInfo.message,
          stack: errorInfo.context.stack,
          severity: errorInfo.severity,
        }),
      },
      requestId: req.requestId,
    });
  }
}
