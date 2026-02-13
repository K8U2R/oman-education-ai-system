/**
 * Google OAuth Repository Interface
 *
 * Interface لـ Repository operations المتعلقة بـ Google OAuth
 */

import { User } from "../../../../entities/User.js";
import { GoogleUserInfo } from "../../../../value-objects/GoogleUserInfo.js";
import { OAuthState } from "../../../../entities/OAuthState.js";

export interface IGoogleOAuthRepository {
  /**
   * إنشاء OAuth State
   *
   * @param redirectTo - URL للعودة بعد OAuth
   * @param codeVerifier - PKCE code verifier
   * @param expiresInSeconds - مدة صلاحية State بالثواني
   * @returns OAuthState
   */
  createState(
    redirectTo: string,
    codeVerifier: string,
    expiresInSeconds: number,
  ): Promise<OAuthState>;

  /**
   * البحث عن State بواسطة token
   *
   * @param stateToken - State token
   * @returns OAuthState أو null إذا لم يوجد
   */
  findStateByToken(stateToken: string): Promise<OAuthState | null>;

  /**
   * حذف State
   *
   * @param stateToken - State token
   */
  deleteState(stateToken: string): Promise<void>;

  /**
   * البحث عن مستخدم بواسطة Google ID
   *
   * @param googleId - Google user ID
   * @returns User أو null إذا لم يوجد
   */
  findUserByGoogleId(googleId: string): Promise<User | null>;

  /**
   * إنشاء مستخدم جديد من Google
   *
   * @param googleUserInfo - معلومات المستخدم من Google
   * @returns User
   */
  createUserFromGoogle(googleUserInfo: GoogleUserInfo): Promise<User>;

  /**
   * ربط حساب Google مع مستخدم موجود
   *
   * @param userId - User ID
   * @param googleId - Google user ID
   * @param googleEmail - Google email
   */
  linkGoogleAccount(
    userId: string,
    googleId: string,
    googleEmail: string,
  ): Promise<void>;
}
