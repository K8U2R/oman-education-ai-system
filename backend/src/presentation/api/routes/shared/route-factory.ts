/**
 * Route Factory - مصنع المسارات
 *
 * Utilities for creating routes with consistent patterns
 */

import {
  Router,
  RequestHandler,
  Request,
  Response,
  NextFunction,
} from "express";
import { container } from "../../../../infrastructure/di/index.js";

export class RouteFactory {
  /**
   * Create route with lazy handler resolution from DI container
   *
   * @param handlerName - Name of handler in DI container
   * @param handlerMethod - Method name to call on handler
   * @param middleware - Optional middleware to apply
   *
   * @example
   * ```typescript
   * router.post('/login',
   *   RouteFactory.createRoute('AuthHandler', 'login', loginRateLimitMiddleware)
   * )
   * ```
   */
  static createRoute<T extends object>(
    handlerName: string,
    handlerMethod: keyof T,
    ...middleware: RequestHandler[]
  ): RequestHandler[] {
    const handler: RequestHandler = async (
      req: Request,
      res: Response,
      next: NextFunction,
    ) => {
      try {
        const handlerInstance = container.resolve<T>(handlerName);
        const method = handlerInstance[handlerMethod];

        if (typeof method !== "function") {
          throw new Error(
            `Method ${String(handlerMethod)} not found on ${handlerName}`,
          );
        }

        await (method as unknown as RequestHandler).call(
          handlerInstance,
          req,
          res,
          next,
        );
      } catch (error) {
        next(error);
      }
    };

    return [...middleware, handler];
  }

  /**
   * Create a feature router with common configuration
   *
   * @param mergeParams - Whether to merge params from parent router
   * @returns Configured Express Router
   */
  static createFeatureRouter(mergeParams = true): Router {
    return Router({ mergeParams });
  }

  /**
   * Create authenticated route (shorthand)
   */
  static createAuthenticatedRoute<T extends object>(
    handlerName: string,
    handlerMethod: keyof T,
    authMiddleware: RequestHandler,
    ...additionalMiddleware: RequestHandler[]
  ): RequestHandler[] {
    return this.createRoute(
      handlerName,
      handlerMethod,
      authMiddleware,
      ...additionalMiddleware,
    );
  }

  /**
   * Create admin-only route (shorthand)
   */
  static createAdminRoute<T extends object>(
    handlerName: string,
    handlerMethod: keyof T,
    authMiddleware: RequestHandler,
    adminMiddleware: RequestHandler,
    ...additionalMiddleware: RequestHandler[]
  ): RequestHandler[] {
    return this.createRoute(
      handlerName,
      handlerMethod,
      authMiddleware,
      adminMiddleware,
      ...additionalMiddleware,
    );
  }
}
