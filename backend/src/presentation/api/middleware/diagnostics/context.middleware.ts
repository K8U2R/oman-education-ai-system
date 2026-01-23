import { Request, Response, NextFunction } from "express";
import { v4 as uuidv4 } from "uuid";
import { enhancedLogger } from "../../../../shared/utils/EnhancedLogger.js";

export interface ContextRequest extends Request {
  requestId?: string;
  userId?: string;
  startTime?: number;
}

/**
 * Request context middleware
 * Initializes request ID and start time
 */
export function requestContextMiddleware(
  req: ContextRequest,
  _res: Response,
  next: NextFunction,
): void {
  // Generate request ID
  req.requestId = uuidv4();
  req.startTime = Date.now();

  // Set context in Enhanced Logger
  enhancedLogger.setContext(
    req.requestId,
    (req as unknown as { user?: { id?: string } }).user?.id || req.userId,
  );

  // Add request ID to response headers
  _res.setHeader("X-Request-ID", req.requestId);

  next();
}
