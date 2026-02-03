/**
 * Route Middleware - وسيط المسارات
 *
 * مجموعة من الـ Middlewares للتحكم في الوصول إلى المسارات بناءً على:
 * - حالة المصادقة (Authentication)
 * - الدور (Role)
 * -  (Permissions)
 *
 * يُستخدم مع نظام التوجيه لتحديد ما إذا كان يُسمح للمستخدم بالوصول إلى مسار معين
 * أو يتم توجيهه إلى صفحة أخرى (login / unauthorized / forbidden).
 */

import { RouteMetadata } from '../types'
import type { Permission } from '@/domain/types/auth.types'
import { RoleService } from '@/domain/services/role.service'
import { User } from '@/domain/entities/User'

export interface MiddlewareContext {
  /** بيانات المستخدم الحالي (null إذا لم يكن مسجلاً الدخول) */
  user: User | null
  /** هل المستخدم مصادق عليه أم لا */
  isAuthenticated: boolean
  /** المسار الحالي (pathname) */
  pathname: string
  /** بيانات وصفية للمسار (metadata) إن وجدت */
  metadata?: RouteMetadata
}

export interface MiddlewareResult {
  /** هل يُسمح بالوصول إلى المسار */
  allow: boolean
  /** مسار التوجيه في حالة الرفض (اختياري) */
  redirectTo?: string
  /** سبب الرفض (مفيد للتسجيل أو التصحيح) */
  reason?: string
}

export type RouteMiddleware = (
  context: MiddlewareContext,
  metadata?: RouteMetadata
) => MiddlewareResult | Promise<MiddlewareResult>

/**
 * Middleware للتحقق من المصادقة
 *
 * يرفض الوصول إذا كان المسار يتطلب المصادقة ولم يكن المستخدم مسجلاً الدخول.
 */
export const authMiddleware: RouteMiddleware = (context, metadata): MiddlewareResult => {
  const routeMetadata = metadata ?? context.metadata

  if (routeMetadata?.requiresAuth && !context.isAuthenticated) {
    return {
      allow: false,
      redirectTo: '/',
      reason: 'يتطلب المسار المصادقة والمستخدم غير مسجل الدخول',
    }
  }

  return { allow: true }
}

/**
 * Middleware للتحقق من الدور (Role)
 *
 * يدعم:
 * - دور واحد مطلوب (requiredRole)
 * - عدة أدوار (requiredRoles) حيث يكفي وجود أحدها
 */
export const roleMiddleware: RouteMiddleware = (context, metadata): MiddlewareResult => {
  const routeMetadata = metadata ?? context.metadata

  // لا يوجد متطلبات دور → السماح
  if (
    !routeMetadata?.requiredRole &&
    (!routeMetadata?.requiredRoles || routeMetadata.requiredRoles.length === 0)
  ) {
    return { allow: true }
  }

  if (!context.isAuthenticated || !context.user) {
    return {
      allow: false,
      redirectTo: '/',
      reason: 'المستخدم غير مصادق عليه',
    }
  }

  // التحقق من الدور الواحد
  if (routeMetadata.requiredRole) {
    const hasRole = RoleService.hasRole(context.user.role, routeMetadata.requiredRole)
    if (!hasRole) {
      return {
        allow: false,
        redirectTo: '/unauthorized',
        reason: `الدور المطلوب غير متوفر: ${routeMetadata.requiredRole}`,
      }
    }
  }

  // التحقق من أحد الأدوار المتعددة
  if (routeMetadata.requiredRoles && routeMetadata.requiredRoles.length > 0) {
    const hasAnyRole = RoleService.hasAnyRole(context.user.role, routeMetadata.requiredRoles)
    if (!hasAnyRole) {
      return {
        allow: false,
        redirectTo: '/unauthorized',
        reason: `لا يملك المستخدم أياً من الأدوار المطلوبة: ${routeMetadata.requiredRoles.join(', ')}`,
      }
    }
  }

  return { allow: true }
}

/**
 * Middleware للتحقق من  (Permissions)
 *
 * يتحقق من أن المستخدم يملك جميع  المطلوبة.
 * يستخدم  المخصصة للمستخدم إن وجدت، وإلا يعتمد على صلاحيات الدور.
 */
export const permissionMiddleware: RouteMiddleware = (context, metadata): MiddlewareResult => {
  const routeMetadata = metadata ?? context.metadata

  // لا صلاحيات مطلوبة → السماح
  if (!routeMetadata?.requiredPermissions || routeMetadata.requiredPermissions.length === 0) {
    return { allow: true }
  }

  if (!context.isAuthenticated || !context.user) {
    return {
      allow: false,
      redirectTo: '/',
      reason: 'المستخدم غير مصادق عليه',
    }
  }

  // تحديد مصدر
  const userPermissions: Permission[] =
    context.user.permissions.length > 0
      ? context.user.permissions
      : RoleService.getRolePermissions(context.user.role)

  const checkResult = RoleService.hasAllPermissions(
    userPermissions,
    routeMetadata.requiredPermissions
  )

  if (!checkResult.hasPermission) {
    return {
      allow: false,
      redirectTo: '/forbidden',
      reason: `صلاحيات ناقصة: ${checkResult.missingPermissions?.join(', ') ?? 'غير معروف'}`,
    }
  }

  return { allow: true }
}

/**
 * دمج عدة Middlewares في سلسلة واحدة
 *
 * يُنفَّذ بالترتيب، ويتوقف عند أول رفض.
 */
export const combineMiddlewares = (...middlewares: RouteMiddleware[]): RouteMiddleware => {
  return async (
    context: MiddlewareContext,
    metadata?: RouteMetadata
  ): Promise<MiddlewareResult> => {
    for (const middleware of middlewares) {
      const result = await middleware(context, metadata)
      if (!result.allow) {
        return result
      }
    }
    return { allow: true }
  }
}

/**
 * السلسلة الافتراضية للـ Middleware
 *
 * الترتيب مهم: المصادقة → الدور →
 */
export const defaultMiddleware = combineMiddlewares(
  authMiddleware,
  roleMiddleware,
  permissionMiddleware
)
