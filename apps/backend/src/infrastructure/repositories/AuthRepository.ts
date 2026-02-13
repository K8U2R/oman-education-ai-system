/**
 * Auth Repository - مستودع المصادقة
 *
 * تطبيق IAuthRepository باستخدام Database Core Adapter
 *
 * @example
 * ```typescript
 * const repository = new AuthRepository(databaseAdapter, tokenService)
 * const result = await repository.login({ email: 'user@example.com', password: 'password' })
 * ```
 */

import { IAuthRepository } from "../../domain/interfaces/repositories/index.js";
import { IRefreshTokenRepository } from "../../domain/interfaces/repositories/index.js";
import { User } from "../../domain/entities/User.js";
import {
  LoginRequest,
  RegisterRequest,
  RefreshTokenRequest,
  RefreshTokenResponse,
  LoginResponse,
  UserData,
  VerificationTokenData,
} from "../../domain/types/auth/index.js";
import {
  AuthenticationFailedError,
  UserNotFoundError,
  UserAlreadyExistsError,
  InvalidTokenError,
  InvalidPasswordError,
  InvalidEmailError,
  RegistrationFailedError,
} from "../../domain/exceptions/index.js";
import { DatabaseCoreAdapter } from "../adapters/db/DatabaseCoreAdapter.js";
import { TokenService } from "../../modules/auth/services/identity/TokenService.js";
import {
  Password,
  type HashedPassword,
} from "../../domain/value-objects/Password.js";
import { logger } from "../../shared/utils/logger.js";
import {
  DatabaseQueryConditions,
  DatabaseQueryOptions,
} from "../../domain/types/index.js";

import { randomUUID } from "crypto";

export class AuthRepository implements IAuthRepository {
  /**
   * إنشاء Auth Repository
   *
   * @param databaseAdapter - Database Core Adapter
   * @param tokenService - خدمة Token
   */
  constructor(
    private readonly databaseAdapter: DatabaseCoreAdapter,
    private readonly tokenService: TokenService,
    private readonly refreshTokenRepository: IRefreshTokenRepository,
  ) {}

  /**
   * البحث عن مستخدمين باستخدام شروط قاعدة البيانات
   *
   * @param conditions - شروط البحث
   * @param options - خيارات البحث
   */
  async find(
    conditions?: DatabaseQueryConditions,
    options?: DatabaseQueryOptions,
  ): Promise<UserData[]> {
    const adapterOptions = options
      ? {
          limit: options.limit,
          offset: options.offset,
          orderBy: Array.isArray(options.orderBy)
            ? options.orderBy[0]
            : options.orderBy,
        }
      : undefined;

    return this.databaseAdapter.find<UserData>(
      "users",
      conditions,
      adapterOptions,
    );
  }

  /**
   * تسجيل الدخول
   *
   * @param credentials - بيانات تسجيل الدخول
   * @returns LoginResponse
   * @throws {AuthenticationFailedError} إذا فشل تسجيل الدخول
   */
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    // Find user by email
    const userData = await this.databaseAdapter.findOne<UserData>("users", {
      email: credentials.email.toLowerCase(),
    });

    if (!userData) {
      throw new AuthenticationFailedError(
        "البريد الإلكتروني أو كلمة المرور غير صحيحة",
      );
    }

    // Verify password
    const password = new Password(credentials.password);
    const isValid = await password.verify(
      userData.password_hash as HashedPassword,
    );

    if (!isValid) {
      throw new AuthenticationFailedError(
        "البريد الإلكتروني أو كلمة المرور غير صحيحة",
      );
    }

    // Check if account is active
    if (!userData.is_active) {
      throw new AuthenticationFailedError("الحساب معطّل");
    }

    // Note: Account verification check (is_verified) is handled in LoginUseCase
    // to allow unverified accounts in development mode for testing

    // Generate tokens
    const accessToken = this.tokenService.generateAccessToken(
      userData.id,
      userData.email,
      userData.role,
    );
    const refreshToken = this.tokenService.generateRefreshToken(
      userData.id,
      userData.email,
    );

