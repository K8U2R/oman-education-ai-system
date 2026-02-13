/**
 * Tier Guard Middleware - حارس الباقة
 *
 * Enforces subscription tier requirements on routes
 * @compliance LAW_14 - Package Sovereignty
 */

import { Request, Response, NextFunction } from "express";
import { logger } from "@/shared/utils/logger.js";

export type PlanTier = "free" | "pro" | "premium";

interface TierRequirement {
  minTier: PlanTier;
  feature?: string;
}

const TIER_HIERARCHY: Record<PlanTier, number> = {
  free: 0,
  pro: 1,
  premium: 2,
};

/**
 * Require minimum subscription tier
 *
 * @example
 * ```typescript
 * router.post('/generate-office', requireTier({ minTier: 'pro' }), handler)
 * ```
 */
export const requireTier = (requirement: TierRequirement) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const userTier: PlanTier = (req.user as any)?.planTier || "free";
      const { minTier, feature } = requirement;

      // Check tier level
      if (TIER_HIERARCHY[userTier] < TIER_HIERARCHY[minTier]) {
        logger.warn(
          `Tier insufficient: user=${userTier}, required=${minTier}, feature=${feature}`,
        );

        res.status(403).json({
          success: false,
          error: "Subscription tier insufficient",
          details: {
            required: minTier,
            current: userTier,
            feature: feature || "This feature",
            upgrade_url: "/pricing",
          },
        });
        return;
      }

      // Tier sufficient, proceed
      next();
    } catch (error) {
      logger.error("Tier guard error:", error);
      res.status(500).json({
        success: false,
        error: "Tier validation failed",
      });
    }
  };
};

/**
 * Shortcuts for common tier requirements
 */
export const requirePro = requireTier({ minTier: "pro" });
export const requirePremium = requireTier({ minTier: "premium" });
