/**
 * Role Middleware - Middleware للتحقق من الأدوار و
 *
 * Middleware للتحقق من أن المستخدم لديه الدور أو  المطلوبة
 */

import { Request, Response, NextFunction } from "express";
import { AuthService } from "@/modules/auth/services/identity/AuthService.js";
import { WhitelistService } from "@/modules/auth/services/account/WhitelistService.js";
import { container } from "../../../../../infrastructure/di/index.js";
import { UserRole, Permission } from "../../../../../domain/types/auth/index.js";
import { RoleService } from "../../../../../domain/services/role.service.js";
import { logger } from "../../../../../shared/utils/logger.js";

// Extend Express Request to include user info
// Note: Request already has user?: UserData from global namespace, so we use a different approach
interface AuthenticatedRequest extends Request {
  userId?: string;
  // We'll populate req.user with UserData from auth.middleware, but we need to ensure
  // the user object has the properties we need for role checking
}

/**
 * Middleware للتحقق من أن المستخدم لديه دور معين
 * يجلب بيانات المستخدم من قاعدة البيانات للتحقق من الدور الحالي
 */
export function requireRole(requiredRole: UserRole) {
  return async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const authReq = req as AuthenticatedRequest;

      // التحقق من وجود userId
      if (!authReq.userId) {
        res.status(401).json({
          success: false,
          error: {
            message: "غير مصرح لك بالوصول",
            code: "UNAUTHORIZED",
          },
        });
        return;
      }

      // جلب بيانات المستخدم من قاعدة البيانات للتحقق من الدور الحالي
      // هذا يضمن أن الدور محدث وليس من token قديم
      const authService = container.resolve<AuthService>("AuthService");
      const user = await authService.getCurrentUser(authReq.userId);

      // التحقق من أن المستخدم نشط (تم إزالة التحقق من is_verified)
      if (!user.isActive) {
        logger.warn("Inactive user attempted to access protected route", {
          userId: authReq.userId,
          role: user.role,
          path: req.path,
        });
        res.status(403).json({
          success: false,
          error: {
            message: "حسابك غير مفعل",
            code: "ACCOUNT_INACTIVE",
          },
        });
        return;
      }

      // التحقق من الدور باستخدام RoleService (يدعم hierarchy)
      if (!RoleService.hasRole(user.role, requiredRole)) {
        logger.warn("User attempted to access route without required role", {
          userId: authReq.userId,
          userRole: user.role,
          requiredRole,
          path: req.path,
        });
        res.status(403).json({
          success: false,
          error: {
            message: "غير مصرح لك بالوصول",
            code: "FORBIDDEN",
            details: {
              userRole: user.role,
              requiredRole,
              path: req.path,
              method: req.method,
            },
          },
        });
        return;
      }

      // إضافة بيانات المستخدم إلى request للاستخدام في handlers
      // req.user is already typed as UserData from global namespace
      authReq.user = user.toData();

      next();
    } catch (error) {
      logger.error("Error in requireRole middleware", {
        error: error instanceof Error ? error.message : "Unknown error",
        path: req.path,
      });
      res.status(500).json({
        success: false,
        error: {
          message: "خطأ في التحقق من ",
          code: "ROLE_CHECK_ERROR",
        },
      });
    }
  };
}

/**
 * Middleware للتحقق من أن المستخدم لديه أحد الأدوار المطلوبة
 */
export function requireAnyRole(requiredRoles: UserRole[]) {
  return async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const authReq = req as AuthenticatedRequest;

      if (!authReq.userId) {
        res.status(401).json({
          success: false,
          error: {
            message: "غير مصرح لك بالوصول",
            code: "UNAUTHORIZED",
          },
        });
        return;
      }

      const authService = container.resolve<AuthService>("AuthService");
      const user = await authService.getCurrentUser(authReq.userId);

      if (!user.isActive) {
        res.status(403).json({
          success: false,
          error: {
            message: "حسابك غير مفعل",
            code: "ACCOUNT_INACTIVE",
          },
        });
        return;
      }

      if (!RoleService.hasAnyRole(user.role, requiredRoles)) {
        logger.warn("User attempted to access route without required roles", {
          userId: authReq.userId,
          userRole: user.role,
          requiredRoles,
          path: req.path,
        });
        res.status(403).json({
          success: false,
          error: {
            message: "غير مصرح لك بالوصول",
            code: "FORBIDDEN",
            details: {
              userRole: user.role,
              requiredRoles,
              path: req.path,
              method: req.method,
            },
          },
        });
        return;
      }

      // إضافة بيانات المستخدم إلى request للاستخدام في handlers
      // req.user is already typed as UserData from global namespace
      authReq.user = user.toData();

      next();
    } catch (error) {
      logger.error("Error in requireAnyRole middleware", {
        error: error instanceof Error ? error.message : "Unknown error",
        path: req.path,
      });
      res.status(500).json({
        success: false,
        error: {
          message: "خطأ في التحقق من ",
          code: "ROLE_CHECK_ERROR",
        },
      });
    }
  };
}

