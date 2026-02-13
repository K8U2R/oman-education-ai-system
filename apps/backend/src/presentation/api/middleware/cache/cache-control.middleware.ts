/**
 * Cache Control Middleware - وسيط التحكم في التخزين المؤقت
 * 
 * Sets Cache-Control headers for different route types
 */

import type { Request, Response, NextFunction } from 'express';

export interface CacheOptions {
    maxAge?: number;        // Max age in seconds
    sMaxAge?: number;       // Shared cache max age
    public?: boolean;       // Allow shared caches
    private?: boolean;      // Only browser cache
    noCache?: boolean;      // Revalidate before use
    noStore?: boolean;      // Don't cache at all
    mustRevalidate?: boolean;
}

/**
 * Cache Control middleware
 * 
 * @param options - Cache configuration options
 * @returns Express middleware function
 */
export const cacheControl = (options: CacheOptions) => {
    return (_req: Request, res: Response, next: NextFunction): void => {
        const directives: string[] = [];

        if (options.public) directives.push('public');
        if (options.private) directives.push('private');
        if (options.noCache) directives.push('no-cache');
        if (options.noStore) directives.push('no-store');
        if (options.mustRevalidate) directives.push('must-revalidate');

        if (options.maxAge !== undefined) {
            directives.push(`max-age=${options.maxAge}`);
        }

        if (options.sMaxAge !== undefined) {
            directives.push(`s-maxage=${options.sMaxAge}`);
        }

        if (directives.length > 0) {
            res.setHeader('Cache-Control', directives.join(', '));
        }

        next();
    };
};

/**
 * Predefined cache strategies
 */
export const CacheStrategies = {
    /**
     * No cache - always revalidate
     */
    noCache: () => cacheControl({
        noStore: true,
        noCache: true
    }),

    /**
     * Short-lived cache (5 minutes)
     */
    shortLived: () => cacheControl({
        public: true,
        maxAge: 300,        // 5 minutes
        mustRevalidate: true
    }),

    /**
     * Medium cache (1 hour)
     */
    medium: () => cacheControl({
        public: true,
        maxAge: 3600,       // 1 hour
        sMaxAge: 3600
    }),

    /**
     * Long-lived cache (1 day)
     */
    longLived: () => cacheControl({
        public: true,
        maxAge: 86400,      // 1 day
        sMaxAge: 86400
    }),

    /**
     * Private cache (user-specific data)
     */
    private: (maxAge: number = 300) => cacheControl({
        private: true,
        maxAge,
        mustRevalidate: true
    })
};
