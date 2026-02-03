/**
 * Login Rate Limit Middleware - Middleware تحديد معدل تسجيل الدخول
 *
 * Rate limiting خاص بمحاولات تسجيل الدخول لحماية النظام من هجمات Brute Force
 */

// Express
import { Request, Response, NextFunction } from "express";

// Application Layer - استخدام barrel exports
import { LoginRateLimiter } from "@/application/services";

// Domain Layer - استخدام barrel exports
import {
  RateLimitExceededError,
  AuthenticationFailedError,
  UserNotFoundError,
} from "@/domain";

// Infrastructure Layer
import { container } from "@/infrastructure/di";

// Shared Layer - استخدام common.ts
import { logger } from "@/shared/common";

/**
 * الحصول على Login Rate Limiter instance من DI Container
 *
 * @returns LoginRateLimiter instance
 */
function getLoginRateLimiter(): LoginRateLimiter {
  return container.resolve<LoginRateLimiter>("LoginRateLimiter");
}

/**
 * Login Rate Limit Middleware
 *
 * يتحقق من الحد الأقصى لمحاولات تسجيل الدخول قبل تنفيذ Login
 * ويسجل المحاولات الفاشلة بعد التنفيذ
 *
 * @param req - Express Request
 * @param res - Express Response
 * @param next - Next Function
 */
export async function loginRateLimitMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const limiter = getLoginRateLimiter();

    // Extract IP address
    const ip =
      req.ip ||
      req.socket.remoteAddress ||
      (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() ||
      "unknown";

    // Extract email from request body
    const email = req.body?.email;

    // Skip rate limiting if email not provided (will be validated by handler)
    if (!email || typeof email !== "string") {
      return next();
    }

    // Check limit before login attempt
    await limiter.checkLimit(ip, email);

    // Store original res.json to intercept response
    const originalJson = res.json.bind(res);

    res.json = function (body: unknown) {
      // If login successful, reset attempts
      if (
        (body as { success?: boolean }).success &&
        (body as { data?: { tokens?: unknown } }).data?.tokens
      ) {
        limiter.recordSuccess(ip, email).catch((err: unknown) => {
          logger.error("Failed to record login success in rate limiter", {
            error: err,
            ip,
            email,
          });
        });
      }

      return originalJson(body);
    };

    // Store original next to catch errors
    const originalNext = next;
    let nextCalled = false;

    next = function (error?: unknown) {
      if (nextCalled) return;
      nextCalled = true;

      // If login failed (error occurred), record attempt
      if (error) {
        // Check if it's an authentication error
        if (
          error instanceof AuthenticationFailedError ||
          error instanceof UserNotFoundError
        ) {
          limiter.recordFailedAttempt(ip, email).catch((err: unknown) => {
            logger.error("Failed to record failed attempt in rate limiter", {
              error: err,
              ip,
              email,
            });
          });
        }
      }

      return originalNext(error);
    };

    // Call next to continue to login handler
    next();
  } catch (error) {
    if (error instanceof RateLimitExceededError) {
      logger.warn("Rate limit exceeded for login attempt", {
        ip: req.ip,
        email: req.body?.email,
      });

      res.status(429).json({
        success: false,
        error: {
          message: error.message,
          code: error.code,
        },
      });
      return;
    }

    // For other errors, continue to next middleware
    next(error);
  }
}
