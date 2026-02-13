/**
 * Sliding Window Rate Limiter - محدد معدل النافذة المنزلقة
 * 
 * Implements sliding window algorithm for distributed rate limiting using Redis
 */

import type { RedisClientType } from 'redis';

export interface RateLimitResult {
    allowed: boolean;
    remaining: number;
    resetTime: number;
    current: number;
}

export class SlidingWindowRateLimiter {
    constructor(private redis: RedisClientType) { }

    /**
     * Check if request is allowed under rate limit
     * Uses Redis Sorted Sets for sliding window
     */
    async checkLimit(
        userId: string,
        windowMs: number,
        maxRequests: number
    ): Promise<RateLimitResult> {
        const now = Date.now();
        const windowStart = now - windowMs;
        const key = `rate-limit:${userId}`;

        try {
            // Remove old entries outside the window
            await this.redis.zRemRangeByScore(key, 0, windowStart);

            // Count current requests in window
            const currentCount = await this.redis.zCard(key);

            if (currentCount >= maxRequests) {
                // Get oldest entry to calculate reset time
                const oldestEntries = await this.redis.zRange(key, 0, 0, {
                    BY: 'SCORE'
                });

                const resetTime = oldestEntries.length > 0
                    ? parseInt(oldestEntries[0]) + windowMs
                    : now + windowMs;

                return {
                    allowed: false,
                    remaining: 0,
                    resetTime,
                    current: currentCount
                };
            }

            // Add current request to the window
            await this.redis.zAdd(key, {
                score: now,
                value: `${now}-${Math.random()}` // Ensure uniqueness
            });

            // Set expiry to clean up old keys
            await this.redis.expire(key, Math.ceil(windowMs / 1000) + 60); // +60s buffer

            return {
                allowed: true,
                remaining: maxRequests - currentCount - 1,
                resetTime: now + windowMs,
                current: currentCount + 1
            };
        } catch (error) {
            // Fail open - allow request if Redis fails
            console.error('Rate limit check failed:', error);
            return {
                allowed: true,
                remaining: maxRequests,
                resetTime: now + windowMs,
                current: 0
            };
        }
    }

    /**
     * Reset rate limit for a user (admin function)
     */
    async resetLimit(userId: string): Promise<void> {
        const key = `rate-limit:${userId}`;
        await this.redis.del(key);
    }

    /**
     * Get current usage for a user
     */
    async getCurrentUsage(userId: string, windowMs: number): Promise<number> {
        const now = Date.now();
        const windowStart = now - windowMs;
        const key = `rate-limit:${userId}`;

        await this.redis.zRemRangeByScore(key, 0, windowStart);
        return await this.redis.zCard(key);
    }
}
