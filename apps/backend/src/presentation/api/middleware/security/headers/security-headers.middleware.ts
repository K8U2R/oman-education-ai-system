/**
 * Security Headers Middleware - برمجية وسطية لرؤوس الأمان
 *
 * Single Source of Truth for system security headers.
 * Merged from security.middleware.ts and security-headers.middleware.ts.
 */

import { Request, Response, NextFunction } from "express";
import { getSettings } from "../../../../../shared/configuration/index.js";
import { enhancedLogger } from "../../../../../shared/utils/EnhancedLogger.js";

/**
 * Security Headers Configuration
 */
interface SecurityHeadersConfig {
  contentSecurityPolicy?: {
    enabled: boolean;
    directives: Record<string, string[]>;
    upgradeInsecureRequests?: boolean;
  };
  strictTransportSecurity?: {
    enabled: boolean;
    maxAge?: number;
    includeSubDomains?: boolean;
    preload?: boolean;
  };
  xFrameOptions?: {
    enabled: boolean;
    value?: "DENY" | "SAMEORIGIN" | "ALLOW-FROM";
  };
  xContentTypeOptions?: {
    enabled: boolean;
  };
  referrerPolicy?: {
    enabled: boolean;
    value?: string;
  };
  permissionsPolicy?: {
    enabled: boolean;
    features?: Record<string, string[]>;
  };
}

const defaultConfig: SecurityHeadersConfig = {
  contentSecurityPolicy: {
    enabled: true,
    directives: {
      "default-src": ["'self'"],
      "script-src": ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      "style-src": [
        "'self'",
        "'unsafe-inline'",
        "https://fonts.googleapis.com",
      ],
      "img-src": [
        "'self'",
        "data:",
        "blob:",
        "https://*.googleusercontent.com",
      ],
      "connect-src": [
        "'self'",
        "https://api.openai.com",
        "https://api.anthropic.com",
      ],
      "font-src": ["'self'", "https://fonts.gstatic.com", "data:"],
      "object-src": ["'none'"],
      "frame-ancestors": ["'self'"],
    },
    upgradeInsecureRequests: true,
  },
  strictTransportSecurity: {
    enabled: true,
    maxAge: 31536000,
    includeSubDomains: true,
    preload: false,
  },
  xFrameOptions: {
    enabled: true,
    value: "SAMEORIGIN",
  },
  xContentTypeOptions: {
    enabled: true,
  },
  referrerPolicy: {
    enabled: true,
    value: "strict-origin-when-cross-origin",
  },
  permissionsPolicy: {
    enabled: true,
    features: {
      geolocation: [],
      microphone: [],
      camera: [],
      payment: [],
    },
  },
};

function buildCSPHeader(
  directives: Record<string, string[]>,
  upgradeInsecure: boolean,
): string {
  const parts = Object.entries(directives).map(
    ([key, values]) => `${key} ${values.join(" ")}`,
  );
  if (upgradeInsecure) parts.push("upgrade-insecure-requests");
  return parts.join("; ");
}

function buildPermissionsPolicyHeader(
  features: Record<string, string[]>,
): string {
  return Object.entries(features)
    .map(([feature, allowlist]) => `${feature}=(${allowlist.join(" ")})`)
    .join(", ");
}

/**
 * Main Security Headers Factory
 */
