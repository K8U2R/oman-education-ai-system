/**
 * Distributed Rate Limit Middleware - وسيط تحديد المعدل الموزع
 * 
 * Redis-backed distributed rate limiting with tier-based quotas (Law-14)
 */

import type { Request, Response, NextFunction } from 'express';
import { container } from '@/infrastructure/di/Container.js';
import { RedisClient } from '@/infrastructure/cache/redis.client.js';
import { SlidingWindowRateLimiter } from './sliding-window.js';
import { TIER_LIMITS } from './rate-limit.config.js';
import type { UserData } from '@/domain/types/auth/auth.types.js';

interface AuthRequest extends Request {
    user?: UserData;
}

/**
 * Distributed Rate Limiting Middleware
 * Enforces tier-based rate limits using Redis
 * 
 * @returns Express middleware function
 */
export const distributedRateLimit = () => {
    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const authReq = req as AuthRequest;
            const user = authReq.user;

            // Require authentication for rate limiting
            if (!user) {
                res.status(401).json({
                    error: 'Unauthorized',
                    message: 'Authentication required'
                });
                return;
            }

            // Get tier-specific limits
            const tier = user.planTier || 'FREE';
            const config = TIER_LIMITS[tier];

            // Get Redis client
            const redisClient = container.resolve<RedisClient>('RedisClient');

            // Check if Redis is connected
            if (!redisClient.connected()) {
                // Fail open - allow request if Redis is down
                console.warn('⚠️ Rate limit bypassed: Redis not connected');
                next();
                return;
            }

            // Create rate limiter
            const limiter = new SlidingWindowRateLimiter(redisClient.getClient());

            // Check rate limit
            const result = await limiter.checkLimit(
                user.id,
                config.windowMs,
                config.max
            );

            // Set standard rate limit headers
            res.setHeader('X-RateLimit-Limit', config.max.toString());
            res.setHeader('X-RateLimit-Remaining', result.remaining.toString());
            res.setHeader('X-RateLimit-Reset', new Date(result.resetTime).toISOString());
            res.setHeader('X-RateLimit-Used', result.current.toString());

            if (!result.allowed) {
                const retryAfter = Math.ceil((result.resetTime - Date.now()) / 1000);

                res.setHeader('Retry-After', retryAfter.toString());
                res.status(429).json({
                    error: 'Too Many Requests',
                    message: `Rate limit exceeded. You have used all ${config.max} requests for your ${tier} tier.`,
                    tier,
                    limit: config.max,
                    windowMs: config.windowMs,
                    retryAfter,
                    resetAt: new Date(result.resetTime).toISOString()
                });
                return;
            }

            // Request allowed - proceed
            next();
        } catch (error) {
            // Fail open - allow request on error
            console.error('❌ Rate limit middleware error:', error);
            next();
        }
    };
};
