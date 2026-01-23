/**
 * Google OAuth Adapter
 *
 * HTTP adapter for Google OAuth 2.0 API
 */

import axios, { AxiosInstance, AxiosError } from "axios";
import {
  loadGoogleOAuthConfig,
  type GoogleOAuthConfig,
} from "@/infrastructure/config/GoogleOAuthConfig";
import { OAuthToken, OAuthTokenData } from "@/domain/value-objects/OAuthToken";
import {
  GoogleUserInfo,
  GoogleUserInfoData,
} from "@/domain/value-objects/GoogleUserInfo";
import {
  OAuthCodeExchangeError,
  OAuthUserInfoError,
} from "@/domain/exceptions/OAuthExceptions";
import {
  BaseAdapter,
  type HealthStatus,
} from "@/infrastructure/adapters/base/BaseAdapter";
import { logger } from "@/shared/utils/logger";

export class GoogleOAuthAdapter extends BaseAdapter<GoogleOAuthConfig, void> {
  private readonly httpClient: AxiosInstance;

  constructor(config?: GoogleOAuthConfig) {
    super();
    // Use protected config from BaseAdapter
    this.config = config || loadGoogleOAuthConfig();
    this.httpClient = axios.create({
      timeout: 10000,
      headers: {
        Accept: "application/json",
      },
    });
    // Mark as connected since we don't need explicit connection for HTTP adapter
    this.connected = true;
  }

  /**
   * Connect (no-op for HTTP adapter)
   */
  async connect(config: GoogleOAuthConfig): Promise<void> {
    // Use protected config from BaseAdapter
    this.config = config;
    this.connected = true;
    this.logConnectionStatus("connected");
  }

  /**
   * Disconnect (no-op for HTTP adapter)
   */
  async disconnect(): Promise<void> {
    this.connected = false;
    this.logConnectionStatus("disconnected");
  }

  /**
   * Health check
   */
  async healthCheck(): Promise<HealthStatus> {
    try {
      // Simple check - try to ping Google OAuth endpoint
      const response = await this.httpClient.get(
        "https://accounts.google.com/.well-known/openid-configuration",
        {
          timeout: 5000,
        },
      );
      return response.status === 200 ? "healthy" : "degraded";
    } catch {
      return "unhealthy";
    }
  }

  /**
   * Get adapter name
   */
  getName(): string {
    return "GoogleOAuthAdapter";
  }

  /**
   * Generate Google OAuth authorization URL
   *
   * @param state - OAuth state token
   * @param codeChallenge - PKCE code challenge
   * @returns Authorization URL
   */
  getAuthorizationUrl(state: string, codeChallenge: string): string {
    if (!this.config) {
      throw new Error("GoogleOAuthAdapter not configured");
    }
    const config = this.config;
    // Log redirect URI for debugging
    logger.info("🔍 Google OAuth Redirect URI", {
      redirectUri: config.redirectUri,
      clientId: config.clientId.substring(0, 20) + "...",
    });

    const params = new URLSearchParams({
      client_id: config.clientId,
      redirect_uri: config.redirectUri,
      response_type: "code",
      scope: config.scope,
      state,
      code_challenge: codeChallenge,
      code_challenge_method: "S256",
      access_type: "offline", // Get refresh token
      prompt: "consent", // Force consent screen to get refresh token
    });

    const authorizationUrl = `${config.authorizationEndpoint}?${params.toString()}`;

    logger.debug("🔍 Full Google OAuth authorization URL", {
      url: authorizationUrl.substring(0, 200) + "...", // Truncate for logging
    });

    return authorizationUrl;
  }

  /**
   * Exchange authorization code for tokens
   *
   * @param code - Authorization code from Google
   * @param codeVerifier - PKCE code verifier
   * @returns OAuthToken
   * @throws {OAuthCodeExchangeError} If token exchange fails
   */
  async exchangeCodeForToken(
    code: string,
    codeVerifier: string,
  ): Promise<OAuthToken> {
    if (!this.config) {
      throw new Error("GoogleOAuthAdapter not configured");
    }
    const config = this.config;
    try {
      const response = await this.httpClient.post<OAuthTokenData>(
        config.tokenEndpoint,
        new URLSearchParams({
          code,
          client_id: config.clientId,
          client_secret: config.clientSecret,
          redirect_uri: config.redirectUri,
          grant_type: "authorization_code",
          code_verifier: codeVerifier,
        }),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        },
      );

      return OAuthToken.fromGoogleResponse(response.data);
    } catch (error) {
      logger.error("Google OAuth token exchange failed", {
        error: error instanceof AxiosError ? error.response?.data : error,
      });

      if (axios.isAxiosError(error)) {
        const errorMessage =
          error.response?.data?.error_description ||
          error.response?.data?.error ||
          "فشل استبدال Authorization Code";
        throw new OAuthCodeExchangeError(errorMessage);
      }

      throw new OAuthCodeExchangeError("فشل استبدال Authorization Code");
    }
  }

  /**
   * Get user info from Google
   *
   * @param accessToken - OAuth access token
   * @returns GoogleUserInfo
   * @throws {OAuthUserInfoError} If user info fetch fails
   */
  async getUserInfo(accessToken: string): Promise<GoogleUserInfo> {
    if (!this.config) {
      throw new Error("GoogleOAuthAdapter not configured");
    }
    const config = this.config;
    try {
      const response = await this.httpClient.get<GoogleUserInfoData>(
        config.userInfoEndpoint,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      return GoogleUserInfo.fromGoogleResponse(response.data);
    } catch (error) {
      logger.error("Google user info fetch failed", {
        error: error instanceof AxiosError ? error.response?.data : error,
      });

      if (axios.isAxiosError(error)) {
        const errorMessage =
          error.response?.data?.error?.message ||
          "فشل جلب معلومات المستخدم من Google";
        throw new OAuthUserInfoError(errorMessage);
      }

      throw new OAuthUserInfoError("فشل جلب معلومات المستخدم من Google");
    }
  }

  /**
   * Refresh access token
   *
   * @param refreshToken - OAuth refresh token
   * @returns OAuthToken
   * @throws {OAuthCodeExchangeError} If token refresh fails
   */
  async refreshToken(refreshToken: string): Promise<OAuthToken> {
    if (!this.config) {
      throw new Error("GoogleOAuthAdapter not configured");
    }
    const config = this.config;
    try {
      const response = await this.httpClient.post<OAuthTokenData>(
        config.tokenEndpoint,
        new URLSearchParams({
          client_id: config.clientId,
          client_secret: config.clientSecret,
          refresh_token: refreshToken,
          grant_type: "refresh_token",
        }),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        },
      );

      return OAuthToken.fromGoogleResponse(response.data);
    } catch (error) {
      logger.error("Google OAuth token refresh failed", {
        error: error instanceof AxiosError ? error.response?.data : error,
      });
      throw new OAuthCodeExchangeError("فشل تحديث Token");
    }
  }
}
