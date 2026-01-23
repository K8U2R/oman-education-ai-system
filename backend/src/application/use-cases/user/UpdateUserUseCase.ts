/**
 * Update User Use Case - حالة استخدام تحديث بيانات المستخدم
 *
 * Use Case مسؤول عن منطق تحديث بيانات المستخدم
 *
 * @example
 * ```typescript
 * const updateUserUseCase = new UpdateUserUseCase(authRepository)
 * const user = await updateUserUseCase.execute('user-id', {
 *   first_name: 'أحمد',
 *   last_name: 'محمد',
 *   username: 'ahmed_mohammed'
 * })
 * ```
 */

// Domain Layer - استخدام barrel exports
import { IAuthRepository, UserData, User, UserNotFoundError } from "@/domain";
import { ValidationError } from "@/domain/exceptions";

// Shared Layer - استخدام common.ts
import { logger } from "@/shared/common";

export interface UpdateUserRequest {
  userId: string;
  data: Partial<
    Pick<UserData, "first_name" | "last_name" | "username" | "avatar_url">
  >;
}

export class UpdateUserUseCase {
  /**
   * إنشاء Update User Use Case
   *
   * @param authRepository - مستودع المصادقة
   */
  constructor(private readonly authRepository: IAuthRepository) {}

  /**
   * تنفيذ تحديث بيانات المستخدم
   *
   * @param request - طلب تحديث بيانات المستخدم
   * @returns User instance محدّث
   * @throws {UserNotFoundError} إذا لم يتم العثور على المستخدم
   *
   * @example
   * ```typescript
   * const user = await updateUserUseCase.execute({
   *   userId: 'user-id',
   *   data: {
   *     first_name: 'أحمد',
   *     last_name: 'محمد',
   *     username: 'ahmed_mohammed',
   *     avatar_url: 'https://example.com/avatar.jpg'
   *   }
   * })
   * ```
   */
  async execute(request: UpdateUserRequest): Promise<User> {
    // Validate userId
    if (!request.userId || typeof request.userId !== "string") {
      logger.warn("Invalid userId in update user request", {
        userId: request.userId,
      });
      throw new UserNotFoundError("معرف المستخدم غير صحيح");
    }

    // Validate update data
    const updateData: Partial<UserData> = {};

    if (request.data.first_name !== undefined) {
      if (
        typeof request.data.first_name !== "string" ||
        request.data.first_name.length > 100
      ) {
        throw new ValidationError(
          "first_name يجب أن يكون نصاً ولا يتجاوز 100 حرف",
        );
      }
      updateData.first_name = request.data.first_name.trim();
    }

    if (request.data.last_name !== undefined) {
      if (
        typeof request.data.last_name !== "string" ||
        request.data.last_name.length > 100
      ) {
        throw new ValidationError(
          "last_name يجب أن يكون نصاً ولا يتجاوز 100 حرف",
        );
      }
      updateData.last_name = request.data.last_name.trim();
    }

    if (request.data.username !== undefined) {
      if (request.data.username === null || request.data.username === "") {
        // Set to undefined to clear the field
        updateData.username = undefined;
      } else if (typeof request.data.username === "string") {
        // Validate username format: alphanumeric + underscore, max 100 chars
        const usernameRegex = /^[a-zA-Z0-9_]+$/;
        if (
          !usernameRegex.test(request.data.username) ||
          request.data.username.length > 100
        ) {
          throw new ValidationError(
            "username يجب أن يحتوي على أحرف وأرقام وشرطة سفلية فقط ولا يتجاوز 100 حرف",
          );
        }
        updateData.username = request.data.username.trim();
      } else {
        throw new ValidationError("username يجب أن يكون نصاً أو null");
      }
    }

    if (request.data.avatar_url !== undefined) {
      if (request.data.avatar_url === null || request.data.avatar_url === "") {
        // Set to undefined to clear the field
        updateData.avatar_url = undefined;
      } else if (typeof request.data.avatar_url === "string") {
        // Validate URL format
        try {
          new URL(request.data.avatar_url);
          updateData.avatar_url = request.data.avatar_url.trim();
        } catch {
          throw new ValidationError("avatar_url يجب أن يكون رابطاً صحيحاً");
        }
      } else {
        throw new ValidationError("avatar_url يجب أن يكون نصاً أو null");
      }
    }

    // Check if there's any data to update
    if (Object.keys(updateData).length === 0) {
      logger.warn("No data to update", { userId: request.userId });
      // Return current user if no updates
      const currentUser = await this.authRepository.getCurrentUser(
        request.userId,
      );
      return currentUser;
    }

    // Call repository to update user
    try {
      const updatedUser = await this.authRepository.updateUser(
        request.userId,
        updateData,
      );

      logger.info("User updated successfully", {
        userId: request.userId,
        updatedFields: Object.keys(updateData),
      });

      return updatedUser;
    } catch (error: unknown) {
      // Re-throw domain exceptions as-is
      if (error instanceof UserNotFoundError) {
        throw error;
      }

      // Wrap unexpected errors
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      logger.error("User update failed", {
        userId: request.userId,
        error: errorMessage,
      });
      throw new UserNotFoundError("فشل تحديث بيانات المستخدم");
    }
  }
}