    // Store refresh token in database
    const decodedRefresh = this.tokenService.verifyToken(refreshToken);
    if (decodedRefresh) {
      await this.refreshTokenRepository.create({
        user_id: userData.id,
        token: refreshToken,
        expires_at: new Date(
          Date.now() + 7 * 24 * 60 * 60 * 1000,
        ).toISOString(), // 7 days (default if not configurable)
      });
    }

    // Remove password hash from response
    // Remove password hash from response
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password_hash, ...userWithoutPassword } = userData;

    return {
      user: userWithoutPassword,
      tokens: {
        access_token: accessToken,
        refresh_token: refreshToken,
        token_type: "Bearer",
        expires_in: 3600,
      },
    };
  }

  /**
   * التسجيل (إنشاء حساب جديد)
   *
   * @param data - بيانات التسجيل
   * @returns User instance
   * @throws {UserAlreadyExistsError} إذا كان المستخدم موجوداً بالفعل
   */
  async register(data: RegisterRequest): Promise<User> {
    try {
      // Check if user already exists
      const existingUser = await this.databaseAdapter.findOne<UserData>(
        "users",
        {
          email: data.email.toLowerCase(),
        },
      );

      if (existingUser) {
        throw new UserAlreadyExistsError(
          "المستخدم موجود بالفعل بهذا البريد الإلكتروني",
        );
      }

      // Hash password
      const password = new Password(data.password);
      const passwordHash = await password.hash();

      // Create user data
      const userData: Omit<UserData, "id" | "created_at" | "updated_at"> = {
        email: data.email.toLowerCase(),
        password_hash: passwordHash,
        first_name: data.first_name,
        last_name: data.last_name,
        username: data.username,
        role: data.role || "student",
        is_verified: false,
        is_active: true,
        permissions: [],
        planTier: "FREE",
      };

      // Insert user
      const createdUser = await this.databaseAdapter.insert<UserData>("users", {
        ...userData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });

      logger.info("User registered", {
        userId: createdUser.id,
        email: createdUser.email,
      });

      return User.fromData(createdUser);
    } catch (error: unknown) {
      // Re-throw domain exceptions as-is
      if (
        error instanceof UserAlreadyExistsError ||
        error instanceof InvalidPasswordError ||
        error instanceof InvalidEmailError
      ) {
        throw error;
      }

      // Wrap other errors
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      logger.error("Registration failed", {
        error: errorMessage,
        email: data.email,
      });
      throw new RegistrationFailedError(`فشل التسجيل: ${errorMessage}`);
    }
  }

  /**
   * تسجيل الخروج
   *
   * @param refreshToken - Refresh Token المراد إلغاؤه
   * @returns void
   */
  async logout(refreshToken: string): Promise<void> {
    // In a real implementation, we would invalidate the refresh token
    // For now, we'll just log the logout
    try {
      const payload = this.tokenService.verifyToken(refreshToken);
      if (payload) {
        logger.info("User logging out", { userId: payload.userId });

        // Invalidate the token in DB
        const storedToken =
          await this.refreshTokenRepository.findByToken(refreshToken);
        if (storedToken) {
          await this.refreshTokenRepository.update(storedToken.id, {
            revoked: true,
          });
        }
      }
    } catch (error) {
      logger.warn("Invalid refresh token during logout", { error });
    }
  }

  /**
   * الحصول على المستخدم الحالي
   *
   * @param userId - معرف المستخدم
   * @returns User instance
   * @throws {UserNotFoundError} إذا لم يتم العثور على المستخدم
   */
  async getCurrentUser(userId: string): Promise<User> {
    const userData = await this.databaseAdapter.findOne<UserData>("users", {
      id: userId,
    });

    if (!userData) {
      throw new UserNotFoundError("المستخدم غير موجود");
    }

    return User.fromData(userData);
  }

  /**
   * تحديث Token
   *
   * @param request - RefreshTokenRequest
   * @returns RefreshTokenResponse
   * @throws {InvalidTokenError} إذا كان Token غير صحيح
   */
  async refreshToken(
    request: RefreshTokenRequest,
  ): Promise<RefreshTokenResponse> {
    const payload = this.tokenService.verifyToken(request.refresh_token);

    if (!payload || payload.type !== "refresh") {
      throw new InvalidTokenError("Refresh Token غير صحيح");
    }

    // Get user
    const user = await this.getCurrentUser(payload.userId);

    // Generate new tokens
    const accessToken = this.tokenService.generateAccessToken(
      user.id,
      user.email.toString(),
      user.role,
    );
    const refreshToken = this.tokenService.generateRefreshToken(
      user.id,
      user.email.toString(),
    );

    return {
      tokens: {
        access_token: accessToken,
        refresh_token: refreshToken,
        token_type: "Bearer",
        expires_in: 3600,
      },
    };
  }

  /**
   * التحقق من صحة Token
   *
   * @param token - Access Token
   * @returns UserData
   * @throws {InvalidTokenError} إذا كان Token غير صحيح
   */
  async verifyToken(token: string): Promise<UserData> {
    const payload = this.tokenService.verifyToken(token);

    if (!payload || payload.type !== "access") {
      throw new InvalidTokenError("Token غير صحيح");
    }

    const user = await this.getCurrentUser(payload.userId);
    return user.toData();
  }

  /**
   * البحث عن مستخدم بالبريد الإلكتروني
   *
   * @param email - البريد الإلكتروني
   * @returns User instance أو null
   */
  async findByEmail(email: string): Promise<User | null> {
    const userData = await this.databaseAdapter.findOne<UserData>("users", {
      email: email.toLowerCase(),
    });

    if (!userData) {
      return null;
    }

    return User.fromData(userData);
  }

  /**
   * البحث عن مستخدم بالمعرف
   *
   * @param id - معرف المستخدم
   * @returns User instance أو null
   */
  async findById(id: string): Promise<User | null> {
    const userData = await this.databaseAdapter.findOne<UserData>("users", {
      id,
    });

    if (!userData) {
      return null;
    }

    return User.fromData(userData);
  }

  /**
   * تحديث بيانات المستخدم
   *
   * @param userId - معرف المستخدم
   * @param data - البيانات المراد تحديثها
   * @returns User instance محدّث
   * @throws {UserNotFoundError} إذا لم يتم العثور على المستخدم
   */
  async updateUser(userId: string, data: Partial<UserData>): Promise<User> {
    const existingUser = await this.findById(userId);

    if (!existingUser) {
      throw new UserNotFoundError("المستخدم غير موجود");
    }

    const updatedUser = await this.databaseAdapter.update<UserData>(
      "users",
      { id: userId },
      {
        ...data,
        updated_at: new Date().toISOString(),
      },
    );

    if (!updatedUser) {
      throw new UserNotFoundError("فشل تحديث المستخدم");
    }

    return User.fromData(updatedUser);
  }

  /**
   * تحديث كلمة المرور
   *
   * @param userId - معرف المستخدم
   * @param currentPassword - كلمة المرور الحالية
   * @param newPassword - كلمة المرور الجديدة
   * @returns void
   * @throws {UserNotFoundError} إذا لم يتم العثور على المستخدم
   * @throws {AuthenticationFailedError} إذا كانت كلمة المرور الحالية غير صحيحة
   */
  async updatePassword(
    userId: string,
    currentPassword: string,
    newPassword: string,
  ): Promise<void> {
    const user = await this.findById(userId);

    if (!user) {
      throw new UserNotFoundError("المستخدم غير موجود");
    }

    // Get user data with password hash
    const userData = await this.databaseAdapter.findOne<UserData>("users", {
      id: userId,
    });

    if (!userData || !userData.password_hash) {
      throw new UserNotFoundError("المستخدم غير موجود");
    }

    // Verify current password
    const password = new Password(currentPassword);
    const isValid = await password.verify(
      userData.password_hash as HashedPassword,
    );

    if (!isValid) {
      throw new AuthenticationFailedError("كلمة المرور الحالية غير صحيحة");
    }

    // Hash new password
    const newPasswordObj = new Password(newPassword);
    const newPasswordHash = await newPasswordObj.hash();

    // Update password
    await this.databaseAdapter.update(
      "users",
      { id: userId },
      {
        password_hash: newPasswordHash,
        updated_at: new Date().toISOString(),
      },
    );

    logger.info("Password updated", { userId });
  }

  /**
   * تحديث كلمة المرور مباشرة (لإعادة التعيين)
   *
   * @param userId - معرف المستخدم
   * @param newPasswordHash - كلمة المرور الجديدة المشفرة
   * @returns void
   * @throws {UserNotFoundError} إذا لم يتم العثور على المستخدم
   */
  async updatePasswordHash(
    userId: string,
    newPasswordHash: string | HashedPassword,
  ): Promise<void> {
    const user = await this.findById(userId);

    if (!user) {
      throw new UserNotFoundError("المستخدم غير موجود");
    }

    // Update password hash directly (for password reset)
    await this.databaseAdapter.update(
      "users",
      { id: userId },
      {
        password_hash: newPasswordHash,
        updated_at: new Date().toISOString(),
      },
    );

    logger.info("Password hash updated", { userId });
  }

  /**
   * إنشاء رمز التحقق
   *
   * @param userId - معرف المستخدم
   * @param token - رمز التحقق
   * @param type - نوع الرمز (email_verification, password_reset)
   * @param expiresAt - تاريخ انتهاء الصلاحية
   * @returns void
   */
  async createVerificationToken(
    userId: string,
    token: string,
    type: "email_verification" | "password_reset",
    expiresAt: Date,
  ): Promise<void> {
    const tokenData: VerificationTokenData = {
      id: randomUUID(),
      user_id: userId,
      token,
      type,
      expires_at: expiresAt.toISOString(),
      used: false,
      created_at: new Date().toISOString(),
    };

    await this.databaseAdapter.insert<VerificationTokenData>(
      "verification_tokens",
      tokenData as unknown as Record<string, unknown>,
    );

    logger.info("Verification token created", {
      userId,
      tokenType: type,
      expiresAt: expiresAt.toISOString(),
    });
  }

  /**
   * البحث عن رمز التحقق
   *
   * @param token - رمز التحقق
   * @returns VerificationTokenData أو null إذا لم يتم العثور عليه
   */
  async findVerificationToken(
    token: string,
  ): Promise<VerificationTokenData | null> {
    const tokenData = await this.databaseAdapter.findOne<VerificationTokenData>(
      "verification_tokens",
      { token },
    );

    return tokenData || null;
  }

  /**
   * تحديد رمز التحقق كمستخدم
   *
   * @param tokenId - معرف رمز التحقق
   * @returns void
   */
  async markVerificationTokenAsUsed(tokenId: string): Promise<void> {
    await this.databaseAdapter.update<VerificationTokenData>(
      "verification_tokens",
      { id: tokenId },
      { used: true },
    );

    logger.info("Verification token marked as used", { tokenId });
  }

  /**
   * مزامنة مستخدم خارجي (مثل Supabase)
   *
   * @param data - بيانات المستخدم
   * @returns User instance
   */
  async syncExternalUser(data: {
    id: string;
    email: string;
    role: string;
    is_verified: boolean;
    username: string;
  }): Promise<User> {
    // Validate role
    const validRoles = [
      "student",
      "teacher",
      "admin",
      "parent",
      "moderator",
      "developer",
    ];
    const userRole = (
      validRoles.includes(data.role) ? data.role : "student"
    ) as "student" | "teacher" | "admin" | "parent" | "moderator" | "developer";

    const userData: Omit<UserData, "created_at" | "updated_at"> = {
      id: data.id,
      email: data.email.toLowerCase(),
      first_name: "", // Can be updated later
      last_name: "",
      username: data.username,
      role: userRole,
      is_verified: data.is_verified,
      is_active: true,
      permissions: [],
      // Use a dummy hash for external users or allow null if schema supports it
      // For now, we generate a random secure password hash effectively disabling password login
      // unless they set one later.
      password_hash: await new Password(randomUUID()).hash(),
      permission_source: "default",
      planTier: "FREE",
    };

    const createdUser = await this.databaseAdapter.insert<UserData>("users", {
      ...userData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    logger.info("External user synced/created via JIT", {
      userId: createdUser.id,
      email: createdUser.email,
    });

    return User.fromData(createdUser);
  }

  /**
   * تحديث وقت آخر ظهور للمستخدم
   *
   * @param userId - معرف المستخدم
   * @returns void
   */
  async updateLastLogin(userId: string): Promise<void> {
    await this.databaseAdapter.update(
      "users",
      { id: userId },
      {
        last_login_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    );
    logger.info("Updated last_login_at", { userId });
  }
}
