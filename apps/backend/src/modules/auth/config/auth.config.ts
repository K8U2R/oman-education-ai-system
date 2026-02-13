import { ENV_CONFIG } from "../../../infrastructure/config/env.config.js";

/**
 * Auth Configuration - إعدادات المصادقة
 *
 * Centralized, validated configuration for the Auth Cluster.
 * Follows "Config Decoupling" architecture.
 */
export const authConfig = {
  jwt: {
    accessSecret: ENV_CONFIG.JWT_SECRET as string,
    refreshSecret: ENV_CONFIG.SESSION_SECRET as string, // Fallback to session secret if needed, but in reality we used access/refresh secrets
    accessExpiry: ENV_CONFIG.JWT_ACCESS_EXPIRY || "15m",
    refreshExpiry: ENV_CONFIG.JWT_REFRESH_EXPIRY || "7d",
  },
  google: {
    clientId: ENV_CONFIG.GOOGLE_CLIENT_ID as string,
    clientSecret: ENV_CONFIG.GOOGLE_CLIENT_SECRET as string,
    callbackUrl: ENV_CONFIG.GOOGLE_CALLBACK_URL as string,
  },
  security: {
    rateLimitEnabled: ENV_CONFIG.RATE_LIMIT_ENABLED,
    rateLimitPerMinute: 60,
  },
};

export type AuthConfig = typeof authConfig;
