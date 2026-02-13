import { Request, Response, NextFunction } from "express";
import { PlanTier } from "@prisma/client";

/**
 * TierGuard Middleware
 * @law Law-14 (Tier Sovereignty)
 * Enforces strict access control based on user's subscription plan.
 */
export const TierGuard = (requiredTier: PlanTier) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // Type assertion for user as it comes from passport
    const user = req.user as { planTier?: string } | undefined;

    if (!user) {
      return res.status(401).json({
        error: "Unauthorized",
        message: "User authentication required for this resource.",
      });
    }

    const userTier = user.planTier || "FREE";

    // Hierarchy Level Mapping
    const tierLevels: Record<string, number> = {
      FREE: 0,
      PRO: 1,
      PREMIUM: 2,
    };

    const requiredLevel = tierLevels[requiredTier] || 0;
    const currentLevel = tierLevels[userTier] || 0;

    if (currentLevel < requiredLevel) {
      return res.status(403).json({
        error: "Forbidden",
        message: "هذه الميزة تتطلب ترقية الباقة", // "This feature requires a plan upgrade"
        required: requiredTier,
        current: userTier,
      });
    }

    return next();
  };
};
