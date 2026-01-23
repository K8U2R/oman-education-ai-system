/**
 * Advanced Rate Limit Middleware - برمجية وسطية متقدمة لتحديد المعدل
 *
 * Rate limiting محسّن مع دعم:
 * - Per-user rate limiting
 * - IP-based rate limiting
 * - Adaptive rate limiting
 * - Rate limit headers
 */

import { Request, Response, NextFunction } from "express";
import rateLimit from "express-rate-limit";
import { getSettings } from "@/shared/configuration/index.js";
import { logger } from "@/shared/utils/logger.js";

const settings = getSettings();

// Extend Express Request to include rateLimit (using intersection type instead of extends)
type RateLimitRequest = Request & {
  rateLimit?: {
    resetTime?: number;
    limit?: number;
    remaining?: number;
    total?: number;
  };
  user?: {
    id: string;
  };
};

/**
 * Extract User ID from request
 */
function getUserId(req: RateLimitRequest): string | null {
  return req.user?.id || null;
}

/**
 * Extract IP address from request
 */
function getIpAddress(req: Request): string {
  return (
    req.ip ||
    req.socket.remoteAddress ||
    (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() ||
    "unknown"
  );
}

/**
 * General API Rate Limiter
 *
 * Rate limiting عام لجميع API endpoints
 */
export const generalRateLimitMiddleware = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: settings.security.rateLimitPerMinute || 100,
  message: {
    success: false,
    error: {
      message: "تم تجاوز الحد الأقصى للطلبات. يرجى المحاولة لاحقاً.",
      code: "RATE_LIMIT_EXCEEDED",
    },
  },
  standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
  legacyHeaders: false, // Disable `X-RateLimit-*` headers
  // Key generator - use IP + User ID if available
  keyGenerator: (req: Request): string => {
    const userId = getUserId(req);
    const ip = getIpAddress(req);
    return userId ? `user:${userId}` : `ip:${ip}`;
  },
  // Skip rate limiting for health checks
  // Validate Configuration

  // Handler for rate limit exceeded
  handler: (req: Request, res: Response) => {
    const userId = getUserId(req);
    const ip = getIpAddress(req);

    logger.warn("Rate limit exceeded", {
      path: req.path,
      method: req.method,
      userId,
      ip,
    });

    const rateLimitReq = req as RateLimitRequest;
    res.status(429).json({
      success: false,
      error: {
        message: "تم تجاوز الحد الأقصى للطلبات. يرجى المحاولة لاحقاً.",
        code: "RATE_LIMIT_EXCEEDED",
        retryAfter: Math.ceil(
          (rateLimitReq.rateLimit?.resetTime ||
            Date.now() + 60000 - Date.now()) / 1000,
        ),
      },
    });
  },
});

/**
 * Strict Rate Limiter for Authentication Endpoints
 *
 * Rate limiting صارم لـ endpoints المصادقة
 */
export const rateLimitMiddleware = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts per 15 minutes
  message: {
    success: false,
    error: {
      message:
        "تم تجاوز الحد الأقصى لمحاولات المصادقة. يرجى المحاولة بعد 15 دقيقة.",
      code: "AUTH_RATE_LIMIT_EXCEEDED",
    },
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req: Request): string => {
    // Use IP + email for auth endpoints
    const ip = getIpAddress(req);
    const email = req.body?.email || req.body?.username || "unknown";
    return `auth:${ip}:${email}`;
  },
  handler: (req: Request, res: Response) => {
    const ip = getIpAddress(req);
    const email = req.body?.email || req.body?.username || "unknown";

    logger.warn("Auth rate limit exceeded", {
      path: req.path,
      method: req.method,
      ip,
      email,
    });

    res.status(429).json({
      success: false,
      error: {
        message:
          "تم تجاوز الحد الأقصى لمحاولات المصادقة. يرجى المحاولة بعد 15 دقيقة.",
        code: "AUTH_RATE_LIMIT_EXCEEDED",
        retryAfter: 900, // 15 minutes in seconds
      },
    });
  },
});

/**
 * Per-User Rate Limiter
 *
 * Rate limiting خاص بكل مستخدم
 */
export const perUserRateLimitMiddleware = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 200, // 200 requests per minute per user
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req: Request): string => {
    const userId = getUserId(req);
    if (!userId) {
      // Fallback to IP if user not authenticated
      return `ip:${getIpAddress(req)}`;
    }
    return `user:${userId}`;
  },
  skip: (req: Request): boolean => {
    // Skip if user not authenticated (will be handled by general rate limiter)
    const rateLimitReq = req as RateLimitRequest;
    return !rateLimitReq.user;
  },
  handler: (req: Request, res: Response) => {
    const rateLimitReq = req as RateLimitRequest;
    const userId = rateLimitReq.user?.id;

    logger.warn("Per-user rate limit exceeded", {
      path: req.path,
      method: req.method,
      userId,
    });

    res.status(429).json({
      success: false,
      error: {
        message: "تم تجاوز الحد الأقصى للطلبات. يرجى المحاولة لاحقاً.",
        code: "USER_RATE_LIMIT_EXCEEDED",
        retryAfter: Math.ceil(
          ((req as RateLimitRequest).rateLimit?.resetTime ||
            Date.now() + 60000 - Date.now()) / 1000,
        ),
      },
    });
  },
});

/**
 * IP-Based Rate Limiter
 *
 * Rate limiting خاص بكل IP
 */
export const ipBasedRateLimitMiddleware = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 50, // 50 requests per minute per IP
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req: Request): string => {
    return `ip:${getIpAddress(req)}`;
  },
  skip: (req: Request): boolean => {
    // Skip if user is authenticated (will be handled by per-user rate limiter)
    const rateLimitReq = req as RateLimitRequest;
    return !!rateLimitReq.user;
  },
  handler: (req: Request, res: Response) => {
    const ip = getIpAddress(req);

    logger.warn("IP-based rate limit exceeded", {
      path: req.path,
      method: req.method,
      ip,
    });

    res.status(429).json({
      success: false,
      error: {
        message:
          "تم تجاوز الحد الأقصى للطلبات من هذا العنوان. يرجى المحاولة لاحقاً.",
        code: "IP_RATE_LIMIT_EXCEEDED",
        retryAfter: Math.ceil(
          ((req as RateLimitRequest).rateLimit?.resetTime ||
            Date.now() + 60000 - Date.now()) / 1000,
        ),
      },
    });
  },
});

/**
 * Adaptive Rate Limiter
 *
 * Rate limiting تكيفي حسب نوع الطلب
 */
export const adaptiveRateLimitMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  // Apply different limits based on endpoint
  const method = req.method;

  // Stricter limits for write operations
  if (
    method === "POST" ||
    method === "PUT" ||
    method === "PATCH" ||
    method === "DELETE"
  ) {
    // Use stricter rate limiter for write operations
    const writeLimiter = rateLimit({
      windowMs: 60 * 1000, // 1 minute
      max: 30, // 30 write operations per minute
      standardHeaders: true,
      legacyHeaders: false,
      keyGenerator: (req: Request): string => {
        const userId = getUserId(req);
        return userId
          ? `write:user:${userId}`
          : `write:ip:${getIpAddress(req)}`;
      },
    });

    writeLimiter(req, res, next);
    return;
  }

  // Lighter limits for read operations
  next();
};
