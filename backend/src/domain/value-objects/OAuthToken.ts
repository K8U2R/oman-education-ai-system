/**
 * OAuth Token Value Object
 *
 * Value Object لـ OAuth tokens (Access Token, Refresh Token)
 */

export interface OAuthTokenData {
  access_token: string;
  refresh_token?: string;
  expires_in: number;
  token_type: string;
  scope?: string;
}

export class OAuthToken {
  constructor(
    public readonly accessToken: string,
    public readonly refreshToken: string | null,
    public readonly expiresIn: number,
    public readonly tokenType: string,
    public readonly scope?: string,
  ) {
    if (!accessToken || accessToken.trim().length === 0) {
      throw new Error("Access token cannot be empty");
    }
  }

  /**
   * Create from Google OAuth response
   */
  static fromGoogleResponse(data: OAuthTokenData): OAuthToken {
    return new OAuthToken(
      data.access_token,
      data.refresh_token || null,
      data.expires_in,
      data.token_type,
      data.scope,
    );
  }

  /**
   * Check if token is expired
   */
  isExpired(issuedAt: Date): boolean {
    const expirationTime = issuedAt.getTime() + this.expiresIn * 1000;
    return Date.now() > expirationTime;
  }

  /**
   * Convert to data object
   */
  toData(): OAuthTokenData {
    return {
      access_token: this.accessToken,
      refresh_token: this.refreshToken || undefined,
      expires_in: this.expiresIn,
      token_type: this.tokenType,
      scope: this.scope,
    };
  }
}
