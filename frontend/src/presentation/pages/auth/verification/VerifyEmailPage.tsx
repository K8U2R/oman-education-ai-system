/**
 * Verify Email Page - صفحة التحقق من البريد الإلكتروني
 *
 * صفحة للتحقق من البريد الإلكتروني باستخدام رمز التحقق
 * تدعم التحقق التلقائي من URL query params
 */

import React, { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Mail, CheckCircle2, XCircle, Loader2 } from 'lucide-react'
import {
  useEmailVerification,
  useSendVerificationEmail,
} from '@/features/user-authentication-management'
import { useAuth } from '@/features/user-authentication-management'
import { loggingService } from '@/infrastructure/services'
import { Button, Card } from '../../../components/common'
import { ROUTES } from '@/domain/constants/routes.constants'

const VerifyEmailPage: React.FC = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { user, refreshUser } = useAuth()
  const { isLoading, error, verifiedUser, verifyEmail, clearError } = useEmailVerification()
  const {
    isLoading: isSending,
    error: sendError,
    isSuccess: sendSuccess,
    sendVerificationEmail,
    cooldownSeconds,
  } = useSendVerificationEmail(60) // 60 ثانية cooldown

  const [token, setToken] = useState<string | null>(null)
  const [verificationStatus, setVerificationStatus] = useState<
    'idle' | 'verifying' | 'success' | 'error'
  >('idle')

  // التحقق من البريد الإلكتروني
  const handleVerify = React.useCallback(
    async (verificationToken: string): Promise<void> => {
      try {
        clearError()
        setVerificationStatus('verifying')
        await verifyEmail(verificationToken)
        setVerificationStatus('success')
        // تحديث بيانات المستخدم
        await refreshUser()
        // إعادة التوجيه بعد 3 ثواني
        setTimeout(() => {
          navigate(ROUTES.DASHBOARD, { replace: true })
        }, 3000)
      } catch (_err) {
        setVerificationStatus('error')
      }
    },
    [verifyEmail, clearError, refreshUser, navigate]
  )

  // قراءة token من URL query params
  useEffect(() => {
    const tokenFromUrl = searchParams.get('token')
    if (tokenFromUrl) {
      // Decode token in case it's URL encoded
      const decodedToken = decodeURIComponent(tokenFromUrl)

      // Validate token format (should be at least 32 characters for hex token)
      if (decodedToken.length < 32) {
        loggingService.warn('Invalid token format', {
          length: decodedToken.length,
          preview: decodedToken.substring(0, 20),
        })
        setVerificationStatus('error')
        return
      }

      setToken(decodedToken)
      setVerificationStatus('verifying')
      handleVerify(decodedToken)
    }
  }, [searchParams, handleVerify])

  // إعادة إرسال بريد التحقق
  const handleResend = async (): Promise<void> => {
    if (!user?.email) {
      return
    }

    try {
      await sendVerificationEmail(user.email)
    } catch (_err) {
      // Error handled by hook
    }
  }

  // معالجة التحقق اليدوي
  const handleManualVerify = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const manualToken = formData.get('token') as string

    if (!manualToken || manualToken.trim().length === 0) {
      return
    }

    const trimmedToken = manualToken.trim()

    // Validate token format
    if (trimmedToken.length < 32) {
      loggingService.warn('Invalid token format', {
        length: trimmedToken.length,
        preview: trimmedToken.substring(0, 20),
      })
      return
    }

    await handleVerify(trimmedToken)
  }

  // إذا كان المستخدم موثق بالفعل
  if (user?.isVerified && !token) {
    return (
      <div className="verify-email-page">
        <Card className="verify-email-page__card">
          <div className="verify-email-page__content">
            <div className="verify-email-page__icon-wrapper verify-email-page__icon-wrapper--success">
              <CheckCircle2 className="verify-email-page__icon" />
            </div>
            <h1 className="verify-email-page__title">البريد الإلكتروني موثق بالفعل</h1>
            <p className="verify-email-page__message">
              بريدك الإلكتروني ({user.email}) موثق بالفعل. يمكنك الآن استخدام جميع ميزات النظام.
            </p>
            <Button
              variant="primary"
              size="lg"
              onClick={() => navigate(ROUTES.DASHBOARD)}
              className="verify-email-page__button"
            >
              الانتقال إلى لوحة التحكم
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  // حالة النجاح
  if (verificationStatus === 'success' || verifiedUser) {
    return (
      <div className="verify-email-page">
        <Card className="verify-email-page__card">
          <div className="verify-email-page__content">
            <div className="verify-email-page__icon-wrapper verify-email-page__icon-wrapper--success">
              <CheckCircle2 className="verify-email-page__icon" />
            </div>
            <h1 className="verify-email-page__title">تم التحقق بنجاح! ✅</h1>
            <p className="verify-email-page__message">
              تم التحقق من بريدك الإلكتروني بنجاح. سيتم توجيهك إلى لوحة التحكم...
            </p>
            <div className="verify-email-page__loading">
              <Loader2 className="verify-email-page__spinner" />
            </div>
          </div>
        </Card>
      </div>
    )
  }

  // حالة الخطأ
  if (verificationStatus === 'error' && error) {
    return (
      <div className="verify-email-page">
        <Card className="verify-email-page__card">
          <div className="verify-email-page__content">
            <div className="verify-email-page__icon-wrapper verify-email-page__icon-wrapper--error">
              <XCircle className="verify-email-page__icon" />
            </div>
            <h1 className="verify-email-page__title">فشل التحقق</h1>
            <p className="verify-email-page__message verify-email-page__message--error">{error}</p>

            {user && !user.isVerified && (
              <div className="verify-email-page__resend">
                <p className="verify-email-page__resend-text">
                  لم تستلم بريد التحقق؟ يمكنك طلب إعادة الإرسال
                </p>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={handleResend}
                  disabled={isSending || cooldownSeconds > 0}
                  isLoading={isSending}
                  className="verify-email-page__resend-button"
                >
                  {cooldownSeconds > 0
                    ? `إعادة الإرسال (${cooldownSeconds}ث)`
                    : 'إعادة إرسال بريد التحقق'}
                </Button>
                {sendSuccess && (
                  <p className="verify-email-page__success-message">
                    ✓ تم إرسال بريد التحقق بنجاح. يرجى التحقق من بريدك الإلكتروني
                  </p>
                )}
                {sendError && <p className="verify-email-page__error-message">{sendError}</p>}
              </div>
            )}

            <div className="verify-email-page__manual-verify">
              <p className="verify-email-page__manual-text">أو أدخل رمز التحقق يدوياً:</p>
              <form onSubmit={handleManualVerify} className="verify-email-page__form">
                <input
                  type="text"
                  name="token"
                  placeholder="أدخل رمز التحقق"
                  className="verify-email-page__input"
                  disabled={isLoading}
                />
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  isLoading={isLoading}
                  className="verify-email-page__button"
                >
                  التحقق
                </Button>
              </form>
            </div>

            <Button
              variant="outline"
              size="lg"
              onClick={() => navigate(ROUTES.LOGIN)}
              className="verify-email-page__button"
            >
              العودة إلى تسجيل الدخول
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  // حالة التحميل (التحقق التلقائي)
  if (verificationStatus === 'verifying' || isLoading) {
    return (
      <div className="verify-email-page">
        <Card className="verify-email-page__card">
          <div className="verify-email-page__content">
            <div className="verify-email-page__icon-wrapper verify-email-page__icon-wrapper--loading">
              <Loader2 className="verify-email-page__icon verify-email-page__spinner" />
            </div>
            <h1 className="verify-email-page__title">جاري التحقق من البريد الإلكتروني...</h1>
            <p className="verify-email-page__message">يرجى الانتظار بينما نتحقق من رمز التحقق</p>
          </div>
        </Card>
      </div>
    )
  }

  // الحالة الافتراضية (لا يوجد token)
  return (
    <div className="verify-email-page">
      <Card className="verify-email-page__card">
        <div className="verify-email-page__content">
          <div className="verify-email-page__icon-wrapper">
            <Mail className="verify-email-page__icon" />
          </div>
          <h1 className="verify-email-page__title">التحقق من البريد الإلكتروني</h1>
          <p className="verify-email-page__message">
            يرجى التحقق من بريدك الإلكتروني والنقر على الرابط الموجود في الرسالة.
          </p>

          {user && !user.isVerified && (
            <div className="verify-email-page__resend">
              <p className="verify-email-page__resend-text">
                لم تستلم بريد التحقق؟ يمكنك طلب إعادة الإرسال إلى: <strong>{user.email}</strong>
              </p>
              <Button
                variant="outline"
                size="lg"
                onClick={handleResend}
                disabled={isSending || cooldownSeconds > 0}
                isLoading={isSending}
                className="verify-email-page__resend-button"
              >
                {cooldownSeconds > 0
                  ? `إعادة الإرسال (${cooldownSeconds}ث)`
                  : 'إعادة إرسال بريد التحقق'}
              </Button>
              {sendSuccess && (
                <p className="verify-email-page__success-message">
                  ✓ تم إرسال بريد التحقق بنجاح. يرجى التحقق من بريدك الإلكتروني
                </p>
              )}
              {sendError && <p className="verify-email-page__error-message">{sendError}</p>}
            </div>
          )}

          <div className="verify-email-page__manual-verify">
            <p className="verify-email-page__manual-text">أو أدخل رمز التحقق يدوياً:</p>
            <form onSubmit={handleManualVerify} className="verify-email-page__form">
              <input
                type="text"
                name="token"
                placeholder="أدخل رمز التحقق"
                className="verify-email-page__input"
                disabled={isLoading}
              />
              <Button
                type="submit"
                variant="primary"
                size="lg"
                isLoading={isLoading}
                className="verify-email-page__button"
              >
                التحقق
              </Button>
            </form>
          </div>

          <Button
            variant="outline"
            size="lg"
            onClick={() => navigate(ROUTES.LOGIN)}
            className="verify-email-page__button"
          >
            العودة إلى تسجيل الدخول
          </Button>
        </div>
      </Card>
    </div>
  )
}
export default VerifyEmailPage
