/**
 * ETag Middleware - وسيط ETag
 * 
 * Generates ETags for responses and handles conditional requests (304 Not Modified)
 */

import type { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';

/**
 * ETag middleware for HTTP caching
 * 
 * Generates MD5 hash of response body as ETag
 * Returns 304 Not Modified if If-None-Match header matches
 */
export const etagMiddleware = () => {
    return (req: Request, res: Response, next: NextFunction): void => {
        const originalSend = res.send.bind(res);

        res.send = function (body: any): Response {
            // Only for GET requests with 200 status
            if (req.method === 'GET' && res.statusCode === 200) {
                // Generate ETag from response body
                const bodyString = typeof body === 'string'
                    ? body
                    : JSON.stringify(body);

                const etag = crypto
                    .createHash('md5')
                    .update(bodyString)
                    .digest('hex');

                // Set ETag header
                res.setHeader('ETag', `"${etag}"`);

                // Check If-None-Match (client's cached ETag)
                const clientEtag = req.headers['if-none-match'];
                if (clientEtag === `"${etag}"`) {
                    // Content hasn't changed - return 304
                    res.status(304).end();
                    return res;
                }
            }

            // Send response normally
            return originalSend(body);
        };

        next();
    };
};
