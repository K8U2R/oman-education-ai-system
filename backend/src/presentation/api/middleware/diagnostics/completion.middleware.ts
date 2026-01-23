import { Response, NextFunction } from "express";
import { enhancedLogger } from "../../../../shared/utils/EnhancedLogger.js";
import { ContextRequest } from "./context.middleware.js";

/**
 * Request completion middleware
 * Logs successful API requests
 */
export function requestCompletionMiddleware(
  req: ContextRequest,
  res: Response,
  next: NextFunction,
): void {
  const originalSend = res.send.bind(res);

  res.send = function (body: unknown) {
    const duration = req.startTime ? Date.now() - req.startTime : 0;

    // Log API request with Enhanced Logger
    enhancedLogger.apiRequest(req.method, req.path, res.statusCode, duration, {
      userId:
        req.userId || (req as unknown as { user?: { id?: string } }).user?.id,
      requestId: req.requestId,
      operation: `${req.method} ${req.path}`,
      service: "API",
    });

    return originalSend(body);
  };

  next();
}