/**
 * Middleware للتحقق من أن المستخدم لديه صلاحية معينة
 */
export function requirePermission(requiredPermission: Permission) {
  return async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const authReq = req as AuthenticatedRequest;

      if (!authReq.userId) {
        res.status(401).json({
          success: false,
          error: {
            message: "غير مصرح لك بالوصول",
            code: "UNAUTHORIZED",
          },
        });
        return;
      }

      const authService = container.resolve<AuthService>("AuthService");
      const user = await authService.getCurrentUser(authReq.userId);

      if (!user.isActive) {
        res.status(403).json({
          success: false,
          error: {
            message: "حسابك غير مفعل",
            code: "ACCOUNT_INACTIVE",
          },
        });
        return;
      }

      // الحصول على صلاحيات المستخدم
      let userPermissions: Permission[] = [];

      // 1. Check if user is in whitelist
      if (user.permissionSource === "whitelist" && user.whitelistEntryId) {
        try {
          const whitelistService =
            container.resolve<WhitelistService>("WhitelistService");
          const whitelistEntry = await whitelistService.findById(
            user.whitelistEntryId,
          );

          if (whitelistEntry && whitelistEntry.is_active && (!whitelistEntry.expires_at || new Date(whitelistEntry.expires_at) > new Date())) {
            userPermissions = whitelistEntry.permissions as Permission[];
          } else {
            // Whitelist entry is invalid, fall back to default
            userPermissions =
              user.permissions.length > 0
                ? user.permissions
                : RoleService.getRolePermissions(user.role);
          }
        } catch (error) {
          // If whitelist check fails, fall back to default
          logger.warn(
            "Failed to check whitelist permissions, falling back to default",
            {
              userId: authReq.userId,
              error: error instanceof Error ? error.message : String(error),
            },
          );
          userPermissions =
            user.permissions.length > 0
              ? user.permissions
              : RoleService.getRolePermissions(user.role);
        }
      } else {
        // 2. Use custom permissions if available, otherwise use role permissions
        userPermissions =
          user.permissions.length > 0
            ? user.permissions
            : RoleService.getRolePermissions(user.role);
      }

      if (!RoleService.hasPermission(userPermissions, requiredPermission)) {
        logger.warn(
          "User attempted to access route without required permission",
          {
            userId: authReq.userId,
            userRole: user.role,
            userPermissions,
            requiredPermission,
            path: req.path,
          },
        );
        res.status(403).json({
          success: false,
          error: {
            message: "غير مصرح لك بالوصول",
            code: "FORBIDDEN",
            details: {
              userRole: user.role,
              userPermissions,
              requiredPermission,
              path: req.path,
              method: req.method,
            },
          },
        });
        return;
      }

      // إضافة بيانات المستخدم إلى request للاستخدام في handlers
      // req.user is already typed as UserData from global namespace
      authReq.user = user.toData();

      next();
    } catch (error) {
      logger.error("Error in requirePermission middleware", {
        error: error instanceof Error ? error.message : "Unknown error",
        path: req.path,
      });
      res.status(500).json({
        success: false,
        error: {
          message: "خطأ في التحقق من ",
          code: "PERMISSION_CHECK_ERROR",
        },
      });
    }
  };
}

/**
 * Middleware للتحقق من أن المستخدم لديه جميع  المطلوبة
 */
