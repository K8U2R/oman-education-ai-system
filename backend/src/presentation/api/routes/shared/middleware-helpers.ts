/**
 * Middleware Helpers - مساعدات Middleware
 *
 * Reusable middleware composition patterns
 */

import { RequestHandler } from "express";

/**
 * Compose multiple middleware into a single array
 */
export const composeMiddleware = (
  ...middleware: RequestHandler[]
): RequestHandler[] => {
  return middleware;
};

/**
 * Common middleware chains
 */
export const MiddlewareChains = {
  /**
   * Authenticated route middleware chain
   */
  authenticated: (authMiddleware: RequestHandler): RequestHandler[] => [
    authMiddleware,
  ],

  /**
   * Admin-only route middleware chain
   */
  adminOnly: (
    authMiddleware: RequestHandler,
    adminMiddleware: RequestHandler,
  ): RequestHandler[] => [authMiddleware, adminMiddleware],

  /**
   * Rate-limited route middleware chain
   */
  rateLimited: (rateLimitMiddleware: RequestHandler): RequestHandler[] => [
    rateLimitMiddleware,
  ],

  /**
   * Authenticated + rate-limited
   */
  authenticatedRateLimited: (
    authMiddleware: RequestHandler,
    rateLimitMiddleware: RequestHandler,
  ): RequestHandler[] => [rateLimitMiddleware, authMiddleware],
};
