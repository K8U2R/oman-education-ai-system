/**
 * Vary Header Middleware
 */

import { Request, Response, NextFunction } from "express";

export function varyMiddleware(
  _req: Request,
  res: Response,
  next: NextFunction,
): void {
  // Add Vary header for content negotiation
  res.set("Vary", "Accept, Accept-Encoding, Accept-Language");

  next();
}
