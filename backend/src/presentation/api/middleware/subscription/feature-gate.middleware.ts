/**
 * Feature Gate Middleware - بوابة الميزات
 *
 * Enable/disable features based on tier
 * @compliance LAW_14 - Package Sovereignty
 */

import { Request, Response, NextFunction } from 'express';
import { PlanTier } from './tier-guard.middleware.js';
import { logger } from '@/shared/utils/logger.js';

interface FeatureConfig {
    name: string;
    tiers: PlanTier[];
    enabled?: boolean;
}

/**
 * Feature → Tier mapping
 * Defines which features are available for each subscription tier
 */
const FEATURE_GATES: Record<string, FeatureConfig> = {
    // Productivity Features (PRO+)
    code_generation: {
        name: 'Code Generation',
        tiers: ['pro', 'premium'],
    },
    office_generation: {
        name: 'Office Documents',
        tiers: ['pro', 'premium'],
    },

    // Premium Features
    analytics: {
        name: 'Advanced Analytics',
        tiers: ['premium'],
    },
    mind_maps: {
        name: 'Mind Maps',
        tiers: ['premium'],
    },
    video_lessons: {
        name: 'Video Lessons',
        tiers: ['premium'],
    },

    // Education Features (ALL TIERS)
    basic_assessment: {
        name: 'Basic Assessments',
        tiers: ['free', 'pro', 'premium'],
    },
    basic_lessons: {
        name: 'Basic Lessons',
        tiers: ['free', 'pro', 'premium'],
    },
};

/**
 * Require specific feature access based on tier
 *
 * @example
 * ```typescript
 * router.post('/analytics', requireFeature('analytics'), handler)
 * ```
 */
export const requireFeature = (featureName: string) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        const feature = FEATURE_GATES[featureName];

        if (!feature) {
            // Feature not found in config, allow by default (fallback)
            logger.warn(`Feature gate not configured: ${featureName}`);
            next();
            return;
        }

        // Check if feature is globally disabled
        if (feature.enabled === false) {
            res.status(503).json({
                success: false,
                error: 'Feature temporarily unavailable',
                feature: feature.name,
            });
            return;
        }

        const userTier: PlanTier = (req.user as any)?.planTier || 'free';

        if (!feature.tiers.includes(userTier)) {
            logger.warn(`Feature access denied: user=${userTier}, feature=${featureName}`);

            res.status(403).json({
                success: false,
                error: 'Feature not available in your plan',
                feature: feature.name,
                required_tiers: feature.tiers,
                current_tier: userTier,
                upgrade_url: '/pricing',
            });
            return;
        }

        next();
    };
};

/**
 * Export feature gates config for external use
 */
export { FEATURE_GATES };
