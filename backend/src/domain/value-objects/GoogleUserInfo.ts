/**
 * Google User Info Value Object
 *
 * Value Object لمعلومات المستخدم من Google
 */

export interface GoogleUserInfoData {
  id: string;
  email: string;
  verified_email: boolean;
  name: string;
  given_name?: string;
  family_name?: string;
  picture?: string;
  locale?: string;
}

export class GoogleUserInfo {
  constructor(
    public readonly id: string,
    public readonly email: string,
    public readonly verifiedEmail: boolean,
    public readonly name: string,
    public readonly givenName?: string,
    public readonly familyName?: string,
    public readonly picture?: string,
    public readonly locale?: string,
  ) {
    if (!id || id.trim().length === 0) {
      throw new Error("Google user ID cannot be empty");
    }
    if (!email || email.trim().length === 0) {
      throw new Error("Email cannot be empty");
    }
  }

  /**
   * Create from Google API response
   */
  static fromGoogleResponse(data: GoogleUserInfoData): GoogleUserInfo {
    return new GoogleUserInfo(
      data.id,
      data.email,
      data.verified_email,
      data.name,
      data.given_name,
      data.family_name,
      data.picture,
      data.locale,
    );
  }

  /**
   * Convert to data object
   */
  toData(): GoogleUserInfoData {
    return {
      id: this.id,
      email: this.email,
      verified_email: this.verifiedEmail,
      name: this.name,
      given_name: this.givenName,
      family_name: this.familyName,
      picture: this.picture,
      locale: this.locale,
    };
  }
}
