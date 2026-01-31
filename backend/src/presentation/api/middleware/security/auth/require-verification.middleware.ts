/**
 * Require Email Verification Middleware
 * 
 * Enforces email verification in production environment
 * Allows unverified users in development for testing
 * 
 * @compliance Emergency Audit Item #3
 * @compliance LAW_01 - Stateless middleware
 */

import { Request, Response, NextFunction } from 'express';
import { ENV_CONFIG } from '../../../../infrastructure/config/env.config.js';
import { logger } from '../../../../shared/utils/logger.js';

/**
 * Middleware to require email verification
 * Only enforced in production environment
 */
export const requireVerification = (req: Request, res: Response, next: NextFunction): void => {
    // Only enforce in production
    if (ENV_CONFIG.NODE_ENV !== 'production') {
        return next();
    }

    // Check if user is authenticated
    if (!req.user) {
        // Auth middleware will handle unauthenticated requests
        return next();
    }

    // Check if user email is verified
    if (req.user.is_verified !== true) {
        logger.warn('Unverified user attempted to access protected resource', {
            userId: req.user.id,
            email: req.user.email,
            path: req.path
        });

        res.status(403).json({
            error: 'EMAIL_NOT_VERIFIED',
            message: 'يرجى التحقق من بريدك الإلكتروني قبل الوصول لهذه الميزة',
            details: {
                requiresVerification: true,
                email: req.user.email
            }
        });
        return;
    }

    // User is verified, proceed
    next();
};
