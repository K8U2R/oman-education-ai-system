/**
 * Google OAuth Repository
 *
 * Database operations for Google OAuth
 * يستخدم BaseRepository لتقليل التكرار
 */

import { IGoogleOAuthRepository } from "@/domain/interfaces/repositories";
import { DatabaseCoreAdapter } from "../adapters/db/DatabaseCoreAdapter";
import { BaseRepository } from "./BaseRepository";
import { User } from "@/domain/entities/User";
import { GoogleUserInfo } from "@/domain/value-objects/GoogleUserInfo";
import { OAuthState } from "@/domain/entities/OAuthState";
import { UserData } from "@/domain/types/auth";

export class GoogleOAuthRepository
  extends BaseRepository
  implements IGoogleOAuthRepository
{
  constructor(databaseAdapter: DatabaseCoreAdapter) {
    super(databaseAdapter);
  }

  /**
   * Get repository name
   */
  protected getRepositoryName(): string {
    return "GoogleOAuthRepository";
  }

  /**
   * Create OAuth state
   * Note: This is delegated to OAuthStateRepository
   */
  async createState(
    _redirectTo: string,
    _codeVerifier: string,
    _expiresInSeconds: number,
  ): Promise<OAuthState> {
    throw new Error("Use OAuthStateRepository for state management");
  }

  /**
   * Find state by token
   * Note: This is delegated to OAuthStateRepository
   */
  async findStateByToken(_stateToken: string): Promise<OAuthState | null> {
    throw new Error("Use OAuthStateRepository for state management");
  }

  /**
   * Delete state
   * Note: This is delegated to OAuthStateRepository
   */
  async deleteState(_stateToken: string): Promise<void> {
    throw new Error("Use OAuthStateRepository for state management");
  }

  /**
   * Find user by Google ID
   *
   * @param googleId - Google user ID
   * @returns User or null if not found
   */
  async findUserByGoogleId(googleId: string): Promise<User | null> {
    try {
      const userData = await this.findOne<
        UserData & {
          google_id?: string;
          google_email?: string;
          oauth_provider?: string;
          planTier: "FREE";
        }
      >("users", {
        google_id: googleId,
      });

      if (!userData) {
        return null;
      }

      return User.fromData(userData);
    } catch (error) {
      this.logError("findUserByGoogleId", error, { googleId });
      return null;
    }
  }

  /**
   * Create user from Google info
   *
   * @param googleUserInfo - Google user information
   * @returns User
   */
  async createUserFromGoogle(googleUserInfo: GoogleUserInfo): Promise<User> {
    return this.executeWithErrorHandling(
      async () => {
        // Check if user exists with same email
        const existingUser = await this.findOne<UserData>("users", {
          email: googleUserInfo.email.toLowerCase(),
        });

        if (existingUser) {
          // Link Google account to existing user
          // إذا كان Google قد تحقق من البريد، قم بتحديث is_verified
          await this.linkGoogleAccount(
            existingUser.id,
            googleUserInfo.id,
            googleUserInfo.email,
            googleUserInfo.verifiedEmail,
          );
          // إعادة جلب المستخدم بعد التحديث للحصول على البيانات المحدثة
          const updatedUser = await this.findOne<UserData>("users", {
            id: existingUser.id,
          });
          return updatedUser
            ? User.fromData(updatedUser)
            : User.fromData(existingUser);
        }

        // Create new user
        const userData: Omit<UserData, "id" | "created_at" | "updated_at"> & {
          google_id?: string;
          google_email?: string;
          oauth_provider?: string;
          oauth_linked_at?: string;
          planTier: "FREE";
        } = {
          email: googleUserInfo.email.toLowerCase(),
          password_hash: undefined, // No password for OAuth users
          first_name:
            googleUserInfo.givenName || googleUserInfo.name.split(" ")[0] || "",
          last_name:
            googleUserInfo.familyName ||
            googleUserInfo.name.split(" ").slice(1).join(" ") ||
            "",
          username: googleUserInfo.email.split("@")[0],
          role: "student",
          is_verified: googleUserInfo.verifiedEmail,
          is_active: true,
          permissions: [],
          avatar_url: googleUserInfo.picture,
          google_id: googleUserInfo.id,
          google_email: googleUserInfo.email,
          oauth_provider: "google",
          oauth_linked_at: new Date().toISOString(),
          planTier: "FREE",
        };

        const inserted = await this.insert<
          UserData & {
            google_id?: string;
            google_email?: string;
            oauth_provider?: string;
            oauth_linked_at?: string;
            planTier: "FREE";
          }
        >("users", {
          ...userData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });

        this.logOperation("createUserFromGoogle", {
          userId: inserted.id,
          email: inserted.email,
          googleId: googleUserInfo.id,
        });

        return User.fromData(inserted);
      },
      "createUserFromGoogle",
      { email: googleUserInfo.email, googleId: googleUserInfo.id },
    );
  }

  /**
   * Link Google account to existing user
   *
   * @param userId - User ID
   * @param googleId - Google user ID
   * @param googleEmail - Google email
   * @param verifiedEmail - هل Google قد تحقق من البريد الإلكتروني
   */
  async linkGoogleAccount(
    userId: string,
    googleId: string,
    googleEmail: string,
    verifiedEmail?: boolean,
  ): Promise<void> {
    return this.executeWithErrorHandling(
      async () => {
        const updateData: Record<string, unknown> = {
          google_id: googleId,
          google_email: googleEmail,
          oauth_provider: "google",
          oauth_linked_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        // إذا كان Google قد تحقق من البريد، قم بتحديث is_verified
        if (verifiedEmail === true) {
          updateData.is_verified = true;
          this.logOperation("linkGoogleAccount", {
            userId,
            googleId,
            verifiedEmail,
          });
        }

        await this.databaseAdapter.update("users", { id: userId }, updateData);

        this.logOperation("linkGoogleAccount", {
          userId,
          googleId,
          verifiedEmailUpdated: verifiedEmail === true,
        });
      },
      "linkGoogleAccount",
      { userId, googleId },
    );
  }

  /**
   * Update user whitelist information
   *
   * @param userId - User ID
   * @param permissionSource - مصدر
   * @param whitelistEntryId - معرف القائمة البيضاء (اختياري)
   * @param role - الدور من whitelist (اختياري)
   * @param permissions -  من whitelist (اختياري)
   * @param isVerified - حالة التحقق (اختياري، للـ whitelist users يجب أن يكون true)
   */
  async updateWhitelistInfo(
    userId: string,
    permissionSource: "default" | "whitelist",
    whitelistEntryId?: string | null,
    role?: string,
    permissions?: string[],
    isVerified?: boolean,
  ): Promise<User> {
    return this.executeWithErrorHandling(
      async () => {
        const updateData: Record<string, unknown> = {
          permission_source: permissionSource,
          updated_at: new Date().toISOString(),
        };

        if (whitelistEntryId !== undefined) {
          updateData.whitelist_entry_id = whitelistEntryId;
        }

        // تحديث role و permissions من whitelist إذا كانت متوفرة
        if (role) {
          updateData.role = role;
        }

        if (permissions && permissions.length > 0) {
          updateData.permissions = permissions;
        }

        // تحديث is_verified - إذا كان من whitelist، يجب أن يكون true
        if (isVerified !== undefined) {
          updateData.is_verified = isVerified;
        } else if (permissionSource === "whitelist") {
          // إذا كان من whitelist ولم يتم تحديد isVerified، اجعله true تلقائياً
          updateData.is_verified = true;
        }

        const updated = await this.databaseAdapter.update<UserData>(
          "users",
          { id: userId },
          updateData,
        );

        if (!updated) {
          throw new Error("Failed to update user whitelist info");
        }

        this.logOperation("updateWhitelistInfo", {
          userId,
          permissionSource,
          whitelistEntryId,
          role,
          permissionsCount: permissions?.length || 0,
          isVerified: updateData.is_verified,
        });

        return User.fromData(updated);
      },
      "updateWhitelistInfo",
      { userId, permissionSource },
    );
  }
}
