/**
 * Error Details Panel - لوحة تفاصيل الخطأ
 *
 * مكون لعرض معلومات تفصيلية عن الخطأ في وضع التطوير
 */

import React, { useState } from 'react'
import { loggingService } from '@/infrastructure/services'
import { Info, ChevronDown, ChevronUp, Copy, Check } from 'lucide-react'
import type { RouteMetadata } from '@/presentation/routing/types'
import type { User } from '@/domain/entities/User'
import type { UserRole, Permission } from '@/domain/types/auth.types'


interface ErrorDetailsPanelProps {
  isOpen: boolean
  onToggle: () => void
  user: User | null
  userRole?: UserRole
  userPermissions?: Permission[]
  routeMetadata?: RouteMetadata | null
  attemptedPath: string
  currentPath: string
  apiError?: {
    message?: string
    code?: string
    status?: number
  }
  errorDetails?: {
    userRole?: string
    requiredRole?: string
    requiredRoles?: string[]
    requiredPermission?: string
    requiredPermissions?: string[]
    userPermissions?: string[]
    routeTitle?: string
    path?: string
    method?: string
    [key: string]: unknown
  }
}

export const ErrorDetailsPanel: React.FC<ErrorDetailsPanelProps> = ({
  isOpen,
  onToggle,
  user,
  userRole,
  userPermissions,
  routeMetadata,
  attemptedPath,
  currentPath,
  apiError,
  errorDetails,
}) => {
  const [copied, setCopied] = useState(false)

  // استخدام errorDetails إذا كان متوفراً، وإلا استخدام routeMetadata
  const effectiveRequiredRole = errorDetails?.requiredRole || routeMetadata?.requiredRole
  const effectiveRequiredRoles = errorDetails?.requiredRoles || routeMetadata?.requiredRoles
  const effectiveRequiredPermissions =
    errorDetails?.requiredPermissions || routeMetadata?.requiredPermissions
  const effectiveRouteTitle = errorDetails?.routeTitle || routeMetadata?.title

  // استخدام معلومات المستخدم من errorDetails إذا كان متوفراً
  const effectiveUserRole = errorDetails?.userRole || userRole
  const effectiveUserPermissions = errorDetails?.userPermissions || userPermissions

  // دالة لنسخ المعلومات
  const handleCopyAll = async (): Promise<void> => {
    // استخدام effective values للنسخ
    const errorInfo = {
      timestamp: new Date().toISOString(),
      user: {
        email: user?.email || 'غير متوفر',
        role: effectiveUserRole || 'غير متوفر',
        isActive: user?.isActive ?? errorDetails?.isActive ?? false,
        isVerified: user?.isVerified ?? errorDetails?.isVerified ?? false,
        permissions: effectiveUserPermissions || [],
      },
      route: {
        attemptedPath,
        currentPath,
        routeMetadata: routeMetadata
          ? {
            title: routeMetadata.title,
            requiresAuth: routeMetadata.requiresAuth,
            requiredRole: routeMetadata.requiredRole,
            requiredRoles: routeMetadata.requiredRoles,
            requiredPermissions: routeMetadata.requiredPermissions,
          }
          : null,
        effectiveRequirements: {
          requiredRole: effectiveRequiredRole || null,
          requiredRoles: effectiveRequiredRoles || null,
          requiredPermissions: effectiveRequiredPermissions || null,
          routeTitle: effectiveRouteTitle || null,
          requiresAuth: routeMetadata?.requiresAuth ?? null,
          note:
            !effectiveRequiredRole &&
              (!effectiveRequiredRoles || effectiveRequiredRoles.length === 0) &&
              (!effectiveRequiredPermissions || effectiveRequiredPermissions.length === 0) &&
              routeMetadata?.requiresAuth
              ? 'هذا المسار يتطلب مصادقة فقط (لا يتطلب دور أو صلاحيات محددة)'
              : null,
        },
      },
      apiError: apiError
        ? {
          message: apiError.message,
          code: apiError.code,
          status: apiError.status,
        }
        : null,
      errorDetails: errorDetails || null,
    }

    const text = JSON.stringify(errorInfo, null, 2)
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => {
        setCopied(false)
      }, 2000)
    } catch (err) {
      loggingService.error('Failed to copy error details', err as Error)
    }
  }

  return (
    <div className="error-details-panel">
      <div className="error-details-panel__header">
        <button className="error-details-panel__toggle" onClick={onToggle} type="button">
          <Info className="error-details-panel__icon" />
          <span>معلومات تفصيلية عن المشكلة</span>
          {isOpen ? (
            <ChevronUp className="error-details-panel__chevron" />
          ) : (
            <ChevronDown className="error-details-panel__chevron" />
          )}
        </button>
        {isOpen && (
          <button
            className="error-details-panel__copy-button"
            onClick={handleCopyAll}
            type="button"
            title="نسخ جميع المعلومات"
          >
            {copied ? (
              <>
                <Check className="error-details-panel__copy-icon" />
                <span>تم النسخ!</span>
              </>
            ) : (
              <>
                <Copy className="error-details-panel__copy-icon" />
                <span>نسخ المعلومات</span>
              </>
            )}
          </button>
        )}
      </div>

      {isOpen && (
        <div className="error-details-panel__content">
          {/* التشخيص الذكي */}
          <div className="error-details-panel__section error-details-panel__section--diagnosis">
            <h3 className="error-details-panel__title">التشخيص الذكي للمشكلة</h3>
            <div className="error-details-panel__diagnosis">
              {(() => {
                // التشخيص: 1. مشكلة هامة (تعطيل/توثيق)
                if (user?.isActive === false || errorDetails?.isActive === false) {
                  return (
                    <div className="error-details-panel__diagnosis-item error-details-panel__diagnosis-item--critical">
                      <strong>السبب المكتشف: الحساب معطل</strong>
                      <p>
                        تم التعرف على أن حسابك غير نشط. هذا يمنع الوصول لجميع الصفحات المحمية بغض
                        النظر عن .
                      </p>
                    </div>
                  )
                }

                // التشخيص: 2. نقص  (Authority Missing)
                if (
                  (effectiveRequiredRole && effectiveUserRole !== effectiveRequiredRole) ||
                  (effectiveRequiredPermissions &&
                    effectiveRequiredPermissions.length > 0 &&
                    (!effectiveUserPermissions ||
                      !effectiveRequiredPermissions.every(p =>
                        effectiveUserPermissions.includes(p as Permission)
                      )))
                ) {
                  return (
                    <div className="error-details-panel__diagnosis-item error-details-panel__diagnosis-item--warning">
                      <strong>السبب المكتشف: نقص (Authority Missing)</strong>
                      <p>
                        المستخدم مسجل دخول بنجاح، ولكن الدور أو الحالية لا تطابق متطلبات الصفحة.
                      </p>
                    </div>
                  )
                }

                // التشخيص: 3. مشكلة في قراءة البيانات (Authority Not Read)
                if (!user && !effectiveUserRole) {
                  return (
                    <div className="error-details-panel__diagnosis-item error-details-panel__diagnosis-item--error">
                      <strong>السبب المكتشف: فشل قراءة البيانات (Authority Not Read)</strong>
                      <p>
                        لم يتم العثور على بيانات المستخدم في المتصفح. قد يكون ذلك بسبب انتهاء الجلسة
                        أو فشل في مزامنة البيانات مع الخادم.
                      </p>
                    </div>
                  )
                }

                // التشخيص: 4. صفحة غير مربوطة بالنظام (Page Not Linked)
                if (
                  !routeMetadata ||
                  (!routeMetadata.requiredRole &&
                    (!routeMetadata.requiredPermissions ||
                      routeMetadata.requiredPermissions.length === 0))
                ) {
                  return (
                    <div className="error-details-panel__diagnosis-item error-details-panel__diagnosis-item--info">
                      <strong>السبب المكتشف: ربط غير مكتمل (Page Not Linked)</strong>
                      <p>
                        الصفحة تفتقر إلى Metadata الصحيحة (requiredRole/Permissions). قد يكون المجلد
                        محمياً بـ ProtectedRoute ولكن دون تحديد متطلبات واضحة.
                      </p>
                    </div>
                  )
                }

                return (
                  <div className="error-details-panel__diagnosis-item">
                    <strong>السبب المكتشف: غير محدد بدقة</strong>
                    <p>
                      يرجى مراجعة التفاصيل أدناه للمزيد من المعلومات، أو قد تكون المشكلة متعلقة
                      برابط الصفحة مباشرة.
                    </p>
                  </div>
                )
              })()}
            </div>
          </div>

          {/* معلومات المستخدم */}
          <div className="error-details-panel__section">
            <h3 className="error-details-panel__title">معلومات المستخدم الحالي</h3>
            <div className="error-details-panel__info">
              <div className="error-details-panel__item">
                <span className="error-details-panel__label">البريد الإلكتروني:</span>
                <span className="error-details-panel__value">{user?.email || 'غير متوفر'}</span>
              </div>
              <div className="error-details-panel__item">
                <span className="error-details-panel__label">الدور الحالي:</span>
                <span className="error-details-panel__value">
                  {effectiveUserRole || 'غير متوفر'}
                </span>
              </div>
              <div className="error-details-panel__item">
                <span className="error-details-panel__label">الحالة:</span>
                <span className="error-details-panel__value">
                  {user?.isActive !== undefined
                    ? user.isActive
                      ? 'نشط'
                      : 'غير نشط'
                    : errorDetails?.isActive !== undefined
                      ? errorDetails.isActive
                        ? 'نشط'
                        : 'غير نشط'
                      : 'غير متوفر'}{' '}
                  /{' '}
                  {user?.isVerified !== undefined
                    ? user.isVerified
                      ? 'موثق'
                      : 'غير موثق'
                    : errorDetails?.isVerified !== undefined
                      ? errorDetails.isVerified
                        ? 'موثق'
                        : 'غير موثق'
                      : 'غير متوفر'}
                </span>
                {((user?.isActive !== undefined && !user.isActive) ||
                  (errorDetails?.isActive !== undefined && !errorDetails.isActive) ||
                  (user?.isVerified !== undefined && !user.isVerified) ||
                  (errorDetails?.isVerified !== undefined && !errorDetails.isVerified)) && (
                    <span className="error-details-panel__note error-details-panel__note--error">
                      ⚠️ هذا هو السبب الرئيسي لعدم الوصول
                    </span>
                  )}
              </div>
              <div className="error-details-panel__item">
                <span className="error-details-panel__label"> المتاحة:</span>
                <span className="error-details-panel__value">
                  {effectiveUserPermissions && effectiveUserPermissions.length > 0
                    ? Array.isArray(effectiveUserPermissions)
                      ? effectiveUserPermissions.join(', ')
                      : String(effectiveUserPermissions)
                    : 'لا توجد صلاحيات'}
                </span>
              </div>
            </div>
          </div>

          {/* متطلبات المسار */}
          {(effectiveRouteTitle ||
            routeMetadata?.requiresAuth !== undefined ||
            effectiveRequiredRole ||
            (effectiveRequiredRoles && effectiveRequiredRoles.length > 0) ||
            (effectiveRequiredPermissions && effectiveRequiredPermissions.length > 0)) && (
              <div className="error-details-panel__section">
                <h3 className="error-details-panel__title">متطلبات المسار</h3>
                <div className="error-details-panel__info">
                  {effectiveRouteTitle && (
                    <div className="error-details-panel__item">
                      <span className="error-details-panel__label">اسم الصفحة:</span>
                      <span className="error-details-panel__value">{effectiveRouteTitle}</span>
                    </div>
                  )}
                  {routeMetadata?.requiresAuth !== undefined && (
                    <div className="error-details-panel__item">
                      <span className="error-details-panel__label">يتطلب مصادقة:</span>
                      <span className="error-details-panel__value">
                        {routeMetadata.requiresAuth ? 'نعم' : 'لا'}
                      </span>
                    </div>
                  )}
                  {effectiveRequiredRole && (
                    <div className="error-details-panel__item">
                      <span className="error-details-panel__label">الدور المطلوب:</span>
                      <span className="error-details-panel__value error-details-panel__value--error">
                        {effectiveRequiredRole}
                      </span>
                      <span className="error-details-panel__note">
                        (لديك: {effectiveUserRole || 'لا يوجد'})
                      </span>
                    </div>
                  )}
                  {effectiveRequiredRoles && effectiveRequiredRoles.length > 0 && (
                    <div className="error-details-panel__item">
                      <span className="error-details-panel__label">الأدوار المطلوبة (أحدها):</span>
                      <span className="error-details-panel__value error-details-panel__value--error">
                        {Array.isArray(effectiveRequiredRoles)
                          ? effectiveRequiredRoles.join(', ')
                          : effectiveRequiredRoles}
                      </span>
                      <span className="error-details-panel__note">
                        (لديك: {effectiveUserRole || 'لا يوجد'})
                      </span>
                    </div>
                  )}
                  {effectiveRequiredPermissions && effectiveRequiredPermissions.length > 0 && (
                    <div className="error-details-panel__item">
                      <span className="error-details-panel__label"> المطلوبة:</span>
                      <span className="error-details-panel__value error-details-panel__value--error">
                        {Array.isArray(effectiveRequiredPermissions)
                          ? effectiveRequiredPermissions.join(', ')
                          : effectiveRequiredPermissions}
                      </span>
                      <span className="error-details-panel__note">
                        (لديك:{' '}
                        {effectiveUserPermissions && effectiveUserPermissions.length > 0
                          ? Array.isArray(effectiveUserPermissions)
                            ? effectiveUserPermissions.join(', ')
                            : String(effectiveUserPermissions)
                          : 'لا توجد صلاحيات'}
                        )
                      </span>
                    </div>
                  )}
                  {!effectiveRequiredRole &&
                    (!effectiveRequiredRoles || effectiveRequiredRoles.length === 0) &&
                    (!effectiveRequiredPermissions || effectiveRequiredPermissions.length === 0) &&
                    (routeMetadata?.requiresAuth || errorDetails?.routeTitle) && (
                      <div className="error-details-panel__item">
                        <span className="error-details-panel__label">ملاحظة:</span>
                        <span className="error-details-panel__value">
                          {routeMetadata?.requiresAuth
                            ? 'هذا المسار يتطلب مصادقة فقط (لا يتطلب دور أو صلاحيات محددة)'
                            : 'هذا المسار لا يتطلب دور أو صلاحيات محددة'}
                        </span>
                      </div>
                    )}
                </div>
              </div>
            )}

          {/* معلومات API */}
          {(apiError || (errorDetails && Object.keys(errorDetails).length > 0)) && (
            <div className="error-details-panel__section">
              <h3 className="error-details-panel__title">معلومات من API</h3>
              <div className="error-details-panel__info">
                {apiError?.message && (
                  <div className="error-details-panel__item">
                    <span className="error-details-panel__label">الرسالة:</span>
                    <span className="error-details-panel__value">{apiError.message}</span>
                  </div>
                )}
                {apiError?.code && (
                  <div className="error-details-panel__item">
                    <span className="error-details-panel__label">رمز الخطأ:</span>
                    <span className="error-details-panel__value error-details-panel__value--code">
                      {apiError.code}
                    </span>
                  </div>
                )}
                {apiError?.status && (
                  <div className="error-details-panel__item">
                    <span className="error-details-panel__label">رمز الحالة:</span>
                    <span className="error-details-panel__value">{apiError.status}</span>
                  </div>
                )}
                {errorDetails && Object.keys(errorDetails).length > 0 && (
                  <div className="error-details-panel__item error-details-panel__item--full">
                    <span className="error-details-panel__label">التفاصيل الإضافية:</span>
                    <div className="error-details-panel__value error-details-panel__value--code error-details-panel__value--scrollable">
                      <pre>{JSON.stringify(errorDetails, null, 2)}</pre>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* معلومات المسار */}
          <div className="error-details-panel__section">
            <h3 className="error-details-panel__title">معلومات المسار</h3>
            <div className="error-details-panel__info">
              <div className="error-details-panel__item">
                <span className="error-details-panel__label">المسار الحالي:</span>
                <span className="error-details-panel__value error-details-panel__value--code">
                  {currentPath}
                </span>
              </div>
              {attemptedPath && attemptedPath !== currentPath && (
                <div className="error-details-panel__item">
                  <span className="error-details-panel__label">المسار المطلوب:</span>
                  <span className="error-details-panel__value error-details-panel__value--code">
                    {attemptedPath}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
