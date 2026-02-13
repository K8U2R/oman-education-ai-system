/**
 * Google OAuth Configuration
 *
 * Configuration for Google OAuth 2.0
 */

import { z } from "zod";
import { ConfigurationError } from "@/domain/exceptions";
import { ENV_CONFIG } from "../../env.config"; // Fixed import

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
 * @compliance Emergency Audit Item #2 - Dynamic Callback URL
 */
export function loadGoogleOAuthConfig(): GoogleOAuthConfig {
  // ✅ Dynamic Callback URL based on environment
  const baseUrl = ENV_CONFIG.APP_URL || ENV_CONFIG.GOOGLE_CALLBACK_URL || "";
  const redirectUri = baseUrl.includes("/callback")
    ? baseUrl // Already complete URL from GOOGLE_CALLBACK_URL
    : `${baseUrl}/api/v1/auth/google/callback`; // Construct from APP_URL

  const config = {
    clientId: ENV_CONFIG.GOOGLE_CLIENT_ID || "",
    clientSecret: ENV_CONFIG.GOOGLE_CLIENT_SECRET || "",
    redirectUri, // ✅ Now dynamic
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