export function requireAllPermissions(requiredPermissions: Permission[]) {
  return async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const authReq = req as AuthenticatedRequest;

      if (!authReq.userId) {
        res.status(401).json({
          success: false,
          error: {
            message: "غير مصرح لك بالوصول",
            code: "UNAUTHORIZED",
          },
        });
        return;
      }

      const authService = container.resolve<AuthService>("AuthService");
      const user = await authService.getCurrentUser(authReq.userId);

      if (!user.isActive) {
        res.status(403).json({
          success: false,
          error: {
            message: "حسابك غير مفعل",
            code: "ACCOUNT_INACTIVE",
          },
        });
        return;
      }

      // الحصول على صلاحيات المستخدم
      let userPermissions: Permission[] = [];

      // 1. Check if user is in whitelist
      if (user.permissionSource === "whitelist" && user.whitelistEntryId) {
        try {
          const whitelistService =
            container.resolve<WhitelistService>("WhitelistService");
          const whitelistEntry = await whitelistService.findById(
            user.whitelistEntryId,
          );

          if (whitelistEntry && whitelistEntry.is_active && (!whitelistEntry.expires_at || new Date(whitelistEntry.expires_at) > new Date())) {
            userPermissions = whitelistEntry.permissions as Permission[];
          } else {
            // Whitelist entry is invalid, fall back to default
            userPermissions =
              user.permissions.length > 0
                ? user.permissions
                : RoleService.getRolePermissions(user.role);
          }
        } catch (error) {
          // If whitelist check fails, fall back to default
          logger.warn(
            "Failed to check whitelist permissions, falling back to default",
            {
              userId: authReq.userId,
              error: error instanceof Error ? error.message : String(error),
            },
          );
          userPermissions =
            user.permissions.length > 0
              ? user.permissions
              : RoleService.getRolePermissions(user.role);
        }
      } else {
        // 2. Use custom permissions if available, otherwise use role permissions
        userPermissions =
          user.permissions.length > 0
            ? user.permissions
            : RoleService.getRolePermissions(user.role);
      }

      const checkResult = RoleService.hasAllPermissions(
        userPermissions,
        requiredPermissions,
      );

      if (!checkResult.hasPermission) {
        logger.warn(
          "User attempted to access route without required permissions",
          {
            userId: authReq.userId,
            userRole: user.role,
            userPermissions,
            requiredPermissions,
            missingPermissions: checkResult.missingPermissions,
            path: req.path,
          },
        );
        res.status(403).json({
          success: false,
          error: {
            message: "غير مصرح لك بالوصول",
            code: "FORBIDDEN",
            details: checkResult.missingPermissions
              ? ` المفقودة: ${checkResult.missingPermissions.join(", ")}`
              : undefined,
          },
        });
        return;
      }

      // إضافة بيانات المستخدم إلى request للاستخدام في handlers
      // req.user is already typed as UserData from global namespace
      authReq.user = user.toData();

      next();
    } catch (error) {
      logger.error("Error in requireAllPermissions middleware", {
        error: error instanceof Error ? error.message : "Unknown error",
        path: req.path,
      });
      res.status(500).json({
        success: false,
        error: {
          message: "خطأ في التحقق من ",
          code: "PERMISSION_CHECK_ERROR",
        },
      });
    }
  };
}

/**
 * Middleware للتحقق من أن المستخدم لديه إحدى  المطلوبة
 */
export function requireAnyPermission(requiredPermissions: Permission[]) {
  return async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const authReq = req as AuthenticatedRequest;

      if (!authReq.userId) {
        res.status(401).json({
          success: false,
          error: {
            message: "غير مصرح لك بالوصول",
            code: "UNAUTHORIZED",
          },
        });
        return;
      }

      const authService = container.resolve<AuthService>("AuthService");
      const user = await authService.getCurrentUser(authReq.userId);

      if (!user.isActive) {
        res.status(403).json({
          success: false,
          error: {
            message: "حسابك غير مفعل",
            code: "ACCOUNT_INACTIVE",
          },
        });
        return;
      }

      const userPermissions =
        user.permissions.length > 0
          ? user.permissions
          : RoleService.getRolePermissions(user.role);

      if (!RoleService.hasAnyPermission(userPermissions, requiredPermissions)) {
        logger.warn(
          "User attempted to access route without any required permission",
          {
            userId: authReq.userId,
            userRole: user.role,
            userPermissions,
            requiredPermissions,
            path: req.path,
          },
        );
        res.status(403).json({
          success: false,
          error: {
            message: "غير مصرح لك بالوصول",
            code: "FORBIDDEN",
            details: {
              userRole: user.role,
              userPermissions,
              requiredPermissions,
              path: req.path,
              method: req.method,
            },
          },
        });
        return;
      }

      // إضافة بيانات المستخدم إلى request للاستخدام في handlers
      // req.user is already typed as UserData from global namespace
      authReq.user = user.toData();

      next();
    } catch (error) {
      logger.error("Error in requireAnyPermission middleware", {
        error: error instanceof Error ? error.message : "Unknown error",
        path: req.path,
      });
      res.status(500).json({
        success: false,
        error: {
          message: "خطأ في التحقق من ",
          code: "PERMISSION_CHECK_ERROR",
        },
      });
    }
  };
}

// Convenience exports for common roles
// Convenience exports for common roles
export const requireAdmin = requireRole("admin");
export const requireDeveloper = requireRole("developer");
