/**
 * Usage Limit Middleware - حدود الاستخدام
 *
 * Production-ready rate limiting based on subscription tier using Redis
 * @compliance LAW_14 - Package Sovereignty
 */

import { Request, Response, NextFunction } from "express";
import { PlanTier } from "./tier-guard.middleware.js";
import { logger } from "../../../../shared/utils/logger.js";
import { redisClient } from "../../../../infrastructure/cache/RedisClient.js";

interface UsageLimit {
  requestsPerHour: number;
  requestsPerDay: number;
  aiRequestsPerDay: number;
}

/**
 * Tier-based usage limits
 */
export const TIER_LIMITS: Record<PlanTier, UsageLimit> = {
  free: {
    requestsPerHour: 10,
    requestsPerDay: 50,
    aiRequestsPerDay: 5,
  },
  pro: {
    requestsPerHour: 100,
    requestsPerDay: 1000,
    aiRequestsPerDay: 100,
  },
  premium: {
    requestsPerHour: 500,
    requestsPerDay: 10000,
    aiRequestsPerDay: 1000,
  },
};

/**
 * Get user identifier for rate limiting
 */
function getUserKey(req: Request): string {
  const userId = (req.user as any)?.id || (req.user as any)?.userId;
  if (userId) return `user:${userId}`;

  // Fallback to IP address for unauthenticated requests
  const ip = req.ip || req.socket.remoteAddress || "unknown";
  return `ip:${ip}`;
}

/**
 * Check rate limit using Redis atomic operations
 */
async function checkRateLimit(
  key: string,
  limit: number,
  windowSeconds: number
): Promise<{ allowed: boolean; current: number; resetAt: number }> {
  const redisKey = `ratelimit:${key}`;

  try {
    // Use Redis INCR for atomic increment
    const current = await redisClient.incr(redisKey);

    // Set expiry on first request in window
    if (current === 1) {
      await redisClient.expire(redisKey, windowSeconds);
    }

    // Get TTL to calculate resetAt
    const ttl = await redisClient.ttl(redisKey);
    const resetAt = Date.now() + (ttl > 0 ? ttl * 1000 : windowSeconds * 1000);

    const allowed = current <= limit;

    return { allowed, current, resetAt };
  } catch (error) {
    logger.error("Rate limit check failed", { key, error });
    // Fail open - allow request if Redis is down
    return { allowed: true, current: 0, resetAt: Date.now() + windowSeconds * 1000 };
  }
}

/**
 * Apply usage limits based on tier
 *
 * Enforces hourly request limits using Redis atomic counters
 */
export const applyUsageLimit = () => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userTier: PlanTier = (req.user as any)?.planTier || "free";
      const limits = TIER_LIMITS[userTier];
      const userKey = getUserKey(req);

      // Check hourly limit (most restrictive)
      const hourKey = `${userKey}:hour`;
      const hourlyCheck = await checkRateLimit(
        hourKey,
        limits.requestsPerHour,
        3600 // 1 hour
      );

      if (!hourlyCheck.allowed) {
        logger.warn("Hourly rate limit exceeded", {
          userKey,
          tier: userTier,
          current: hourlyCheck.current,
          limit: limits.requestsPerHour,
        });

        res.status(429).json({
          error: "Rate limit exceeded",
          message: `You have exceeded your hourly request limit (${limits.requestsPerHour} requests/hour)`,
          tier: userTier,
          limit: limits.requestsPerHour,
          current: hourlyCheck.current,
          resetAt: new Date(hourlyCheck.resetAt).toISOString(),
        });
        return;
      }

      // Check daily limit
      const dayKey = `${userKey}:day`;
      const dailyCheck = await checkRateLimit(
        dayKey,
        limits.requestsPerDay,
        86400 // 24 hours
      );

      if (!dailyCheck.allowed) {
        logger.warn("Daily rate limit exceeded", {
          userKey,
          tier: userTier,
          current: dailyCheck.current,
          limit: limits.requestsPerDay,
        });

        res.status(429).json({
          error: "Rate limit exceeded",
          message: `You have exceeded your daily request limit (${limits.requestsPerDay} requests/day)`,
          tier: userTier,
          limit: limits.requestsPerDay,
          current: dailyCheck.current,
          resetAt: new Date(dailyCheck.resetAt).toISOString(),
        });
        return;
      }

      // Set rate limit headers
      res.setHeader("X-RateLimit-Limit-Hour", limits.requestsPerHour.toString());
      res.setHeader("X-RateLimit-Remaining-Hour", (limits.requestsPerHour - hourlyCheck.current).toString());
      res.setHeader("X-RateLimit-Reset-Hour", new Date(hourlyCheck.resetAt).toISOString());

      logger.debug("Rate limit check passed", {
        userKey,
        tier: userTier,
        hourly: `${hourlyCheck.current}/${limits.requestsPerHour}`,
        daily: `${dailyCheck.current}/${limits.requestsPerDay}`,
      });

      next();
    } catch (error) {
      logger.error("Usage limit middleware error", { error });
      // Fail open on error
      next();
    }
  };
};

/**
 * Check if user has exceeded daily AI request limit
 * Specifically for AI-powered endpoints
 */
export const checkAIUsageLimit = () => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userTier: PlanTier = (req.user as any)?.planTier || "free";
      const limits = TIER_LIMITS[userTier];
      const userKey = getUserKey(req);

      // Check AI-specific daily limit
      const aiKey = `${userKey}:ai:day`;
      const aiCheck = await checkRateLimit(
        aiKey,
        limits.aiRequestsPerDay,
        86400 // 24 hours
      );

      if (!aiCheck.allowed) {
        logger.warn("AI request limit exceeded", {
          userKey,
          tier: userTier,
          current: aiCheck.current,
          limit: limits.aiRequestsPerDay,
        });

        res.status(429).json({
          error: "AI request limit exceeded",
          message: `You have exceeded your daily AI request limit (${limits.aiRequestsPerDay} AI requests/day)`,
          tier: userTier,
          limit: limits.aiRequestsPerDay,
          current: aiCheck.current,
          resetAt: new Date(aiCheck.resetAt).toISOString(),
          upgradeInfo: userTier === "free"
            ? "Upgrade to Pro for 100 AI requests/day"
            : userTier === "pro"
              ? "Upgrade to Premium for 1000 AI requests/day"
              : null,
        });
        return;
      }

      // Set AI rate limit headers
      res.setHeader("X-RateLimit-AI-Limit", limits.aiRequestsPerDay.toString());
      res.setHeader("X-RateLimit-AI-Remaining", (limits.aiRequestsPerDay - aiCheck.current).toString());
      res.setHeader("X-RateLimit-AI-Reset", new Date(aiCheck.resetAt).toISOString());

      logger.debug("AI rate limit check passed", {
        userKey,
        tier: userTier,
        ai: `${aiCheck.current}/${limits.aiRequestsPerDay}`,
      });

      next();
    } catch (error) {
      logger.error("AI usage limit middleware error", { error });
      // Fail open on error
      next();
    }
  };
};
