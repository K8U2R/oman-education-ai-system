/**
 * ETag Middleware
 */

import { Request, Response, NextFunction } from "express";

/**
 * Generate ETag from response body
 */
function generateETag(body: string): string {
  // Simple ETag generation (in production, use crypto hash)
  let hash = 0;
  for (let i = 0; i < body.length; i++) {
    const char = body.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return `"${hash.toString(16)}"`;
}

/**
 * ETag Middleware
 */
export function etagMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  // Store original send function
  const originalSend = res.send.bind(res);

  res.send = function (body: unknown): Response {
    // Generate ETag
    const bodyString = typeof body === "string" ? body : JSON.stringify(body);
    const etag = generateETag(bodyString);

    // Set ETag header
    res.set("ETag", etag);

    // Check if client has matching ETag
    const ifNoneMatch = req.headers["if-none-match"];
    if (ifNoneMatch === etag) {
      res.status(304).end();
      return res;
    }

    return originalSend(body);
  };

  next();
}