export function securityHeadersMiddleware(
  config: SecurityHeadersConfig = defaultConfig,
) {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const settings = getSettings();
      const finalConfig = { ...defaultConfig, ...config };
      const isDev = settings.app.env === "development";

      // CSP
      if (finalConfig.contentSecurityPolicy?.enabled) {
        const directives = { ...finalConfig.contentSecurityPolicy.directives };
        if (isDev) {
          directives["connect-src"] = [
            ...(directives["connect-src"] || []),
            "http://localhost:*",
            "ws://localhost:*",
          ];
        }
        res.setHeader(
          "Content-Security-Policy",
          buildCSPHeader(
            directives,
            !!finalConfig.contentSecurityPolicy.upgradeInsecureRequests,
          ),
        );
      }

      // HSTS (Only Production + HTTPS)
      if (
        finalConfig.strictTransportSecurity?.enabled &&
        (req.secure || req.headers["x-forwarded-proto"] === "https")
      ) {
        const hsts = finalConfig.strictTransportSecurity;
        let value = `max-age=${hsts.maxAge}`;
        if (hsts.includeSubDomains) value += "; includeSubDomains";
        if (hsts.preload) value += "; preload";
        res.setHeader("Strict-Transport-Security", value);
      }

      // Frames, Type, Referrer
      if (finalConfig.xFrameOptions?.enabled)
        res.setHeader(
          "X-Frame-Options",
          finalConfig.xFrameOptions.value || "DENY",
        );
      if (finalConfig.xContentTypeOptions?.enabled)
        res.setHeader("X-Content-Type-Options", "nosniff");
      if (finalConfig.referrerPolicy?.enabled)
        res.setHeader(
          "Referrer-Policy",
          finalConfig.referrerPolicy.value || "strict-origin",
        );

      // Permissions
      if (
        finalConfig.permissionsPolicy?.enabled &&
        finalConfig.permissionsPolicy.features
      ) {
        res.setHeader(
          "Permissions-Policy",
          buildPermissionsPolicyHeader(finalConfig.permissionsPolicy.features),
        );
      }

      // Legacy & Obscurity
      res.setHeader("X-XSS-Protection", "1; mode=block");
      res.setHeader("X-DNS-Prefetch-Control", "off");
      res.removeHeader("X-Powered-By");

      // Law 08: Fail-Safe Logging
      enhancedLogger.info("Security Headers Applied");
      next();
    } catch (error) {
      // Law 08: Fail-Safe Logging
      enhancedLogger.error("Error applying Security Headers", { error });
      next(error);
    }
  };
}

/**
 * Production Security Headers (Strict)
 */
export function productionSecurityHeadersMiddleware() {
  return securityHeadersMiddleware({
    contentSecurityPolicy: {
      enabled: true,
      directives: {
        "default-src": ["'self'"],
        "script-src": ["'self'"], // No unsafe-inline in prod
        "style-src": ["'self'", "'unsafe-inline'"],
        "img-src": [
          "'self'",
          "data:",
          "blob:",
          "https://*.googleusercontent.com",
        ],
        "connect-src": ["'self'"],
      },
      upgradeInsecureRequests: true,
    },
    strictTransportSecurity: { enabled: true, preload: true },
  });
}

/**
 * Development Security Headers (Lenient for Vite/HMR)
 */
export function developmentSecurityHeadersMiddleware() {
  return securityHeadersMiddleware({
    contentSecurityPolicy: {
      enabled: true,
      directives: {
        "default-src": ["'self'"],
        "script-src": ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
        "style-src": [
          "'self'",
          "'unsafe-inline'",
          "https://fonts.googleapis.com",
        ],
        "img-src": [
          "'self'",
          "data:",
          "blob:",
          "https://*.googleusercontent.com",
        ],
        "connect-src": [
          "'self'",
          "https://api.openai.com",
          "https://api.anthropic.com",
          "http://localhost:*",
          "ws://localhost:*",
        ],
        "font-src": ["'self'", "https://fonts.gstatic.com", "data:"],
        "object-src": ["'none'"],
        "frame-ancestors": ["'self'"],
      },
      upgradeInsecureRequests: false,
    },
    strictTransportSecurity: { enabled: false },
  });
}

/**
 * API Security Headers (Lightweight)
 */
export function apiSecurityHeadersMiddleware() {
  return (_req: Request, res: Response, next: NextFunction): void => {
    try {
      res.setHeader("X-Content-Type-Options", "nosniff");
      res.setHeader("X-Frame-Options", "DENY");
      res.setHeader("Referrer-Policy", "no-referrer");
      res.removeHeader("X-Powered-By");

      // Law 08: Fail-Safe Logging
      enhancedLogger.info("API Security Headers Applied");
      next();
    } catch (error) {
      // Law 08: Fail-Safe Logging
      enhancedLogger.error("Error applying API Security Headers", { error });
      next(error);
    }
  };
}
