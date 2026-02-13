/**
 * Auth Middleware - Middleware المصادقة
 *
 * Middleware للتحقق من صحة Token والسماح بالوصول للموارد المحمية
 *
 * @example
 * ```typescript
 * router.get('/protected', authMiddleware, (req, res) => {
 *   // req.user contains the authenticated user
 * })
 * ```
 */

// Express
import { Request, Response, NextFunction } from "express";

// Application Layer - استخدام barrel exports
import { TokenService } from "@/modules/auth/services/identity/TokenService.js";
import {
  TokenExpiredError,
  InvalidTokenError,
  UnauthorizedError,
  UserData,
} from "../../../../../domain/index.js";
import { logger } from "../../../../../shared/utils/logger.js";

import { container } from "../../../../../infrastructure/di/Container.js";

// Express types are now defined in src/types/express.d.ts

export class AuthMiddleware {
  private _tokenService: TokenService | undefined;

  /**
   * إنشاء Auth Middleware
   *
   * @param tokenService - خدمة Token (Optional for DI)
   */
  constructor(tokenService?: TokenService) {
    this._tokenService = tokenService;
  }

  /**
   * Getter for TokenService (Lazy Resolution)
   */
  private get tokenService(): TokenService {
    if (!this._tokenService) {
      this._tokenService = container.resolve<TokenService>("TokenService");
    }
    return this._tokenService;
  }

  /**
   * Middleware للتحقق من صحة Token
   *
   * يضيف req.user و req.userId للطلب إذا كان Token صحيحاً
   *
   * @param req - Express Request
   * @param res - Express Response
   * @param next - Next Function
   * @throws {InvalidTokenError} إذا كان Token غير صحيح
   * @throws {TokenExpiredError} إذا كان Token منتهي الصلاحية
   * @throws {UnauthorizedError} إذا لم يتم توفير Token
   */
  authenticate = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      // Get token from Authorization header
      // Get token from Authorization header or Query parameter (for SSE/WS)
      let token: string | undefined;
      const authHeader = req.headers.authorization;

      if (authHeader && authHeader.startsWith("Bearer ")) {
        token = authHeader.substring(7);
      } else if (req.query && req.query.token) {
        token = req.query.token as string;
      }

      if (!token) {
        logger.warn("Authentication attempt without token", {
          path: req.path,
          ip: req.ip,
        });
        throw new UnauthorizedError("Token مطلوب للوصول");
      }

      // Verify token
      const payload = this.tokenService.verifyToken(token);

      if (!payload || payload.type !== "access") {
        throw new InvalidTokenError("Token غير صحيح");
      }

      // Add user info to request
      (req as any).userId = payload.userId;

      req.user = {
        id: payload.userId,
        email: payload.email,
        role: payload.role || "student",
        is_verified: true,
        is_active: true,
        metadata: {},
        profile: {
          firstName: (payload as { firstName?: string }).firstName || "",
          lastName: (payload as { lastName?: string }).lastName || "",
        },
        permissionSource: "default",
        preferences: {},
        created_at: new Date(),
        updated_at: new Date(),
      } as unknown as UserData;

      logger.debug("User authenticated", {
        userId: payload.userId,
        email: payload.email,
        path: req.path,
      });

      next();
    } catch (error) {
      if (
        error instanceof InvalidTokenError ||
        error instanceof TokenExpiredError
      ) {
        res.status(error.statusCode).json({
          success: false,
          error: {
            message: error.message,
            code: error.code,
          },
        });
        return;
      }

      if (error instanceof UnauthorizedError) {
        res.status(error.statusCode).json({
          success: false,
          error: {
            message: error.message,
            code: error.code,
          },
        });
        return;
      }

      logger.error("Auth middleware error", { error, path: req.path });
      next(error);
    }
  };

  /**
   * Optional authentication middleware
   *
   * يضيف req.user إذا كان Token موجوداً، لكن لا يرفض الطلب إذا لم يكن موجوداً
   *
   * @param req - Express Request
   * @param res - Express Response
   * @param next - Next Function
   */
  optional = async (
    req: Request,
    _res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const authHeader = req.headers.authorization;

      if (authHeader && authHeader.startsWith("Bearer ")) {
        const token = authHeader.substring(7);
        const payload = this.tokenService.verifyToken(token);

        if (payload && payload.type === "access") {
          (req as any).userId = payload.userId;
        }
      }
    } catch {
      // Ignore errors in optional auth
    }

    next();
  };
}

// Export singleton instance
export const authMiddleware = new AuthMiddleware();
