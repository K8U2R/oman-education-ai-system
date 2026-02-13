/**
 * Rate Limit Configuration - إعدادات حدود الاستخدام
 * 
 * Tier-based rate limiting configuration per Law-14
 */

import type { PlanTier } from '@/domain/types/auth/auth.types.js';

export interface RateLimitConfig {
    windowMs: number;           // Time window in milliseconds
    max: number;                // Max requests per window
    skipFailedRequests: boolean;
    skipSuccessfulRequests: boolean;
}

/**
 * Tier-based rate limits
 * Law-14: Tier Supremacy
 */
export const TIER_LIMITS: Record<PlanTier, RateLimitConfig> = {
    FREE: {
        windowMs: 60 * 60 * 1000, // 1 hour
        max: 100,
        skipFailedRequests: false,
        skipSuccessfulRequests: false
    },
    PRO: {
        windowMs: 60 * 60 * 1000, // 1 hour
        max: 1000,
        skipFailedRequests: false,
        skipSuccessfulRequests: false
    },
    PREMIUM: {
        windowMs: 60 * 60 * 1000, // 1 hour
        max: 999999, // Effectively unlimited
        skipFailedRequests: false,
        skipSuccessfulRequests: false
    }
};
