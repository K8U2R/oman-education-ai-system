/**
 * Google OAuth Configuration
 *
 * Configuration for Google OAuth 2.0
 */

import { z } from "zod";
import { ConfigurationError } from "@/domain/exceptions";

const GoogleOAuthConfigSchema = z.object({
  clientId: z.string().min(1, "GOOGLE_OAUTH_CLIENT_ID is required"),
  clientSecret: z.string().min(1, "GOOGLE_OAUTH_CLIENT_SECRET is required"),
  redirectUri: z.string().url("GOOGLE_OAUTH_REDIRECT_URI must be a valid URL"),
  scope: z.string().default("openid email profile"),
  authorizationEndpoint: z
    .string()
    .url()
    .default("https://accounts.google.com/o/oauth2/v2/auth"),
  tokenEndpoint: z
    .string()
    .url()
    .default("https://oauth2.googleapis.com/token"),
  userInfoEndpoint: z
    .string()
    .url()
    .default("https://www.googleapis.com/oauth2/v2/userinfo"),
});

export type GoogleOAuthConfig = z.infer<typeof GoogleOAuthConfigSchema>;

/**
 * Load Google OAuth configuration from environment
 *
 * @throws {ConfigurationError} If required configuration is missing
 */
export function loadGoogleOAuthConfig(): GoogleOAuthConfig {
  const { ENV_CONFIG } = require("../env.config.js");

  const config = {
    clientId: ENV_CONFIG.GOOGLE_CLIENT_ID || "",
    clientSecret: ENV_CONFIG.GOOGLE_CLIENT_SECRET || "",
    redirectUri: ENV_CONFIG.GOOGLE_CALLBACK_URL, // Already has default in schema
    scope: process.env.GOOGLE_OAUTH_SCOPE || "openid email profile",
  };

  try {
    return GoogleOAuthConfigSchema.parse(config);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new ConfigurationError(
        `Invalid Google OAuth configuration: ${error.errors.map((e) => e.message).join(", ")}`,
      );
    }
    throw error;
  }
}
