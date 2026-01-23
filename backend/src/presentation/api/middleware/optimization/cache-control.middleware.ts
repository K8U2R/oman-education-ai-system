/**
 * Cache Middleware
 * Middleware for adding HTTP caching headers
 */

import { Request, Response, NextFunction } from "express";

/**
 * Cache options for different types of resources
 */
const CACHE_OPTIONS = {
  static: {
    maxAge: 31536000, // 1 year
    immutable: true,
  },
  api: {
    maxAge: 300, // 5 minutes
    mustRevalidate: true,
  },
  html: {
    maxAge: 0,
    mustRevalidate: true,
    noCache: true,
  },
} as const;

/**
 * Cache Middleware for static assets
 */
export function staticCacheMiddleware(
  _req: Request,
  res: Response,
  next: NextFunction,
): void {
  const { maxAge, immutable } = CACHE_OPTIONS.static;

  res.set({
    "Cache-Control": `public, max-age=${maxAge}${immutable ? ", immutable" : ""}`,
    Expires: new Date(Date.now() + maxAge * 1000).toUTCString(),
  });

  next();
}

/**
 * Cache Middleware for API responses
 */
export function apiCacheMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const { maxAge, mustRevalidate } = CACHE_OPTIONS.api;

  // Only cache GET requests
  if (req.method !== "GET") {
    return next();
  }

  // Skip caching for authenticated requests with sensitive data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if ((req as any).user && req.path.includes("/admin")) {
    res.set({
      "Cache-Control": "private, no-cache, no-store, must-revalidate",
      Pragma: "no-cache",
      Expires: "0",
    });
    return next();
  }

  res.set({
    "Cache-Control": `public, max-age=${maxAge}${mustRevalidate ? ", must-revalidate" : ""}`,
    Expires: new Date(Date.now() + maxAge * 1000).toUTCString(),
  });

  next();
}

/**
 * Last-Modified Middleware
 */
export function lastModifiedMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  // Check if client has matching Last-Modified
  const ifModifiedSince = req.headers["if-modified-since"];
  if (ifModifiedSince) {
    const clientDate = new Date(ifModifiedSince);
    const serverDate = new Date();

    // If resource hasn't changed, return 304
    if (serverDate <= clientDate) {
      res.status(304).end();
      return;
    }
  }

  // Set Last-Modified header
  res.set("Last-Modified", new Date().toUTCString());

  next();
}

/**
 * No Cache Middleware for HTML pages
 */
export function noCacheMiddleware(
  _req: Request,
  res: Response,
  next: NextFunction,
): void {
  res.set({
    "Cache-Control": "no-cache, no-store, must-revalidate",
    Pragma: "no-cache",
    Expires: "0",
  });

  next();
}
